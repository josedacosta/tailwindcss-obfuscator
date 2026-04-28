# Nuxt

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
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ["tailwindcss-obfuscator/nuxt"],

  tailwindcssObfuscator: {
    prefix: "tw-",
    verbose: true,
  },
});
```

## Options

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ["tailwindcss-obfuscator/nuxt"],

  tailwindcssObfuscator: {
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
  },
});
```

## Compatibility

| Nuxt | Status |
| ---- | ------ |
| 3.x  | Stable |

## Development mode

By default the obfuscator is disabled in development (`nuxt dev`) and active during `nuxt build`.

## Full example

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ["@nuxtjs/tailwindcss", "tailwindcss-obfuscator/nuxt"],

  tailwindcssObfuscator: {
    prefix: "tw-",
    verbose: true,
    exclude: ["dark", "light", /^prose/],
    mapping: {
      enabled: true,
      file: ".tw-obfuscation/class-mapping.json",
    },
  },

  // Tailwind config
  tailwindcss: {
    cssPath: "~/assets/css/tailwind.css",
  },
});
```
