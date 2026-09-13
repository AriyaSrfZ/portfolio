---
title: "Payment State vs. Payment Fact"
subtitle: "Explained Simply: Gateway Boundaries"
domain: "Fintech Systems"
oneLiner: "NO RESPONSE YET ≠ USER DIDN'T PAY"
leftColumnTitle: "WHAT YOUR SYSTEM SEES"
leftColumnItems:
  - "A request went out to the gateway"
  - "No webhook has arrived back yet"
  - "Response time is climbing"
rightColumnTitle: "WHAT'S ACTUALLY TRUE"
rightColumnItems:
  - "The gateway is a separate system you don't control"
  - "The user may have already paid successfully"
  - "The fact and your knowledge of the fact are two different events"
date: 2026-09-11
---

The payment gateway page isn't part of your app. It's a different
system, with its own session and its own timing, and it only tells you
what happened whenever it gets around to it - usually a webhook,
arriving on its own schedule, not in sync with the user's action.

Treat "no response yet" as "user didn't pay" and you get a health
dashboard that's confidently wrong. Wrong-and-confident is worse than
uncertain, because people build decisions on top of it.

The fix: build your state model around the gap between "it happened"
and "we know it happened," instead of pretending the gap isn't there.
