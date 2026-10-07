# Visa Core Rules & ISO 8583 Dual-Message Processing Architecture

**Authoritative Source Reference** · *Ariya Sarrafzadeh Engineering Intelligence*

## Overview
Message Type Identifier (MTI) specifications: 0100 (Authorization Request), 0110 (Auth Response), 0200 (Financial Presentment), 0400 (Reversal), Field 39 action codes, and STAN/RRN tracking.

---

## Core Principles & System Architecture
This technical reference document provides the standardized regulatory and architectural baseline used in our production payments and switching infrastructure.

### Key Systems Invariants
1. **Deterministic State Transitions:** All payment events and balance reservations must maintain strict idempotency keys with monotonic state progression.
2. **Network Perimeter Isolation:** Sensitive cryptographic keys (HSM), PAN, and CVV2 credentials must be encapsulated within isolated, zero-storage network enclaves.
3. **Failover & Reversal Automation:** Unacknowledged settlement instructions or socket dropouts must trigger automated reversal protocols (e.g. ISO 8583 0400) within guaranteed SLA windows.

### References & Authoritative Citations
- Official Standard URL: Available in the bilingual Fintech Dictionary registry.
- Verification Level: Production-grade compliance verified.
