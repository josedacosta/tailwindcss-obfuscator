# Mangle Ecosystem

## Overview

The `tailwindcss-patch` and `unplugin-tailwindcss-mangle` packages are **two separate npm packages** but they are developed together in the **same GitHub monorepo**: [sonofmagic/tailwindcss-mangle](https://github.com/sonofmagic/tailwindcss-mangle).

## Package Relationship

```
┌─────────────────────────────────────────────────────────────────┐
│                 sonofmagic/tailwindcss-mangle                   │
│                      (GitHub Monorepo)                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────┐      ┌─────────────────────────────┐  │
│  │  tailwindcss-patch  │ ───► │ unplugin-tailwindcss-mangle │  │
│  │     (npm package)   │      │       (npm package)         │  │
│  └─────────────────────┘      └─────────────────────────────┘  │
│           │                              │                      │
│           │ Exposes Tailwind             │ Uses extracted       │
│           │ internal APIs                │ classes to mangle    │
│           │                              │                      │
│           ▼                              ▼                      │
│  ┌─────────────────────┐      ┌─────────────────────────────┐  │
│  │ - Patches Tailwind  │      │ - Vite plugin               │  │
│  │ - Extracts classes  │      │ - Webpack plugin            │  │
│  │ - Runtime context   │      │ - Rollup plugin             │  │
│  └─────────────────────┘      │ - Nuxt module               │  │
│                               └─────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## tailwindcss-patch

**npm**: https://www.npmjs.com/package/tailwindcss-patch

### Purpose

Patches Tailwind CSS source code at install time to expose internal APIs that are normally not accessible. This allows extracting the complete list of generated utility classes.

### How It Works

1. **Installation**: Run `npx tw-patch install` after installing Tailwind CSS
2. **Patching**: Modifies Tailwind's source files to expose the internal context
3. **Extraction**: Provides APIs to get all generated classes at runtime

### Key Features

- `TailwindcssPatcher` class for programmatic access
- `twPatcher.getContexts()` - Get all Tailwind contexts at runtime
- `twPatcher.getClassSet()` - Get all generated utility classes
- CLI tool: `npx tw-patch extract` creates `.tw-patch/tw-class-list.json`

### Tailwind Version Support

| tailwindcss-patch | Tailwind CSS      | Method                                         |
| ----------------- | ----------------- | ---------------------------------------------- |
| v9.0.0+           | v3.x · v4.x       | Runtime patching (v3) + CSS scanning (v4)      |
| v8.x              | v3.x · v4 partial | Limited Oxide support, several blocking issues |
| v3.x              | v3.x              | Classic runtime patching (legacy)              |

**v9.0.0 update (April 2026)**: `tailwindcss-patch` shipped first-class Tailwind v4 support, but through a **CSS-scanning** approach (`--css` flag): it parses the compiled CSS to discover which classes Tailwind generated, instead of patching the v3 runtime. This works around the Oxide rewrite but it's a fundamentally different method from `tailwindcss-obfuscator`'s AST + PostCSS pipeline. See [/research/tailwindcss-patch](./tailwindcss-patch.md) for the side-by-side breakdown.

## unplugin-tailwindcss-mangle

**npm**: https://www.npmjs.com/package/unplugin-tailwindcss-mangle

### Purpose

A build-time plugin that mangles (obfuscates) Tailwind CSS class names in your production build. It transforms readable class names into short, cryptic identifiers.

### Transformation Example

```html
<!-- Before -->
<div class="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex"></div>

<!-- After -->
<div class="tw-a tw-b tw-c tw-d tw-e tw-f tw-g tw-h"></div>
```

### Supported Build Tools

- **Vite** - `unplugin-tailwindcss-mangle/vite`
- **Webpack** - `unplugin-tailwindcss-mangle/webpack`
- **Rollup** - `unplugin-tailwindcss-mangle/rollup`
- **Nuxt 3** - `unplugin-tailwindcss-mangle/nuxt`

### Dependency on tailwindcss-patch

`unplugin-tailwindcss-mangle` requires `tailwindcss-patch` to be installed and configured first:

```bash
npm i -D unplugin-tailwindcss-mangle tailwindcss-patch
npx tw-patch install
```

### Limitations

1. **Production only**: Only works during build, not in development mode
2. **Static classes only**: Dynamic class construction (`bg-${color}-500`) breaks obfuscation
3. **Partial mangling**: Some simple classes like `flex`, `relative` are not mangled by default

## Monorepo Structure

The GitHub repository contains:

```
sonofmagic/tailwindcss-mangle/
├── packages/
│   ├── tailwindcss-patch/           # Core patching library
│   ├── unplugin-tailwindcss-mangle/ # Build plugins
│   ├── core/                        # Shared core logic
│   ├── config/                      # Configuration utilities
│   └── shared/                      # Shared utilities
├── apps/                            # Test applications
│   ├── next-app/
│   ├── nuxt-app/
│   ├── vite-react/
│   └── ...
└── website/                         # Documentation site
```

## Why This Matters for Our Project

Understanding this ecosystem is crucial for our `tailwindcss-obfuscator` because:

1. **Adjacent problem domain**: `tailwindcss-mangle` mangles classes for tree-shaking; we obfuscate them for design-system protection. Same input, different output goal.
2. **Reference implementation**: Their approach to class extraction informed our pattern catalog.
3. **Tailwind v4 gap (now closed differently)**: Until v9.0.0 (April 2026), neither package supported Tailwind v4. v9.0.0 added v4 support via CSS scanning — a different mechanism from our AST + PostCSS pipeline. We now coexist rather than fill a void.
4. **Architecture insights**: Their monorepo + unplugin layout is a useful baseline.

## Key Differences from Our Approach

| Aspect                   | tailwindcss-mangle (v9.0.0+)           | Our tailwindcss-obfuscator                            |
| ------------------------ | -------------------------------------- | ----------------------------------------------------- |
| Goal                     | Class mangling for bundle tree-shaking | Full obfuscation (design-system protection)           |
| Tailwind v4              | ✅ via CSS scanning                    | ✅ via AST + PostCSS (transforms source files too)    |
| Patching `node_modules`  | Yes for v3 (`tw-patch install`)        | ❌ Never                                              |
| Class extraction         | Runtime patch (v3) / CSS scan (v4)     | Static analysis of source files                       |
| Build tools              | Vite / Webpack / Rollup / Nuxt         | Vite / Webpack / Rollup / esbuild / Rspack / Farm     |
| AST-based JSX/TSX        | ❌                                     | ✅ Babel                                              |
| Class-utility extraction | 2 of 6                                 | All 6 (`cn`/`clsx`/`classnames`/`twMerge`/`cva`/`tv`) |

## Local Code for Reverse Engineering

We have downloaded the source code for analysis:

```
./github/tailwindcss-mangle/packages/tailwindcss-patch/
./github/tailwindcss-mangle/packages/unplugin-tailwindcss-mangle/
```

See `./github/README.md` for download instructions.

## References

::: info External Links

- [tailwindcss-mangle GitHub](https://github.com/sonofmagic/tailwindcss-mangle) - Monorepo source code
- [tailwindcss-patch npm](https://www.npmjs.com/package/tailwindcss-patch) - NPM package
- [unplugin-tailwindcss-mangle npm](https://www.npmjs.com/package/unplugin-tailwindcss-mangle) - NPM package
- [Discussion on Tailwind CSS repo](https://github.com/tailwindlabs/tailwindcss/discussions/11179) - Community discussion
  :::
