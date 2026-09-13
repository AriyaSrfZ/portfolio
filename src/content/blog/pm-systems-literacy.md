---
title: "Most PMs manage stakeholders. Few understand the system."
description: "A payment gateway page is a different system from your app, with its own state and timing. Most PMs never learn that, and it shows up as bad metrics, silent policy risk, and permission trees nobody can explain."
category: "product-management"
date: 2026-09-11
technologies: ["Product Management", "System Design", "Payment Systems"]
---

Most product management advice is about people: stakeholders, roadmaps,
prioritization frameworks. Almost none of it is about the actual system
you're a PM *for* - what a relational database guarantees that a
time-series store doesn't, why an API contract breaks the way it does,
what a permission model looks like after two years of "just add a
group for this feature." You can't make good calls about a system you
don't understand at that level. You can only make calls that sound
reasonable in a meeting.

Three examples from actually building inside a payment ecosystem.

## A payment gateway page is not part of your app

A team building a payment product coded in Java needed to know whether
a transaction was healthy: had the user paid, or quit. The signal they
had was response and response time from their own system. The problem:
their system doesn't know what happens on the payment gateway's page.
That page belongs to the bank or payment processor - a separate
system, with its own session, its own timing, and its own path back to
you (usually a webhook or a callback, arriving whenever it arrives, not
synchronously with the user's action).

"No response yet" and "user didn't pay" got treated as the same thing.
They're not. A user can pay successfully and your system still hasn't
heard about it yet, because that information has to cross a system
boundary you don't control. Treating gateway latency as a proxy for
user intent produces a health dashboard that's confidently wrong -
which is worse than a dashboard that's honestly uncertain, because
wrong-and-confident is what people build decisions on top of.

The fix isn't a better dashboard. It's understanding that "the payment
happened" and "we know the payment happened" are two different events,
separated by a boundary you don't control, and building your state
model around that gap instead of pretending it doesn't exist.

## Shipping the feature isn't the same as shipping the product

Somewhere in the same ecosystem, a team built auto-signup: pull a
user's mobile number from a merchant's existing user database, and
create an account automatically, without the user asking for one or
being told it happened. It solved a real problem - friction in
onboarding. It also created an account, and the data relationship that
comes with an account, for someone who never consented to either. No
one on the team was ignoring policy on purpose. No one was thinking
about policy at all, because "policy" wasn't part of how the feature
was scoped - it was scoped as an engineering problem (how do we create
an account from a phone number) rather than a product problem (what
does creating this account without consent obligate us to later, and
to whom).

That gap - between "does the code do the thing" and "should this exist,
under what constraints, with what obligations later" - is exactly the
part of the job that gets skipped when a PM's job is understood as
"turn stakeholder asks into tickets."

## A permission tree is a data model, not a to-do list

Access control in the same ecosystem grew the way most access control
grows: a group for this feature, a group for that feature, added
whenever someone needed access to something and there wasn't already a
group that fit. After enough features, nobody could look at the
permission tree and explain what it meant - not because any single
group was wrong, but because the whole thing was never designed, only
accumulated.

A permission system is a data model like any other. It has an
intended shape, invariants that should hold, and a cost every time you
add a special case instead of extending the model. Treated as a
to-do list instead - "someone needs access, make a group" - it turns
into technical debt that's much harder to pay down than code, because
by the time it's unreadable, nobody remembers which access actually
matters and which is a leftover from a feature that shipped and was
forgotten.

## What this adds up to

Every team I've worked across in this ecosystem was good at their own
slice: someone took orders, someone coded, someone shipped. Almost
none of it was connected by anyone thinking about the system as a
whole - and specifically, almost nobody was thinking about monitoring,
logging, or disaster recovery as part of the product itself rather
than an operations afterthought bolted on once something breaks.

That's the actual job, as I understand it: not stacking whatever
stakeholders ask for into something that looks like a roadmap, but
understanding the system - the databases, the APIs, the state
machines, the boundaries between systems that aren't yours - well
enough to know which asks are reasonable, which create risk nobody's
named yet, and which are solving the wrong problem entirely. Most PMs
manage people around a system they don't understand. The job is
understanding the system well enough that managing people around it
gets easier, not harder.
