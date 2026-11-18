# Agent motion-design skills: button and dropdown prescriptions (v1)

Date: 2026-11-17. Budget: 8 fetches used. Values come from summaries of the raw files returned by the fetch tool, not from reading the full files myself. Quotes are short fragments.

## 1. Skills

| Skill | Repo URL | Popularity (source) | Covers |
|---|---|---|---|
| emil-design-eng (Emil Kowalski) | https://github.com/emilkowalski/skills | 57.5k stars (repo page, https://github.com/emilkowalski/skills) | Press scale, popover origin, tooltip, enter/exit, reduced motion. README also lists animate, review-animations, choreograph, apple-design, gestures. |
| impeccable (`animate` command) | https://github.com/pbakaus/impeccable | ~111.5k stars (repo page, https://github.com/pbakaus/impeccable) | 24 commands. `skill/reference/animate.md` exists (directory listing, https://github.com/pbakaus/impeccable/tree/main/skill/reference). Duration bands, one easing, hover pattern, reduced motion. |
| web-design-guidelines (Vercel) | https://github.com/vercel-labs/agent-skills | 34.2k stars (repo page, https://github.com/vercel-labs/agent-skills) | Rule list only: animation, focus, hover. No numbers except a 5 s autoplay limit. |
| Apple HIG Motion | https://developer.apple.com/design/human-interface-guidelines/motion | not applicable | Fetch returned only the page title, so nothing extracted. |
| design-taste-frontend (taste-skill) | not located | unknown | Not fetched (budget). Installed locally as a skill, but no repo URL verified. |

skills.sh install counts: not fetched, unknown. The stars are for whole repos, not per skill.

## 2. Prescriptions

| Element | Value | Quote | Source |
|---|---|---|---|
| Button hover (Emil) | Hover only under `@media (hover: hover) and (pointer: fine)`. A generic hover example uses scale(1.05). No button-specific hover value. | "transform: scale(1.05);" | https://raw.githubusercontent.com/emilkowalski/skills/main/skills/emil-design-eng/SKILL.md |
| Button hover (Impeccable) | Move a child, not the hovered element: translateY(-2px). | "Keep the hovered element still and let a child carry the motion." | https://raw.githubusercontent.com/pbakaus/impeccable/main/skill/reference/animate.md |
| Button hover (Vercel) | Hover state required, no numbers. | "Buttons/links need `hover:` state (visual feedback)" | https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md |
| Button press | scale(0.97) on :active, 160ms, ease-out. Range 0.95 to 0.98. | "transition: transform 160ms var(--ease-out);" | Emil SKILL.md (URL above) |
| Dropdown open | 150-250ms, start at scale(0.9) or higher plus opacity. | "Start from `scale(0.9)` or higher" | Emil SKILL.md |
| Dropdown easing | `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)` (Emil). Impeccable gives `cubic-bezier(0.16, 1, 0.3, 1)` for confident arrivals. | "cubic-bezier(0.23, 1, 0.32, 1)" | Emil SKILL.md; Impeccable animate.md |
| Dropdown close | No close duration given for dropdowns. Generic rule: exit shorter than enter (example 250ms in, 200ms out). Impeccable: "Exit faster than entrance." | "enter 250ms, exit 200ms" | Emil SKILL.md; Impeccable animate.md |
| Popover origin | `transform-origin: var(--transform-origin)`, i.e. the trigger, not center. | "Popovers should scale in from their trigger, not from center." | Emil SKILL.md |
| Tooltip | 125ms transform plus opacity, ease-out, starts at scale(0.97). Repeat hovers use 0ms. Open delay: no number. | "transition-duration: 0ms;" | Emil SKILL.md |
| Overlay / panel / view transition | 300-500ms band (Impeccable). Routine state change 150-300ms. Immediate feedback 100-150ms. | "300–500 ms: layout, overlay, or view transition" | Impeccable animate.md |
| Perspective / 3D | No `perspective` for UI controls in any source. Emil only has an orbit demo with preserve-3d and translateZ(72px). | "translateZ(72px)" | Emil SKILL.md |
| Reduced motion | Keep gentler motion, do not remove all. Opacity-only fade example (0.2s). Vercel: honor it, "reduced variant or disable". | "Reduced motion means fewer and gentler animations, not zero." | Emil SKILL.md; Impeccable animate.md; Vercel command.md |
| Properties | transform and opacity only. Never `transition: all`. Set transform-origin correctly. Interruptible. | "Never `transition: all`—list properties explicitly" | Vercel command.md |

## 3. Disagreements

- Reduced motion: Vercel allows "reduced variant or disable"; Emil and Impeccable say fewer and gentler, not zero.
- Hover on buttons: Emil uses scale on the element; Impeccable says keep the element still and move a child.
- Easing: Emil cubic-bezier(0.23, 1, 0.32, 1) vs Impeccable cubic-bezier(0.16, 1, 0.3, 1). Both strong ease-out; no source ranks them.
- Overlay duration: Emil 150-250ms for dropdowns vs Impeccable 300-500ms for overlays. Menus are probably "routine state change" (150-300ms) under Impeccable, which overlaps Emil.

## 4. Could not be verified

- Apple HIG Motion: page body did not load; no Apple numbers.
- design-taste-frontend / taste-skill: repo URL and content not fetched.
- skills.sh install counts and per-skill popularity: not fetched.
- Full text of the Emil and Impeccable files: only extracted summaries seen. Emil file path `skills/emil-design-eng/SKILL.md` returned content, but the other Emil skills (animate, apple-design, review-animations) were not read.
- Impeccable animate.md: the extraction said the file content was not in the "provided content", yet quoted values. Treat Impeccable values as lower confidence until reread.
- Vercel web-design-guidelines: rules come from the web-interface-guidelines repo command.md; the SKILL.md in agent-skills was not read. Its path is inferred from the README.
- Whether these are the "most used" skills by installs: unknown. Ranking here is by repo stars only.
