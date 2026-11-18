# Palette v1 — "Consulting room"

Feeling: calm and in control. Visitors arrive with a hard problem; the page should lower their pulse, not raise it.
Navy is gone. Pine ink leads, with three warm complements, each with one job.

| Role | Token | Light (Paper) | Dark (Night) | Use |
|---|---|---|---|---|
| Elevated layer | `--paper-0` | #FFFFFF | #3A433F | Raised panels, popovers |
| Card layer | `--paper-1` | #FAF7F0 | #292F2D | Cards, sheets |
| Page | `--paper-2` | #EFE9DD | #202725 | Page background |
| Sunken | `--paper-3` | #E3DBCA | #181E1C | Code, wells, table heads |
| Rule | `--paper-4` | #D2C6AE | #47514C | Heavy dividers |
| Primary ink | `--ink-2` | #1F4A43 pine | #8FB4AA patina | Buttons, links, footer |
| Ink mid | `--ink-3` | #3B7066 | #B4D0C8 | Hover, secondary lines |
| Ink tint | `--ink-5/6` | #C6DCD5 / #E4EFEB | #36504A / #243330 | Washes, selected rows |
| Text | `--graphite-1..4` | #202725 → #555D58 | #EEF0EC → #A7B0AA | Body → muted |
| Terracotta | `--pencil` | #A6402A | #E8936F | Notes, focus ring, attention |
| Ochre | `--sepia` | #835F22 | #D4BA8C | Dates, tags, metadata |
| Plum | `--plum` | #6C4868 | #CDA6C8 | Categories, secondary links |

Checks (WCAG ratio, light mode on page background): text 12.6, muted 4.8+, pine 8.2, terracotta 4.5+, ochre 4.8, plum 6.3. Every pair clears AA (4.5) on page and card layers.
Layer steps: page → card and page → sunken are each a visible step (about 1.13 contrast), plus a warm border (#C9BDA5).

Dark mode follows the project's canonical Carbon / Graphite / Basalt / Patina / Ochre.
All 34 diagrams in `public/diagrams/` were recoloured from navy to pine.
