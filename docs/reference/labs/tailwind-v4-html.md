# Tailwind CSS v4 + HTML Static - Class Obfuscation Guide

## Overview

This guide covers class obfuscation for static HTML projects using Tailwind CSS v4. Because `tailwindcss-patch` does NOT work with Tailwind v4 (see `tailwindcss_patch_v4_issues.md`), we use a custom extraction script.

## Architecture

```
scripts/extract-classes.ts  →  .tw-obfuscation/class-list.json
                                          ↓
src/*.html  →  Vite + @tailwindcss/vite  →  unplugin-tailwindcss-mangle  →  dist/
src/*.css                                                                   (obfuscated)
```

## Key Difference from v3

- **No `tailwind.config.js`** - Configuration is in CSS with `@theme`
- **No `tailwindcss-patch`** - Use custom extraction script
- **New plugin**: `@tailwindcss/vite` instead of PostCSS

## Dependencies

```json
{
  "dependencies": {
    "@tailwindcss/vite": "^4.1.17",
    "tailwindcss": "^4.1.17",
    "vite": "^6.0.5"
  },
  "devDependencies": {
    "tsx": "^4.19.2",
    "unplugin-tailwindcss-mangle": "^5.0.0"
  }
}
```

## Configuration Files

### CSS Configuration (src/styles.css)

```css
@import "tailwindcss";

/* Custom theme configuration for Tailwind CSS v4 */
@theme {
  --color-primary: #3b82f6;
  --color-secondary: #8b5cf6;
  --color-accent: #06b6d4;
  --font-sans: "Inter", system-ui, sans-serif;
}

@layer components {
  .btn {
    @apply rounded-lg px-4 py-2 font-medium transition-colors;
  }

  .btn-primary {
    @apply bg-primary hover:bg-primary/90 text-white;
  }
}
```

### tailwindcss-mangle.config.ts

```typescript
import { defineConfig } from "@tailwindcss-mangle/config";

export default defineConfig({
  registry: {
    output: {
      file: ".tw-obfuscation/class-list.json",
    },
  },
  transformer: {
    registry: {
      file: ".tw-obfuscation/class-list.json",
    },
    generator: {
      classPrefix: "tw-",
    },
  },
});
```

### vite.config.js

```javascript
import { defineConfig } from "vite";
import { resolve } from "path";
import tailwindcss from "@tailwindcss/vite";
import tailwindcssMangle from "unplugin-tailwindcss-mangle/vite";

export default defineConfig(({ mode }) => ({
  root: "src",
  plugins: [tailwindcss(), mode === "production" && tailwindcssMangle()].filter(Boolean),
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        about: resolve(__dirname, "src/about.html"),
      },
    },
  },
}));
```

## Custom Extraction Script

Create `scripts/extract-classes.ts`:

```typescript
#!/usr/bin/env tsx
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { join, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, "..");
const SRC_DIR = join(ROOT_DIR, "src");
const OUTPUT_DIR = join(ROOT_DIR, ".tw-obfuscation");
const OUTPUT_FILE = join(OUTPUT_DIR, "class-list.json");

function findFiles(dir: string, extensions: string[]): string[] {
  const files: string[] = [];
  if (!existsSync(dir)) return files;

  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      files.push(...findFiles(fullPath, extensions));
    } else if (extensions.includes(extname(entry).toLowerCase())) {
      files.push(fullPath);
    }
  }
  return files;
}

function extractClassesFromHtml(content: string): Set<string> {
  const classes = new Set<string>();

  // Match class="..." and class='...'
  const regex = /class=["']([^"']*)["']/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    match[1]
      .split(/\s+/)
      .filter(Boolean)
      .forEach((cls) => classes.add(cls));
  }
  return classes;
}

function extractClassesFromCss(content: string): Set<string> {
  const classes = new Set<string>();
  const applyRegex = /@apply\s+([^;]+);/g;
  let match;
  while ((match = applyRegex.exec(content)) !== null) {
    match[1]
      .split(/\s+/)
      .filter(Boolean)
      .forEach((cls) => classes.add(cls));
  }
  return classes;
}

// Main execution
const allClasses = new Set<string>();

for (const file of findFiles(SRC_DIR, [".html"])) {
  const classes = extractClassesFromHtml(readFileSync(file, "utf-8"));
  classes.forEach((cls) => allClasses.add(cls));
}

for (const file of findFiles(SRC_DIR, [".css"])) {
  const classes = extractClassesFromCss(readFileSync(file, "utf-8"));
  classes.forEach((cls) => allClasses.add(cls));
}

if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true });
writeFileSync(OUTPUT_FILE, JSON.stringify(Array.from(allClasses).sort(), null, 2));
console.log(`Extracted ${allClasses.size} classes to ${OUTPUT_FILE}`);
```

## Package.json Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsx scripts/extract-classes.ts && vite build",
    "extract-classes": "tsx scripts/extract-classes.ts"
  }
}
```

## Tailwind v4 Features Supported

| Feature              | Example                        | Supported |
| -------------------- | ------------------------------ | --------- |
| Container Queries    | `@container`, `@lg:`           | ✅        |
| Named Containers     | `@container/card`, `@lg/card:` | ✅        |
| Data Attributes      | `data-[state=open]:bg-green`   | ✅        |
| ARIA States          | `aria-disabled:opacity-50`     | ✅        |
| Arbitrary Properties | `[clip-path:...]`              | ✅        |
| Opacity Modifiers    | `bg-blue-500/50`               | ✅        |

## Result

### Before (Development)

```html
<div class="@container">
  <div class="@lg:grid-cols-4 bg-blue-500 hover:bg-blue-700">Container Query Demo</div>
</div>
```

### After (Production)

```html
<div class="tw-a">
  <div class="tw-b tw-c tw-d">Container Query Demo</div>
</div>
```

## Why Not tailwindcss-patch?

See `tailwindcss_patch_v4_issues.md` for detailed explanation. In summary:

1. CLI command `tw-patch extract` fails with module errors
2. API only detects ~30% of classes
3. v4's CSS-first architecture is incompatible with the patch's approach
