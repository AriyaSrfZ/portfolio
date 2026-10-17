# Technical Document & Presentation Design System
## Ariya Sarrafzadeh · Systems Architecture & Engineering

This specification establishes visual, typographic, and architectural standards for technical whitepapers, RFCs, architecture blueprints, executive presentations, and advisory dossiers.

---

## 1. Document Palette & Print Standards

Technical documents must remain authoritative, tactile, and legible in both digital view and monochrome print. Never rely on dark backgrounds for printable assets.

| Token | Hex | CMYK / Print | Role |
| :--- | :--- | :--- | :--- |
| **Carbon (Primary Ink)** | `#202725` | `C:72 M:60 Y:64 K:72` | Primary text, headings, table borders |
| **Basalt (Structural Line)** | `#303936` | `C:68 M:52 Y:58 K:52` | Secondary headers, section rules |
| **Paper (Light Canvas)** | `#E9E5DC` | `C:4 M:4 Y:8 K:4` | Callout boxes, highlight cards |
| **Porcelain (Document Base)** | `#F3F0E8` | `C:2 M:2 Y:5 K:1` | Page background (digital preview only) |
| **Patina (Accent Ink)** | `#38645D` | `C:76 M:42 Y:58 K:26` | Architectural emphasis, critical paths |
| **Ochre (Editorial Alert)** | `#B39A77` | `C:26 M:34 Y:56 K:4` | Rare caution labels, milestone indicators |
| **Monochrome Fallback** | `#000000` | `K:100` | 100% black text on pure white paper (`#FFFFFF`) |

### Print & PDF Export Rules
- Backgrounds must collapse to `#FFFFFF` (100% White) during print (`@media print`).
- Ink color must render at `#202725` or pure black for maximum contrast and zero halftone dot artifacts on body text.
- Accent colors (`#38645D`) should only appear on diagrams, section rules, and code labels.

---

## 2. Typographic Hierarchy

All documents standardize on **IBM Plex Sans** for prose, **IBM Plex Mono** for technical identifiers and code, and **Vazirmatn** for Persian/RTL specifications.

| Element | Typeface | Size / Leading | Weight | Letter Spacing |
| :--- | :--- | :--- | :--- | :--- |
| **Document Title (Cover)** | IBM Plex Sans | 32 pt / 38 pt | Bold (700) | -0.5 pt |
| **Subtitle / Tagline** | IBM Plex Sans | 16 pt / 22 pt | Medium (500) | 0.0 pt |
| **Section Heading (H1)** | IBM Plex Sans | 20 pt / 26 pt | Bold (700) | -0.2 pt |
| **Subsection (H2)** | IBM Plex Sans | 14 pt / 18 pt | SemiBold (600) | 0.0 pt |
| **Body Prose** | IBM Plex Sans | 10 pt / 15 pt | Regular (400) | +0.1 pt |
| **Code & Protocols** | IBM Plex Mono | 8.5 pt / 12 pt | Regular (400) | 0.0 pt |
| **Metadata & Footnotes** | IBM Plex Mono | 8 pt / 10 pt | Medium (500) | +0.5 pt |

---

## 3. Architecture Diagrams Convention

Diagrams must maintain strict semantic clarity over decorative styling:
- **Trust Boundaries:** Thin dashed rule (`stroke="#303936" stroke-dasharray="4 4"`).
- **Synchronous Calls:** Solid stroke with directional arrowhead (`#202725`, width: 1.5 pt).
- **Asynchronous Messaging:** Dashed line with circle terminal (`#527C78`, width: 1.5 pt).
- **Critical Invariant Path:** Highlighted in Patina (`#38645D` on light, `#8FB4AA` on dark).
- **Persisted Fact Storage:** Cylindrical database icon with immutable ledger tag.

---

## 4. Header, Footer & Signature Stamp

Each document page should include:
- **Header:** Document Title left-aligned; Monogram stamp right-aligned (`public/brand/as-signature.svg`).
- **Footer:** Confidentiality / Publication tier; ISO date (`YYYY-MM-DD`); Page number in format `Page X of Y`.
- **Author Stamp:** `Ariya Sarrafzadeh · Systems Architect · https://ariya-sarrafzadeh.ir`
