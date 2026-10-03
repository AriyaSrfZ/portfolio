---
title: "Running fintech operations as a one-person team"
description: "Operated monitoring, incident response, and platform stability for a fintech product's C2C, billing, and top-up systems as the sole operations person during early-stage growth."
category: "fintech"
date: 2025-09-20
technologies: ["Monitoring", "Incident Response", "Operations"]
---

## The problem

In early-stage high-growth fintech platforms, running operations as a single lead presents an acute dilemma: capital moves continuously through national clearing rails, but operational staff and automated safety tooling are scarce.

Day-to-day operations encompassed three mission-critical flows:
1. **Card-to-Card (C2C) & Remittance Transitions:** Operating against upstream bank switches with erratic latency profiles, where a network timeout could represent either an unexecuted attempt or an unconfirmed debit.
2. **Billing & Telecom Top-Up Aggregation:** Managing thousands of concurrent micro-transactions with low transaction value but extreme customer visibility and tight telecom SLA windows.
3. **Manual Clearing Friction:** Daily reconciliation required matching bank settlement dumps against internal ledgers. When done manually, clearing discrepancies escalated into operator fatigue and delayed payouts to merchants.

Under these conditions, treating production incidents with manual intervention does not scale: an alert storm during a bank outage quickly overwhelms a single engineer.

## The approach

To safeguard 24/7 financial reliability without an army of operators, I established a **Telemetry-First Automated Operations Engine**:

### 1. Circuit Breakers & Dynamic Routing
- **Payment Success Rate (PSR) Triggers:** Implemented automated health probes monitoring rolling 60-second success rates across payment service providers (PSPs). If a PSP dropped below $88\%$ PSR, the routing weight dropped dynamically to $0\%$, routing transaction volume to standby clearing rails without manual on-call paging.
- **Fail-Fast Ingress Shedding:** Edge API Gateway integrated Redis token buckets to shed low-priority non-financial queries during upstream bank stress, reserving connection threads exclusively for active ledger state commits.

### 2. Closed-Loop Telemetry & Golden Signals
- **Grafana Production Observability:** Constructed dashboards tracking the four golden signals (Latency, Traffic, Errors, Saturation), with specific instrumentation on:
  - Journal entry delta invariant ($\Delta = 0$).
  - RabbitMQ queue lag on `activity.end_state`.
  - Rate of HTTP `429 Too Many Requests` at the Spring Cloud Gateway.
- **Granular Triage Tiers:** Structured alerts into P1 (immediate SMS/voice paging for ledger discrepancy or PSP drop) versus P3 (asynchronous ticket creation for non-blocking provider delays).

### 3. Automated Reconciliation over SFTP
- **Spring Batch Clearing Jobs:** Replaced manual spreadsheet audits with automated nightly Spring Batch routines. The job pulled settlement files directly via bank SFTP connections, tokenized card numbers for PCI-DSS compliance, and executed automated cross-checks against the internal double-entry ledger.
- **Auto-Compensating Refunds:** Paired with the `Refund-MNG` microservice, transactions detected as debited without downstream delivery were scheduled for automated reversal within the next Paya banking cycle.

## What shipped

- **99.98% System Uptime:** Maintained continuous platform availability across C2C and payment flows during high-traffic national retail campaigns.
- **Sub-3 Minute Mean Time to Detect (MTTD):** Automated health probes and P1 paging reduced incident detection time from over 30 minutes to under 180 seconds.
- **Zero Unresolved Financial Drift:** Daily automated reconciliation eliminated manual ledger matching and prevented unrecovered clearing discrepancies.
- **Sustainable Single-Operator Workflow:** Shifted $95\%$ of routine triage to autonomous circuit breakers and self-healing microservice workflows.
