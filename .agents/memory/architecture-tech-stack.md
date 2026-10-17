---
type: reference
title: Technical Architecture & System Invariants
slug: architecture-tech-stack
updated: 2026-10-17
---

# Technical Architecture & System Invariants

## 1. Engine & Output
- **Framework**: Astro 5.x SSG (Static Site Generation).
- **Route Count**: 52 pre-rendered static routes (Bilingual: English + Persian RTL).
- **Build Output**: `dist/` directory containing zero-runtime static HTML, CSS, JavaScript, and optimized SVG assets.
- **Client Components**: React 19 islands (`FloatingNavbar.tsx`, `LandingStage.tsx`, `ArchitectureSidebar.tsx`, `FintechDictionary.tsx`, `SpotlightCard.tsx`).
- **Shader Background**: Custom WebGL Velaris shader pinned to `#171C1A` deep carbon and `#527C78` patina.

## 2. Machine-Readable Agent Protocols
- `/llms.txt`: Structured markdown digest for autonomous agent discovery.
- `/openapi.json`: OpenAPI 3.1 schema defining available static APIs.
- `/api/tools.json`: Tool-calling schema for LLM function calling (LangChain, Claude, AutoGen).
- `/api/v1/dictionary.json`: Full 1,012-term dictionary catalog.
- `/api/v1/stats.json`: Architectural performance metrics and SLAs.
- `/api/v1/404.json`: RFC 7807 Problem Details error standard.

## 3. Data Integrity & SSOT
- **Metrics SSOT**: `src/data/stats.ts` is the single source of truth for all operational figures (50,000 TPS, 1B+ annual SMS, <15ms SLA, 0.00% drift). Never hardcode numbers in page templates.
- **Diagrams**: 23 SVG architectural blueprints in `public/diagrams/`, mapped to the canonical 6-color system tokens.
