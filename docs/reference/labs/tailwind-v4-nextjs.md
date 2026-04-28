# Tailwind CSS v4 + Next.js - Class Obfuscation Guide

## Overview

This guide covers class obfuscation for Next.js applications using Tailwind CSS v4. Because `tailwindcss-patch` does NOT work with Tailwind v4, we use a custom extraction script that supports JSX `className` attributes.

## Architecture

```
scripts/extract-classes.ts  →  .tw-obfuscation/class-list.json
                                         ↓
src/**/*.tsx  →  Next.js + @tailwindcss/postcss  →  unplugin-tailwindcss-mangle  →  .next/
src/**/*.css                                                                        (obfuscated)
```

## Key Differences from v3 + Next.js

- **No `tailwind.config.ts`** - Configuration in CSS with `@theme`
- **No `tailwindcss-patch`** - Custom script extracts `className` attributes
- **PostCSS plugin**: `@tailwindcss/postcss` instead of `tailwindcss`
- **New v4 features**: Container queries, improved arbitrary values

## Dependencies

```json
{
  "dependencies": {
    "@tailwindcss/postcss": "^4.1.17",
    "next": "^15.1.2",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "tailwindcss": "^4.1.17"
  },
  "devDependencies": {
    "tsx": "^4.19.2",
    "typescript": "^5.7.2",
    "unplugin-tailwindcss-mangle": "^5.0.0"
  }
}
```

## Configuration Files

### postcss.config.mjs

```javascript
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
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

### next.config.ts

```typescript
import type { NextConfig } from "next";
import TailwindcssMangle from "unplugin-tailwindcss-mangle/webpack";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (process.env.NODE_ENV === "production" && !isServer) {
      config.plugins.push(TailwindcssMangle());
    }
    return config;
  },
};

export default nextConfig;
```

## CSS Configuration (src/app/globals.css)

```css
@import "tailwindcss";

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

  .card {
    @apply rounded-xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800;
  }
}
```

## Custom Extraction Script for React

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

function extractClassesFromJsx(content: string): Set<string> {
  const classes = new Set<string>();

  // className="..." and className='...'
  const stringRegex = /className=["']([^"']*)["']/g;
  let match;
  while ((match = stringRegex.exec(content)) !== null) {
    match[1]
      .split(/\s+/)
      .filter(Boolean)
      .forEach((cls) => classes.add(cls));
  }

  // className={`...`} (template literals without interpolation)
  const templateRegex = /className=\{`([^`]*)`\}/g;
  while ((match = templateRegex.exec(content)) !== null) {
    const staticParts = match[1].replace(/\$\{[^}]*\}/g, " ");
    staticParts
      .split(/\s+/)
      .filter(Boolean)
      .forEach((cls) => classes.add(cls));
  }

  // className={"..."}
  const braceRegex = /className=\{"([^"]*)"\}/g;
  while ((match = braceRegex.exec(content)) !== null) {
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

// Main
const allClasses = new Set<string>();

for (const file of findFiles(SRC_DIR, [".tsx", ".ts", ".jsx", ".js"])) {
  const classes = extractClassesFromJsx(readFileSync(file, "utf-8"));
  classes.forEach((cls) => allClasses.add(cls));
}

for (const file of findFiles(SRC_DIR, [".css"])) {
  const classes = extractClassesFromCss(readFileSync(file, "utf-8"));
  classes.forEach((cls) => allClasses.add(cls));
}

if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true });
writeFileSync(OUTPUT_FILE, JSON.stringify(Array.from(allClasses).sort(), null, 2));
console.log(`Extracted ${allClasses.size} classes`);
```

## Package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "tsx scripts/extract-classes.ts && next build",
    "start": "next start",
    "extract-classes": "tsx scripts/extract-classes.ts"
  }
}
```

## Using Tailwind v4 Features in React

### Container Queries

```tsx
export function ContainerQueryDemo() {
  return (
    <div className="@container">
      <div className="@sm:flex @md:grid @md:grid-cols-2 @lg:grid-cols-3">
        <div className="rounded-lg bg-blue-500 p-4 text-white">Responsive to container width</div>
      </div>
    </div>
  );
}
```

### Named Container Queries

```tsx
export function NamedContainerDemo() {
  return (
    <div className="@container/sidebar">
      <p className="@sm/sidebar:text-lg @md/sidebar:text-xl">Named container query</p>
    </div>
  );
}
```

### Data Attributes

```tsx
export function DataAttributeDemo() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <button
      data-state={isOpen ? "open" : "closed"}
      className="p-4 text-white data-[state=closed]:bg-red-500 data-[state=open]:bg-green-500"
      onClick={() => setIsOpen(!isOpen)}
    >
      Toggle State
    </button>
  );
}
```

### ARIA States

```tsx
export function AriaDemo() {
  return (
    <button
      aria-disabled="true"
      className="bg-blue-500 p-4 text-white aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
    >
      Disabled Button
    </button>
  );
}
```

## Conditional Classes Pattern (v4 Compatible)

```tsx
// Using complete static strings (works with obfuscation)
const buttonStyles = {
  primary: "bg-primary text-white hover:bg-primary/90",
  secondary: "bg-secondary text-white hover:bg-secondary/90",
  danger: "bg-red-500 text-white hover:bg-red-600",
};

export function Button({ variant }: { variant: keyof typeof buttonStyles }) {
  return <button className={`btn ${buttonStyles[variant]}`}>Click me</button>;
}
```

## Result

### Before (Development)

```jsx
<div className="@container">
  <div className="@lg:grid-cols-4 bg-blue-500 hover:bg-blue-700">
```

### After (Production)

```javascript
createElement("div", { className: "tw-a" }, createElement("div", { className: "tw-b tw-c tw-d" }));
```
