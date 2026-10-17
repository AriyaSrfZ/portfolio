---
type: project
title: Enterprise Operations Console Architecture
updated: 2026-10-17
---

# Enterprise Telemetry & Operations Console Architecture

## 1. Frame Constraint & Viewport Lockdown
- **Root Enclosure**: Absolute `100vw` by `100vh` frame constraint (`overflow: hidden` on `html` and `body`).
- **Zero Document Sprawl**: Document-level vertical scrollbar eliminated (`document.documentElement.scrollHeight === window.innerHeight`).
- **Internal Panel Scrolling**: Isolated to central workspace container (`overflow-y: auto`) with pinned sticky table headers (`position: sticky; top: 0; z-index: 10`).

## 2. Enterprise Dark Palette System
- Canvas / Root: `#0B0F17`
- Surface Containers: `#131926`
- Dividers & Grid: `#1E293B`
- Primary Headers: `#F8FAFC` (WCAG AAA > 12:1)
- Secondary Metadata: `#94A3B8` (WCAG AA > 7:1)
- Interactive Active Tab: `#2563EB` with `#FFFFFF` text
- Status Tokens:
  - Nominal: `#064E3B40` bg + `#6EE7B7` border/text
  - Warning: `#78350F40` bg + `#FCD34D` border/text
  - Critical: `#7F1D1D40` bg + `#FCA5A5` border/text

## 3. Headless React Hooks
- `useTelemetryStream` (`src/hooks/useTelemetryStream.ts`): Live simulated banking telemetry with exponential backoff reconnect logic, error boundary state, and memoized metrics.
- `useViewportBounds` (`src/hooks/useViewportBounds.ts`): Dynamic container measurement via ResizeObserver with debouncing and memory leak prevention.
- `useActiveView` (`src/hooks/useActiveView.ts`): Synchronized URL query (`?view=...`), hash navigation, keyboard shortcuts (`[0-7]`, Alt+Arrows), and cubic-bezier micro-transitions (220ms).

## 4. Model Context Protocol (MCP) Integration
- Tool Schema: `public/mcp/operations-tools.json`
- Runtime Agent Bridge: `window.__AGENTIC_CONSOLE__` in `src/mcp/operationsAgentBridge.ts`
  - `get_ui_state`: Active view, viewport width/height, stream status, locale.
  - `set_active_tab`: Programmatic transition to target view.
  - `get_telemetry_metrics`: Snapshot of TPS, financial drift, failover latency, and cluster nodes.
  - `run_accessibility_audit`: In-browser WCAG 2.1 AA/AAA contrast and DOM tree audit.
