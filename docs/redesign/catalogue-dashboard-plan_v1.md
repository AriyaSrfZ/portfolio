# Catalogue Dashboard: design plan v1 (2026-11-17)

Goal: the site reads like a **plan to greatness**. It should be a calm executive dashboard of 25 years of work, catalogued so a founder finds the right proof in seconds and every panel moves a little. The colours should be majestic and quiet, never flashy.

Reference: Charlie Hills, "Claude Motion Charts" (Instagram post DeZYQm2iPvw). It shows 16 Apple-keynote-style motion tiles: a bar chart, a money KPI, a ring gauge, a counter, a funnel and a kinetic headline. Its rule: **one object, one change per tile**.

---

## 1. Names for what you are asking (so you can steer)

| Name | What it means | Use here? |
|---|---|---|
| **Bento grid** | Tiles of mixed sizes in one grid, like a lunch box (Apple product pages) | **Yes: the home page backbone** |
| **Executive dashboard / KPI tiles** | Cards with one number, a trend and a tiny chart | **Yes: career metrics** |
| **Catalogue / specimen sheet** | Indexed entries with a code, a category, a filter and a detail view, like a product catalogue | **Yes: skills, systems, whitepapers** |
| **Motion charts / data storytelling** | Charts that draw themselves when they scroll into view | **Yes: one move per tile** |
| **Editorial / Swiss grid** | Strict columns, big type, generous margins | Yes, as the page structure |
| **Quiet luxury** | Deep jewel tones, fine rules, a little brass, lots of space | **Yes: the "majestic, not flashy" feel** |
| Glassmorphism | Frosted, blurred see-through panels | No, it reads as the AI look |
| Neumorphism | Soft extruded plastic buttons | No |
| Neo-brutalism | Thick black borders, hard shadows | No |
| Retro / Y2K | Pixel or chrome nostalgia | No |
| Aurora / mesh gradient | Glowing coloured blobs | No, this is what you hated |

**Chosen style: "Quiet-luxury bento dashboard, catalogued."**

## 2. Palette v2 (applied today)

- **Emerald jewel** `#0E5A44`: main ink, buttons and the footer. Deep stone green rather than pine. Ramp: `#08261D`, `#0E5A44`, `#236F56`, `#7FBFA3`, `#C4E3D5`, `#E3F2EB`.
- **Absinthe** `#A9C23F` fill, `#566B12` for text: chart highlights and "live / good" states, used sparingly.
- **Cedar** `#8C4426`: notes, focus ring, attention.
- **Brass / ochre** `#835F22`: dates, tags, the majestic accent lines.
- **Plum** `#6C4868`: categories and secondary links.
- **Limestone layers**: `#FFFFFF`, `#FAF7F0`, `#EFE9DD`, `#E3DBCA`, `#D2C6AE`. Each step is visibly different.
- **Night mode**: Carbon `#202725` ground with emerald `#7CC4A6` and absinthe `#C5D96A`.

All text pairs pass the AA contrast minimum (4.5) on the page and card layers.

## 3. Fonts and buttons

- Keep **IBM Plex** (Sans, Condensed and Mono) as your fonts.
- **Display**: Plex Sans Condensed SemiBold, large, tracking -0.01em.
- **Numbers**: Plex Mono with tabular figures, so KPI digits don't jitter while counting.
- **Labels**: Plex Sans Medium at 13px with a small-caps feel. Labels go beside or below a heading, never above it.
- **Primary button**: solid emerald with a 6px radius and a 1px brass inner line on hover. Pressing shrinks it to 97% over 160ms. An arrow slides 3px on hover.
- **Secondary button**: a 1.5px emerald outline. On hover an emerald wash fills it from left to right over 200ms.
- **Ghost / link**: text with an underline that grows from 0 to 100% width.
- **Chips / filters**: square 4px-radius toggles with a count badge, such as `Payments 7`. When selected they fill emerald with an absinthe dot.
- **Dropdowns**: grow from their trigger (already done). Closing is faster than opening (to add).

## 4. Page architecture: every front

### Home = "Command board" (bento)
1. **Header tile (2×2)**: the statement, the portrait, Book a call, and an availability light (absinthe pulse).
2. **KPI strip (4 tiles)**: years in production, peak TPS, money reconciled, systems shipped. Numbers count up once on view.
3. **Career timeline tile (wide)**: 25 years as a horizontal track that draws itself, with role changes as brass ticks.
4. **Skills radar / matrix tile**: the skill catalogue as a heat matrix (domains × depth) with absinthe on the strongest cells.
5. **Systems catalogue tile**: 8 system "specimens", each with a code (`SYS-01`), a category chip and a mini diagram thumbnail.
6. **Whitepapers tile**: a count, the latest three, and a small bar chart of papers per domain.
7. **"Plan to greatness" roadmap tile**: next 12 months, with what you are building and what clients can hire you for.
8. **Engagement models tile**: Architecture review, Build lead and Advisory, as three priced or scoped rows.
9. **Contact tile**: calendar, email and LinkedIn.

### Skills catalogue page (new, replaces "Dictionary/Achievements" clutter)
- A filter bar of domain chips and a search box. The grid of skill cards updates live with a smooth reflow (View Transitions).
- Each card shows a skill code, years used, the systems it was used in (as links), and a depth meter.

### Systems (the 8 dossiers)
- A specimen-sheet layout: diagram plate, title block, KPIs, decisions, failure modes.
- A sticky mini-index with a progress bar.

### Whitepapers = "Library"
- A catalogue table and card toggle, filters by domain and year, reading time, and a diagram thumbnail.
- The article page gets a contents rail, numbered figures and a "related systems" footer.

### Contact / Book
- The booking widget is restyled to light limestone (it is dark today).
- A short intake form: problem, deadline, budget band.

### Navbar
- Reduce to **Work · Skills · Library · About · Book a call**. Everything else moves to the footer.

### Farsi (RTL)
- The same components, mirrored. Charts stay left-to-right.

## 5. Motion rules (no static page, no circus)

- **One authored moment per tile**: counters count, bars grow, rings fill and timelines draw, each once, when 40% of the tile is visible.
- Easing `cubic-bezier(0.23,1,0.32,1)`. Tiles take 400–700ms, controls 160–200ms, and exits are faster than entrances.
- Hover on tiles: lift 2px with a soft offset shadow and a 1px brass border.
- Page-to-page: **View Transitions** cross-fade, and a system tile morphs into its sheet header.
- `prefers-reduced-motion`: show every final state instantly.
- No library needed: CSS plus a small IntersectionObserver. Charts are inline SVG, so no new dependency.

## 6. Skills I will use (installed)

- **impeccable**: direction, craft checks, the detector, the finish review.
- **design-taste-frontend (tasteskill v2)**: gallery-researched art direction and a look-and-fix loop on screenshots.
- **dataviz**: chart form, colour formula and validator for KPI tiles and the skills matrix.
- **modern-web-guidance**: View Transitions, scroll-driven animation and container queries done the current way.
- **emil design-eng rules** (from the research note): press, menu and motion timings.
- **design:design-critique / accessibility-review**: the review pass at the end.

### Repos you could add (optional, only if you know them)
- *Anthropic `frontend-design` skill* (from the claude-code plugins repo): a general taste baseline.
- *Any "motion" or "Claude Motion" brief* from the post's author: comment "BRIEF" on the post and paste it here. I'll fold its rules into §5.
- If you have a favourite Dribbble or Awwwards dashboard, one screenshot beats any repo.

## 7. Content I need from you (data retouch)

1. **One title**: currently four exist. Suggested: *Principal Systems Architect*.
2. **Peak throughput**: 50,000 TPS or 5,000 TPS?
3. **Career KPIs**: years, systems shipped, money or volume processed, teams led, largest client.
4. **Timeline**: 6–10 milestones over 25 years (year, company or type, one line).
5. **Skills list with depth**: about 30 skills, grouped by domain, each with years.
6. **Roadmap**: 3–5 things you are building or offering in the next 12 months.
7. **Engagement offers**: names and rough scope or price bands.
8. A portrait without baked-in text.

## 8. Phases

| Phase | What | Effort |
|---|---|---|
| 1 | Bento home: KPI tiles, timeline, skills matrix, systems catalogue tile, motion system, new buttons | ~1 session |
| 2 | Skills catalogue page and navbar trim | ~½ session |
| 3 | Whitepaper library: filters and article layout | ~½ session |
| 4 | System sheets, contact and booking restyle, Farsi pass | ~1 session |
| 5 | Review: impeccable finish, accessibility, phone, dark, then commit | ~½ session |

Phase 1 can start now with placeholder figures marked `[CONFIRM]`, swapped once §7 is answered.
