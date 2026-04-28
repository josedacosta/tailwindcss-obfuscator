# Lab Analysis: tailwindcss-patch + unplugin-tailwindcss-mangle

This document presents a comprehensive reverse engineering analysis of `tailwindcss-patch` and `unplugin-tailwindcss-mangle` packages, testing their compatibility with Tailwind CSS v3 and v4.

## Executive Summary

| Configuration              | Tailwind | Status         | Notes                         |
| -------------------------- | -------- | -------------- | ----------------------------- |
| lab-mangle-tw3-html-static | v3       | ✅ **SUCCESS** | Full obfuscation works        |
| lab-mangle-tw3-vite-react  | v3       | ✅ **SUCCESS** | Full obfuscation works        |
| lab-mangle-tw4-html-static | v4       | ❌ **FAILURE** | tw-patch incompatible with v4 |
| lab-mangle-tw4-vite-react  | v4       | ❌ **FAILURE** | tw-patch incompatible with v4 |

## Package Overview

### tailwindcss-patch

**Repository**: [tailwindcss-patch](https://github.com/AntzyMo/tailwindcss-patch)

**Purpose**: Patches Tailwind CSS to intercept and extract generated class names during the build process.

**Key Commands**:

- `tw-patch install`: Patches the Tailwind CSS runtime in node_modules
- `tw-patch extract`: Runs Tailwind build and extracts all generated classes

**Version Compatibility**:

- **v3.0.x**: Works with Tailwind CSS v3 (PostCSS-based)
- **v8.4.x**: Claims to support Tailwind CSS v4, but has critical issues

### unplugin-tailwindcss-mangle

**Repository**: [unplugin-tailwindcss-mangle](https://github.com/AntzyMo/unplugin-tailwindcss-mangle)

**Purpose**: Build tool plugin that replaces Tailwind CSS class names with short obfuscated versions.

**Supported Build Tools**:

- Vite (`unplugin-tailwindcss-mangle/vite`)
- Webpack (`unplugin-tailwindcss-mangle/webpack`)
- Rollup (`unplugin-tailwindcss-mangle/rollup`)
- esbuild (`unplugin-tailwindcss-mangle/esbuild`)

---

## Detailed Analysis: Tailwind CSS v3

### Architecture

```
Source Files → tailwind.config.js → PostCSS → Generated CSS
                     ↓
              tw-patch extract
                     ↓
           .tw-patch/tw-class-list.json
                     ↓
         unplugin-tailwindcss-mangle
                     ↓
              Obfuscated Output
```

### Working Configuration

#### package.json

```json
{
  "scripts": {
    "postinstall": "tw-patch install",
    "build": "pnpm run extract-classes && vite build",
    "extract-classes": "tw-patch extract"
  },
  "devDependencies": {
    "@tailwindcss-mangle/config": "^6.1.0",
    "tailwindcss": "^3.4.17",
    "tailwindcss-patch": "^3.0.1",
    "unplugin-tailwindcss-mangle": "^5.0.0"
  }
}
```

**CRITICAL**: Use `tailwindcss-patch@^3.0.1` for Tailwind v3, NOT the latest v8.x!

#### tailwind.config.js

```javascript
export default {
  content: ["./src/**/*.{html,js,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

#### tailwindcss-mangle.config.ts

```typescript
import { defineConfig } from "@tailwindcss-mangle/config";

export default defineConfig({
  registry: {
    output: {
      file: ".tw-patch/tw-class-list.json",
    },
  },
  transformer: {
    registry: {
      file: ".tw-patch/tw-class-list.json",
    },
    generator: {
      classPrefix: "tw-",
    },
  },
});
```

#### vite.config.js (or vite.config.ts)

```javascript
import { defineConfig } from "vite";
import tailwindcssMangle from "unplugin-tailwindcss-mangle/vite";

export default defineConfig(({ mode }) => ({
  plugins: [
    // Only enable in production
    mode === "production" && tailwindcssMangle(),
  ].filter(Boolean),
}));
```

### Results

**Extraction Output** (35 classes for test app):

```json
[
  "bg-blue-100",
  "bg-gray-100",
  "container",
  "flex",
  "font-bold",
  "gap-6",
  "grid",
  "lg:grid-cols-3",
  "md:grid-cols-2",
  "min-h-screen",
  ...
]
```

**Before Obfuscation**:

```html
<body class="min-h-screen bg-gray-100">
  <div class="container mx-auto px-4 py-8"></div>
</body>
```

**After Obfuscation**:

```html
<body class="tw-k tw-m">
  <div class="tw-q tw-ba tw-da container"></div>
</body>
```

**Notes**:

- Utility classes are obfuscated (e.g., `min-h-screen` → `tw-k`)
- Custom component classes defined with `@apply` (`.btn-primary`, `.card`) are NOT obfuscated
- The `container` class remains unchanged (configurable)

---

## Detailed Analysis: Tailwind CSS v4

### Architecture Mismatch

Tailwind CSS v4 introduced a **CSS-first architecture** that fundamentally breaks `tailwindcss-patch`:

**Tailwind v3** (Config-based):

```
tailwind.config.js → PostCSS Plugin → CSS Output
```

**Tailwind v4** (CSS-first):

```
CSS (@import "tailwindcss") → @tailwindcss/vite → CSS Output
```

### Failure Analysis

When running `tw-patch extract` on a Tailwind v4 project:

```bash
$ tw-patch extract

Error: Unable to locate Tailwind CSS config from /path/to/project
    at resolveConfigPath (tailwindcss-patch/dist/chunk-FLS2Y3CS.js:698:11)
```

**Root Cause**: The `tailwindcss-patch` package explicitly searches for `tailwind.config.js`:

```javascript
// From tailwindcss-patch source code
function resolveConfigPath(options) {
  // Searches for tailwind.config.js, tailwind.config.ts, etc.
  // Throws error if not found
  throw new Error(`Unable to locate Tailwind CSS config from ${options.cwd}`);
}
```

### Attempted Workarounds

#### 1. Using `--css` option

```bash
$ tw-patch extract --css src/index.css
# Result: Same error - still requires tailwind.config.js
```

#### 2. Creating empty tailwind.config.js

```javascript
// tailwind.config.js (empty config)
export default {};
```

```bash
$ tw-patch extract
# Result: Runs but extracts 0 classes (no content paths)
```

#### 3. Using v8.x with v4 features

The `--css` option was added in v8.x for Tailwind v4 support, but the implementation still requires a config file, making it non-functional.

### Why tailwindcss-patch Cannot Support Tailwind v4

1. **No Config File**: Tailwind v4 uses CSS-first configuration (`@theme`, `@import "tailwindcss"`)
2. **Different Build Process**: V4 uses `@tailwindcss/vite` or `@tailwindcss/postcss` plugins
3. **Runtime Patching**: The patch modifies PostCSS internals that don't exist in v4
4. **Class Generation**: V4 generates classes differently using the new Oxide engine

---

## Recommendations

### For Tailwind CSS v3 Projects

✅ **Use tailwindcss-patch + unplugin-tailwindcss-mangle**

Installation:

```bash
pnpm add -D tailwindcss-patch@^3.0.1 unplugin-tailwindcss-mangle @tailwindcss-mangle/config
```

This combination works reliably for:

- Static HTML + Vite
- React + Vite
- Vue + Vite
- Next.js (with webpack configuration)
- Any PostCSS-based setup

### For Tailwind CSS v4 Projects

❌ **DO NOT use tailwindcss-patch**

Alternatives:

1. **Custom extraction scripts**: Scan source files using regex patterns
2. **Our package**: Use `tailwindcss-obfuscator` which supports both v3 and v4
3. **Post-build obfuscation**: Process build output after generation

See `docs/tailwindcss_patch_v4_issues.md` for detailed v4 workarounds.

---

## Lab Apps Reference

### lab-mangle-tw3-html-static

- **Path**: `apps/lab-mangle-tw3-html-static`
- **Status**: ✅ Working
- **Dependencies**: tailwindcss@3.4.17, tailwindcss-patch@3.0.1

### lab-mangle-tw3-vite-react

- **Path**: `apps/lab-mangle-tw3-vite-react`
- **Status**: ✅ Working
- **Dependencies**: tailwindcss@3.4.17, tailwindcss-patch@3.0.1, react@19.1.0

### lab-mangle-tw4-html-static

- **Path**: `apps/lab-mangle-tw4-html-static`
- **Status**: ❌ Failing
- **Error**: "Unable to locate Tailwind CSS config"

### lab-mangle-tw4-vite-react

- **Path**: `apps/lab-mangle-tw4-vite-react`
- **Status**: ❌ Failing
- **Error**: "Unable to locate Tailwind CSS config"

---

## Conclusion

**tailwindcss-patch + unplugin-tailwindcss-mangle** is a viable solution **only for Tailwind CSS v3** projects. The fundamental architectural changes in Tailwind CSS v4 make these packages incompatible with the new CSS-first approach.

For Tailwind v4 projects, alternative solutions like custom extraction scripts or dedicated packages (like `tailwindcss-obfuscator`) are required.
