# Mangle Tailwind v4 Issues

> Technical issues with `tailwindcss-patch` v8.x and `unplugin-tailwindcss-mangle` on Tailwind CSS v4

**Original investigation:** December 8, 2025 against Tailwind v4.1.17 + Next.js 15.5.7.
**Refresh:** April 28, 2026 — Tailwind v4 is now at 4.2.4 and `tailwindcss-patch` shipped v9.0.0 with first-class v4 support via CSS scanning. The issues below remain accurate for the **v8.x branch**; the architectural objections (Oxide engine in Rust, no PostCSS hook) are why v9.0.0 had to switch mechanism. See [/research/tailwindcss-patch](./tailwindcss-patch.md) for the up-to-date positioning.

**Project:** tailwindcss-obfuscator
**App:** tailwind_v4_react_nextjs
**Tailwind Version (refreshed):** 4.2.4
**Next.js Version (refreshed):** 16.x

---

## Executive Summary

CSS class obfuscation for Tailwind CSS v4 is currently **not functional** due to fundamental incompatibilities between the existing obfuscation tools and Tailwind v4's new architecture. This document details the technical issues encountered and their root causes.

---

## 1. Background: How CSS Obfuscation Works

CSS class obfuscation replaces human-readable class names with short, meaningless identifiers to:

- Reduce CSS/HTML file size
- Make reverse-engineering more difficult
- Obfuscate design system implementation

**Example transformation:**

```html
<!-- Before -->
<div class="flex min-h-screen items-center justify-center bg-gray-50">
  <!-- After -->
  <div class="tw-a tw-b tw-c tw-d tw-e"></div>
</div>
```

For this to work, the obfuscation tool must:

1. Extract all CSS class names used in the project
2. Generate a mapping (original → obfuscated)
3. Replace class names in **both** CSS selectors and HTML/JSX class attributes
4. Do this at build time to ensure consistency

---

## 2. Tool Tested: unplugin-tailwindcss-mangle

### 2.1 Overview

- **Package:** `unplugin-tailwindcss-mangle` v5.0.0
- **Dependency:** `tailwindcss-patch` v3.0.1
- **Configuration:** `@tailwindcss-mangle/config` v6.1.0
- **Documentation:** https://mangle.icebreaker.top/

This is the primary obfuscation tool for Tailwind CSS, supporting webpack and Vite.

### 2.2 How It Works (Tailwind v3)

1. `tailwindcss-patch` patches the Tailwind CSS compiler to extract generated class names
2. During build, it creates `.tw-patch/tw-class-list.json` with all classes
3. `unplugin-tailwindcss-mangle` uses this list to transform classes in:
   - JavaScript/TypeScript files (className attributes)
   - CSS files (selectors)
   - HTML files

### 2.3 The Problem with Tailwind v4

**Tailwind CSS v4 uses a completely new architecture:**

| Feature          | Tailwind v3                       | Tailwind v4                            |
| ---------------- | --------------------------------- | -------------------------------------- |
| Configuration    | `tailwind.config.js` (JavaScript) | `@import "tailwindcss"` (CSS-first)    |
| CSS Processing   | PostCSS plugin                    | Native CSS with `@tailwindcss/postcss` |
| Class Generation | JIT compiler with JS API          | Rust-based core engine (Oxide)         |
| Layer System     | `@layer` hijacking                | Native CSS cascade layers              |

**Root Cause:** `tailwindcss-patch` cannot patch Tailwind v4's Rust-based engine to extract class names.

---

## 3. Error Analysis

### 3.1 Error When Using unplugin-tailwindcss-mangle with Tailwind v4

**Configuration in `next.config.ts`:**

```typescript
import TailwindcssMangle from "unplugin-tailwindcss-mangle/webpack";

const nextConfig: NextConfig = {
  webpack: (config, { dev }) => {
    if (!dev) {
      config.plugins.push(TailwindcssMangle({}));
    }
    return config;
  },
};
```

**Build Error:**

```
Module not found: Can't resolve 'm-0":{"name":"tw-kia","usedBy":{}},"card":{"name":"tw-lia"...
```

### 3.2 Technical Explanation

The plugin adds a custom webpack loader before `postcss-loader` to transform CSS:

```javascript
// From plugin source code
webpack(compiler) {
  compiler.hooks.compilation.tap(pluginName, (compilation) => {
    NormalModule.getCompilationHooks(compilation).loader.tap(pluginName, (_, module) => {
      const idx = module.loaders.findIndex((x) => x.loader.includes("postcss-loader"));
      if (idx > -1) {
        module.loaders.splice(idx, 0, {
          loader: WEBPACK_LOADER,
          options: { ctx }
        });
      }
    });
  });
}
```

**The Bug:** When processing CSS with Tailwind v4's `@import "tailwindcss"` syntax, the loader's context object (`ctx`) gets dumped as a module path string. Webpack then tries to resolve this JSON-like string as an actual module path, causing the "Module not found" error.

**Error String Analysis:**

```
Can't resolve 'm-0":{"name":"tw-kia","usedBy":{}}...'
```

This is a fragment of the internal class mapping JSON being incorrectly treated as a require/import path.

---

## 4. Alternative Approach: Post-Build Obfuscation

### 4.1 Strategy

Since build-time integration doesn't work, I attempted post-build text replacement:

1. Run `next build` normally
2. After build completes, run a script that:
   - Reads the extracted class list
   - Generates a mapping
   - Replaces classes in `.next/static/` and `.next/server/` files

### 4.2 Implementation

```typescript
// scripts/obfuscate-classes.ts
function replaceClasses(content: string, mapping: Map<string, string>) {
  for (const [original, obfuscated] of mapping) {
    // Replace in CSS selectors: .classname
    // Replace in HTML/JSX: class="classname"
    content = content.replace(pattern, obfuscated);
  }
  return content;
}
```

### 4.3 Why This Failed

**The Problem:** Tailwind class names overlap with JavaScript identifiers.

**Examples of problematic class names:**

- `grid` - Also a CSS Grid property and potential variable name
- `flex` - Also a flexbox property and potential variable name
- `top` - Also a CSS position property and window.top
- `left`, `right`, `bottom` - CSS properties
- `block`, `inline` - CSS display values
- `hidden` - Common boolean variable name

**What Happened:**

```javascript
// Original compiled code
const grid = useGrid();

// After obfuscation (BROKEN)
const tw-abc = useGrid(); // Invalid JavaScript syntax!
```

The regex-based replacement cannot distinguish between:

- `class="grid"` (should be replaced)
- `const grid =` (should NOT be replaced)
- `.grid {` in CSS (should be replaced)

**Result:** `SyntaxError: Invalid left-hand side in assignment`

---

## 5. Why Build-Time Integration is Required

CSS class obfuscation requires **AST-level understanding** of the code:

### 5.1 For JavaScript/TypeScript

The tool must use a JavaScript parser (like Babel or SWC) to:

- Identify `className` prop values
- Distinguish string literals from variable references
- Handle dynamic class names (`cn()`, `clsx()`, template literals)

### 5.2 For CSS

The tool must use a CSS parser to:

- Identify class selectors (`.classname`)
- Avoid replacing property values that look like class names
- Handle complex selectors (`[class*="prefix-"]`)

### 5.3 For HTML

The tool must parse HTML to:

- Find `class` attribute values
- Split multiple classes correctly
- Preserve non-class attributes

**Text replacement cannot reliably do this.**

---

## 6. Tailwind v4 Architectural Changes

### 6.1 CSS-First Configuration

**Tailwind v3:**

```javascript
// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: { primary: "#3490dc" },
    },
  },
};
```

**Tailwind v4:**

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  --color-primary: #3490dc;
}
```

### 6.2 Oxide Engine

Tailwind v4 uses a Rust-based engine called "Oxide" for:

- Faster compilation
- Native CSS parsing
- Built-in content detection

This engine doesn't expose the same hooks that `tailwindcss-patch` used to extract class names.

### 6.3 Native Cascade Layers

**Tailwind v3:**

```css
@layer utilities {
  .custom-class { ... }
}
```

Tailwind hijacked `@layer` for its own purposes.

**Tailwind v4:**
Uses native CSS cascade layers, so the `@layer` syntax has different semantics.

---

## 7. Current Status

| Component           | Status     | Notes                                   |
| ------------------- | ---------- | --------------------------------------- |
| Class Extraction    | ✅ Working | Custom script extracts 1058 classes     |
| Mapping Generation  | ✅ Working | 1017 classes mapped to obfuscated names |
| CSS Transformation  | ❌ Broken  | Plugin crashes with Tailwind v4         |
| JS Transformation   | ❌ Broken  | Post-build replacement breaks code      |
| HTML Transformation | ❌ Broken  | Same issues as JS                       |

---

## 8. Recommended Solutions

### 8.1 Short-Term: Use Tailwind v3

For projects requiring obfuscation now, use Tailwind CSS v3.4.x where the tooling works properly.

### 8.2 Medium-Term: Wait for Plugin Update

The `unplugin-tailwindcss-mangle` maintainers need to:

1. Update `tailwindcss-patch` to work with Tailwind v4's Oxide engine
2. Fix the CSS loader context serialization bug
3. Test with `@tailwindcss/postcss`

**GitHub Issue to Watch:** <https://github.com/sonofmagic/tailwindcss-mangle/issues>

::: info Update — April 2026
`tailwindcss-mangle` released v9.0.0 in April 2026 with Tailwind v4 support through CSS scanning (the `--css` flag), confirming the diagnosis below: the v8.x runtime-patching path could not be fixed and a different mechanism was needed. The new approach works for tree-shaking but doesn't ship a full obfuscation pipeline; see [/research/tailwindcss-patch](./tailwindcss-patch.md) for the comparison.
:::

### 8.3 Long-Term: Custom Solution

Build a custom obfuscation pipeline using:

1. **SWC/Babel plugin** for JavaScript transformation
2. **PostCSS plugin** for CSS transformation
3. **Cheerio/HTMLParser** for HTML transformation
4. **Shared class registry** for consistent mapping

This is complex but would provide reliable obfuscation.

---

## 9. Files Created During Investigation

| File                                 | Purpose                                                |
| ------------------------------------ | ------------------------------------------------------ |
| `scripts/extract-classes.ts`         | Extracts Tailwind classes from React/shadcn components |
| `scripts/obfuscate-classes.ts`       | Failed post-build obfuscation attempt                  |
| `.tw-obfuscation/class-list.json`    | Extracted class names (1058 unique)                    |
| `.tw-obfuscation/class-mapping.json` | Original → obfuscated mapping                          |
| `tailwindcss-mangle.config.ts`       | Plugin configuration (not used)                        |

---

## 10. Conclusion

Tailwind CSS v4's architectural changes break existing obfuscation tools. The primary issue is that `tailwindcss-patch` cannot hook into the new Rust-based Oxide engine to extract class names, and the webpack loader has a bug that causes it to serialize its internal context as a module path.

Until the maintainers update their tools for Tailwind v4 compatibility, CSS class obfuscation is not reliably possible for Tailwind v4 projects.

---

## References

::: info External Links

- [Tailwind CSS v4.0 Release](https://tailwindcss.com/blog/tailwindcss-v4) - Official blog post
- [Tailwind v4 Upgrade Guide](https://tailwindcss.com/docs/upgrade-guide) - Migration documentation
- [tailwindcss-mangle Documentation](https://mangle.icebreaker.top/) - Official mangle docs
- [unplugin-tailwindcss-mangle GitHub](https://github.com/sonofmagic/tailwindcss-mangle) - Source code
  :::
