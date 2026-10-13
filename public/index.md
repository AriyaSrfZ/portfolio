# Ariya Sarrafzadeh | Principal Systems Architect & Technical Product Leader

> High-throughput payment infrastructure, distributed double-entry ledgers, telecom SMS switches, and forensic fraud platforms.

Production System Reference: https://ariya-sarrafzadeh.ir  
Location: Tehran, Iran  
Direct Contact: ariasg2002@gmail.com | LinkedIn: https://linkedin.com/in/ariya-sarrafzadeh  
OpenAPI 3.1 Spec: https://ariya-sarrafzadeh.ir/openapi.json  
Agent Index: https://ariya-sarrafzadeh.ir/llms.txt  

---

## Verified Production Metrics

- **Peak Throughput:** 50,000 TPS under extreme concurrency with sub-25ms latency.
- **Failover SLA:** <30ms automated circuit failover across 4 national PSP gateways.
- **Ledger Invariant:** 0.00% financial drift across 50,000+ daily clearing batches.
- **Fraud Risk SLA:** <15ms (P99) scoring loop across multi-hop Neo4j graph clusters.
- **Monthly Actives:** 12M+ monthly active users supported across platforms.

---

## 01 · Settlements & Ledgers: Double-Entry ACID Ledgers & Balance Reservations

- **SSOT Balance Parity:** Mathematical guarantee where `Sum(Debits) - Sum(Credits) = 0` on ScyllaDB and PostgreSQL append-only fact logs with serializable isolation.
- **Two-Phase Reservation:** Ephemeral state machine moving funds from `AVAILABLE` to `RESERVED` before upstream bank webhooks execute, eliminating race conditions.
- **Distributed Idempotency:** Atomic Redis `SETNX` mutex locks with 15,000ms TTL and 24-hour expiration window (86,400s) to guarantee zero duplicate deductions during network retry spikes.
- **Automated Rollback:** Transient network dropouts handled via Transactional Outbox pattern and Raft distributed consensus; unconfirmed authorizations roll back automatically.

---

## 02 · Payment Switch: Smart PSP Switch & Dynamic Weighted Routing (ISO 8583)

- **Head-to-Head Protocol:** Real-time unpacker for ISO 8583 MTI 0100/0200 financial telegrams, parsing STAN, RRN, and terminal authentication headers in sub-5ms.
- **Multi-Gateway Distribution:** Dynamic traffic routing across 4 national payment service providers (SEP, PEC, BPM, PEP).
- **Health-Weighted Scoring:** Real-time scoring factoring rolling P99 latency and success ratios, delivering a +14% conversion lift across transaction volumes.
- **Circuit Breakers:** Hardware socket failures trigger instant <30ms failover with automated reverse credit telegrams (MTI 0400).

---

## 03 · Fraud Risk & eKYC: Perimeter Isolation & Zero-Storage Token Vault

- **Zero-Storage Token Vault:** Raw PAN is replaced with high-entropy opaque UUID tokens; ephemeral CVV2 codes maintain an exact 0.00s zero-retention policy and are purged immediately post-authorization per PCI-DSS.
- **National eKYC Integration:** Cryptographically queries Shahkar (SIM-to-National-ID) and Sabt-Ahval APIs, correlating SIM issuance timestamps with Harim OTP to eliminate SIM-swap attacks.
- **Neo4j Graph Forensics:** Computes real-time risk vectors in <15ms across multi-hop card and device clusters, slashing fraud drain by 94% while maintaining frictionless checkouts for >92% of legitimate users.

---

## 04 · Reconciliation & Payouts: Multi-Pass Reconciliation & Early Merchant Settlement

- **Event-Driven Ingestion:** Captures end-state events over RabbitMQ feeding Spring Batch nightly workers.
- **3-Way SFTP Cross-Referencing:** Cross-checks internal ledgers, PSP transaction logs, and Shaparak/Bank clearing statements against RRN and STAN with 100% mathematical parity.
- **Auto-Healing Refund-MNG:** Identifies uncaptured authorizations and automatically issues reverse credits, eliminating 100% of manual reconciliation overhead.
- **24h Early Merchant Credit:** Disburses early payouts in 24h via automated Paya/Satna ACH batches with automated dynamic fee deduction: `Fee = Amount * (r_base + d * r_daily)`.

---

## 05 · Production Incident Archive

- **Incident 01 (Redis Cluster Partition):** Brain-split network partition during Black Friday traffic spike resolved via Raft consensus lock fencing and automated outbox replay.
- **Incident 02 (Bank Host Timeout Storm):** Bank gateway socket hang causing duplicate capture requests mitigated by distributed 24h idempotency keys and automatic reverse telegram dispatch.

---

## 06 · Product Lifecycle & Technical PM Operating Framework

- **Dual-Track Agile:** Continuous discovery coupled with disciplined engineering delivery.
- **Invariants as Specifications:** Authoring machine-executable PRDs specifying idempotent API schemas, strict error catalogs, and mathematically verifiable invariants.

---

## 07 · Architecture Intake & Review Consultation

Direct technical consultations for payment switches, distributed ledgers, SMS aggregators, and high-concurrency fintech platforms.
- Schedule: https://cal.com/ariya-sarrafzadeh/15min
- Direct Email: ariasg2002@gmail.com
- LinkedIn: https://linkedin.com/in/ariya-sarrafzadeh
