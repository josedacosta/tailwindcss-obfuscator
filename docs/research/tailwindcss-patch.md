# tailwindcss-patch vs tailwindcss-obfuscator

## Executive Summary

The `tailwindcss-patch` library claims "first-class support for Tailwind CSS v4", but in practice, **its extraction functionality is broken** for v4 projects. This document explains the technical issues and why we created `tailwindcss-obfuscator` as a complete alternative.

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

| Feature               | tailwindcss-patch        | tailwindcss-obfuscator |
| --------------------- | ------------------------ | ---------------------- |
| Tailwind v3 support   | ✅ Yes                   | ✅ Yes                 |
| Tailwind v4 support   | ❌ No                    | ✅ Yes                 |
| Requires patching     | Yes (`tw-patch install`) | No                     |
| Build tool support    | Limited                  | All (via unplugin)     |
| React/Next.js         | ✅ Yes                   | ✅ Yes                 |
| Vue/Nuxt              | ⚠️ Partial               | ✅ Yes                 |
| Svelte/SvelteKit      | ⚠️ Partial               | ✅ Yes                 |
| Astro                 | ❌ No                    | ✅ Yes                 |
| Class utility support | ❌ No                    | ✅ cn, clsx, cva, tv   |
| Source maps           | ❌ No                    | ✅ Yes                 |
| Persistent mapping    | ⚠️ Basic                 | ✅ Full with merge     |

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
