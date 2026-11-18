# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary: founders, CTOs and product heads at fintech and telecom companies, mainly in the GCC**, who need a senior person to design a payment, ledger or messaging system, or to review one. They arrive from LinkedIn or a referral, skim on a laptop or phone, and decide in a few minutes whether Ariya is worth a call. (Confirmed by Ariya, 2026-11-16: freelance design projects come first.)
- **Secondary: recruiters and hiring managers** filling senior architecture or technical product roles, including roles in Dubai. (Confirmed: "calls for roles and work".)

## Product Purpose

Ariya Sarrafzadeh's personal site. It exists to bring inbound work: freelance system-design and product-design projects first, and conversations about roles second. Success is a visitor contacting Ariya (a booked call or an email) after seeing evidence that he has designed real high-load financial and telecom systems.

Ariya wants mostly freelance work, not a full day in an office. (Confirmed, 2026-11-16.)

## Positioning

Ariya designs both the system and the product decision behind it: payment switches, double-entry ledgers, fraud and reconciliation engines, and national SMS gateways, each documented with its trade-offs, failure modes and business result. The whitepapers and schematics on the site are his own working documents, not marketing summaries.

## Operating Context

- Bilingual: English (default) and Farsi (`/fa/`, right-to-left, Vazirmatn).
- Content already on the site: eight architecture sections on the home page, 21 whitepapers/field notes under `/blog/`, SVG schematics under `public/diagrams/`, a fintech dictionary, achievements, contact and booking.
- Deployed as a static Astro site at `https://ariya-sarrafzadeh.ir`.

## Capabilities and Constraints

- Stack: Astro 7, Tailwind 4, React islands. No new frontend dependencies without asking (project rule).
- Build must pass with `npm run build` before any change is reported.
- **Inferred, not confirmed by Ariya:** the lead title is "Systems Architect & Technical Product Leader" (the current hero and tab title). The site also shows "Principal Systems Architect", "Technical Product Manager" (on the portrait image) and "Solutions Architect & Technical Product Owner" (whitepaper author line).
- **Open, not confirmed:** peak-throughput figures. The home page says 50,000 TPS; `TASKS.md` and a whitepaper card say 5,000 TPS for the switch and 25,000+ msg/sec for SMPP. No figure may be changed until Ariya says which is true.
- **Inferred, not confirmed:** the visual palette may be replaced. The project CLAUDE.md pins Carbon/Patina/Ochre; Ariya called the site "dull colored" and asked for more colour levels on 2026-11-08 and 2026-11-16.

## Brand Commitments

- Name: Ariya Sarrafzadeh. Monogram and lockups in `public/brand/`.
- Voice rules from the project CLAUDE.md: no cliché hero copy ("empowering the future", "passionate innovator"), no gratuitous emoji, no generic purple/blue gradients or neon glow.
- Ariya stated he has the fonts he wants (IBM Plex Sans, IBM Plex Mono, Vazirmatn) and dislikes the current icon style.

## Evidence on Hand

- Portrait: `public/photos/ariya.jpg`.
- Schematics: `public/diagrams/*.svg` (ledger, ISO 8583 switch, fraud tracing, reconciliation, SMPP, and others).
- Whitepapers: `src/content/blog/en/*.md`, `src/content/blog/fa/*.md`.
- Metrics: `src/data/stats.ts`.
- No client testimonials, client logos or named customers are on hand. Do not invent any.

## Product Principles

1. The work is the proof: show a real schematic or decision before any claim about it.
2. A visitor should know within seconds who Ariya is, what he designs, and how to reach him.
3. Every number names the system it belongs to, and no number appears that Ariya has not confirmed.
4. Freelance projects lead; roles are the second path, never hidden.
5. English and Farsi stay equal in quality.
