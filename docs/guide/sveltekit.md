# SvelteKit

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

SvelteKit uses Vite, so use the Vite plugin:

```ts
// vite.config.ts
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import TailwindObfuscator from "tailwindcss-obfuscator/vite";

export default defineConfig({
  plugins: [
    sveltekit(),
    TailwindObfuscator({
      prefix: "tw-",
      verbose: true,
    }),
  ],
});
```

## Svelte syntax

The plugin supports Svelte-specific syntax:

### `class` attribute

```svelte
<div class="flex items-center bg-blue-500">
  Content
</div>
```

### `class:` directive

```svelte
<script>
  let isActive = true
</script>

<div
  class="flex items-center"
  class:bg-blue-500={isActive}
  class:bg-gray-500={!isActive}
>
  Content
</div>
```

### Dynamic classes

```svelte
<script>
  let variant = 'primary'
  $: classes = variant === 'primary'
    ? 'bg-blue-500 text-white'
    : 'bg-gray-500 text-black'
</script>

<div class={classes}>
  Content
</div>
```

## Compatibility

| SvelteKit | Svelte | Status |
| --------- | ------ | ------ |
| 2.x       | 5.x    | Stable |
| 1.x       | 4.x    | Stable |

## Full example

```ts
// vite.config.ts
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import TailwindObfuscator from "tailwindcss-obfuscator/vite";

export default defineConfig(({ mode }) => ({
  plugins: [
    sveltekit(),
    TailwindObfuscator({
      prefix: "tw-",
      verbose: mode === "production",
      exclude: ["dark", "light"],
      mapping: {
        enabled: true,
        file: ".tw-obfuscation/class-mapping.json",
      },
    }),
  ],
}));
```
