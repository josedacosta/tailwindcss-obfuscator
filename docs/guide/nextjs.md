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

::: warning Status — not supported (April 2026)
`tailwindcss-obfuscator` does not run under Turbopack today. To use the obfuscator you must opt out of Turbopack with the `--webpack` flag (see workaround below). Turbopack support is on the roadmap; the rest of this section explains exactly what's missing and why.
:::

### Workaround — opt out with `--webpack`

Next.js 15 made Turbopack stable; Next.js 16 enables it by default for both `next dev` and `next build`. Our plugin is a Webpack 5 plugin, so the simplest path is to keep the supported Webpack pipeline by passing `--webpack` explicitly:

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
# Default in Next 16 — Turbopack runs, no obfuscation, our `webpack:` config is ignored
next dev
next build

# Opt-in to the supported pipeline — Webpack runs, our plugin attaches normally
next dev --webpack
next build --webpack
```

### Why isn't Turbopack supported?

Turbopack is not "Webpack rewritten in Rust" — it's a different bundler with a deliberately small public surface. Three things make porting `tailwindcss-obfuscator` non-trivial:

1. **No `webpack:` callback.** Next 16 ignores the `webpack:` block in `next.config.ts` when Turbopack is the active bundler. Turbopack reads its own `turbopack:` block instead, which only accepts `rules`, `resolveAlias`, `resolveExtensions`, and a small whitelist of loader entries.
2. **No general-purpose plugin API.** Our plugin attaches to `compiler.hooks.compilation.tap()` and `processAssets`. Turbopack has no equivalent — you cannot register a transform that runs after every CSS chunk is finalised, you cannot add a `generateBundle`-style post-pass, and you cannot inspect the module graph.
3. **No third-party loader chain (yet).** Turbopack accepts a fixed set of loaders (CSS, PostCSS, MDX, etc.) plus a few webpack-loader-compatible packages whitelisted by Vercel. There is no public way to ship a custom loader to npm and have Turbopack pick it up.

In other words, the same plugin code that runs unmodified across Vite, Webpack, Rollup, and esbuild — thanks to [`unplugin`](https://github.com/unjs/unplugin) — has nothing to attach to under Turbopack today.

### What would Turbopack support look like?

There are three realistic paths, listed by ambition:

1. **Post-build script** — let Turbopack run, then walk `.next/static/**` and `.next/server/**` ourselves and rewrite class strings using the mapping. We already do this for SSG output of the Webpack-mode apps (see [`apps/test-shadcn-ui/scripts/post-build.mjs`](https://github.com/josedacosta/tailwindcss-obfuscator/blob/main/apps/test-shadcn-ui/scripts/post-build.mjs)). It's the smallest change, works today, and can be exposed as a `tailwindcss-obfuscator/postbuild` helper.
2. **`unplugin-turbopack`** adapter — when [`unplugin`](https://github.com/unjs/unplugin) ships official Turbopack support, our existing plugin can ride on it. As of April 2026 this is being prototyped but not stable.
3. **Native Turbopack rule** — write a Rust extension when Vercel publishes the public plugin SDK. No ETA from Vercel.

### Should we invest now?

Honest assessment, April 2026:

- **Yes, eventually** — Turbopack is the new default. Projects scaffolded with `create-next-app` after Next 15 use it out of the box. Within 12–18 months, "obfuscation breaks our `pnpm build`" will be a real adoption blocker.
- **Not blocking today** — `--webpack` is a one-line workaround. Webpack mode in Next 16 is fully supported by Vercel and not deprecated. Real production teams happily ship Next 14/15/16 builds in Webpack mode.
- **Path 1 (post-build helper) is cheap** and unblocks 100 % of users immediately. We may ship that next.
- **Paths 2 and 3 are speculative** and gated on upstream work.

If this matters for your project, please [👍 the tracking issue](https://github.com/josedacosta/tailwindcss-obfuscator/issues) (or open one) so we can prioritise.

### How to detect that Turbopack just silently bypassed the obfuscator

If you forget `--webpack` and Turbopack runs instead, the build succeeds but no classes get obfuscated. The fastest sanity check after a build:

```bash
node scripts/verify-obfuscation.mjs   # in this repo
```

Or, in your own project:

```bash
grep -RE 'class="[^"]*\bbg-blue-500\b' .next/server/app | head -3
# Should return nothing once obfuscation worked.
```

If you see your original Tailwind classes in the output, Turbopack is the likely culprit — switch to `--webpack` mode.
