# TASKS.md — Sovereign Engineering Portfolio Deliverables

## Active Workstream Backlog

### TASK-01: Canonical Palette Design System
* **Model Recommendation**: `Sonnet 5 (Medium Effort)`
* **Deliverable**: `src/styles/tokens_v1.css`
* **Scope**: Encode the mandatory tokens (Carbon `#202725`, Graphite `#292F2D`, Basalt `#343C38`, Patina `#8FB4AA`, Ochre `#B39A77`) as CSS custom properties and Tailwind utility classes. Strip any default blue/purple gradients from `tailwind.config.mjs`.
* **Success Criteria**: `npm run build` passes; all components inherit canonical tokens.

### TASK-02: Proof-of-Work Case Study Cards
* **Model Recommendation**: `Sonnet 5 (Medium Effort)`
* **Deliverable**: `src/components/CaseStudies_v1.astro`
* **Scope**: Build structured, high-density showcase cards for:
  1. `25,000+ msg/sec SMPP Carrier Routing` (zero packet loss, SMPP 3.4/5.0, failover).
  2. `5,000 TPS Aegis Transaction Switch` (sub-ms idempotency, double-entry balance journal).
  3. `3-Node Sovereign Autonomous Grid` (Debian workstation, Smart-DB, Stockholm VPS).
* **Success Criteria**: Component renders responsive grid with verified monospace metric tags (`[TPS: 5,000]`, `[LOSS: 0.00%]`).

### TASK-03: Stockholm VPS Deployment Pipeline
* **Model Recommendation**: `Haiku 5.5 (Low Effort)`
* **Deliverable**: `scripts/deploy_stockholm_v1.sh`
* **Scope**: Write deterministic deployment script that executes `npm run build` and syncs `dist/` over SSH to Stockholm VPS (`109.120.131.224:8088`), ensuring proper file permissions and zero-downtime static swap.
* **Success Criteria**: Dry run script executes with 0 exit code and validates remote target path.
