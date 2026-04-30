---
"tailwindcss-obfuscator": minor
---

New extractor option `scanObjectStrings` (default `false`) — opt-in pass that walks Tailwind class strings stored in object property values, factory args, and lookup tables that the standard JSX / `cn()` / `cva()` / `tv()` walkers don't reach. Heuristic-gated to avoid false positives: a string is picked up only if it contains ≥2 whitespace-separated tokens AND every token validates as a Tailwind class. Single-word strings (`"flex"`, `"red"`, `"info"`) are NEVER auto-extracted — wrap them in `cn(…)` or add to `safelist`.

Fixes the « broken design with obfuscator » class of bugs where status-color tables, badge variants by level, etc. produced inconsistent obfuscation across siblings of the same lookup table.
