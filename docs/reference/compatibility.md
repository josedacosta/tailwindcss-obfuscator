# Tailwind CSS Class Obfuscation - Compatibility Matrix

## Overview

This document provides a comprehensive compatibility matrix for Tailwind CSS class obfuscation across different project types, frameworks, and class patterns.

## Project Type Support

This summary indicates whether a project type is conceptually supported by the package's extractors and transformers. For the **actual list of versions exercised in CI** (the source of truth), jump to [`tailwindcss-obfuscator (our package)`](#tailwindcss-obfuscator-our-package) below.

| Project Type             | Tailwind v3 | Tailwind v4 | Extraction Method                   |
| ------------------------ | ----------- | ----------- | ----------------------------------- |
| HTML Static              | ✅ Full     | ✅ Full     | Built-in extractors                 |
| React / Next.js          | ✅ Full     | ✅ Full     | Built-in JSX extractors             |
| Vue 3                    | ✅ Full     | ✅ Full     | Built-in `:class` binding support   |
| Svelte 4 + 5 / SvelteKit | ✅ Full     | ✅ Full     | Built-in `class:` directive support |
| Astro                    | ✅ Full     | ✅ Full     | Built-in `class:list` support       |
| Qwik                     | ✅ Full     | ✅ Full     | Built-in `class$` support           |
| Solid.js                 | ✅ Full     | ✅ Full     | Built-in JSX extractors             |
| React Router (ex-Remix)  | ✅ Full     | ✅ Full     | Built-in JSX extractors             |
| TanStack Start / Router  | ✅ Full     | ✅ Full     | Built-in JSX extractors             |

## Class Pattern Support

### HTML Patterns

| Pattern       | Example                             | Extraction          | Obfuscation         |
| ------------- | ----------------------------------- | ------------------- | ------------------- |
| Double quotes | `class="bg-blue-500"`               | ✅                  | ✅                  |
| Single quotes | `class='bg-blue-500'`               | ✅                  | ✅                  |
| Multi-line    | `class="bg-blue-500\n  text-white"` | ✅                  | ✅                  |
| No quotes     | `class=bg-blue-500`                 | ✅ _(since v2.0.1)_ | ✅ _(since v2.0.1)_ |

### JSX/React Patterns

| Pattern                    | Example                                      | Extraction | Obfuscation |
| -------------------------- | -------------------------------------------- | ---------- | ----------- |
| String attribute           | `className="bg-blue-500"`                    | ✅         | ✅          |
| Single quotes              | `className='bg-blue-500'`                    | ✅         | ✅          |
| Braces with string         | `className={"bg-blue-500"}`                  | ✅         | ⚠️          |
| Template literal (static)  | ``className={`bg-blue-500`}``                | ✅         | ⚠️          |
| Template literal (dynamic) | ``className={`bg-${color}-500`}``            | ❌         | ❌          |
| Ternary                    | `className={active ? "bg-blue" : "bg-gray"}` | ✅\*       | ⚠️          |
| Variable                   | `className={styles}`                         | ❌         | ❌          |

\*Ternary works if both options are complete static strings

::: warning Why dynamic patterns (`bg-${color}-500`, `className={styles}`) cannot be extracted
The obfuscator extracts class names by **statically analysing source code at build time**. Anything resolved at runtime (template-literal interpolation, prop-bound variables) is invisible to it. Full explanation + workarounds in [Known Limitations § Dynamic template literals](./limitations#dynamic-template-literals-bg-color-500).
:::

### CSS Patterns

| Pattern           | Example                                     | Extraction | Obfuscation |
| ----------------- | ------------------------------------------- | ---------- | ----------- |
| @apply            | `@apply bg-blue-500 p-4;`                   | ✅         | ✅          |
| @layer components | `@layer components { .btn { @apply ... } }` | ✅         | ✅          |
| @theme (v4)       | `@theme { --color-primary: #3b82f6; }`      | N/A        | N/A         |

## Tailwind Feature Support

### Modifiers and Variants

| Feature      | Example                   | v3  | v4  |
| ------------ | ------------------------- | --- | --- |
| Responsive   | `sm:bg-blue-500`          | ✅  | ✅  |
| Dark mode    | `dark:bg-gray-800`        | ✅  | ✅  |
| Hover/Focus  | `hover:bg-blue-700`       | ✅  | ✅  |
| Active       | `active:bg-blue-800`      | ✅  | ✅  |
| Group hover  | `group-hover:opacity-100` | ✅  | ✅  |
| Peer states  | `peer-checked:block`      | ✅  | ✅  |
| First/Last   | `first:rounded-t-lg`      | ✅  | ✅  |
| Odd/Even     | `odd:bg-gray-50`          | ✅  | ✅  |
| Before/After | `before:content-['']`     | ✅  | ✅  |
| Important    | `!bg-green-500`           | ✅  | ✅  |
| Negative     | `-ml-4`                   | ✅  | ✅  |

### Tailwind v4 Specific Features

| Feature                  | Example                          | Extraction | Obfuscation |
| ------------------------ | -------------------------------- | ---------- | ----------- |
| Container queries        | `@container`                     | ✅         | ✅          |
| Named containers         | `@container/card`                | ✅         | ✅          |
| Container size variants  | `@lg:block`                      | ✅         | ✅          |
| Named container + size   | `@lg/card:text-2xl`              | ✅         | ✅          |
| Arbitrary container      | `@[500px]:flex`                  | ✅         | ✅          |
| Container min/max        | `@min-[400px]:grid`              | ✅         | ✅          |
| Extended container sizes | `@3xl:text-xl` to `@7xl:p-12`    | ✅         | ✅          |
| Data attributes          | `data-[state=open]:bg-green`     | ✅         | ✅          |
| ARIA states              | `aria-disabled:opacity-50`       | ✅         | ✅          |
| ARIA arbitrary           | `aria-[current=page]:font-bold`  | ✅         | ✅          |
| Supports queries         | `supports-[display:grid]:grid`   | ✅         | ✅          |
| Has variant              | `has-[:checked]:bg-blue-500`     | ✅         | ✅          |
| Not variant              | `not-first:mt-4`                 | ✅         | ✅          |
| Min/Max breakpoints      | `min-[320px]:flex`               | ✅         | ✅          |
| CSS variable shorthand   | `bg-(--my-color)`                | ✅         | ✅          |
| CSS var with type hint   | `bg-(color:--my-bg)`             | ✅         | ✅          |
| CSS var with opacity     | `bg-(--primary)/50`              | ✅         | ✅          |
| Group-data variants      | `group-data-[state=open]:block`  | ✅         | ✅          |
| Group-aria variants      | `group-aria-expanded:rotate-180` | ✅         | ✅          |
| Peer-data variants       | `peer-data-[checked]:bg-blue`    | ✅         | ✅          |
| Named group variants     | `group/sidebar:hover:bg-gray`    | ✅         | ✅          |
| Named peer variants      | `peer/input:focus:ring-2`        | ✅         | ✅          |
| Wildcard selector        | `*:flex`                         | ✅         | ✅          |
| Deep wildcard selector   | `**:text-sm`                     | ✅         | ✅          |
| In variants              | `in-hover:bg-blue-500`           | ✅         | ✅          |
| In with data attr        | `in-data-[state=open]:block`     | ✅         | ✅          |
| In with arbitrary        | `in-[.sidebar]:bg-gray-100`      | ✅         | ✅          |
| nth variants             | `nth-2:bg-gray-100`              | ✅         | ✅          |
| nth arbitrary            | `nth-[2n+1]:bg-gray-50`          | ✅         | ✅          |
| nth-last variants        | `nth-last-2:mb-0`                | ✅         | ✅          |
| nth-of-type variants     | `nth-of-type-2:text-lg`          | ✅         | ✅          |
| Starting style           | `starting:opacity-0`             | ✅         | ✅          |
| Forced colors            | `forced-colors:outline`          | ✅         | ✅          |
| Not forced colors        | `not-forced-colors:shadow-lg`    | ✅         | ✅          |
| Trailing important       | `flex!`                          | ✅         | ✅          |
| Arbitrary variants       | `[&_p]:text-blue-500`            | ✅         | ✅          |
| Arbitrary media          | `[@media(min-width:640px)]:flex` | ✅         | ✅          |
| Arbitrary supports       | `[@supports(display:grid)]:grid` | ✅         | ✅          |
| Extended breakpoints     | `3xl:flex` to `7xl:hidden`       | ✅         | ✅          |
| User interaction states  | `user-valid:border-green-500`    | ✅         | ✅          |
| Inert state              | `inert:opacity-50`               | ✅         | ✅          |
| Pointer device queries   | `pointer-fine:cursor-pointer`    | ✅         | ✅          |
| Optional form state      | `optional:border-gray-300`       | ✅         | ✅          |
| Small container sizes    | `@3xs:flex`, `@2xs:grid`         | ✅         | ✅          |

### Arbitrary Values

| Feature            | Example                | Extraction | Obfuscation |
| ------------------ | ---------------------- | ---------- | ----------- |
| Arbitrary color    | `bg-[#1da1f2]`         | ✅         | ✅          |
| Arbitrary spacing  | `p-[13px]`             | ✅         | ✅          |
| Arbitrary property | `[color:red]`          | ✅         | ✅          |
| CSS functions      | `bg-[url('/img.png')]` | ✅         | ✅          |
| calc()             | `w-[calc(100%-20px)]`  | ✅         | ✅          |
| CSS variables      | `bg-[var(--my-color)]` | ✅         | ✅          |

### Opacity Modifiers

| Feature           | Example             | v3  | v4  |
| ----------------- | ------------------- | --- | --- |
| Standard opacity  | `bg-blue-500/50`    | ✅  | ✅  |
| Arbitrary opacity | `bg-blue-500/[.25]` | ✅  | ⚠️  |

### Gradients

| Feature          | Example         | v3  | v4  |
| ---------------- | --------------- | --- | --- |
| from-\*          | `from-blue-500` | ✅  | ✅  |
| via-\*           | `via-pink-500`  | ✅  | ✅  |
| to-\*            | `to-purple-500` | ✅  | ✅  |
| Percentage stops | `from-10%`      | ✅  | ✅  |

## Utility Library Support

| Library           | Example                                 | Extraction | Obfuscation |
| ----------------- | --------------------------------------- | ---------- | ----------- |
| clsx              | `clsx('bg-blue', {'text-white': true})` | ✅         | ✅          |
| classnames        | `classnames('a', 'b')`                  | ✅         | ✅          |
| tailwind-merge    | `twMerge('p-4', 'p-2')`                 | ✅         | ✅          |
| cn (shadcn/ui)    | `cn('bg-blue', className)`              | ✅         | ✅          |
| CVA               | `cva('base', { variants })`             | ✅         | ✅          |
| tailwind-variants | `tv({ base: 'px-4' })`                  | ✅         | ✅          |

**Note**: All static string arguments in these libraries are fully extractable, including:

- Base classes: `cva("flex items-center")`
- Variant classes: `variants: { size: { sm: "text-sm" } }`
- Compound variants: `compoundVariants: [{ class: "font-bold" }]`
- Slots (tailwind-variants): `slots: { base: "rounded-lg" }`

Dynamic class construction (e.g., `bg-${color}-500`) is not supported.

## DOM Manipulation

| Pattern          | Example                           | Extraction | Obfuscation |
| ---------------- | --------------------------------- | ---------- | ----------- |
| classList.add    | `el.classList.add('bg-blue-500')` | ⚠️         | ⚠️          |
| classList.toggle | `el.classList.toggle('active')`   | ⚠️         | ⚠️          |
| className =      | `el.className = 'bg-blue-500'`    | ⚠️         | ⚠️          |
| setAttribute     | `el.setAttribute('class', '...')` | ⚠️         | ⚠️          |

## Legend

| Symbol | Meaning                         |
| ------ | ------------------------------- |
| ✅     | Fully supported                 |
| ⚠️     | Partial support / requires care |
| ❌     | Not supported                   |
| N/A    | Not applicable                  |

## Recommendations

### For Maximum Compatibility

1. **Use complete static class strings** - Avoid dynamic class construction
2. **Prefer ternary operators** - `isActive ? "bg-blue" : "bg-gray"` over template interpolation
3. **Use object mapping** - Map state to complete class strings
4. **Avoid utility libraries with dynamic logic** - Or ensure all classes are also used statically somewhere

### Class Pattern Examples

```tsx
// ✅ GOOD - All classes are static and extractable
const variants = {
  primary: "bg-blue-500 text-white hover:bg-blue-600",
  secondary: "bg-gray-500 text-white hover:bg-gray-600",
};

<button className={variants[variant]}>Click</button>

// ❌ BAD - Dynamic class construction
<button className={`bg-${color}-500 hover:bg-${color}-600`}>Click</button>
```

## Package Compatibility

### tailwindcss-patch + unplugin-tailwindcss-mangle

| Configuration | Tailwind | Status       | Notes                          |
| ------------- | -------- | ------------ | ------------------------------ |
| HTML Static   | v3       | ✅ **Works** | Use `tailwindcss-patch@^3.0.1` |
| Vite React    | v3       | ✅ **Works** | Use `tailwindcss-patch@^3.0.1` |
| Next.js       | v3       | ✅ **Works** | Use webpack plugin config      |
| HTML Static   | v4       | ❌ **Fails** | No tailwind.config.js          |
| Vite React    | v4       | ❌ **Fails** | No tailwind.config.js          |
| Next.js       | v4       | ❌ **Fails** | No tailwind.config.js          |

**Critical**: `tailwindcss-patch` requires `tailwind.config.js` which doesn't exist in Tailwind v4's CSS-first architecture.

See `docs/lab_tailwindcss_patch_analysis.md` for detailed analysis.

### tailwindcss-obfuscator (our package)

This is the live, source-of-truth matrix for the package. Every row corresponds to a real, executed test app under [`apps/`](https://github.com/josedacosta/tailwindcss-obfuscator/tree/main/apps) — built and verified at every release via [`scripts/verify-obfuscation.mjs`](https://github.com/josedacosta/tailwindcss-obfuscator/blob/main/scripts/verify-obfuscation.mjs) (which the CI runs).

| Framework / Project Type    | Tested Version         | Tailwind | Bundler              | Test App                                           |
| --------------------------- | ---------------------- | -------- | -------------------- | -------------------------------------------------- |
| **Next.js** (App Router)    | 16.2.4                 | v4       | Webpack / Turbopack  | `apps/test-nextjs`                                 |
| **Next.js** (legacy v3)     | 16.2.4                 | v3       | Webpack              | `apps/tailwind_v3_react_nextjs`                    |
| **Next.js + shadcn/ui**     | 16.2.4                 | v4       | Webpack              | `apps/test-shadcn-ui`                              |
| **Nuxt**                    | 4.4.2                  | v4       | Vite                 | `apps/test-nuxt`                                   |
| **SvelteKit + Svelte 5**    | 2.58.0 (Svelte 5.55.5) | v4       | Vite                 | `apps/test-sveltekit`                              |
| **Astro**                   | 6.1.9                  | v4       | Vite                 | `apps/test-astro`                                  |
| **Solid.js**                | 1.9.12                 | v4       | Vite                 | `apps/test-solidjs`                                |
| **Qwik**                    | 1.19.2                 | v4       | Vite                 | `apps/test-qwik`                                   |
| **React Router** (ex-Remix) | 7.14.2                 | v4       | Vite                 | `apps/test-react-router`                           |
| **TanStack Start**          | 1.168.25               | v4       | Vite                 | `apps/test-tanstack-start`                         |
| **React + Vite**            | 19.1.0                 | v4       | Vite 8.x             | `apps/test-vite-react`                             |
| **React + Vite (TW v3)**    | 19.0.0                 | v3       | Vite 8.x             | `apps/test-tailwind-v3`                            |
| **React + Vite (TW v4)**    | 19.0.0                 | v4       | Vite 8.x             | `apps/test-tailwind-v4`                            |
| **Vue 3 + Vite**            | 3.5.14                 | v4       | Vite 8.x             | `apps/test-vite-vue`                               |
| **Static HTML (TW v3)**     | n/a                    | v3       | Vite                 | `apps/tailwind_v3_html_static`                     |
| **Static HTML (TW v4)**     | n/a                    | v4       | Vite                 | `apps/tailwind_v4_html_static`                     |
| **Static HTML + esbuild**   | n/a                    | v4       | esbuild ≥ 0.28       | `apps/test-static-html`                            |
| **Rollup standalone**       | n/a                    | v4       | Rollup ^4.60         | `apps/test-rollup-standalone`                      |
| **Webpack standalone**      | n/a                    | v4       | Webpack ^5.106       | `apps/test-webpack-standalone`                     |
| **Rspack standalone**       | n/a                    | v4       | @rspack/core ≥1.7.11 | _no test app — adapter exercised by tarball-smoke_ |
| **Farm standalone**         | n/a                    | v4       | @farmfe/core ≥1.7.11 | _no test app — adapter exercised by tarball-smoke_ |

**How to read this table:** the "Tested Version" column shows the exact upper-bound version exercised on the CI. Lower versions of the same major typically work but are not in the test matrix and may regress without us catching it. If you need a guarantee, open an issue and we'll add a test app for your specific version.

### Version-range claims vs. tested baselines

Some README cells advertise a wider range than the actual test matrix below. The README cells reflect the package's design intent (the plugin core is bundler-agnostic and most reasonable versions should work) ; the matrix above reflects only what we actually exercise. If a wider range matters to you, here is the gap :

| README claim                | Actually tested in CI                      | Untested versions                             |
| --------------------------- | ------------------------------------------ | --------------------------------------------- |
| Next.js v13 → v16           | v16.2.4 only                               | v13, v14, v15 (App Router + Pages Router)     |
| Nuxt v3 + v4                | v4.4.2 only                                | v3.x                                          |
| SvelteKit v2 (Svelte v4+v5) | v2.58.0 + Svelte 5.55.5 only               | Svelte v4.x (pre-runes)                       |
| Astro v4 → v6               | v6.1.9 only                                | v4.x, v5.x                                    |
| Vite v4 → v8                | v8.x only                                  | v4, v5, v6, v7                                |
| Vue v3.5+                   | v3.5.14 only                               | other v3.5 / v3.6 patches as they ship        |
| Webpack v5                  | v5.106.x only (in test-webpack-standalone) | older v5 minors (rare in greenfield projects) |

We track these gaps in [issue: phase-2 test apps coverage](https://github.com/josedacosta/tailwindcss-obfuscator/issues) — contributions welcome.
