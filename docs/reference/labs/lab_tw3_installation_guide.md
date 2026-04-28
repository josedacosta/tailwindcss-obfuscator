# Installation Guide: tailwindcss-patch + unplugin-tailwindcss-mangle (Tailwind v3)

This guide explains how to set up class obfuscation for Tailwind CSS v3 projects using `tailwindcss-patch` and `unplugin-tailwindcss-mangle`.

## Prerequisites

- Node.js 18+
- pnpm, npm, or yarn
- A Tailwind CSS v3 project (with `tailwind.config.js`)

## Step 1: Install Dependencies

```bash
# Using pnpm
pnpm add -D tailwindcss-patch@^3.0.1 unplugin-tailwindcss-mangle@^5.0.0 @tailwindcss-mangle/config@^6.1.0

# Using npm
npm install -D tailwindcss-patch@^3.0.1 unplugin-tailwindcss-mangle@^5.0.0 @tailwindcss-mangle/config@^6.1.0

# Using yarn
yarn add -D tailwindcss-patch@^3.0.1 unplugin-tailwindcss-mangle@^5.0.0 @tailwindcss-mangle/config@^6.1.0
```

> **IMPORTANT**: Use `tailwindcss-patch@^3.0.1` specifically for Tailwind v3. The latest version (v8.x) has compatibility issues.

## Step 2: Add Scripts to package.json

```json
{
  "scripts": {
    "postinstall": "tw-patch install",
    "extract-classes": "tw-patch extract",
    "build": "pnpm run extract-classes && vite build"
  }
}
```

The `postinstall` script patches Tailwind CSS every time you install dependencies.

## Step 3: Create Configuration File

Create `tailwindcss-mangle.config.ts` at your project root:

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

### Configuration Options

| Option                              | Description                           | Default                        |
| ----------------------------------- | ------------------------------------- | ------------------------------ |
| `registry.output.file`              | Path to store extracted classes       | `.tw-patch/tw-class-list.json` |
| `transformer.generator.classPrefix` | Prefix for obfuscated classes         | `""`                           |
| `transformer.generator.type`        | Generation type (`ordered`, `random`) | `ordered`                      |

## Step 4: Configure Build Tool

### Vite (vite.config.js)

```javascript
import { defineConfig } from "vite";
import tailwindcssMangle from "unplugin-tailwindcss-mangle/vite";

export default defineConfig(({ mode }) => ({
  plugins: [
    // Other plugins (react, vue, etc.)

    // Only enable obfuscation in production
    mode === "production" && tailwindcssMangle(),
  ].filter(Boolean),
}));
```

### Vite + React

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcssMangle from "unplugin-tailwindcss-mangle/vite";

export default defineConfig(({ mode }) => ({
  plugins: [react(), mode === "production" && tailwindcssMangle()].filter(Boolean),
}));
```

### Webpack (next.config.mjs)

```javascript
import TailwindcssMangle from "unplugin-tailwindcss-mangle/webpack";

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { dev }) => {
    if (!dev) {
      config.plugins.push(
        TailwindcssMangle({
          mangleOptions: {
            classListPath: ".tw-patch/tw-class-list.json",
            classGenerator: {
              classPrefix: "tw-",
            },
          },
          log: true,
        })
      );
    }
    return config;
  },
};

export default nextConfig;
```

## Step 5: Configure Tailwind

Ensure your `tailwind.config.js` has correct content paths:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

## Step 6: Build and Verify

```bash
# Build the project
pnpm run build

# Check extracted classes
cat .tw-patch/tw-class-list.json
```

## Verification

After building, verify obfuscation in your output files:

**Before (source)**:

```html
<div class="flex items-center bg-blue-500 text-white"></div>
```

**After (build output)**:

```html
<div class="tw-a tw-b tw-c tw-d"></div>
```

## Troubleshooting

### "0 classes extracted"

**Cause**: Content paths in `tailwind.config.js` don't match your source files.

**Fix**: Ensure content paths are correct:

```javascript
content: ["./src/**/*.{html,js,jsx,tsx}"];
```

### "tw-patch: command not found"

**Cause**: `postinstall` script didn't run.

**Fix**: Run manually:

```bash
npx tw-patch install
```

### Classes not being obfuscated

**Cause**: Plugin only runs in production mode.

**Fix**: Build with production mode:

```bash
NODE_ENV=production pnpm run build
# or
vite build --mode production
```

### Custom component classes not obfuscated

**Behavior**: Classes defined with `@apply` in `@layer components` are intentionally NOT obfuscated because they're meant to be reusable component names.

```css
@layer components {
  .btn-primary {
    /* NOT obfuscated */
    @apply bg-blue-500 text-white; /* These ARE obfuscated */
  }
}
```

## Reserved Classes

Some classes are typically excluded from obfuscation:

```typescript
classGenerator: {
  reserveClassName: [
    /^js-/,      // JavaScript hooks
    /^no-/,      // Utility toggles
    /^is-/,      // State classes
    /^has-/,     // Feature detection
  ],
}
```

## File Structure

After setup, your project should have:

```
project/
├── .tw-patch/
│   └── tw-class-list.json    # Generated class list
├── tailwindcss-mangle.config.ts
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── package.json
```

## Example Projects

See working examples in our lab apps:

- `apps/lab-mangle-tw3-html-static` - Static HTML + Vite
- `apps/lab-mangle-tw3-vite-react` - React + Vite
