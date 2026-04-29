---
"tailwindcss-obfuscator": minor
---

Recognize 33 new Tailwind CSS v4.x utility families that were previously
unrecognised by the class extractor (so any class using them shipped raw,
un-obfuscated, in production bundles). Audit performed against the upstream
`tailwindlabs/tailwindcss` v4.2.4 source.

Newly recognised:

- **Logical-axis utilities (v4.2.0)** — `pbs-*`, `pbe-*`, `mbs-*`, `mbe-*`,
  `scroll-pbs-*`, `scroll-pbe-*`, `scroll-mbs-*`, `scroll-mbe-*`,
  `border-bs-*`, `border-be-*`, `inset-bs-*`, `inset-be-*`, `inset-s-*`,
  `inset-e-*`, `inline-*`, `block-*`, `min-inline-*`, `max-inline-*`,
  `min-block-*`, `max-block-*`.
- **Font features (v4.2.0)** — `font-features-*`.
- **New gradient families (v4)** — `bg-linear-*`, `bg-radial-*`,
  `bg-conic-*`, plus the static `via-none`.
- **3D transforms (v4)** — `rotate-x-*`, `rotate-y-*`, `rotate-z-*`,
  `translate-z-*`, `scale-z-*`, `perspective-*`, `perspective-origin-*`,
  plus the static `transform-3d`.
- **New utility families (v4)** — `inset-shadow-*`, `inset-ring-*`,
  `field-sizing-*`, `color-scheme-*`, `font-stretch-*`.

Bumped to `minor` because consumers using any of these utilities in a
codebase that builds with the obfuscator will now see them obfuscated
where they were silently passed through before — observable behaviour
change.
