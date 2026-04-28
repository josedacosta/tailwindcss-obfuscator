# React Router (v7) — formerly Remix

Remix has merged into [React Router v7](https://reactrouter.com). Use the same Vite plugin as the other Vite-based React apps.

## Install

```bash
pnpm add -D tailwindcss-obfuscator
```

You also need React Router 7 itself, plus `@react-router/dev`, `@react-router/node`, and the platform adapter you target (`@react-router/serve`, `@react-router/cloudflare`, etc.).

## Configure Vite

`vite.config.ts`:

```ts
import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import tailwindCssObfuscator from "tailwindcss-obfuscator/vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
    reactRouter(),
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

> [!NOTE]
> The obfuscator is **opt-in for dev**. By default it only runs in `command === "build"`. Pass `refresh: true` to also activate it in `react-router dev` (rarely needed — most teams obfuscate only the production bundle).

## SSR pages

React Router v7's SSR builds emit obfuscated CSS in `build/server/assets/*.css` and the same obfuscated `tw-X` class names in the SSR-rendered HTML. The Vite phase covers both — no extra post-build hook needed.

## Source-side conventions

The same [static-class-only rule](./getting-started.md#static-classes-only) applies. Inside loader / action / component code:

- Static `className="..."` attributes ✅ obfuscated
- `cn()` / `clsx()` / `cva()` calls ✅ obfuscated
- Variant tables (`{ default: "bg-primary text-white", … }`) ✅ obfuscated
- Dynamic interpolation (`` `bg-${color}-500` ``) ❌ skipped — use a lookup map instead

## See also

- Sample app: [`apps/test-react-router`](https://github.com/josedacosta/tailwindcss-obfuscator/tree/main/apps/test-react-router)
- Vite plugin guide: [`/guide/vite`](./vite.md)
- Full options reference: [`/guide/options`](./options.md)
