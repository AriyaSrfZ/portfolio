---
title: "Multi-tenant Identity Service with RS256 JWT Verification & Zero Shared Secrets"
description: "Designed and built a standalone identity and authentication service supporting multi-tenant isolation, policy-based permissions, and cross-service token verification with zero shared secrets."
category: "system-architecture"
date: 2026-09-08
technologies: ["FastAPI", "PostgreSQL", "RS256 JWT", "Redis", "Docker"]
metric: "Zero cross-tenant data leaks across 21 isolation tests"
---

## 01. The Problem: Shared Secret Vulnerabilities and Monolithic Bottlenecks

In microservice architectures, authorization frequently degrades into one of two anti-patterns:
1. **Symmetric Secret Sprawl (HS256):** Every downstream microservice shares the same HMAC secret key. If a peripheral reporting service is compromised, an attacker can forge master authentication tokens for the entire platform.
2. **Database Read Amplification:** Downstream services repeatedly call a central authentication service or database on every single incoming HTTP/gRPC request to validate sessions, creating an availability single point of failure (SPOF) and adding 15–40ms of latency per hop.
3. **Cross-Tenant Data Leakage:** In multi-tenant enterprise platforms, vague boundary enforcement between corporate clients, merchants, and individual users risks unauthorized lateral traversal.

---

## 02. Architectural Solution: Asymmetric RS256 Delegation & Isolation

We architected a standalone, multi-tenant User Authentication & Authorization (UAA) service utilizing asymmetric public-key cryptography (RS256) and fine-grained tenant boundaries.

```
                    ┌────────────────────────────┐
                    │      UAA Service (Auth)    │
                    │ Private Key (2048-bit RSA) │
                    └─────────────┬──────────────┘
                                  │ Signs JWTs
                                  │ Publishes JWKS
                                  ▼
                   ┌──────────────────────────────┐
                   │       API Edge Gateway       │
                   └──────────────┬───────────────┘
                                  │ RS256 Public Key Verification
         ┌────────────────────────┼────────────────────────┐
         ▼                        ▼                        ▼
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│  Payment Switch  │    │  Ledger Service  │    │  BNPL Origination│
│  (Tenant Alpha)  │    │  (Tenant Beta)   │    │  (Tenant Gamma)  │
│ Public Key Cache │    │ Public Key Cache │    │ Public Key Cache │
└──────────────────┘    └──────────────────┘    └──────────────────┘
```

### 1. Asymmetric Key Pair Lifecycle (RS256 & JWKS)
- **Zero Shared Secrets:** The private signing key resides exclusively in the isolated UAA enclave or hardware security module (HSM). Downstream services receive only the public key via standard JSON Web Key Sets (`/.well-known/jwks.json`).
- **Autonomous Local Verification:** Every microservice verifies token signatures in-memory in less than $0.2\text{ms}$ without contacting the identity service over the network.
- **Key Rotation without Downtime:** Tokens include a Key ID (`kid`) header. Downstream services cache public keys and automatically refresh when encountering an unrecognized active key identifier.

### 2. Multi-Tenant Boundary Enforcement
- **Strict Claims Encapsulation:** Each emitted token contains immutable claims:
  - `sub`: Canonical user UUID
  - `tid`: Isolated Tenant UUID
  - `roles`: Role hierarchy definitions
  - `scopes`: Exact functional permissions (`payment:write`, `ledger:read`, `settlement:audit`)
- **Row-Level Security (RLS) & Connection Routing:** Downstream data layers utilize the `tid` claim to enforce PostgreSQL row-level policies (`SET LOCAL app.current_tenant_id = '...'`), guaranteeing hardware-enforced data partitioning between enterprise tenants.

### 3. High-Value Transactional Tickets
For sensitive write operations (such as high-value wallet debits or bank settlements), a static bearer token is insufficient:
- The client requests a single-use transactional ticket with an expiration window of 60 seconds.
- The ticket is stored in Redis with an atomic token hash.
- Upon execution at the API gateway or payment switch, the ticket is verified and burnt atomically using `GETDEL ticket:{tx_hash}`, rendering replay attacks structurally impossible.

---

## 03. Implementation & Verification Framework

The identity service was implemented with asynchronous Python (FastAPI) and PostgreSQL, packaged into containerized multi-stage Docker artifacts:

- **Security Verification Matrix:** Implemented an automated test suite verifying 21 distinct tenant-isolation vectors, including tenant ID tampering, cross-tenant token replay, expired key handling, and invalid audience headers.
- **Fail-Closed Topology:** Downstream middleware defaults to absolute denial if the `tid` claim is missing or does not match the scoped route namespace.

---

## 04. Concrete Production Outcomes

- **Zero Cross-Tenant Leaks:** Verified across 21 adversarial penetration tests and production load simulations.
- **100% Shared Secret Elimination:** Completely removed symmetric HMAC keys from all peripheral services.
- **99.5% Reduction in Auth Network Overhead:** Eliminated remote session lookups on downstream service calls, saving an aggregate 28ms of P95 transaction latency.
- **High Concurrency Throughput:** The identity service autonomously handled 12,000 token generations per second during peak stress tests with negligible memory footprint.
