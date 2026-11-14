---
title: "Fraud detection and forensic money-trail tracing at superapp scale"
description: "Built and ran a one-person fraud response system for a 40+ service superapp - detection, session shutdown, cross-wallet money tracing, and court-ready documentation, end to end in under 10 minutes."
category: "fintech"
date: 2026-09-11
technologies: [".NET", "Payment Systems", "Card-to-Card Settlement", "Fraud Detection"]
metric: "Full incident response, from detection to session shutdown to a court-admissible report, under 10 minutes, by one operator"
---

## The problem

A superapp with 40+ services - wallets, bill payment, telecom credit,
e-commerce checkout - was hitting fraud patterns that didn't fit any
single team's job description: account takeovers, rapid wallet-to-wallet
laundering, and abuse of digital goods (bill payments, phone credit) as
a way to move stolen money somewhere untraceable fast.

The real constraints weren't technical, or not only technical:

- Transaction data lived in silos - bank logs, internal ledgers,
  merchant checkout data (Digikala and others), telecom and utility
  providers - none of it built to talk to the others.
- Manual investigation meant pulling in multiple teams and multiple
  hours, while the money kept moving.
- Whatever got produced at the end had to be understandable by a court
  system where judges are clerics with very limited technical
  background - a chart a non-technical judge can follow matters as
  much as the underlying trace being correct.
- On the intake side, the first report of a fraud often came through a
  police officer with no framework for understanding what "a web
  purchase" even was, let alone tracing one.

## Architecture & Implementation

An integrated forensic pipeline enables full incident containment and legal handoff in under 10 minutes.

**Detection and containment.** Automated telemetry rules flag accounts by velocity anomalies and atypical purchase behavior. When an anomaly triggers, active sessions terminate and device authentication tokens unmount immediately without manual intervention.

**Money-trail tracing.** Recursive queries trace funds across multi-hop wallet transfers. Fraudulent schemes typically fragment and convert stolen funds into digital goods, bill payments, or secondary wallets to break audit continuity. The engine traces these chains across more than 40 microservices, reconstructing the terminal balance destination with roughly 80% accuracy under adversarial fragmentation.

**Forensic Reporting Engine.** A specialized reporting module transforms raw distributed database traces, cryptographic transaction hashes, and bank clearing logs into a self-contained, auditable document. Clear visual path graphs enable non-technical adjudicators and legal authorities to trace fund movements directly to terminal recipient accounts.

**Proxy Settlement Infrastructure.** Operating as a licensed payment facilitator (*pardakht-yari*) required direct reconciliation and transaction normalization across 22 distinct banking switches, abstracting diverse error codes and timeout semantics behind a single resilient interface.

## Operational Outcomes

- End-to-end incident response (anomaly detection, token invalidation, fund graph tracing, and legal report synthesis) dropped from a multi-hour manual workflow to under 10 minutes.
- Real-time forensic query capability enabled operators to trace and freeze unauthorized transactions before funds were cashed out at ATM networks.
- The underlying switch architecture sustained rapid transaction scaling while maintaining sub-millisecond state consistency across high-concurrency clearing windows.

## Key Architectural Invariants

The primary constraint in financial fraud mitigation is the interface between automated telemetry and external human stakeholders. A tracing pipeline that halts at detection without providing verifiable legal documentation fails the operational objective. End-to-end containment requires verifiable forensic legibility from edge ingress to the courtroom.
