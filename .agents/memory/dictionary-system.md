---
type: reference
title: Fintech Dictionary System
slug: dictionary-system
updated: 2026-10-17
---

# Fintech Dictionary System Architecture

## 1. Catalog Scale & Scope
- **Catalog Source**: `src/data/dictionary/dictionary.json` (~1,012 structured entries).
- **Taxonomy**: 26 domain categories, 8 functional role filters (`Architecture`, `Engineering`, `Product`, `Operations`, `Risk`, `Finance`, `Compliance`, `Security`).
- **Regulatory Citations**: Offline attachments and primary source links (`BIS CPMI`, `ECB`, `Federal Reserve`, `CBI/Shaparak`).

## 2. Card Face & Content Hierarchy
- **Primary Scannable Elements**:
  1. Category badge (`Payments & Money Movement`, `Cards & Processing`, etc.)
  2. English term title + Persian translation (RTL)
  3. Clean, high-density architectural definition
  4. Target role pills
  5. Primary regulatory links
- **Anti-Duplication Guard**:
  - `src/data/dictionary/dictionary.json` contains generic fallback text across multiple entries for `caseWorldwideEn` and `caseIranEn`.
  - The UI component (`FintechDictionary.tsx`) executes an `isGeneric()` evaluation to filter out generic fallback text from card faces.
  - Unique, substantive case studies are deferred to an interactive expandable `<details>` drawer, keeping the default card grid scannable and compact.
