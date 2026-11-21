# Redesign plan — v3 (2026-11-16)

Supersedes v2. v1 and v2 were written without seeing the site. v3 is written after loading the real pages in a browser and is partly built.

## Goal

Bring inbound freelance system-design projects first, and conversations about roles second (Ariya, 2026-11-16).

## Direction: Drawing Sheet

Chosen by Ariya on 2026-11-16. The site is a set of engineering drawing sheets: paper ground, ink-blue line work, graphite text, red pencil for decisions, title blocks in place of badges, schematics as plates. The dark variant is a cyanotype blueprint.

Fonts stay IBM Plex Sans, IBM Plex Mono and Vazirmatn. IBM Plex Sans Condensed is added from the same family for large headings.

## Done in this pass

| Area | Change |
|---|---|
| Colour | New paper, ink-blue, graphite, red-pencil and sepia ramps in `src/styles/global.css`. The whole site inherits them through Tailwind theme variables. Paper is the default theme; Blueprint is the dark option. |
| Shape | Sharp 2px corners, no drop shadows, no glass blur, site-wide. |
| Type size | The 9-11px labels are raised to 12-13px site-wide. Headings use the condensed face at display size. |
| Background | Animated WebGL background and mouse-tracking gradient removed from the layout. |
| Home, first sheet | Statement, Book a call, email and LinkedIn, portrait, the ledger schematic as the plate, two red-pencil decision notes, three more system plates, title block. |
| Home, below | Metric tiles and four tabs replaced by a schedule table of systems, numbered general notes, a protocols list and a production list. Duplicate tab strip removed. |
| Diagrams | All 34 SVG schematics recoloured from the dark palette to ink on paper. |
| Footer | Ink-blue band with a closing question, Book a call, and a title block. |
| Whitepapers | Header in sentence case at display size; the "ACID VERIFIED" label that appeared on every card is replaced by each paper's own topic. Article titles enlarged. |
| Navbar | Emoji removed from the theme menu; themes renamed Paper and Blueprint. |

## Not done yet

1. The eight system sheets on the home page still use the old inner layout: small boxes inside the sheet. They inherit the new colours and type size but are not restructured.
2. Other pages (about, work, achievements, contact, dictionary, developers, docs) inherit the new world through tokens only. None has been individually laid out.
3. The navbar still carries eight section links plus three page links. It should be reduced.
4. The embedded booking calendar is a third-party dark widget.
5. Raster hero images inside articles are still dark infographics.
6. Unused files left in place: `Velaris`, `BackgroundController`, `AuroraBackground`, `SpotlightCard`, `Hero.astro`.

## Data to settle (not changed; Ariya decides)

1. **Title.** Four versions are on the site: "Systems Architect & Technical Product Leader" (hero, tab title, now the title block), "Principal Systems Architect" (older copy), "Technical ProductManager" (printed on the portrait image), "Solutions Architect & Technical Product Owner" (whitepaper author line).
2. **Throughput.** `src/data/stats.ts` says the ledger peaks at 50,000 TPS. A whitepaper card says "5,000+ TPS lock-free". `TASKS.md` says 5,000 TPS for the switch and 25,000+ msg/sec for SMPP. The old hero sentence used the ledger's 50,000 TPS figure for the SMPP gateway; that sentence is no longer shown in English, but the Farsi protocol list still does it.
3. **Whitepaper count.** The English page counts 21 automatically. The Farsi page has "14 DOSSIERS" typed in.
4. **Portrait.** The image file has "Technical ProductManager" baked in. The home page now crops to the photograph only. A clean photo without text would be better.
5. **Location.** The site says Tehran, Iran. If the aim is GCC work, a line such as "works remotely with GCC teams" would help, but only if it is true.
