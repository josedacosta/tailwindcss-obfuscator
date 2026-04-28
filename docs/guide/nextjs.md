# Next.js

## Installation

::: code-group

```bash [pnpm]
pnpm add -D tailwindcss-obfuscator
```

```bash [npm]
npm install -D tailwindcss-obfuscator
```

```bash [yarn]
yarn add -D tailwindcss-obfuscator
```

:::

## Configuration

```ts
// next.config.ts
import type { NextConfig } from "next";
import TailwindObfuscator from "tailwindcss-obfuscator/webpack";

const config: NextConfig = {
  webpack: (config, { dev }) => {
    // Production builds only
    if (!dev) {
      config.plugins = config.plugins || [];
      config.plugins.push(
        TailwindObfuscator({
          prefix: "tw-",
          verbose: true,
        })
      );
    }
    return config;
  },
};

export default config;
```

## Options

```ts
TailwindObfuscator({
  // Prefix for obfuscated class names
  prefix: "tw-",

  // Enable verbose logging
  verbose: true,

  // Exclude specific classes
  exclude: ["dark", "light", /^data-/],

  // Mapping file output
  mapping: {
    enabled: true,
    file: ".tw-obfuscation/class-mapping.json",
    pretty: 2,
  },

  // Cache for incremental builds
  cache: {
    enabled: true,
    directory: ".tw-obfuscation/cache",
    strategy: "merge",
  },
});
```

## App Router vs Pages Router

The plugin works with both Next.js architectures:

| Router                   | Support |
| ------------------------ | ------- |
| App Router (Next.js 13+) | Stable  |
| Pages Router             | Stable  |

## Compatibility

| Next.js | Status |
| ------- | ------ |
| 16.x    | Stable |
| 15.x    | Stable |
| 14.x    | Stable |
| 13.x    | Stable |

## shadcn/ui

For projects using shadcn/ui with `cn()` and `cva()`, no extra configuration is required — the plugin detects these helpers automatically.

```tsx
// Works out of the box
import { cn } from "@/lib/utils";

<div className={cn("flex items-center", isActive && "bg-blue-500")}>;
```

## Full example

```ts
// next.config.ts
import type { NextConfig } from "next";
import TailwindObfuscator from "tailwindcss-obfuscator/webpack";

const config: NextConfig = {
  webpack: (config, { dev, isServer }) => {
    // Production client bundle only
    if (!dev && !isServer) {
      config.plugins = config.plugins || [];
      config.plugins.push(
        TailwindObfuscator({
          prefix: "tw-",
          verbose: true,
          exclude: ["dark", "light", /^prose/],
          mapping: {
            enabled: true,
            file: ".tw-obfuscation/class-mapping.json",
            pretty: false,
          },
          cache: {
            enabled: true,
            strategy: "merge",
          },
        })
      );
    }
    return config;
  },
};

export default config;
```

## Turbopack

::: tip Status — supported via post-build CLI (since v2.0.1)
Turbopack does not expose a plugin API, so `tailwindcss-obfuscator/webpack` cannot attach to it directly. **The supported workaround is the `tw-obfuscator` CLI run as a post-build step.** Pick whichever pattern fits your project.
:::

### Pattern A — Post-build CLI (Turbopack-friendly, official)

Let Turbopack do the build, then run the CLI to obfuscate the produced `.next/` output. Works for `next dev` AND `next build`, no `--webpack` flag required.

```jsonc
// package.json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build && tw-obfuscator run --build-dir .next --content 'app/**/*.{js,jsx,ts,tsx,mdx}' --content 'components/**/*.{js,jsx,ts,tsx,mdx}' --css 'app/**/*.css'",
  },
}
```

What this does, in order:

1. `next build` runs Turbopack normally — no plugin, no obfuscation.
2. `tw-obfuscator run`:
   - **Extracts** every Tailwind class from your sources (the `--content` globs).
   - **Generates** a deterministic mapping (`bg-blue-500 → tw-a`, etc.) and writes it to `.tw-obfuscation/class-mapping.json`.
   - **Transforms** every `.css`, `.html`, and `.js` chunk under `--build-dir .next` (which covers both `.next/static/**` and `.next/server/**`).

The result is identical to what the Webpack plugin would produce — same mapping, same bundle-size reduction, same source code untouched. The only difference is timing: the obfuscation happens after Turbopack finishes instead of inside it.

A working sample lives in [`apps/test-nextjs`](https://github.com/josedacosta/tailwindcss-obfuscator/tree/main/apps/test-nextjs) under the `build:turbopack` script — run `pnpm --filter test-nextjs build:turbopack` to reproduce.

### Pattern B — Opt out of Turbopack with `--webpack`

If you prefer the Webpack plugin attaching at build time (no post-build step), keep the supported Webpack pipeline:

```jsonc
// package.json
{
  "scripts": {
    "dev": "next dev --webpack",
    "build": "next build --webpack",
  },
}
```

```bash
# Default in Next 16 — Turbopack runs, no plugin, post-build CLI required
next dev
next build

# Webpack opt-in — our plugin attaches normally, no post-build CLI needed
next dev --webpack
next build --webpack
```

Both patterns produce the same final output. **Pattern A** is the right choice if you want to stay on Turbopack's faster dev experience and don't mind a ~1-second extra step at build time. **Pattern B** is the right choice if you want a single-pass build with no post-processing.

### Why isn't Turbopack supported?

Turbopack is not "Webpack rewritten in Rust" — it's a different bundler with a deliberately small public surface. Three things make porting `tailwindcss-obfuscator` non-trivial:

1. **No `webpack:` callback.** Next 16 ignores the `webpack:` block in `next.config.ts` when Turbopack is the active bundler. Turbopack reads its own `turbopack:` block instead, which only accepts `rules`, `resolveAlias`, `resolveExtensions`, and a small whitelist of loader entries.
2. **No general-purpose plugin API.** Our plugin attaches to `compiler.hooks.compilation.tap()` and `processAssets`. Turbopack has no equivalent — you cannot register a transform that runs after every CSS chunk is finalised, you cannot add a `generateBundle`-style post-pass, and you cannot inspect the module graph.
3. **No third-party loader chain (yet).** Turbopack accepts a fixed set of loaders (CSS, PostCSS, MDX, etc.) plus a few webpack-loader-compatible packages whitelisted by Vercel. There is no public way to ship a custom loader to npm and have Turbopack pick it up.

In other words, the same plugin code that runs unmodified across Vite, Webpack, Rollup, and esbuild — thanks to [`unplugin`](https://github.com/unjs/unplugin) — has nothing to attach to under Turbopack today.

### What would Turbopack support look like?

There are three realistic paths, listed by ambition:

1. ✅ **Post-build CLI** — **shipped in v2.0.1**. Let Turbopack run, then walk `.next/static/**` and `.next/server/**` and rewrite class strings using the mapping. Exposed as `tw-obfuscator run --build-dir .next` (see Pattern A above). Works today on every Next.js version.
2. **`unplugin-turbopack`** adapter — when [`unplugin`](https://github.com/unjs/unplugin) ships official Turbopack support, our existing plugin can ride on it. As of April 2026 this is being prototyped but not stable.
3. **Native Turbopack rule** — write a Rust extension when Vercel publishes the public plugin SDK. No ETA from Vercel.

### Should we invest in 2 and 3 now?

Honest assessment, April 2026:

- **Path 1 (post-build CLI) is shipped and unblocks every user immediately** — no `--webpack` flag, no plugin code, just a CLI run after the build. The output is identical to the Webpack-plugin path.
- **Path 2 (unplugin adapter)** would let us drop the post-build step but doesn't change the output. Low priority while Path 1 works.
- **Path 3 (native Rust)** is years out — gated entirely on Vercel publishing a public plugin SDK.

If you have specific feedback on the Pattern A flow (slower than expected, missing `--content` glob coverage, etc.), please [open an issue](https://github.com/josedacosta/tailwindcss-obfuscator/issues).

### How to detect that obfuscation got skipped

Whether you ran Pattern A or B, verify your bundle was actually obfuscated. The fastest sanity check after a build:

```bash
# In your own project — should return nothing once obfuscation worked
grep -RE 'class="[^"]*\bbg-blue-500\b' .next/server/app | head -3

# Or check the mapping file exists and is non-empty
cat .tw-obfuscation/class-mapping.json | head -20
```

If you see original Tailwind classes in the output, the obfuscation step didn't run :

- **Pattern A**: confirm the `tw-obfuscator run` command finished successfully (check the `&&` chain in your `build` script). Look for `[tw-obfuscator] transformed N files` in the build log.
- **Pattern B**: confirm Turbopack didn't sneak back — pure `next build` (no `--webpack` flag) will silently skip the plugin under Next.js 16.
