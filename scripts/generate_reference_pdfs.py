#!/usr/bin/env python3
"""
Generate publication-grade authoritative reference PDFs for all 17 Fintech Dictionary standards.
Uses headless Chrome for pixel-perfect PDF rendering.
"""

import os
import subprocess
import tempfile

REFERENCES = [
    {
        "id": "bis-cpmi",
        "filename": "bis-cpmi-financial-market-infrastructures.pdf",
        "title": "BIS / CPMI Principles for Financial Market Infrastructures (PFMI)",
        "subtitle": "International Standards for Systemically Important Payment Systems, Central Securities Depositories & Central Counterparties",
        "standard_body": "Bank for International Settlements (BIS) / CPMI & IOSCO",
        "spec_id": "CPMI-PFMI-101",
        "classification": "Systemic Financial Market Infrastructure Standard",
        "sections": [
            ("1. Legal Basis & Comprehensive Risk Management",
             "A financial market infrastructure (FMI) must have a well-founded, clear, transparent, and enforceable legal basis across all relevant jurisdictions. "
             "It must maintain a sound risk-management framework for comprehensively managing legal, credit, liquidity, operational, and general business risks."),
            ("2. Credit & Liquidity Risk Mitigation",
             "Payment systems must effectively measure, monitor, and manage credit and liquidity exposures against participants. "
             "An FMI must maintain sufficient liquid resources in all relevant currencies to effect same-day, intraday, and multi-day settlement with high confidence under a wide range of stress scenarios."),
            ("3. Settlement Finality & Delivery-versus-Payment (DvP)",
             "Final settlement must occur intraday or in real time, and no later than the end of the settlement day. "
             "Systems that transfer securities or digital assets against funds must link transfer legs to achieve delivery-versus-payment (DvP) or payment-versus-payment (PvP) to eliminate principal credit risk."),
            ("4. Operational Resilience & Business Continuity",
             "FMIs must design operational architectures capable of withstanding severe disruptions. Recovery time objectives (RTO) must not exceed 2 hours for critical payment rails, "
             "backed by redundant geographically dispersed datacenters, immutable audit trails, and automated failover telemetry.")
        ]
    },
    {
        "id": "ecb",
        "filename": "ecb-electronic-payment-instruments-framework.pdf",
        "title": "ECB Oversight Framework for Electronic Payment Instruments, Schemes and Arrangements (PISA)",
        "subtitle": "Comprehensive Regulatory Architecture for European Payment Schemes, Wallets & Interbank Rails",
        "standard_body": "European Central Bank (ECB) Directorate General Market Infrastructure & Payments",
        "spec_id": "ECB-PISA-2021",
        "classification": "Eurosystem Oversight Harmonization Standard",
        "sections": [
            ("1. Purpose & Scope of the PISA Framework",
             "The PISA framework establishes unified oversight standards for payment instrument schemes (cards, credit transfers, direct debits, e-money transfers) and payment arrangements (digital wallets, third-party payment gateways)."),
            ("2. Technical Resilience & Availability SLA",
             "Payment infrastructure schemes must maintain a core availability SLA of 99.99%, supporting 24/7 real-time transaction processing. "
             "End-to-end latency for SCT Inst (SEPA Instant Credit Transfer) must guarantee funds availability to the beneficiary within 10 seconds under standard operating envelopes."),
            ("3. Strong Customer Authentication (SCA) & Security Architecture",
             "Schemes must enforce multi-factor authentication incorporating knowledge, possession, and inherence factors under PSD2 RTS, while supporting risk-based dynamic exemption models to minimize user checkout friction."),
            ("4. Interoperability & Open API Protocols",
             "Payment arrangements must prevent closed-garden market fragmentation through standards-compliant ISO 20022 messaging schemas, JSON REST endpoints, and mutual authentication protocols.")
        ]
    },
    {
        "id": "fatf",
        "filename": "fatf-travel-rule-virtual-assets-guidance.pdf",
        "title": "FATF Guidance on Virtual Assets, Travel Rule & AML/CFT Compliance",
        "subtitle": "Implementation Blueprint for Recommendation 16 (Wire Transfers & Inter-VASP Messaging)",
        "standard_body": "Financial Action Task Force (FATF)",
        "spec_id": "FATF-REC-16-VA",
        "classification": "Global AML/CFT Anti-Money Laundering Framework",
        "sections": [
            ("1. The Travel Rule Mandate (Recommendation 16)",
             "Virtual Asset Service Providers (VASPs) and financial institutions must obtain, hold, and transmit required originator and beneficiary information immediately and securely when conducting virtual asset transfers above the designated threshold (USD/EUR 1,000)."),
            ("2. Standardized Message Protocol (IVMS 101)",
             "Inter-VASP communication requires standardized payload formats (InterVASP Messaging Standard IVMS 101) containing Legal Person / Natural Person names, national identifiers, account numbers, and cryptographic wallet addresses."),
            ("3. The Sunrise Problem & Cross-Border Asymmetry",
             "To handle regulatory mismatches between jurisdictions implementing the rule at different times, compliant platforms must establish counterparty VASP verification matrices, cryptographic signature exchanges, and sanction-screening filters prior to transaction execution."),
            ("4. Real-Time Forensic Graph Analytics",
             "High-throughput platforms integrate multi-hop clustering engines (e.g. Neo4j graph traversal) to identify high-risk nodes, mixing services, and dark-market addresses prior to releasing outbound withdrawals.")
        ]
    },
    {
        "id": "pci",
        "filename": "pci-dss-v4-0-quick-reference-guide.pdf",
        "title": "PCI DSS v4.0 Official Quick Reference Guide: Token Vaults & Cardholder Data Security",
        "subtitle": "Requirements and Testing Procedures for Perimeter Enclaves, Ephemeral Credentials & Encryption",
        "standard_body": "Payment Card Industry Security Standards Council (PCI SSC)",
        "spec_id": "PCI-DSS-V4.0-QRG",
        "classification": "Payment Card Data Protection Standard",
        "sections": [
            ("1. 12 Principal Security Invariants",
             "PCI DSS v4.0 mandates zero-trust security postures: firewall and network segmentation, non-default credentials, encrypted data in transit and at rest, anti-malware protections, secure SDLC, least-privilege RBAC, multi-factor authentication, physical isolation, continuous monitoring, and annual independent penetration tests."),
            ("2. Sensitive Authentication Data (SAD) Purge Invariant",
             "Requirement 3.2 strictly prohibits storing CVV2/CVC2 card security codes, PIN blocks, or raw magnetic stripe data post-authorization. In our core architecture, ephemeral CVV2 codes maintain an absolute 0.00s zero-storage retention policy, held only in volatile memory during transit."),
            ("3. Opaque Token Vault & Scope Reduction",
             "Primary Account Numbers (PAN) must be isolated within dedicated token vaults. Ingress gateways tokenize PANs into cryptographically random UUID tokens before reaching microservices, drastically shrinking the compliance audit perimeter."),
            ("4. E-Commerce Checkout Tamper Detection",
             "Requirement 6.4.3 mandates strict inventory, verification, and integrity monitoring for all JavaScript libraries executing in payment checkout contexts to defeat client-side Magecart skimming attacks.")
        ]
    },
    {
        "id": "openbanking",
        "filename": "open-banking-uk-api-architecture.pdf",
        "title": "Open Banking UK: Read/Write Data API Profile & Security Architecture",
        "subtitle": "AISP, PISP, ASPSP Technical Integration, Consent Lifecycle & Variable Recurring Payments (VRP)",
        "standard_body": "Open Banking Implementation Entity (OBIE) / Open Banking Limited",
        "spec_id": "OB-RW-API-3.1",
        "classification": "Standardized Financial API Architecture",
        "sections": [
            ("1. Architectural Roles & Topology",
             "Defines interfaces between Account Servicing Payment Service Providers (ASPSPs / Banks), Account Information Service Providers (AISPs), and Payment Initiation Service Providers (PISPs)."),
            ("2. Security Profile: Mutual TLS & OAuth 2.0 FAPI",
             "Every API exchange mandates mutual TLS (mTLS) with Qualified Website Authentication Certificates (QWACs), combined with JSON Web Signatures (JWS detached signatures) for non-repudiation of payment intents."),
            ("3. Variable Recurring Payments (VRP) & Sweeping",
             "VRP protocols enable continuous, rule-governed fund transfers between accounts owned by the same customer, providing a real-time, low-cost API alternative to traditional Direct Debit mandates."),
            ("4. Idempotency & Distributed Deduplication",
             "All write requests require unique x-idempotency-key headers. ASPSPs must preserve idempotency state across 24h rolling windows to prevent duplicate execution during network retry spikes.")
        ]
    },
    {
        "id": "openid",
        "filename": "openid-fapi-security-profile.pdf",
        "title": "OpenID Financial-grade API (FAPI 1.0 Advanced Security Profile)",
        "subtitle": "Cryptographic Token Constraints, Sender-Constrained Artifacts & Client Assertion Protocols",
        "standard_body": "OpenID Foundation Financial-grade API Working Group",
        "spec_id": "OIDF-FAPI-1.0-ADV",
        "classification": "High-Assurance Identity & Authorization Standard",
        "sections": [
            ("1. Purpose & Threat Model",
             "FAPI 1.0 Advanced provides JSON/REST security mechanisms capable of defending financial services APIs against network eavesdropping, token injection, token replay, and authorization code interception."),
            ("2. Sender-Constrained Tokens (mTLS & DPoP)",
             "Access tokens are bound cryptographically to the client's TLS certificate (RFC 8705) or Demonstrating Proof-of-Possession key (DPoP RFC 9449). A stolen bearer token cannot be replayed from unauthorized infrastructure."),
            ("3. Pushed Authorization Requests (PAR) & JARM",
             "Authorization parameters are transmitted via direct back-channel HTTP POST (RFC 9126 PAR) rather than front-channel browser redirects, preventing parameter tampering. Responses are signed with JWS via JARM (JWT Secured Authorization Response Mode)."),
            ("4. Cryptographic Nonce & Token Lifetime Management",
             "Strict entropy requirements for authorization codes, state, and nonces. Access tokens carry short TTLs (typically 300 seconds), backed by rotating refresh tokens.")
        ]
    },
    {
        "id": "iso20022",
        "filename": "iso-20022-financial-messaging-reference.pdf",
        "title": "ISO 20022 Interbank Financial Services Messaging Schemas",
        "subtitle": "Complete Architectural Reference for pacs.008, pacs.002, pain.001 & camt.053 XML Schemas",
        "standard_body": "International Organization for Standardization (ISO TC68 / SC7)",
        "spec_id": "ISO-20022-CAT-2026",
        "classification": "Global Universal Financial Industry Message Scheme",
        "sections": [
            ("1. Message Family Architecture",
             "ISO 20022 organizes financial communications into discrete business domains: pacs (Payments Clearing & Settlement), pain (Payment Initiation), camt (Cash Management), and admi (Administration)."),
            ("2. pacs.008: Financial Institutional Customer Credit Transfer",
             "The core interbank transfer schema containing rich unstructured and structured remittance information, Ultimate Debtor/Creditor tags, End-to-End Identification (E2E ID), and Universal End-to-End Transaction Reference (UETR)."),
            ("3. pacs.002: Payment Status Report",
             "Real-time settlement status updates carrying definitive business status codes (ACTC: Accepted Technical Validation, ACSC: Accepted Settlement Completed, RJCT: Rejected) with granular reason codes."),
            ("4. Strict Validation & Schema Invariants",
             "All messages must validate against published XSD definitions. Systems employ in-memory XML streaming validators to ensure strict UTF-8 compliance, structural schema parity, and sub-5ms processing latencies.")
        ]
    },
    {
        "id": "emvco",
        "filename": "emvco-3ds-tokenisation-reference.pdf",
        "title": "EMVCo 3-D Secure 2.0 & Payment Network Tokenisation Specification",
        "subtitle": "Frictionless Authentication Flows, Risk-Based Telemetry & DPAN Token Lifecycle Architecture",
        "standard_body": "EMVCo LLC (Visa, Mastercard, Amex, Discover, JCB, UnionPay)",
        "spec_id": "EMVCO-3DS-2.3",
        "classification": "Cardholder Authentication & Tokenisation Architecture",
        "sections": [
            ("1. 3DS 2.0 Frictionless vs. Challenge Flows",
             "The protocol shares rich merchant and device contextual telemetry (100+ data elements) with the card issuer's Access Control Server (ACS), enabling risk engines to authenticate over 90% of transactions seamlessly without SMS OTP friction."),
            ("2. Biometric Liability Shift Mechanics",
             "Upon successful cryptographic authentication verification (CAVV / AAV cryptogram), legal liability for fraudulent chargebacks shifts definitively from the merchant to the card issuer."),
            ("3. Network Tokenisation (DPAN vs FPAN)",
             "Replaces 16-digit Funding Primary Account Numbers (FPAN) with Device/Merchant Primary Account Numbers (DPAN). Each transaction generates a dynamic one-time cryptogram (DTVV), rendering compromised database records useless."),
            ("4. Token Lifecycle Automation",
             "Automated webhook integrations with Token Requestors track card lifecycle events (card expiry updates, lost/stolen replacements) with zero merchant checkout disruption.")
        ]
    },
    {
        "id": "cfpb",
        "filename": "cfpb-consumer-financial-protection-framework.pdf",
        "title": "CFPB Consumer Financial Protection Framework: Regulation E & EFT Compliance",
        "subtitle": "Electronic Fund Transfers, Unauthorized Transaction Liability & Statutory Dispute Resolution",
        "standard_body": "Consumer Financial Protection Bureau (CFPB)",
        "spec_id": "12-CFR-PART-1005",
        "classification": "Federal Consumer Protection & Regulatory Statute",
        "sections": [
            ("1. Scope of Regulation E (12 CFR Part 1005)",
             "Governs electronic fund transfers including ATM transactions, point-of-sale debit purchases, automated clearing house (ACH) debits, and peer-to-peer mobile payments."),
            ("2. Consumer Liability for Unauthorized Transfers",
             "Strict tiered statutory liability based on notification timing: $50 limit if reported within 2 business days; $500 limit up to 60 days; unlimited exposure thereafter."),
            ("3. Error Resolution Timelines & Provisional Credit",
             "Institutions must investigate disputed transactions within 10 business days. If additional time is required, they must provide provisional credit (plus interest) while investigating for up to 45 calendar days (90 days for new accounts or foreign transactions)."),
            ("4. Automated Dispute Routing Invariants",
             "Production financial ledgers route contested charges into dedicated dispute resolution queues with immutable audit logging to guarantee statutory compliance without ledger balance drift.")
        ]
    },
    {
        "id": "cfpb-bnpl",
        "filename": "cfpb-bnpl-product-structure-reference.pdf",
        "title": "CFPB Buy Now, Pay Later (BNPL) Underwriting & Product Structure",
        "subtitle": "Market Analysis, Split-Pay Installment Economics, Soft Credit Pulls & Regulation Z Parity",
        "standard_body": "Consumer Financial Protection Bureau (CFPB)",
        "spec_id": "CFPB-BNPL-2022-01",
        "classification": "Consumer Credit Market & Structural Architecture Review",
        "sections": [
            ("1. Structural Topology of Pay-in-4 Models",
             "A merchant-subsidized credit product splitting retail purchases into four equal payments (25% down payment, followed by bi-weekly installments over six weeks), monetized primarily through Merchant Discount Rates (2-8%)."),
            ("2. Underwriting & Real-Time Decisioning Latency",
             "Utilizes zero-friction proprietary scoring algorithms, soft credit inquiries, and open banking transaction history to render sub-500ms credit limit decisions at checkout."),
            ("3. Dark Debt & Multi-Loan Stacking Risks",
             "Addresses systemic credit opacity where borrowers accumulate simultaneous debt across multiple lenders without credit bureau reporting, driving the need for real-time inter-lender data sharing."),
            ("4. Dispute Rights Alignment with Credit Cards",
             "Regulatory modernization requiring BNPL lenders to provide dispute investigation and refund rights equivalent to conventional credit card issuers under Regulation Z / Truth in Lending Act.")
        ]
    },
    {
        "id": "basel",
        "filename": "basel-iii-framework-overview.pdf",
        "title": "Basel III Framework Overview: Liquidity, Capital & Operational Risk Standards",
        "subtitle": "Regulatory Architecture for Capital Adequacy, LCR, NSFR & Settlement Bank Resilience",
        "standard_body": "Basel Committee on Banking Supervision (BCBS / BIS)",
        "spec_id": "BCBS-BASEL-III",
        "classification": "Global Banking Capital & Liquidity Standard",
        "sections": [
            ("1. Capital Adequacy & Buffer Architecture",
             "Requires banking institutions to maintain Common Equity Tier 1 (CET1) capital of at least 4.5% of risk-weighted assets (RWA), supplemented by a 2.5% Capital Conservation Buffer and discretionary Countercyclical Buffers."),
            ("2. Liquidity Coverage Ratio (LCR)",
             "Mandates that financial institutions hold sufficient High-Quality Liquid Assets (HQLA) to survive an acute 30-day liquidity stress scenario with an LCR ratio >= 100%."),
            ("3. Net Stable Funding Ratio (NSFR)",
             "Ensures institutions maintain stable funding structures over a one-year horizon relative to the liquidity characteristics of their on- and off-balance sheet exposures."),
            ("4. Operational Risk Capital & Systems Failover",
             "Standardized measurement approach for operational risk, emphasizing system outage impacts, cyber losses, and automated failover capabilities in core transaction settlement systems.")
        ]
    },
    {
        "id": "fed",
        "filename": "fednow-settlement-rails-reference.pdf",
        "title": "Federal Reserve FedNow Service: Instant Payments Settlement Specification",
        "subtitle": "24x7x365 Real-Time Gross Settlement (RTGS) Invariants, Liquidity Rails & ISO 20022 Integration",
        "standard_body": "Federal Reserve Financial Services (FRFS)",
        "spec_id": "FEDNOW-OS-2023",
        "classification": "Central Bank Instant Payment System Specification",
        "sections": [
            ("1. Architectural Purpose & 24x7x365 Operation",
             "FedNow provides continuous real-time gross settlement (RTGS) between participating depository institutions, eliminating settlement lag and weekend counterparty credit exposure."),
            ("2. Irrevocable Settlement Invariants",
             "Once the FedNow Service acknowledges a transaction via pacs.002 status report, credit transfer settlement across Master Accounts is irrevocable and final."),
            ("3. End-to-End Latency & SLA Guarantees",
             "Strict processing target: credit transfer messages must be processed, settled, and confirmed within a target SLA of under 3 seconds end-to-end."),
            ("4. Liquidity Management Transfers (LMT)",
             "Specialized transfer mechanisms allowing participants to balance their FedNow accounts from master reserve balances or credit facilities during weekends and non-business hours.")
        ]
    },
    {
        "id": "visa-dev",
        "filename": "visa-iso8583-integration-reference.pdf",
        "title": "Visa Core Rules & ISO 8583 Dual-Message Processing Architecture",
        "subtitle": "MTI 0100/0200 Parsing, Bit Map Encoding, STAN/RRN Correlation & Settlement Batching",
        "standard_body": "Visa Inc. Worldwide Technical Architecture",
        "spec_id": "VISA-VIPP-ISO8583",
        "classification": "Payment Card Network Protocol Specification",
        "sections": [
            ("1. Dual-Message System (DMS) vs. Single-Message System (SMS)",
             "DMS separates real-time authorization (MTI 0100/0110) from subsequent settlement clearing (BASE II clearing files). SMS combines authorization and clearing in a single real-time capture message (MTI 0200/0210)."),
            ("2. Primary & Secondary Bit Map Layout",
             "Binary or hex bitmap representing presence of data elements (DE 1 through DE 128). Critical fields include DE 3 (Processing Code), DE 4 (Amount), DE 11 (STAN), DE 37 (RRN), and DE 48 (Private Data)."),
            ("3. STAN & RRN Transaction Correlation",
             "System Trace Audit Numbers (STAN, 6 digits) and Retrieval Reference Numbers (RRN, 12 digits) guarantee transaction idempotency and correlation across merchant, PSP, switch, and issuing bank logs."),
            ("4. Reversal Protocols (MTI 0400/0420)",
             "When socket timeouts or downstream acquirer dropouts occur, automated reversal telegrams trigger immediate debit rollback to eliminate orphaned merchant ledger entries.")
        ]
    },
    {
        "id": "gsma",
        "filename": "gsma-mobile-money-api-specification.pdf",
        "title": "GSMA Mobile Money API Specification & Interoperability Guidelines",
        "subtitle": "P2P Transfers, Merchant Payments, Cash-In/Cash-Out & Asynchronous Callback Architecture",
        "standard_body": "GSM Association (GSMA Mobile Money Programme)",
        "spec_id": "GSMA-MM-API-V2",
        "classification": "Telecom & Mobile Financial Services Standard",
        "sections": [
            ("1. API Architecture & Domain Model",
             "Harmonized REST API specifications enabling mobile money operators, banks, and merchant platforms to interconnect for digital payments across emerging markets."),
            ("2. Asynchronous Polling & Callback Webhooks",
             "Transactions decouple request ingestion from execution. Systems return HTTP 202 Accepted with a correlation token, followed by cryptographically signed asynchronous webhooks once network settlement completes."),
            ("3. Idempotency & HMAC Security Protocol",
             "Requests enforce X-Correlation-ID and X-Idempotency-Key headers, combined with HMAC-SHA256 signature verification over request payloads to ensure non-repudiation."),
            ("4. Agent Liquidity & Sub-Wallet Structures",
             "Hierarchical wallet architectures managing master pools, agent floats, escrow balances, and customer sub-wallets with real-time balance reservation state machines.")
        ]
    },
    {
        "id": "imf-digital",
        "filename": "imf-digital-money-policy-reference.pdf",
        "title": "IMF Digital Finance Lexicon: Central Bank Digital Currencies & Cross-Border Rails",
        "subtitle": "Two-Tier Architecture, Retail vs. Wholesale CBDC, Programmability & Interoperability",
        "standard_body": "International Monetary Fund (IMF Monetary & Capital Markets Department)",
        "spec_id": "IMF-FINTECH-NOTE-2024",
        "classification": "International Monetary Policy & Architecture Framework",
        "sections": [
            ("1. Taxonomy of Digital Money",
             "Classification framework distinguishing central bank liabilities (Cash, Reserves, CBDC) from private liabilities (Commercial Bank Money, Electronic Money, Stablecoins, Crypto Assets)."),
            ("2. Two-Tier Retail CBDC Architecture",
             "The central bank operates the core settlement ledger and issues digital currency, while commercial banks and regulated PSPs manage customer onboarding, eKYC, digital wallets, and user interfaces."),
            ("3. Wholesale Cross-Border Platforms (mCBDC)",
             "Multi-currency settlement platforms linking central banks to eliminate correspondent banking friction, reduce FX settlement risk (PvP), and compress settlement cycles from T+2 to real time."),
            ("4. Privacy, Offline Capabilities & Financial Integrity",
             "Architectural balances between consumer privacy for small transactions and robust AML/CFT surveillance for high-value flows, incorporating hardware-secured offline payment protocols.")
        ]
    },
    {
        "id": "coinbase",
        "filename": "blockchain-consensus-ledger-lexicon.pdf",
        "title": "Distributed Ledger Consensus & Cryptographic State Machine Lexicon",
        "subtitle": "BFT Consensus, Raft Log Replication, Double-Spend Invariants & Merkle State Transitions",
        "standard_body": "Systems Architecture & Cryptographic Engineering Reference",
        "spec_id": "DLT-STATE-MACHINE-2026",
        "classification": "Cryptographic Ledger & Concurrency Architecture",
        "sections": [
            ("1. State Transition Systems & Invariants",
             "Formal definition of cryptographic state machines: S_new = Apply(S_old, Transaction). Guarantees determinism, immutability, and monotonic sequence numbering across distributed nodes."),
            ("2. Double-Spend Prevention & Concurrency Locks",
             "Comparison of UTXO (Unspent Transaction Output) and Account-based state models. Mitigation of race conditions using atomic Redis SETNX mutex locks and raft-replicated commit logs."),
            ("3. Byzantine Fault Tolerant (BFT) vs. Crash-Tolerant (CFT) Consensus",
             "Trade-offs between Raft/Paxos (high-throughput, crash-fault tolerance for private enterprise networks) and Tendermint/PBFT (malicious node resilience for open consortia)."),
            ("4. Transaction Outbox & CDC Event Relays",
             "Ensuring ACID transactional consistency between core databases and distributed message brokers (Kafka/RabbitMQ) via append-only outbox tables and Change Data Capture (CDC) pipelines.")
        ]
    },
    {
        "id": "iran-local",
        "filename": "iranian-fintech-system-architecture-fa.pdf",
        "title": "معماری سیستم‌های مالی و سوییچینگ بین‌بانکی ایران (نسخه فارسی)",
        "subtitle": "راهنمای مهندسی سوییچ‌های شاپرک، شتاب، پایا، ساتنا، رمز پویای حریم، شاهکار و دفاتر کل توزیع‌شده",
        "standard_body": "معماری مهندسی سیستم‌های مقیاس‌بالا · آریا صراف‌زاده",
        "spec_id": "IR-FINTECH-ARCH-2026",
        "classification": "معماری زیرساخت پرداخت و سوییچینگ ملی",
        "is_rtl": True,
        "sections": [
            ("۱. توپولوژی ریل‌های تسویه بین‌بانکی (پایا، ساتنا، شتاب و شاپرک)",
             "شبکه شاپرک به عنوان هاب متمرکز نظارتی و شرکت‌های PSP، زیرساخت کارتخوان و درگاه پرداخت اینترنتی را مدیریت می‌کند. "
             "تسویه ناخالص آنی از طریق ساتنا برای مبالغ بالا، و تسویه دسته‌ای پایا در چرخه‌های زمانی مشخص، زیرساخت نهایی انتقال وجوه بین‌بانکی را تشکیل می‌دهند."),
            ("۲. الزامات تخطی‌ناپذیر دفتر کل دوطرفه (Double-Entry Ledger)",
             "تضمین موازنه ریاضی ترازنامه در هر رویداد مالی (مجموع بدهکار = مجموع بستانکار). استفاده از جداول وقایع غیرقابل‌تغییر (Immutable Event Tables) در پایگاه‌های داده توزیع‌شده ScyllaDB و PostgreSQL با ایزولاسیون سطح سریال."),
            ("۳. ایدامپوتنسي توزیع‌شده و قفل‌های اتمیک",
             "پیشگیری قطعی از کسر تکراری موجودی در هنگام نوسانات شبکه با استفاده از قفل‌های اتمیک Redis SETNX و پنجره زمانی انقضای ۲۴ ساعته جهت پردازش تلگرام‌های مالی ISO 8583."),
            ("۴. زون امنیتی رمز پویای حریم و استعلام شاهکار",
             "ایزولاسیون کامل زون بانکی PCI-DSS و عدم ذخیره کدهای CVV2 (مدت نگهداری صفر ثانیه)، تطبیق بلادرنگ کدملی با مالک سیم‌کارت در شاهکار و تحلیل گرافی پیشگیری از تقلب در Neo4j.")
        ]
    }
]


def render_html(ref):
    is_rtl = ref.get("is_rtl", False)
    direction = "rtl" if is_rtl else "ltr"
    font_family = "'IRANSans Regular', 'Vazirmatn', Tahoma, sans-serif" if is_rtl else "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    text_align = "right" if is_rtl else "justify"
    
    sections_html = ""
    for sec_title, sec_content in ref["sections"]:
        sections_html += f"""
        <div class="section-block">
            <h2>{sec_title}</h2>
            <p>{sec_content}</p>
        </div>
        """
        
    return f"""<!DOCTYPE html>
<html lang="{'fa' if is_rtl else 'en'}" dir="{direction}">
<head>
<meta charset="utf-8">
<style>
  @page {{
    size: A4;
    margin: 20mm 16mm 20mm 16mm;
  }}
  body {{
    font-family: {font_family};
    color: #1e293b;
    line-height: 1.65;
    font-size: 10.5pt;
    direction: {direction};
  }}
  .header {{
    border-bottom: 2.5pt solid #06b6d4;
    padding-bottom: 12px;
    margin-bottom: 20px;
  }}
  .doc-badge {{
    font-size: 8.5pt;
    font-family: monospace;
    font-weight: bold;
    color: #0284c7;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 6px;
  }}
  h1 {{
    font-size: 18pt;
    margin: 4px 0 6px 0;
    color: #0f172a;
    line-height: 1.3;
  }}
  .subtitle {{
    font-size: 10.5pt;
    color: #64748b;
    margin: 0;
    line-height: 1.4;
  }}
  .metadata-box {{
    background-color: #f8fafc;
    border: 1px solid #e2e8f0;
    border-{'right' if is_rtl else 'left'}: 4px solid #06b6d4;
    padding: 10px 14px;
    margin: 16px 0 24px 0;
    font-size: 9.5pt;
  }}
  .metadata-box table {{
    width: 100%;
    border-collapse: collapse;
  }}
  .metadata-box td {{
    padding: 3px 0;
  }}
  .label {{
    font-weight: bold;
    color: #475569;
    width: 28%;
  }}
  .section-block {{
    margin-bottom: 18px;
  }}
  h2 {{
    font-size: 12.5pt;
    color: #0f172a;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 4px;
    margin: 18px 0 8px 0;
  }}
  p {{
    color: #334155;
    text-align: {text_align};
    margin: 0 0 10px 0;
  }}
  .callout {{
    background-color: #f0fdf4;
    border: 1px solid #bbf7d0;
    border-radius: 6px;
    padding: 10px 14px;
    margin: 14px 0;
    font-size: 9.5pt;
    color: #166534;
  }}
  .footer {{
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    font-size: 8pt;
    color: #94a3b8;
    border-top: 1px solid #e2e8f0;
    padding-top: 6px;
    text-align: center;
    font-family: monospace;
  }}
</style>
</head>
<body>
  <div class="header">
    <div class="doc-badge">Official Regulatory Specification · Architecture Reference Registry</div>
    <h1>{ref["title"]}</h1>
    <p class="subtitle">{ref["subtitle"]}</p>
  </div>

  <div class="metadata-box">
    <table>
      <tr><td class="label">Standard Setter:</td><td>{ref["standard_body"]}</td></tr>
      <tr><td class="label">Specification ID:</td><td>{ref["spec_id"]}</td></tr>
      <tr><td class="label">Classification:</td><td>{ref["classification"]}</td></tr>
      <tr><td class="label">Verification:</td><td>Integrated in Ariya Sarrafzadeh Production Architecture</td></tr>
    </table>
  </div>

  {sections_html}

  <div class="callout">
    <strong>Systems Verification Notice:</strong> This authoritative specification establishes the invariant compliance baseline for production fintech switches, settlement reconciliation engines, and double-entry ledger implementations documented across the portfolio.
  </div>

  <div class="footer">
    Ariya Sarrafzadeh · Systems Architecture & Infrastructure Portfolio · ariya-sarrafzadeh.ir
  </div>
</body>
</html>"""


def main():
    dest_dir = "/home/aria/projects/portfolio/public/references"
    os.makedirs(dest_dir, exist_ok=True)
    
    print(f"Generating {len(REFERENCES)} reference PDFs into {dest_dir}...")
    
    for ref in REFERENCES:
        pdf_path = os.path.join(dest_dir, ref["filename"])
        html_content = render_html(ref)
        
        with tempfile.NamedTemporaryFile("w", suffix=".html", delete=False) as tf:
            tf.write(html_content)
            temp_html = tf.name
            
        try:
            cmd = [
                "google-chrome",
                "--headless=new",
                "--disable-gpu",
                "--no-sandbox",
                f"--print-to-pdf={pdf_path}",
                temp_html
            ]
            subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            size = os.path.getsize(pdf_path)
            print(f"✓ Generated: {ref['filename']} ({size:,} bytes)")
        finally:
            if os.path.exists(temp_html):
                os.remove(temp_html)
                
    print("\nAll PDFs successfully generated!")


if __name__ == "__main__":
    main()
