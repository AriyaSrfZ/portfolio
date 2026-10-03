---
title: "Pre-KYC Contact Enrichment Pipeline for 100M Fragmented Customer Records"
description: "High-throughput deterministic normalisation, phonetic blocking, and identity attribute cross-referencing across 94.7M unindexed records with zero database deadlocks."
category: "data-engineering"
date: 2025-11-02
technologies: ["ETL", "Elasticsearch", "PostgreSQL", "Redis", "Python", "Apache Spark"]
---

## 01. The Problem: Data Fragmentation at Scale

High-velocity fintech and telecom super-apps inevitably inherit millions of fragmented customer identities across disparate legacy silos: SIM card registration archives, billing ledgers, wallet profiles, and merchant records. In our production environment, the platform handled a core dataset of **94.7 million records** characterized by severe data decay:

- **Unstandardized Schemas:** Missing national ID codes, varied date-of-birth formats (Gregorian vs. Solar Hijri), and inconsistent Persian orthography (Arabic vs. Persian `ی` and `ک`).
- **Concurrency Bottlenecks:** Real-time checkout queries executing full-table scans against unindexed relational databases triggered table-level locking cascades and database deadlocks during promotional flash sales.
- **Upstream Regulatory eKYC Overhead:** Submitting unverified or malformed user credentials directly to centralized government rails (Shahkar and Sabt-Ahval) incurred costly per-request billing and increased friction for legitimate users due to avoidable timeouts.

---

## 02. Architectural Solution: Multi-Pass Deterministic Pipeline

To clean, deduplicate, and enrich 94.7M customer profiles without degrading core payment switch latency, we architected a two-tier hybrid data pipeline: an asynchronous batch ETL engine paired with an in-memory low-latency serving cache.

### 1. Orthographic Normalization & Phonetic Blocking
Every raw name and address string undergoes deterministic sanitization prior to ingestion:
- **Unicode Canonical Normalization:** Uniform mapping of all Arabic character variants to standard Persian Unicode codepoints (`U+06CC` and `U+06A9`).
- **Phonetic Encoding:** Implementation of modified Double Metaphone adapted for Persian phonetics to cluster phonetic spelling variations of names and addresses into deterministic block keys.

### 2. Probabilistic Entity Resolution
Rather than executing $O(N^2)$ cross-comparisons, the pipeline groups candidate records into tight partition blocks using composite keys (`DateOfBirth + PhoneticSurname + CityCode`). Within each block, a weighted Jaro-Winkler and Levenshtein similarity matrix computes confidence scores across four vectors:
- Normalized Full Name ($40\%$ weight)
- Mobile Phone MSISDN ($30\%$ weight)
- National Identity Hash ($20\%$ weight)
- Postal Code Prefix ($10\%$ weight)

Pairs scoring $\ge 0.88$ confidence are merged into canonical master customer identities; ambiguous pairs ($0.65 - 0.87$) are flagged for asynchronous review or auxiliary confirmation via dynamic SMS OTP.

```
[Raw Ingestion Feed] 
        │
        ▼
[Unicode Normalizer] ──► [Phonetic Blocking Engine]
                                │
                                ▼
                    [Probabilistic Matcher (≥0.88)]
                                │
        ┌───────────────────────┴───────────────────────┐
        ▼                                               ▼
[Canonical Master Store]                    [Redis Read-Through Cache]
(ScyllaDB / PostgreSQL)                     (TTL: 7 Days · Sub-5ms Read)
```

---

## 03. Production Serving & Cache Topology

Once cleansed, golden customer profile records are indexed into ScyllaDB with automated event replication to Redis clusters:
- **Partition Key Strategy:** Keyed by SHA-256 hash of the sanitized national ID and normalized phone number.
- **Zero-Lock Serving:** Read-through cache design handles up to 50,000 queries per second with a P99 response time under $4.2\text{ms}$.
- **Pre-KYC Validation:** When a user initiates digital wallet onboarding, the enrichment service verifies local cached records before dispatching external Shahkar requests, filtering out $92\%$ of malformed identity submissions.

---

## 04. Concrete Production Outcomes

- **100% Database Deadlock Elimination:** Decoupled enrichment queries from transactional payment switch databases, completely eliminating lock contention.
- **70% Predictive Accuracy:** Correctly resolved and pre-filled incomplete identity records prior to formal biometric eKYC submission.
- **$40\%$ Latency Reduction in Onboarding:** Dropped median customer verification turnaround from $14.2$ seconds to $1.8$ seconds.
- **Direct Financial Savings:** Filtered invalid and duplicate queries, reducing monthly government API query expenditures by over $32\%$.
