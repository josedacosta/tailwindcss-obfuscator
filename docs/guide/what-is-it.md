# What is tailwindcss-obfuscator?

**tailwindcss-obfuscator** is a build-time tool that transforms your Tailwind CSS class names into short, cryptic identifiers to protect your CSS intellectual property.

## The Problem

When you build a website with Tailwind CSS, your class names are fully readable in the browser's DevTools:

```html
<div
  class="flex items-center justify-between rounded-lg bg-white p-4 shadow-md transition-shadow hover:shadow-lg"
>
  <h1 class="text-xl font-bold text-gray-900">Dashboard</h1>
  <button class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">Save</button>
</div>
```

This reveals:

- Your design system structure
- Component styling patterns
- Responsive breakpoints used
- State management approach (hover, focus, etc.)

## The Solution

tailwindcss-obfuscator transforms these classes at build time:

```html
<div class="tw-a tw-b tw-c tw-d tw-e tw-f tw-g tw-h tw-i">
  <h1 class="tw-j tw-k tw-l">Dashboard</h1>
  <button class="tw-m tw-n tw-o tw-p tw-q tw-r">Save</button>
</div>
```

The CSS is also transformed:

```css
/* Before */
.bg-blue-500 {
  background-color: rgb(59 130 246);
}
.hover\:bg-blue-600:hover {
  background-color: rgb(37 99 235);
}

/* After */
.tw-o {
  background-color: rgb(59 130 246);
}
.tw-r:hover {
  background-color: rgb(37 99 235);
}
```

## Key Features

### Zero Runtime Cost

All obfuscation happens during the build process. There's no JavaScript overhead or performance penalty in production.

### Framework Agnostic

Works with any framework through [unplugin](https://github.com/unjs/unplugin):

- Vite (React, Vue, Svelte, Solid, Qwik)
- Webpack (Next.js)
- Rollup
- esbuild

### Smart Class Detection

Automatically detects Tailwind classes in:

- `className` and `class` attributes
- `cn()`, `clsx()`, `classnames()` utilities
- `cva()` from class-variance-authority
- `twMerge()` from tailwind-merge
- Template literals and conditional expressions

### Tailwind v3 & v4 Support

Works with both:

- **Tailwind v3**: Config-based with `tailwind.config.js`
- **Tailwind v4**: CSS-first with `@import "tailwindcss"`

### Persistent Mapping

Class mappings are saved and reused across builds:

- Consistent obfuscated names between builds
- Merge strategy for incremental updates
- JSON output for debugging

## What It Doesn't Do

- **Runtime obfuscation**: Classes must be static strings, not dynamically constructed
- **Dynamic class names**: `bg-${color}-500` won't work (use conditional classes instead)
- **Third-party CSS**: Only Tailwind utility classes are obfuscated

## Comparison

| Feature            | tailwindcss-obfuscator | tailwindcss-mangle |
| ------------------ | ---------------------- | ------------------ |
| Tailwind v4        | Yes                    | No                 |
| Patching required  | No                     | Yes                |
| Build tool support | All (unplugin)         | Vite, Webpack      |
| Active development | Yes                    | Limited            |
