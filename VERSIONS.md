# VERSIONS

## 2026-11-19 / perf-v1 (home `/`)

No layout variation, so no `index_v2.astro`. Same markup and visuals; load path only.

| Metric (local Lighthouse, mobile default) | Before | After |
| :--- | ---: | ---: |
| Performance | 89 | 99 |
| FCP | 2.0 s | 1.1 s |
| LCP | 2.4 s | 2.1 s |
| TBT | 320 ms | 0-10 ms |
| CLS | 0 | 0 |

Netlify deploy preview of the same `main` scored 17 (slower runner, real third-party latency).

Changes:
- Fonts: Google Fonts `@import` replaced by Astro Fonts API (`astro.config.mjs` `fonts`, `<Font>` in `Layout.astro`). Self-hosted woff2, `font-display: swap`, metric-matched fallbacks, preload for Plex Sans 400 and Plex Sans Condensed 600 (Vazirmatn 400 on `/fa/`).
- Portrait: moved to `src/assets/photos/`, rendered with `<Picture>` (AVIF/WebP, 250w/385w), `fetchpriority="high"`.
- GA4 and Clarity: queue calls at once, load vendor scripts on first scroll/pointer/key input.
- Cal.com embed: initialises when `#cal-inline` nears the viewport.
- Lenis: dynamic import on first wheel/touch/key input.
- Hydration: `FloatingNavbar` `client:idle`, `ArchitectureSidebar` `client:visible`, `AIWorkforceHub` `client:visible`.
- Dossier diagrams: `loading="lazy"`. Dossier panels and footer: `content-visibility: auto`.
- `public/_headers`: `/_astro/*` immutable, 1 year.
