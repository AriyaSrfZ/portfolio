# VERSIONS — public/diagrams (SVG fix)

| Version | Date | Full path | Source | Change |
|---|---|---|---|---|
| v1 (original, untouched) | before 2026-11-08 | /home/aria/projects/portfolio/public/diagrams/{ai-agent-compiler-cage-schematic,fintech-lmax-disruptor-schematic,iso20022-truncation-trap-schematic,mcp-latency-projection-schematic,telecom-smpp-sliding-window-schematic}.svg | — | Invalid XML: named entities &bull; and &rarr; are undefined in XML, so browsers refuse to render them |
| v2 | 2026-11-08 | /home/aria/projects/portfolio/public/diagrams/{same five names}_v2.svg | v1 above | &bull; → &#8226;, &rarr; → &#8594;; all else byte-identical. Passes xmllint. |

References in src/ and src/content/ repointed to the _v2 files (ai-agent-deterministic-ast-gates, fintech-lmax-balance-reservation, iso20022-truncation-trap, mcp-latency-tax, telecom-smpp-sliding-window).
Not referenced by any page, left as-is: event-driven-payments.1svg (typo of .svg).
