# TanStack Router

The Vite plugin works out of the box with [TanStack Router](https://tanstack.com/router) (file-based or code-defined routes) and TanStack Start.

## Install

```bash
pnpm add -D tailwindcss-obfuscator
pnpm add @tanstack/react-router
```

## Configure Vite

`vite.config.ts`:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tailwindCssObfuscator from "tailwindcss-obfuscator/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    tailwindCssObfuscator({
      prefix: "tw-",
      preserve: { classes: ["no-obfuscate"] },
      mapping: {
        enabled: true,
        file: ".tw-obfuscation/class-mapping.json",
        pretty: 2,
      },
    }),
  ],
});
```

If you also use `@tanstack/router-plugin/vite` for file-based routes generation, add it _before_ `react()` and `tailwindCssObfuscator(…)`. The order matters — the obfuscator runs `enforce: "post"` so it always sees the final transformed output.

## `Link` `activeProps.className`

TanStack Router's `Link` component supports an `activeProps={ { className: "…" } }` prop. Those class strings are picked up by the AST transformer like any other JSX `className` value:

```tsx
<Link
  to="/about"
  className="rounded-lg bg-blue-600 px-4 py-2 text-white"
  activeProps={{ className: "ring-2 ring-blue-300" }}
>
  About
</Link>
```

Both `className` strings end up obfuscated.

## See also

- Sample app: [`apps/test-tanstack-start`](https://github.com/josedacosta/tailwindcss-obfuscator/tree/main/apps/test-tanstack-start)
- Vite plugin guide: [`/guide/vite`](./vite.md)
