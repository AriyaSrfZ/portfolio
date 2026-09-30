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

## What I built

A system that let one person run the entire fraud response - detection
through legal handoff - in under 10 minutes.

**Detection and containment.** Automated rules flagged accounts by
purchase rate and type - the pattern of an unauthorized session doesn't
look like the account owner's normal behavior, and that gap is
detectable. On a flag, sessions got killed and device tokens unmounted
automatically, no manual step in between detection and shutdown.

**Money-trail tracing.** A set of queries traced money through
recursive wallet hops - the same fraud pattern usually means the money
gets split, moved, and reconverted into something spendable (bill
payments, phone credit, e-commerce purchases) to break the trail. The
system followed that chain automatically across more than 40 services
in the app, reconstructing where the money actually ended up with
roughly 80% accuracy on identifying the final destination - a number
that reflects how deliberately the underlying fraud patterns are
designed to be hard to follow, not a clean lab benchmark.

**Making it legible to a court.** A .NET tool turned the raw trace -
bank logs, internal transaction records, cryptographic references -
into a self-contained Excel file: hyperlinked between sheets, with a
visual chart of the money's path simple enough that someone with no
technical background could follow where funds went and who ultimately
received them. This was the actual bottleneck the rest of the system
existed to solve - a technically perfect trace is useless if it can't
be handed to a court and understood.

**Settlement infrastructure underneath all of it.** None of this ran on
top of a bank's own infrastructure - the company wasn't a bank. I
designed the proxy payment/settlement layer (called *pardakht-yari*
locally) that handled reconciliation directly, and built card-to-card
processing across 22 separate Iranian banks, each with its own
connection quirks, error codes, and timeout behavior, normalized into
one consistent interface.

## Impact

- End-to-end fraud response - detection, containment, trace, and a
  court-ready report - went from a multi-team, multi-hour process to
  under 10 minutes handled by one person.
- The system gave 24/7 live tracing on request, whether the call came
  from law enforcement or directly from someone who'd lost money -
  fast enough in some cases to stop funds before they were cashed out.
- The core transaction-monitoring and settlement architecture scaled
  from roughly 100 users to 30 million, and is still the foundation a
  team of around 300 people maintains today.

## What I'd flag for anyone building something similar

The hard part was never really the tracing logic - it was the interface
between a technical system and non-technical decision-makers on both
ends: an intake officer who doesn't know what a web purchase is, and a
judge who needs to see money move on a page, not in a database. Any
fraud system that stops at "we found it" and doesn't solve for "and now
someone who isn't technical needs to act on it" hasn't actually solved
the problem yet.
