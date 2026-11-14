# Brand System & Identity Specification
## Ariya Sarrafzadeh · The Systems Thinker

---

## 1. Brand Strategy & Core Identity

- **Brand Name:** Ariya Sarrafzadeh
- **Farsi Name:** آریا صراف‌زاده
- **Technical Handle:** AriyaSrfZ
- **Primary Website:** `https://ariya-sarrafzadeh.ir`
- **Brand Archetype:** The Systems Thinker
- **Positioning:** A systems architect and technology professional connecting engineering depth, operational reality, and product outcomes.
- **Core Promise:** Complexity, made dependable.
- **Primary Tagline:** Systems that hold under pressure.
- **Persian Tagline:** سامانه‌هایی که زیر فشار تاب می‌آورند.
- **Supporting Statement:**
  > "I work at the intersection of systems architecture, engineering, and product thinking—designing dependable technology for complex, high-stakes environments."
- **Warmth-to-Austerity Balance:** 65 : 35 (Disciplined structure, tactile warm neutrals, approachable writing, comfortable typography, and generous whitespace).

---

## 2. Canonical Color Specification

### 2.1 Core Identity Palette

| Name | Hex | Role |
| :--- | :--- | :--- |
| **Carbon** | `#202725` | Main dark canvas and primary ink |
| **Basalt** | `#303936` | Secondary dark surfaces and structural dividers |
| **Deep Carbon** | `#171C1A` | Code surfaces and deep background containers |
| **Paper** | `#E9E5DC` | Warm light surface and elevated cards |
| **Porcelain** | `#F3F0E8` | Light-mode canvas |
| **Patina** | `#527C78` | Signature brand accent |
| **Patina Light** | `#8FB4AA` | Dark-mode interactive accent & indicator |
| **Ochre** | `#B39A77` | Rare editorial highlight & milestone alerts only |
| **White** | `#FFFFFF` | Selected elevated light surfaces |
| **Neutral Border** | `#D5D0C6` | Light-mode borders and structural rules |

### 2.2 Semantic Theme Tokens

#### Light Theme (Warm Paper Journal)
- **Canvas:** `#F3F0E8` (Porcelain)
- **Surface:** `#E9E5DC` (Paper)
- **Elevated Surface:** `#FFFFFF` (White)
- **Primary Text:** `#202725` (Carbon)
- **Secondary Text:** `#535D57`
- **Border:** `#D5D0C6` (Neutral Border)
- **Primary Accent:** `#38645D` (Deep Patina)
- **Accent Hover:** `#294F49`
- **Focus Ring:** `#38645D`
- **Code Surface:** `#E5E9E3`

#### Dark Theme (Calm Charcoal & Green-Gray)
- **Canvas:** `#202725` (Carbon)
- **Surface:** `#292F2D`
- **Elevated Surface:** `#343C38`
- **Primary Text:** `#F0EEE7`
- **Secondary Text:** `#B5BDB6`
- **Border:** `#46504B`
- **Primary Accent:** `#8FB4AA` (Patina Light)
- **Accent Hover:** `#A6C8BE`
- **Focus Ring:** `#B7D5CC`
- **Code Surface:** `#171C1A` (Deep Carbon)

---

## 3. Bespoke AS Monogram & Asset Directory

The AS monogram embodies architectural precision through clean geometry, balanced negative space, and interlocking continuity between the letterforms **A** and **S**.

| Deliverable | Path | Primary Role |
| :--- | :--- | :--- |
| **Primary Monogram** | `public/brand/as-monogram.svg` | Standalone vector mark |
| **Dark Monogram** | `public/brand/as-monogram-dark.svg` | Dark canvas vector avatar / stamp |
| **Light Monogram** | `public/brand/as-monogram-light.svg` | Light canvas vector avatar / stamp |
| **Horizontal Lockup (Dark)** | `public/brand/as-lockup-dark.svg` | Dark header / presentation lockup |
| **Horizontal Lockup (Light)**| `public/brand/as-lockup-light.svg`| Light header / document lockup |
| **Transparent Lockup** | `public/brand/as-lockup.svg` | Universal responsive header |
| **Document Signature** | `public/brand/as-signature.svg` | Diagram attribution & whitepaper footer |
| **Social Avatar** | `public/brand/as-avatar.svg` | Square / circular profile icon (256x256) |
| **Favicon** | `public/favicon.svg` | 32x32 crisp browser tab icon |
| **Social Preview** | `public/brand/og-preview.svg` | 1200x630 Open Graph card |
| **Marketing Ad Card** | `public/brand/as-marketing-card.svg` / `.png` | 1200x630 High-impact marketing deliverable |
| **LinkedIn Banner** | `brand/linkedin/linkedin-banner.svg` | 1584x396 profile banner |
| **GitHub Header** | `brand/github/header.svg` | GitHub profile banner |
| **Master PNG Exports**| `public/brand/*.png` | 1024x1024 high-res raster renders |

### Validation Across Display Sizes
- **16 × 16 px:** Favicon geometry tested with 2.6px stroke weight; zero sub-pixel blurring.
- **24 × 24 px & 32 × 32 px:** Tested in browser tabs across macOS, Windows, and Linux Chrome/Firefox.
- **64 × 64 px to 512 × 512 px:** Tested on high-DPI displays with crisp path continuity.

---

## 4. Typography Hierarchy

- **Interface & Latin Prose:** `IBM Plex Sans` (Light 300, Regular 400, Medium 500, SemiBold 600, Bold 700)
- **Code, Identifiers & Telemetry:** `IBM Plex Mono` (Regular 400, Medium 500, SemiBold 600)
- **Persian & RTL Content:** `Vazirmatn` (Light 300, Regular 400, Medium 500, Bold 700)

---

## 5. Multi-Channel Guidance

1. **Portfolio Website (`https://ariya-sarrafzadeh.ir`):**
   - Implements semantic CSS tokens centrally in `src/styles/global.css`.
   - Supports seamless Dark, Light, and System match modes with zero flash.
2. **LinkedIn Profile:**
   - Upload `brand/linkedin/linkedin-banner.svg` to the profile banner canvas (1584 × 396 px).
   - Avatar safe zone is cleared on the bottom left.
3. **GitHub Profile (`https://github.com/AriyaSrfZ`):**
   - Use `brand/github/README.md` in repository `AriyaSrfZ/AriyaSrfZ`.
4. **Technical Documents & Presentations:**
   - Follow standards defined in `brand/docs/DOCUMENT_SYSTEM.md`.
