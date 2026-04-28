# tailwindcss-patch vs tailwindcss-obfuscator

## Executive Summary

`tailwindcss-patch` and `tailwindcss-obfuscator` are often compared because both touch Tailwind class names at build time, but they solve **different problems** and use **different mechanisms**:

- `tailwindcss-patch` (v9.0.0+) **mangles** class names to shrink the production bundle. It collects classes via runtime patching on Tailwind v3 and via CSS scanning on Tailwind v4 (the `--css` flag, added in v9.0.0).
- `tailwindcss-obfuscator` **obfuscates** class names everywhere — source files, CSS, build artefacts — to make the design system hard to reverse-engineer. It uses an AST transformer (Babel) and a PostCSS pass, and never patches `node_modules`.

This page collects the technical history (the v8.x → v9.0.0 transition explains a lot of the design space) and ends with a head-to-head feature comparison.

::: warning Historical context
Sections "The Problem with tailwindcss-patch" through "How tailwindcss-patch Works" describe `tailwindcss-patch` v8.x, where the v4 support was broken (this is what motivated `tailwindcss-obfuscator`). v9.0.0 fixed it via CSS scanning, but kept the mangling-only goal. The Feature Comparison and "Why we still differ" sections below cover v9.0.0+ and are the up-to-date reference.
:::

## The Problem with tailwindcss-patch

### Expected Behavior

```bash
# This should work
npx tw-patch extract
# Output: .tw-patch/tw-class-list.json with all classes
```

### Actual Results

| Method                 | Result          | Classes Found |
| ---------------------- | --------------- | ------------- |
| `tw-patch extract` CLI | **Failed**      | 0             |
| Direct API call        | Partial success | ~150 (30%)    |
| tailwindcss-obfuscator | **Success**     | 450+ (100%)   |

## Technical Analysis

### Issue #1: CLI Command Fails

Running `npx tw-patch extract` produces:

```
Error: Cannot find module '@tailwindcss/node'
```

**Root Cause**: The CLI is designed for Tailwind v3's PostCSS-based architecture. Tailwind v4 uses a completely different build system.

### Issue #2: Architecture Mismatch

**Tailwind v3 Architecture**:

```
tailwind.config.js  →  PostCSS plugin  →  Generated CSS
         ↓
   JavaScript-based
   configuration
```

**Tailwind v4 Architecture**:

```
src/styles.css      →  @tailwindcss/vite  →  Generated CSS
      ↓
  CSS-first with
  @theme, @import
```

The patch tries to find and parse `tailwind.config.js`, which doesn't exist in v4 projects.

### Issue #3: Incomplete Class Detection

Even when using the API directly, only ~30% of classes are detected:

| Class Type                            | tailwindcss-patch | tailwindcss-obfuscator |
| ------------------------------------- | ----------------- | ---------------------- |
| Basic utilities (`bg-*`, `text-*`)    | Partial           | ✅ All                 |
| Responsive (`sm:`, `md:`, etc.)       | ❌ Missing        | ✅ All                 |
| Dark mode (`dark:*`)                  | ❌ Missing        | ✅ All                 |
| Arbitrary values (`[...]`)            | ❌ Missing        | ✅ All                 |
| Container queries (`@container`)      | ❌ Missing        | ✅ All                 |
| Pseudo-elements (`before:`, `after:`) | ❌ Missing        | ✅ All                 |
| State variants (`hover:`, `focus:`)   | ❌ Missing        | ✅ All                 |
| Group/Peer variants                   | ❌ Missing        | ✅ All                 |

## Approach Comparison

### How tailwindcss-patch Works

```javascript
// Internal approach (simplified)
const tailwindConfig = require("./tailwind.config.js");
const context = createContext(tailwindConfig);
const classes = context.getClassList();
```

This fails because:

1. `tailwind.config.js` doesn't exist in v4
2. v4's context API is completely different
3. The extraction logic doesn't understand v4's CSS-first directives

### How tailwindcss-obfuscator Works

```typescript
// Static analysis approach (simplified)
import { extractClasses } from "tailwindcss-obfuscator";

// Automatically scans source files for:
// - class="..." and className="..."
// - cn(), clsx(), cva() function arguments
// - @apply directives in CSS
// - Template literals with static content
```

This works because:

1. **No dependency on Tailwind internals** - scans source files directly
2. **Framework-agnostic** - works with any build tool via unplugin
3. **AST-based parsing** - understands JavaScript/TypeScript syntax
4. **CSS-aware** - properly handles `@apply` and selectors

## Feature Comparison

| Feature                                                                  | tailwindcss-patch (v9.0.0+)     | tailwindcss-obfuscator                                      |
| ------------------------------------------------------------------------ | ------------------------------- | ----------------------------------------------------------- |
| Goal                                                                     | Mangle classes for tree-shaking | Obfuscate classes (rewrite source + bundles end-to-end)     |
| Tailwind v3 support                                                      | ✅ Yes (runtime patching)       | ✅ Yes                                                      |
| Tailwind v4 support                                                      | ✅ Yes (CSS scanning, v9.0.0+)  | ✅ Yes (AST + PostCSS)                                      |
| Requires patching `node_modules`                                         | Yes for v3 (`tw-patch install`) | ❌ Never                                                    |
| Build-tool support                                                       | Limited                         | All (via unplugin: Vite/Webpack/Rollup/esbuild/Rspack/Farm) |
| React/Next.js                                                            | ✅                              | ✅                                                          |
| Vue/Nuxt                                                                 | ⚠️ Partial                      | ✅                                                          |
| Svelte/SvelteKit                                                         | ⚠️ Partial                      | ✅                                                          |
| Astro                                                                    | ❌                              | ✅                                                          |
| Class-utility extraction (`cn`/`clsx`/`classnames`/`twMerge`/`cva`/`tv`) | ❌                              | ✅ All six                                                  |
| AST-based JSX/TSX transform                                              | ❌                              | ✅ Babel                                                    |
| Source maps                                                              | ❌                              | ✅                                                          |
| Persistent mapping                                                       | ⚠️ Basic                        | ✅ With merge strategy                                      |

> **Why we still differ from `tailwindcss-patch` v9.0.0**
>
> The two libraries solve adjacent but distinct problems:
>
> - **`tailwindcss-patch`** scans CSS output and content sources to collect Tailwind class names, then mangles them for **bundle size optimisation**. It's a shorter-cycle tool and stops once the class list is collected.
> - **`tailwindcss-obfuscator`** rewrites class names everywhere — source files (JSX, Vue, Svelte, Astro), CSS selectors, build artefacts — to make the design system **uncopyable**. It needs an AST transformer, a PostCSS pass, and a full mapping persistence layer because every output file is touched.
>
> If you only care about bundle size and you're willing to accept the runtime patching for v3, `tailwindcss-patch` is lighter. If you need to ship a build whose CSS is genuinely hard to reverse-engineer, that's the `tailwindcss-obfuscator` use case.

## Build Output Comparison

| Metric               | tailwindcss-patch | tailwindcss-obfuscator |
| -------------------- | ----------------- | ---------------------- |
| Classes detected     | ~150              | 450+                   |
| Build success        | Partial           | ✅ Full                |
| Obfuscation accuracy | ~30%              | 100%                   |
| Missing classes      | Many variants     | None                   |
| Bundle size impact   | Unknown           | -15% to -30%           |

## Usage Comparison

### With tailwindcss-patch (Tailwind v3 only)

```bash
# Installation
npm install tailwindcss-patch unplugin-tailwindcss-mangle

# Patching required after each install
npx tw-patch install

# Extract classes before build
npx tw-patch extract
```

```javascript
// vite.config.js
import tailwindcssMangle from "unplugin-tailwindcss-mangle/vite";

export default {
  plugins: [tailwindcssMangle()],
};
```

### With tailwindcss-obfuscator (v3 & v4)

```bash
# Installation - no patching required
npm install tailwindcss-obfuscator
```

```javascript
// vite.config.js
import TailwindObfuscator from "tailwindcss-obfuscator/vite";

export default {
  plugins: [
    TailwindObfuscator({
      prefix: "tw-",
      verbose: true,
    }),
  ],
};
```

## Migration Guide

### From tailwindcss-patch to tailwindcss-obfuscator

1. **Remove old packages**:

   ```bash
   npm uninstall tailwindcss-patch unplugin-tailwindcss-mangle
   ```

2. **Install tailwindcss-obfuscator**:

   ```bash
   npm install -D tailwindcss-obfuscator
   ```

3. **Update build configuration**:

   ```javascript
   // Before (vite.config.js)
   import tailwindcssMangle from "unplugin-tailwindcss-mangle/vite";

   // After
   import TailwindObfuscator from "tailwindcss-obfuscator/vite";
   ```

4. **Remove postinstall script** (no more patching needed):

   ```json
   {
     "scripts": {
       // Remove: "postinstall": "tw-patch install"
     }
   }
   ```

5. **Update build script**:
   ```json
   {
     "scripts": {
       // Before: "build": "tw-patch extract && vite build"
       // After:
       "build": "vite build"
     }
   }
   ```

## Why We Built tailwindcss-obfuscator

The limitations of `tailwindcss-patch` with Tailwind v4 led us to create a complete alternative:

1. **Future-proof architecture** - No dependency on Tailwind internals
2. **Universal framework support** - Works with any build tool
3. **Modern class patterns** - Supports cn(), clsx(), cva(), and more
4. **Better developer experience** - No patching, no manual extraction
5. **Full v4 compatibility** - CSS-first architecture fully supported

## Recommendations

| Scenario                   | Recommendation                      |
| -------------------------- | ----------------------------------- |
| New project (v4)           | Use `tailwindcss-obfuscator`        |
| Existing project (v3)      | Migrate to `tailwindcss-obfuscator` |
| Must use tailwindcss-patch | Stay on Tailwind v3                 |

## References

::: info External Links

- [tailwindcss-patch GitHub](https://github.com/sonofmagic/tailwindcss-mangle) - Source code (monorepo)
- [tailwindcss-obfuscator npm](https://www.npmjs.com/package/tailwindcss-obfuscator) - Our package
- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs) - Official docs
- [Tailwind CSS v4 Upgrade Guide](https://tailwindcss.com/docs/upgrade-guide) - Migration guide
  :::
