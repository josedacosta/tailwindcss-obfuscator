---
"tailwindcss-obfuscator": patch
---

Docs homepage SEO + GEO overhaul (no package code change).

The live homepage at https://josedacosta.github.io/tailwindcss-obfuscator/ now ships :

**Three JSON-LD structured-data blocks** in the page head, picked up by Google Knowledge Panels, Google AI Overviews, Perplexity, ChatGPT search, Claude search, and Bing :

- `SoftwareApplication` — name, alternateName, applicationCategory, operatingSystem, version, license, $0 offer, author, code repository, programming language. Drives Knowledge Panel cards.
- `FAQPage` with 7 questions — written verbatim in user voice (real Google search intents), each Q&A 2-4 sentences, optimised so an LLM can quote them back.
- `BreadcrumbList` — Home → Get Started.

**Stronger hero copy** — more keyword-dense, names every supported bundler and meta-framework on the first paint, leads with the value prop ("30–60 % bundle reduction") instead of a vague tagline.

**Three-CTA hierarchy** — Get Started (brand), Compare with mangle (alt, points to /research/comparison), View on GitHub (alt). Replaces the previous two-CTA layout that under-promoted the comparison page.

**On-page FAQ section** at the bottom of the homepage that mirrors the FAQPage JSON-LD — same 7 questions, same answers, fully crawlable Markdown so the schema has on-page text backing it (Google requires the schema content to also appear visibly on the page).

Verified via local `pnpm docs:build` — all three `<script type="application/ld+json">` blocks are emitted into the rendered `dist/index.html`. After this lands and Pages redeploys, validate via Google's [Rich Results Test](https://search.google.com/test/rich-results) and Schema.org's [Schema Markup Validator](https://validator.schema.org/).
