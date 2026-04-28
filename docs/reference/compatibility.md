# Tailwind CSS Class Obfuscation - Compatibility Matrix

## Overview

This document provides a comprehensive compatibility matrix for Tailwind CSS class obfuscation across different project types, frameworks, and class patterns.

## Project Type Support

| Project Type  | Tailwind v3 | Tailwind v4 | Extraction Method                 |
| ------------- | ----------- | ----------- | --------------------------------- |
| HTML Static   | ✅ Full     | ✅ Full     | Built-in extractors               |
| React/Next.js | ✅ Full     | ✅ Full     | Built-in JSX extractors           |
| Vue.js        | ✅ Full     | ✅ Full     | Built-in :class binding support   |
| Svelte        | ✅ Full     | ✅ Full     | Built-in class: directive support |
| SvelteKit     | ✅ Full     | ✅ Full     | Built-in extractors               |
| Astro         | ✅ Full     | ✅ Full     | Built-in class:list support       |
| Qwik          | ✅ Full     | ✅ Full     | Built-in class$ support           |
| Solid.js      | ✅ Full     | ✅ Full     | Built-in JSX extractors           |
| Remix         | ✅ Full     | ✅ Full     | Built-in JSX extractors           |
| Angular       | ✅ Partial  | ⚠️ Partial  | Requires custom patterns          |

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

| Configuration | Tailwind | Status       | Notes                    |
| ------------- | -------- | ------------ | ------------------------ |
| HTML Static   | v3       | ✅ **Works** | Full support             |
| Vite React    | v3       | ✅ **Works** | Full support             |
| Next.js       | v3       | ✅ **Works** | Full support             |
| HTML Static   | v4       | ✅ **Works** | CSS-first compatible     |
| Vite React    | v4       | ✅ **Works** | CSS-first compatible     |
| Next.js       | v4       | ✅ **Works** | CSS-first compatible     |
| SvelteKit     | v4       | ✅ **Works** | class: directive support |
| Astro         | v4       | ✅ **Works** | Full support             |
| Qwik          | v4       | ✅ **Works** | class attribute support  |

## Project-Specific Notes

### Lab Apps (unplugin-tailwindcss-mangle testing)

#### lab-mangle-tw3-html-static

- **Status**: ✅ Working
- Uses `tailwindcss-patch@^3.0.1` for extraction
- All HTML patterns fully supported
- CSS `@apply` fully supported

#### lab-mangle-tw3-vite-react

- **Status**: ✅ Working
- Uses `tailwindcss-patch@^3.0.1` for extraction
- React className patterns fully supported

#### lab-mangle-tw4-html-static

- **Status**: ❌ Failing
- Error: "Unable to locate Tailwind CSS config"
- `tailwindcss-patch` incompatible with Tailwind v4

#### lab-mangle-tw4-vite-react

- **Status**: ❌ Failing
- Error: "Unable to locate Tailwind CSS config"
- `tailwindcss-patch` incompatible with Tailwind v4

### Demo Apps

#### tailwind_v3_html_static

- Uses `tailwindcss-patch` for extraction
- All HTML patterns fully supported
- CSS `@apply` fully supported

#### tailwind_v4_html_static

- Uses custom extraction script
- All Tailwind v4 features supported
- Container queries work perfectly

#### tailwind_v3_react_nextjs

- Uses `tailwindcss-patch` for extraction
- Webpack plugin for obfuscation
- className patterns fully supported

#### tailwind_v4_react_nextjs

- Uses custom extraction script with JSX support
- All Tailwind v4 features supported
- Container queries and new v4 syntax work perfectly
