# Vite

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
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react"; // or vue, svelte, etc.
import TailwindObfuscator from "tailwindcss-obfuscator/vite";

export default defineConfig({
  plugins: [
    react(),
    TailwindObfuscator({
      prefix: "tw-",
      verbose: true,
    }),
  ],
});
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
    pretty: true,
  },

  // Cache for incremental builds
  cache: {
    enabled: true,
    directory: ".tw-obfuscation/cache",
    strategy: "merge",
  },
});
```

## Supported frameworks

The Vite plugin works with every Vite-based framework:

| Framework | Status |
| --------- | ------ |
| React     | Stable |
| Vue       | Stable |
| Svelte    | Stable |
| Solid     | Stable |
| Qwik      | Stable |
| Preact    | Stable |

## Development mode

By default the obfuscator is **disabled** in development (`vite dev`) so the dev experience stays normal. It activates automatically during `vite build`.

To force obfuscation in dev (not recommended for normal development):

```ts
TailwindObfuscator({
  // Force obfuscation even in dev
  refresh: true,
});
```

## Full example

```ts
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import TailwindObfuscator from "tailwindcss-obfuscator/vite";

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    TailwindObfuscator({
      prefix: "tw-",
      verbose: mode === "production",
      exclude: [
        "dark",
        "light",
        /^prose/, // Exclude Tailwind Typography
      ],
      mapping: {
        enabled: true,
        file: ".tw-obfuscation/class-mapping.json",
        pretty: mode !== "production",
      },
    }),
  ],
}));
```
