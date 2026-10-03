---
title: "Migrating a monolithic payments flow to event-driven architecture"
description: "Moved a tightly-coupled, synchronous payment processing flow to an event-driven design to remove cascading failures and support independent scaling of each step."
category: "system-architecture"
date: 2025-10-15
technologies: ["Event-Driven Architecture", "Message Queues", "Microservices"]
---

## The problem

In high-concurrency payment platforms, synchronous monolithic execution creates severe availability bottlenecks:

1. **Cascading Timeouts under PSP Load:** During traffic surges, upstream payment service providers (PSPs) and bank clearing switches experience elevated latency ($>5000\text{ ms}$). In a synchronous flow, inbound threads remain blocked waiting for downstream bank responses, causing connection pool exhaustion across the entire application server fleet.
2. **Double-Debit and Financial Inconsistencies:** When a gateway timeout occurred after funds were reserved but before confirmation was recorded, automated retries generated phantom duplicate transactions and clearing discrepancies.
3. **Coupled Database Writes:** Writing directly to user balances via naive mutable SQL statements (`UPDATE accounts SET balance = balance - amount`) caused row lock contention, deadlocks, and audit vulnerabilities under concurrent load.

## The approach

To eliminate cascading failures and maintain absolute financial integrity across banking rails, we decoupled execution using the **Transactional Outbox Pattern** paired with a **Two-Phase Balance Reservation Engine**:

### 1. Two-Phase Balance Reservation Machine
Instead of mutable balance adjustments, financial accounting enforces an append-only Double-Entry Ledger combined with a formal state machine:
- **Phase 1 (Reservation):** Balance shifts from `AVAILABLE` to `RESERVED`. Funds are ring-fenced; the account holder cannot double-spend, but funds have not departed the wallet.
- **Phase 2 (Commit or Compensate):** Upon receiving a cryptographically validated callback from the bank clearing switch, funds in `RESERVED` are deducted and transferred to the settlement account. If the transaction times out or fails, funds roll back to `AVAILABLE`.
- **Zero-Sum Ledger Invariant:** Every financial transaction creates at least two balanced journal entries:
  $$\sum_{i=1}^{n} \text{Debit}_i - \sum_{j=1}^{m} \text{Credit}_j = 0$$

### 2. Transactional Outbox over RabbitMQ Mesh
- **Asynchronous Event Relay:** State mutations and outbound domain events (`activity.event`) are written atomically to an outbox table within the local database transaction boundary.
- **Debezium Change Data Capture (CDC):** Engine streams events into an enterprise RabbitMQ mesh without dual-write risks.
- **Dedicated Route Topologies:** Events route to isolated queues: `activity.pending` for real-time telemetry and `activity.end_state` for ledger finalization.
- **Idempotency Enforcement:** All message consumers enforce strict deduplication using a persistent distributed tracking code (`trackingCode`), ensuring duplicate network deliveries are discarded without state corruption.

### 3. Automated Reconciliation & Auto-Healing
- **Nightly Multi-Pass Batching:** A Spring Batch reconciler queries upstream bank clearing logs via SFTP, cross-checking journal entries against bank settlement reports.
- **Auto-Healing Engine:** The `Refund-MNG` service automatically detects orphan reservations and triggers compensatory rollbacks without requiring manual human triage.

## What shipped

- **99.99% Edge Gateway Availability:** Decoupled ingress threads from upstream bank response times, allowing the platform to absorb traffic spikes without connection pool starvation.
- **Zero Financial Drift:** Maintained 100% mathematical ledger balance across $50,000+$ daily clearing events.
- **Sub-200ms Eventual Consistency:** Reduced end-to-end event propagation across the microservice mesh to under $200\text{ ms}$.
- **Elimination of Manual Reconciliations:** Automated $99.8\%$ of discrepancy handling via the nightly Spring Batch and auto-healing refund workflows.
