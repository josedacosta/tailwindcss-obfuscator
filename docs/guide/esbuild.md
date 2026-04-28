---
outline: deep
---

# esbuild (standalone)

Use the `tailwindcss-obfuscator/esbuild` plugin in any esbuild script — no framework, no bundler chain, just esbuild's JS API or its CLI.

## Quick start

::: code-group

```bash [npm]
npm install -D tailwindcss-obfuscator esbuild
```

```bash [pnpm]
pnpm add -D tailwindcss-obfuscator esbuild
```

```bash [yarn]
yarn add -D tailwindcss-obfuscator esbuild
```

```bash [bun]
bun add -D tailwindcss-obfuscator esbuild
```

:::

```ts
// build.ts
import * as esbuild from "esbuild";
import TailwindObfuscator from "tailwindcss-obfuscator/esbuild";

await esbuild.build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  outdir: "dist",
  plugins: [TailwindObfuscator({ prefix: "tw-" })],
});
```

::: tip
esbuild only sees what's reachable from `entryPoints`. Make sure your CSS file is imported (or listed under `loader`) — otherwise the obfuscator has no CSS to rewrite.
:::

## Production configuration

```ts
TailwindObfuscator({
  prefix: "tw-",
  content: ["src/**/*.{html,js,jsx,ts,tsx}"],
  css: ["src/**/*.css"],
  preserve: { classes: ["dark", "light", "sr-only"] },
  mapping: {
    enabled: true,
    file: ".tw-obfuscation/class-mapping.json",
    pretty: 2,
  },
});
```

## Loading CSS in esbuild

esbuild needs to know how to handle `.css` imports. Two common setups:

### Inline CSS via `text` loader

```ts
await esbuild.build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  outdir: "dist",
  loader: { ".css": "css" },
  plugins: [TailwindObfuscator({ prefix: "tw-" })],
});
```

### CSS via PostCSS

If you generate Tailwind via `@tailwindcss/postcss`, run PostCSS in a watch step before esbuild and feed the resulting `.css` to esbuild's input. The obfuscator then rewrites the compiled CSS along with the JS bundle.

## Patterns the plugin handles

| Pattern                                                         | Status                            |
| --------------------------------------------------------------- | --------------------------------- |
| `className="flex items-center"` in a `.tsx` entry               | ✅ JSX/TSX entries                |
| `class="..."` in a static `.html` template processed by esbuild | ✅ HTML loader                    |
| `cn("flex", isActive && "ring-2")`                              | ✅ AST extraction                 |
| Imports of CSS files via `import "./styles.css"`                | ✅ obfuscated alongside JS        |
| Dynamic interpolation (`` `bg-${color}-500` ``)                 | ❌ left as-is — switch to ternary |

## Troubleshooting

::: warning Watch mode
If you use `esbuild.context()` for watch mode, the obfuscator runs on every rebuild. The `.tw-obfuscation/class-mapping.json` file is rewritten between runs — make sure your editor isn't holding a stale handle.
:::

::: tip Standalone CLI alternative
If your build pipeline doesn't fit cleanly into esbuild's plugin API, you can run the post-build CLI instead:

```bash
npx tw-obfuscator run --build-dir dist
```

It scans the existing `dist/` output and rewrites everything in place.
:::

## See also

- Sample app — [`apps/test-static-html`](https://github.com/josedacosta/tailwindcss-obfuscator/tree/main/apps/test-static-html) (esbuild + static HTML)
- [Options reference](./options.md)
- [Class utilities](./class-utilities.md)
