# High-Scale Iranian Fintech Microservices Architecture: The Production Blueprint

**Author:** Ariya Sarrafzadeh  
**Website:** [ariya-sarrafzadeh.ir](https://ariya-sarrafzadeh.ir)  
**Target Audience:** Distributed Systems Architects, Lead Backend Engineers, and Technical Product Managers  
**Core Technologies:** Java (Spring Boot, Spring WebFlux), RabbitMQ, Redis, MongoDB, MySQL, MinIO, PCI Demilitarized Zones  
**Domain Scope:** Iranian Payment Rails, Shaparak, Double-Entry Ledger, Smart PSP Switching, BNPL & Revolving Limits, Sovereign eKYC, Automated Merchant Early Settlement  

---

## Table of Contents
1. [Architectural Overview & Ecosystem Realities](#1-architectural-overview--ecosystem-realities)
2. [Global System Topology](#2-global-system-topology)
3. [Edge Gateway & Transactional Ticket AuthNZ](#3-edge-gateway--transactional-ticket-authnz)
4. [Double-Entry Wallet Ledger Engine](#4-double-entry-wallet-ledger-engine)
5. [Smart PSP Payment Switch & Network Isolation](#5-smart-psp-payment-switch--network-isolation)
6. [Purchase Aggregator & Multi-Party Dynamic Split](#6-purchase-aggregator--multi-party-dynamic-split)
7. [BNPL & Consumer Credit Origination Pipeline](#7-bnpl--consumer-credit-origination-pipeline)
8. [Installment Lifecycle, Debt Recovery & Revolving Limits](#8-installment-lifecycle-debt-recovery--revolving-limits)
9. [National Banking Rails & Direct Debit](#9-national-banking-rails--direct-debit)
10. [24-Hour Merchant Early Settlement Engine](#10-24-hour-merchant-early-settlement-engine)
11. [Sovereign eKYC & PKI Digital Signature Provider](#11-sovereign-ekyc--pki-digital-signature-provider)
12. [Event-Driven Eventual Consistency & Auto-Healing](#12-event-driven-eventual-consistency--auto-healing)
13. [Product Manager Operations & SLA Matrix](#13-product-manager-operations--sla-matrix)

---

## 1. Architectural Overview & Ecosystem Realities

Building a high-throughput financial ecosystem in Iran requires solving a set of constraints rarely encountered in Western platforms:
1. **Heterogeneous, Fragmented Bank Protocols:** Unlike unified developer APIs (such as Stripe or Adyen), Iranian payment institutions (PSPs including SEP, PEC, BPM, PEP) maintain distinct legacy protocols, varying timeout dynamics, and divergent error semantics.
2. **Batch Clearing Realities:** Capital movement does not settle instantly. Transactions transition through the Central Bank's clearing house (Paya) across fixed cycles daily ($03:45$, $10:45$, $13:45$, $18:45$). Architecture must account for asynchronous reconciliation and stateful pending queues.
3. **Mandatory Card-Not-Present Security (Harim Dynamic OTP):** Online payments require integration with the Central Bank's Harim infrastructure, routing SMS and app-based dynamic passwords through banks without exposing plain-text credentials.
4. **Strict Isolation of Sensitive Data:** To satisfy regulatory compliance and PCI-DSS equivalents, primary account numbers (PAN), track data, and card security codes must never touch public or core application layers.

This blueprint details an enterprise-grade microservice architecture handling tens of millions of daily transactions across consumer super-apps, merchant dashboards, and national clearing rails.

---

## 2. Global System Topology

The platform decouples public ingress, domain orchestration, ledger accounting, payment switches, credit operations, and asynchronous telemetry into bounded microservice domains:

```mermaid
graph TB
    subgraph Ingress Tier
        MobileApp[Mobile SuperApp - Android / iOS]
        WebPortal[Merchant & Consumer Web Portals]
        Partners[External B2B Merchants]
    end

    subgraph Edge & Security Tier
        Gateway[API Gateway - Spring Cloud Gateway]
        UAA[UAA - Identity Provider & OAuth2/JWT]
        ConfigServer[Config-Server - Spring Cloud / Git]
        ScheduleMNG[Schedule-MNG - Distributed Quartz]
    end

    subgraph Core Payment & Transaction Domain
        PurchaseMNG[Purchase-MNG - Orchestrator]
        WalletMNG[Wallet-MNG - Wallet Service]
        Ledger[Wallet Provider / Double-Entry Ledger]
        SwitchPSP[Switch-PSP - Payment Switch Engine]
        RefundMNG[Refund-MNG - Multi-Channel Refund Engine]
    end

    subgraph Isolated PCI-DSS Banking Zone
        Vault[Vault Coordinator & Card Vault]
        PSPProxy[PSP-Proxy Cluster]
        BankProxy[Bank-Proxy - ACH / RTGS / Direct Debit]
    end

    subgraph Credit & BNPL Domain
        CreditOnboard[Credit-Onboarding - Loan Origination]
        CreditScore[Credit-Score - ICS & Ecosystem Matrix]
        SwitchCredit[Switch-Credit - Provider Switch]
        CreditProvider[Credit-Provider - In-House BNPL]
        InstallmentMNG[Installment-MNG - Repayment Engine]
        RevolvingMNG[Revolving-MNG - Credit Restorer]
    end

    subgraph Supplementary Services
        MerchantCredit[Merchant-Credit - Early Cashout]
        PDY[PDY - Shaparak Payment Facilitator]
        KYC[KYC Engine - Shahkar & Sabt-Ahval]
        DSP[DSP - Digital Signature PKI]
    end

    subgraph Asynchronous Backbone
        RabbitMQ((RabbitMQ Enterprise Mesh))
        ReportMNG[Report-MNG - Spring Batch Analytics]
        Audit[Audit Service - Immutable Log]
        Notification[Notification - Multi-Provider SMS/Push]
    end

    %% Ingress Traffic
    MobileApp & WebPortal & Partners -->|HTTPS / WSS| Gateway
    Gateway -->|AuthNZ Delegation| UAA
    Gateway -->|Route Traffic| PurchaseMNG
    Gateway -->|Route Traffic| WalletMNG
    Gateway -->|Route Traffic| CreditOnboard
    Gateway -->|Route Traffic| MerchantCredit

    %% Payment Pipeline
    PurchaseMNG -->|Reserve / Verify| WalletMNG
    WalletMNG -->|ACID Balance Delta| Ledger
    PurchaseMNG -->|Route Payment| SwitchPSP
    SwitchPSP -->|Encrypted Dispatch| PSPProxy
    PSPProxy -->|Tokenize PAN| Vault

    %% BNPL Pipeline
    CreditOnboard -->|Identity Verification| KYC
    CreditOnboard -->|Dual Scoring Query| CreditScore
    CreditOnboard -->|Provision Credit Line| SwitchCredit
    SwitchCredit -->|Allocate| CreditProvider
    InstallmentMNG -->|Settled Event| RevolvingMNG
    RevolvingMNG -->|Restore Ceiling| CreditProvider

    %% Async Telemetry
    PurchaseMNG & WalletMNG & SwitchPSP & InstallmentMNG -->|Publish `activity.event`| RabbitMQ
    RabbitMQ -->|Consume| ReportMNG
    RabbitMQ -->|Consume| Notification
    RabbitMQ -->|Audit Logs| Audit
```

---

## 3. Edge Layer & Transactional Ticket AuthNZ

The Edge Layer insulates internal microservices from malformed requests, network bursts, and token replay attacks.

```mermaid
sequenceDiagram
    autonumber
    actor Client as SuperApp / Web Client
    participant GW as API Gateway (WebFlux)
    participant Redis as Redis (Token Bucket & Tickets)
    participant UAA as UAA Microservice
    participant Core as Target Domain Service

    Client->>GW: POST /api/v1/purchase/pay (Bearer Token + Ticket)
    GW->>Redis: Check Rate Limit Quota (Token Bucket)
    alt Rate Limit Exceeded
        Redis-->>GW: Limit Exhausted
        GW-->>Client: 429 Too Many Requests
    end
    GW->>UAA: Validate Token & Authorize Request
    UAA-->>GW: Token Valid (Claims: UUID, Roles, Scopes)
    GW->>Redis: Atomic Burn Ticket (GETDEL ticket:tx-uuid)
    alt Ticket Invalid or Expired
        Redis-->>GW: Nil / Not Found
        GW-->>Client: 403 Forbidden (Ticket Already Consumed)
    end
    GW->>Core: Forward Validated Request (Headers: X-User-Id, X-Tenant-Id)
    Core-->>GW: 200 OK (Transaction Initiated)
    GW-->>Client: 200 OK Response
```

### Architectural Specifications
1. **Reactive Non-Blocking Gateway (Spring Cloud Gateway / WebFlux Netty):** Maintains high concurrent connections with minimal memory overhead, using Redis-backed token bucket algorithms for dynamic IP and Client-ID rate limiting.
2. **Stateless JWT Authority (UAA):** Signs tokens using asymmetric cryptography ($RSA\text{-}2048$). Tokens embed user profile metadata, role arrays, and tenant contexts, avoiding database read queries during routine API calls.
3. **Transactional Single-Use Tickets:** For high-value monetary mutations (e.g., executing a purchase or changing payout destinations), clients must exchange credentials for a short-lived ticket. The gateway burns this ticket atomically via Redis `GETDEL`, neutralizing replay vectors.

---

## 4. Double-Entry Wallet Ledger Engine

Financial state integrity prohibits simplistic `UPDATE users SET balance = balance - amount` operations. The system enforces an **Immutable Double-Entry Ledger (ACID)** paired with a **Two-Phase Reservation State Machine**.

```mermaid
stateDiagram-v2
    [*] --> AVAILABLE: Initial Balance
    AVAILABLE --> RESERVED: Step 1: Reserve Funds (Phase 1)
    RESERVED --> AVAILABLE: Step 2a: Failure / Timeout (Compensate & Release)
    RESERVED --> TRANSFERRED: Step 2b: Verify Callback (Phase 2 Commit)
    TRANSFERRED --> [*]: Ledger Finalized
```

### Double-Entry Invariants
Every financial transaction writes at least two balanced journal records: a debit from the source bucket and a credit to the destination bucket. The net sum across all journal entries must always equal zero:
$$\sum_{i=1}^{n} \text{Debit}_i - \sum_{j=1}^{m} \text{Credit}_j = 0$$

```mermaid
classDiagram
    class WalletAccount {
        +UUID id
        +UUID userId
        +String tenantId
        +String currency
        +Status status
        +DateTime createdAt
    }

    class BalanceBucket {
        +UUID id
        +UUID walletAccountId
        +BalanceType type
        +BigDecimal availableBalance
        +BigDecimal reservedBalance
        +Long version
    }

    class JournalEntry {
        +UUID id
        +String trackingCode
        +UUID debitBucketId
        +UUID creditBucketId
        +BigDecimal amount
        +EntryType entryType
        +DateTime timestamp
    }

    WalletAccount "1" *-- "many" BalanceBucket
    BalanceBucket "1" <-- "many" JournalEntry
```

### Operational Mechanics
- **Phase 1 (Reservation):** Balance shifts from `AVAILABLE` to `RESERVED`. Funds are ring-fenced; the user cannot double-spend them, but funds have not yet departed the account.
- **Phase 2 (Commit or Compensate):** Upon receiving a cryptographically verified callback from the settlement rail, funds in `RESERVED` are deducted and credited to the merchant's settlement wallet. On network timeout or decline, funds return to `AVAILABLE`.
- **Idempotency Enforcement:** All ledger endpoints require a unique `trackingCode`. Duplicate inbound calls return the cached response, preventing duplicate debits or credits.
- **Segregated Balance Buckets:** The system isolates `CASH` balances (withdrawable via Paya/Sheba) from `INTERNAL_CREDIT` (cashback, campaign coins, non-cashoutable credits).

---

## 5. Smart PSP Payment Switch & Network Isolation

The Payment Switch decouples downstream bank idiosyncrasies while isolating sensitive cardholder credentials.

```mermaid
graph TD
    subgraph Cloud Core Application Zone
        Purchase[Purchase Service] -->|Initiate IPG / DPG| SwitchPSP[Switch-PSP Engine]
        HealthCheck[Health Monitor Service] -->|Real-time Metrics| SwitchPSP
    end

    subgraph PCI-DSS Bank-Adjacent Isolated Zone
        SwitchPSP -->|Encrypted Payload| PSPProxy[PSP-Proxy Multi-Cluster]
        PSPProxy <-->|PAN Token Translation| Vault[Vault-Coordinator & HSM Vault]
    end

    subgraph Iranian Banking Mesh - Shaparak
        PSPProxy -->|REST / SOAP| SEP[Saman - SEP]
        PSPProxy -->|REST / SOAP| PEC[Parsian - PEC]
        PSPProxy -->|REST / SOAP| BPM[Behpardakht Mellat - BPM]
        PSPProxy -->|REST / SOAP| PEP[Pasargad - PEP]
    end
```

### Dynamic Switch Mechanics
1. **Dynamic Smart Routing Algorithm:** `Switch-PSP` dynamically computes a weighted routing score for each available PSP terminal every 30 seconds:
   $$\text{Score} = w_1 \cdot \text{SuccessRate}_{\text{5min}} + w_2 \cdot \frac{1}{\text{Latency}_{\text{avg}}} + w_3 \cdot \text{CostEfficiency}$$
   If an external bank gateway degrades, traffic automatically fails over to healthy PSPs within milliseconds.
2. **Payment Modalities:**
   - **Internet Payment Gateway (IPG):** Traditional two-phase redirect via Shaparak (`*.shaparak.ir`).
   - **Direct Payment Gateway (DPG - 4-Parameters):** In-app payment experience triggering the national Harim dynamic OTP rail without full-page external redirects.
3. **End-to-End Card Security:** Raw PANs are captured client-side using an ephemeral public key issued by the isolated PSP-Proxy. Core application servers never see or log raw card credentials.

---

## 6. Purchase Aggregator & Multi-Party Dynamic Split

The `Purchase-MNG` service manages checkout lifecycles, insurance splits, and multi-vendor settlements.

```mermaid
sequenceDiagram
    autonumber
    actor Merchant as Merchant System
    actor User as Consumer
    participant Gateway as API Gateway
    participant PurchaseAgg as Purchase Aggregator
    participant PurchaseCore as Purchase Management
    participant Insurance as Insurance Microservice
    participant SwitchPSP as Switch-PSP
    participant MQ as RabbitMQ
    participant Report as Report-MNG
    participant GL as General Ledger

    Merchant->>Gateway: Create Purchase Request (Amount, Metadata, Split Details)
    Gateway->>PurchaseAgg: Forward Validated Request
    alt Insurance Split Required
        PurchaseAgg->>Insurance: Register Insurance Policy & Query Split
        Insurance-->>PurchaseAgg: Policy ID & Commission Split Values
    end
    PurchaseAgg->>PurchaseCore: Initialize Transaction
    PurchaseCore-->>Merchant: Return Payment URL & Ticket
    Merchant-->>User: Redirect to Payment Screen with Ticket
    User->>SwitchPSP: Execute Payment (Card or Wallet)
    SwitchPSP-->>PurchaseCore: Payment Successful (RRN & Tracking Code)
    PurchaseCore->>Merchant: Send Webhook Callback
    Merchant->>PurchaseCore: Finalize Transaction (Verify)
    par Financial Reconciliation & Telemetry
        PurchaseCore->>MQ: Publish `activity.end_state`
        MQ->>Report: Ingest for User History & Merchant Dashboard
        MQ->>GL: Post Split Accounting Entries
    end
    PurchaseCore-->>User: Display Payment Confirmation Receipt
```

---

## 7. BNPL & Consumer Credit Origination Pipeline

Automates unsecured micro-lending, document intake, and dynamic credit allocation without manual branch visits.

```mermaid
graph TD
    User([User Application]) -->|Apply for Credit| Onboarding[Credit-Onboarding Process]
    
    subgraph Identity & Liveness Engine
        Onboarding -->|National Code & SIM Match| Shahkar[Shahkar Inquiry - KYC]
        Onboarding -->|Identity Metadata & Vitality| SabtAhval[Sabt-Ahval - KYC]
    end

    subgraph Dual-Credit Scoring Engine
        Onboarding -->|Bank Default & Cheque Registry| ICS[ICS National Banking Score]
        Onboarding -->|Ecosystem Behavioral Data| DigipayScore[Behavioral Matrix Engine]
        ICS & DigipayScore --> ScoreCombiner{Scoring Fusion Matrix}
        ScoreCombiner -->|Approved| CollateralCheck[Collateral & Promissory Note]
    end

    subgraph Credit Line Provisioning
        CollateralCheck -->|Pass| SwitchCredit[Switch-Credit Engine]
        SwitchCredit -->|In-House BNPL Wallet| CreditProvider[Credit-Provider Service]
        SwitchCredit -->|POS Credit Card| CreditCardProvider[Credit-Card-Provider Service]
    end
```

### Dual Scoring Fusion Function
$$\text{CreditLimit} = f(\text{ICS}_{\text{BankingScore}}, \text{Score}_{\text{Ecosystem}}, \text{RiskCategory}_{\text{Merchant}})$$
- **ICS (Iran Credit Scoring):** National credit bureau checking across all Iranian banks for bounced cheques, unpaid promissory notes, and loan defaults.
- **Ecosystem Behavioral Score:** Evaluates historical marketplace checkout velocity, return ratios, wallet turnover, and account age.

---

## 8. Installment Lifecycle, Debt Recovery & Revolving Limits

Manages repayment schedules, penalty calculations, underwriter risk coverage, and real-time revolving credit restoration.

```mermaid
sequenceDiagram
    autonumber
    actor User as Consumer
    participant Installment as Installment-MNG
    participant SwitchPSP as Switch-PSP / IPG
    participant MQ as RabbitMQ
    participant Revolving as Revolving-MNG
    participant CreditProv as Credit-Provider (Wallet)
    participant Underwriting as Corporate Underwriter
    participant GL as General Ledger

    Note over User,Installment: Scheduled Due-Date Reminder (SMS/Push)
    User->>Installment: Submit Payment (Wallet, IPG, or Direct Debit)
    Installment->>SwitchPSP: Collect Repayment Funds
    SwitchPSP-->>Installment: Funds Cleared Successfully
    Installment->>Installment: Update Status (PAID)
    par Async Credit Line Restoration
        Installment->>MQ: Publish `installment.settled` Event
        MQ->>Revolving: Ingest Event & Calculate Revolved Principal
        Revolving->>CreditProv: Restore Available Credit Limit
        MQ->>GL: Post Realized Interest & Settle Debt Balance
    end
    Installment-->>User: Confirmation Notice & Updated Available Ceiling

    opt User Defaults on Repayment (Grace Period Expired)
        Installment->>Underwriting: Claim Default Balance from Underwriter
        Underwriting->>GL: Offset Bad Debt from Corporate Retention Escrow
    end
```

---

## 9. National Banking Rails & Direct Debit

Abstracts low-level protocol interfaces for interbank settlements, batch clearing, and card-to-card routing.

```mermaid
graph LR
    subgraph Internal Domain Services
        WalletPayout[Wallet Payout Engine]
        DirectDebitTrigger[Recurring Subscription Engine]
        C2CTransfer[Card-to-Card Transfer MiniApp]
    end

    subgraph Switch-Bank Subsystem
        SwitchBank[Switch-Bank Core] --> BankProxy[Bank-Proxy Orchestrator]
    end

    subgraph National Financial Rails
        BankProxy -->|ACH File & API / Paya| PayaRail[Central Bank Paya ACH]
        BankProxy -->|RTGS API / Satna| SatnaRail[Central Bank Satna RTGS]
        BankProxy -->|Direct Debit Mandate| BankDirectDebit[Partner Banks Open Banking]
        BankProxy -->|Faravaran Hub Integration| Faravaran[Shaparak Pardakhtsazi C2C]
    end
```

### Rail Characteristics
- **Paya (ACH):** Handles batch fund disbursements and wallet-to-bank cashouts across 4 daily clearing cycles.
- **Satna (RTGS):** Real-time gross settlement for high-value interbank transfers.
- **Direct Debit (Peyman):** Long-term digital authorization allowing automated balance deductions for subscriptions and installments with zero user friction.
- **Card-to-Card (Faravaran Hub):** Leverages authorized Payment Creation (Pardakhtsazi) licenses from Shaparak to facilitate peer-to-peer card transfers with dynamic bank switch selection.

---

## 10. 24-Hour Merchant Early Settlement Engine

Allows marketplace sellers to unlock pending liquidity within 24 hours via automated working capital loans.

```mermaid
stateDiagram-v2
    [*] --> INIT: Merchant Requests Early Cashout
    INIT --> PAID: Settlement Fee Calculated & Deducted
    PAID --> UPLOAD_IN_PROGRESS: Generate Bank Batch Manifest
    UPLOAD_IN_PROGRESS --> UPLOADED: Pushed to Bank SFTP Bridge
    UPLOADED --> REPAYMENT: Commercial Bank Disburses Loan to Seller
    REPAYMENT --> SUCCESS: Marketplace Offsets Invoice at Due Date
    SUCCESS --> [*]

    UPLOAD_IN_PROGRESS --> UPLOAD_FAILED: SFTP Transmission Error
    UPLOADED --> PROVIDER_REJECTED: Bank Regulatory Rejection
    PROVIDER_REJECTED --> REFUNDED: Fee Returned via Refund-MNG
    REPAYMENT --> INCONSISTENT: Ledger Discrepancy Flagged
```

### Dynamic Daily Floating Fee
$$\text{Fee} = \text{InvoiceAmount} \cdot (r_{\text{base}} + d \cdot r_{\text{daily}})$$
Where $d$ represents the days remaining until normal accounting invoice clearing (e.g., $0.4\%$ fee for 5 days; $\sim 2.5\%$ for 30 days).

---

## 11. Sovereign eKYC & PKI Digital Signature Provider

Enables legally binding, paperless credit contracts via sovereign registry inquiries and PKI infrastructure.

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant KYC as KYC Microservice
    participant Gov as National Registries (Shahkar / Sabt)
    participant DS as Digital-Signature Service
    participant DSP as DSP Engine (PKI CA)
    participant Storage as File-Server (MinIO & GridFS)

    User->>KYC: Submit National ID, Mobile & Biometric Video
    par Identity & Liveness Check
        KYC->>Gov: Verify SIM Ownership (Shahkar Protocol)
        Gov-->>KYC: Match Confirmed (Boolean: True)
        KYC->>Gov: Query Vital Records (Sabt-Ahval API)
        Gov-->>KYC: Identity Verified (Birthdate, Vitality Status)
        KYC->>KYC: Execute Neural Liveness & Anti-Spoofing Model
    end
    KYC-->>DS: eKYC Dossier Verified
    DS->>DSP: Request PKI Certificate Issuance
    DSP->>DSP: Generate Keypair & Legal Digital Certificate
    DS->>Storage: Fetch Loan Contract PDF
    DSP->>Storage: Embed User Digital Signature & Visual Stamp
    DSP-->>User: Loan Contract Legally Executed
```

---

## 12. Event-Driven Eventual Consistency & Auto-Healing

Maintains financial consistency across microservice boundaries during bank switch outages.

```mermaid
graph TD
    subgraph Transaction Producers
        P[Purchase-MNG] -->|activity.event| Exchange{RabbitMQ Topic Exchange}
        W[Wallet-MNG] -->|activity.event| Exchange
        S[Switch-PSP] -->|activity.event| Exchange
    end

    subgraph Report & Multi-View Engine
        Exchange -->|Route: activity.pending| QPending[Queue: Pending Events]
        Exchange -->|Route: activity.end_state| QFinal[Queue: End-State Events]
        QPending & QFinal --> ReportMNG[Report-MNG Service]
        ReportMNG --> MongoView[(MongoDB Multi-View Collections)]
    end

    subgraph Batch Reconciliation & Auto-Healing
        ReportMNG --> BatchJob[Spring Batch Daily Reconciliation Job]
        BatchJob -->|Query Source Ledger Records| W & S
        BatchJob -->|Detect Discrepancy| RefundEngine[Refund-MNG Auto-Healer]
        RefundEngine -->|Execute Auto-Refund| S
    end
```

---

## 13. Product Manager Operations & SLA Matrix

Key performance indicators and automated circuit breakers for platform product managers:

| Domain | Key Performance Indicator (KPI) | Target SLA | Automated System Reaction on Breach |
| :--- | :--- | :--- | :--- |
| **API Gateway** | P99 Latency & 429 Throttle Rate | $< 50\text{ ms}$, $< 0.1\%$ | Scale Redis token buckets; shed low-priority traffic. |
| **Payment Switch** | Payment Success Rate (PSR) | $> 88\%$ per PSP | Route traffic weight to $0\%$; instant failover to backup PSP. |
| **Wallet Ledger** | Journal Invariant Balance Delta | Strictly zero ($\Delta = 0$) | Halt wallet withdrawals immediately; trigger P1 on-call alert. |
| **BNPL Origination** | Default Probability at Origination | $< 1.8\%$ NPL | Increase required ICS bank score threshold; require physical cheques. |
| **Merchant Settlement** | 24-Hour Settlement Payout Rate | $> 99.2\%$ completed | Retry bank SFTP pipeline; alert operations for manual clearing. |
| **eKYC Services** | Shahkar Verification Latency | $< 1200\text{ ms}$ | Fallback to secondary KYC aggregator; display retry screen. |

---
*Published as an architectural reference for fintech engineers and systems builders at [ariya-sarrafzadeh.ir](https://ariya-sarrafzadeh.ir).*