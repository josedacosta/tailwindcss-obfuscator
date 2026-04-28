# Getting Started

## Prerequisites

- Node.js 18.x or higher
- A project using Tailwind CSS (v3 or v4)
- A supported build tool (Vite, Webpack, etc.)

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

## Basic Setup

### Vite

```ts
// vite.config.ts
import { defineConfig } from "vite";
import TailwindObfuscator from "tailwindcss-obfuscator/vite";

export default defineConfig({
  plugins: [
    TailwindObfuscator({
      prefix: "tw-",
      verbose: true,
    }),
  ],
});
```

### Next.js

```ts
// next.config.ts
import type { NextConfig } from "next";
import TailwindObfuscator from "tailwindcss-obfuscator/webpack";

const config: NextConfig = {
  webpack: (config, { dev }) => {
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

### Nuxt

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ["tailwindcss-obfuscator/nuxt"],

  tailwindcssObfuscator: {
    prefix: "tw-",
    verbose: true,
  },
});
```

## Verify Installation

After setting up, run your production build:

```bash
pnpm build
```

You should see output like:

```
[tw-obfuscator] Initializing Tailwind CSS obfuscator...
[tw-obfuscator] Extracted 1234 classes from 50 files
[tw-obfuscator] Detected Tailwind CSS v4
[tw-obfuscator] Found 456 classes to obfuscate
[tw-obfuscator] Obfuscation complete!
```

## Class Mapping

A mapping file is generated at `.tw-obfuscation/class-mapping.json`:

```json
{
  "version": "1.0.0",
  "generatedAt": "2024-01-15T10:30:00Z",
  "tailwindVersion": "4",
  "totalClasses": 1234,
  "obfuscatedClasses": 456,
  "classes": {
    "bg-blue-500": {
      "original": "bg-blue-500",
      "obfuscated": "tw-a",
      "usedIn": ["src/components/Button.tsx"],
      "occurrences": 3
    }
  }
}
```

## Next Steps

- [Configuration Options](/guide/options) - Customize the obfuscator
- [Class Utilities](/guide/class-utilities) - Using with cn(), clsx(), cva()
- [Exclusions](/guide/exclusions) - Exclude specific classes
