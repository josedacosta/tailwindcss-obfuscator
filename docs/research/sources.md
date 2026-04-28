# Tailwind CSS Documentation

This document catalogs all sources of Tailwind CSS documentation and patterns that need to be considered for `tailwindcss-obfuscator` compatibility.

## Official Documentation

### Primary Documentation Site

| Resource                   | URL                                                       | Purpose                                  |
| -------------------------- | --------------------------------------------------------- | ---------------------------------------- |
| **Main Docs**              | https://tailwindcss.com/docs                              | Complete reference for all utilities     |
| **Installation Guides**    | https://tailwindcss.com/docs/installation                 | Framework-specific setup instructions    |
| **Functions & Directives** | https://tailwindcss.com/docs/functions-and-directives     | `@apply`, `@layer`, `@config`, etc.      |
| **Configuration**          | https://tailwindcss.com/docs/configuration                | `tailwind.config.js` options             |
| **Theme Configuration**    | https://tailwindcss.com/docs/theme                        | Customizing the default theme            |
| **Responsive Design**      | https://tailwindcss.com/docs/responsive-design            | Breakpoint prefixes (`sm:`, `md:`, etc.) |
| **Dark Mode**              | https://tailwindcss.com/docs/dark-mode                    | `dark:` variant usage                    |
| **Hover, Focus & States**  | https://tailwindcss.com/docs/hover-focus-and-other-states | State variants                           |
| **Plugins**                | https://tailwindcss.com/docs/plugins                      | Official and community plugins           |

### Framework Integration Guides

| Framework | URL                                                                  |
| --------- | -------------------------------------------------------------------- |
| Vite      | https://tailwindcss.com/docs/installation/using-vite                 |
| Next.js   | https://tailwindcss.com/docs/installation/framework-guides#nextjs    |
| Nuxt      | https://tailwindcss.com/docs/installation/framework-guides#nuxt      |
| SvelteKit | https://tailwindcss.com/docs/installation/framework-guides#sveltekit |
| Astro     | https://tailwindcss.com/docs/installation/framework-guides#astro     |
| Remix     | https://tailwindcss.com/docs/installation/framework-guides#remix     |
| Laravel   | https://tailwindcss.com/docs/installation/framework-guides#laravel   |

### Blog & Changelog

| Resource      | URL                                    | Purpose                     |
| ------------- | -------------------------------------- | --------------------------- |
| **Blog**      | https://tailwindcss.com/blog           | New features, announcements |
| **Changelog** | https://tailwindcss.com/plus/changelog | Detailed version changes    |

---

## GitHub Resources

### Official Repositories

| Repository       | URL                                                     | Purpose                       |
| ---------------- | ------------------------------------------------------- | ----------------------------- |
| **Tailwind CSS** | https://github.com/tailwindlabs/tailwindcss             | Main source code              |
| **Releases**     | https://github.com/tailwindlabs/tailwindcss/releases    | Version history               |
| **Issues**       | https://github.com/tailwindlabs/tailwindcss/issues      | Bug reports, feature requests |
| **Discussions**  | https://github.com/tailwindlabs/tailwindcss/discussions | Community Q&A                 |

### Related Official Packages

| Package                            | URL                                                           | Purpose                  |
| ---------------------------------- | ------------------------------------------------------------- | ------------------------ |
| **@tailwindcss/typography**        | https://github.com/tailwindlabs/tailwindcss-typography        | Prose styling plugin     |
| **@tailwindcss/forms**             | https://github.com/tailwindlabs/tailwindcss-forms             | Form element styling     |
| **@tailwindcss/aspect-ratio**      | https://github.com/tailwindlabs/tailwindcss-aspect-ratio      | Aspect ratio utilities   |
| **@tailwindcss/container-queries** | https://github.com/tailwindlabs/tailwindcss-container-queries | Container query support  |
| **Headless UI**                    | https://github.com/tailwindlabs/headlessui                    | Accessible UI components |

---

## Tailwind v4 Specific Resources

### CSS-First Architecture

| Topic                     | URL                                                         | Patterns to Check          |
| ------------------------- | ----------------------------------------------------------- | -------------------------- |
| **v4 Beta Announcement**  | https://tailwindcss.com/blog/tailwindcss-v4-beta            | New CSS-first approach     |
| **v4 Upgrade Guide**      | https://tailwindcss.com/docs/upgrade-guide                  | Migration patterns         |
| **@theme Directive**      | https://tailwindcss.com/docs/functions-and-directives#theme | Theme customization in CSS |
| **@import "tailwindcss"** | https://tailwindcss.com/docs/installation                   | New import syntax          |

### New v4 Features

| Feature           | Pattern Examples                        |
| ----------------- | --------------------------------------- |
| Container Queries | `@container`, `@lg:`, `@container/name` |
| Named Containers  | `@lg/sidebar:hidden`                    |
| ARIA Variants     | `aria-disabled:opacity-50`              |
| Data Attributes   | `data-[state=open]:bg-green-500`        |
| Group/Peer Naming | `group/item`, `peer/input`              |

---

## Class Pattern Categories to Support

### Basic Patterns

```html
<!-- Static class strings -->
<div class="flex items-center justify-between">
  <div class="bg-blue-500 text-white">
    <!-- Multi-line -->
    <div class="flex items-center bg-blue-500"></div>
  </div>
</div>
```

### JSX/React Patterns

```jsx
// String literal
<div className="flex items-center">

// Template literal (static)
<div className={`flex items-center`}>

// Ternary
<div className={isActive ? "bg-blue-500" : "bg-gray-500"}>

// Logical AND
<div className={isVisible && "block"}>

// Array join
<div className={["flex", "items-center"].join(" ")}>
```

### Utility Function Patterns

```jsx
// clsx / classnames
<div className={clsx("flex", { "bg-blue-500": isActive })}>

// cn (shadcn/ui)
<div className={cn("flex", className)}>

// tailwind-merge
<div className={twMerge("p-4", customPadding)}>

// cva (class-variance-authority)
const button = cva("px-4 py-2", {
  variants: {
    intent: {
      primary: "bg-blue-500",
      secondary: "bg-gray-500"
    }
  }
});

// tailwind-variants (tv)
const button = tv({
  base: "px-4 py-2",
  variants: {
    color: {
      primary: "bg-blue-500"
    }
  }
});
```

### CSS Directive Patterns

```css
/* @apply directive */
.btn {
  @apply rounded-lg px-4 py-2;
}

/* @layer components */
@layer components {
  .card {
    @apply rounded-xl p-6 shadow-lg;
  }
}

/* @layer utilities */
@layer utilities {
  .text-shadow {
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  }
}

/* Tailwind v4 @theme */
@theme {
  --color-primary: #3b82f6;
  --spacing-18: 4.5rem;
}
```

### Variant Patterns

```html
<!-- Responsive -->
<div class="sm:flex md:grid lg:hidden xl:block 2xl:inline">

<!-- Dark mode -->
<div class="dark:bg-gray-900 dark:text-white">

<!-- State variants -->
<div class="hover:bg-blue-600 focus:ring-2 active:bg-blue-800">

<!-- Group/Peer -->
<div class="group">
  <span class="group-hover:text-blue-500">
</div>

<!-- First/Last/Odd/Even -->
<li class="first:rounded-t-lg last:rounded-b-lg odd:bg-gray-50">

<!-- Before/After -->
<div class="before:content-[''] after:absolute">

<!-- Arbitrary variants -->
<div class="[&>*]:p-4 [&:nth-child(3)]:bg-blue-500">
```

### Arbitrary Value Patterns

```html
<!-- Arbitrary colors -->
<div class="bg-[#1da1f2] text-[rgb(255,0,0)]">
  <!-- Arbitrary spacing -->
  <div class="m-[2.5rem] gap-[clamp(1rem,5vw,3rem)] p-[13px]">
    <!-- Arbitrary properties -->
    <div class="[clip-path:circle(50%)] [mask-image:linear-gradient(...)]">
      <!-- CSS variables -->
      <div class="bg-[var(--my-color)] text-[length:var(--font-size)]">
        <!-- calc() -->
        <div class="h-[calc(100vh-64px)] w-[calc(100%-2rem)]"></div>
      </div>
    </div>
  </div>
</div>
```

### Modifier Patterns

```html
<!-- Important modifier -->
<div class="!mt-0 !bg-blue-500">
  <!-- Negative values -->
  <div class="-ml-4 -mt-2 -translate-x-full -rotate-45">
    <!-- Opacity modifier -->
    <div class="border-white/[.25] bg-blue-500/50 text-black/75">
      <!-- Gradient stops -->
      <div class="from-blue-500 via-purple-500 to-pink-500">
        <div class="from-10% via-30% to-90%"></div>
      </div>
    </div>
  </div>
</div>
```

### Framework-Specific Patterns

```svelte
<!-- Svelte class: directive -->
<div class:bg-red-500={isActive} class:flex>

<!-- Svelte class:list -->
<div class:list={["flex", isActive && "bg-blue-500"]}>
```

```vue
<!-- Vue :class binding -->
<div :class="{ 'bg-blue-500': isActive }">
<div :class="['flex', isActive ? 'bg-blue' : 'bg-gray']">
```

```astro
<!-- Astro class:list -->
<div class:list={["flex", { "bg-blue-500": isActive }]}>
```

```tsx
// Qwik class attribute
<div class="flex items-center">
<div class={`flex ${isActive ? 'bg-blue-500' : ''}`}>
```

---

## Community Resources

### Learning Platforms

| Resource              | URL                                   | Type                   |
| --------------------- | ------------------------------------- | ---------------------- |
| Tailwind Labs YouTube | https://www.youtube.com/@TailwindLabs | Video tutorials        |
| Tailwind Play         | https://play.tailwindcss.com          | Interactive playground |
| Tailwind UI           | https://tailwindui.com                | Component examples     |

### Third-Party Documentation

| Resource    | URL                    | Purpose                    |
| ----------- | ---------------------- | -------------------------- |
| shadcn/ui   | https://ui.shadcn.com  | Component library patterns |
| Flowbite    | https://flowbite.com   | Component patterns         |
| DaisyUI     | https://daisyui.com    | Component plugin           |
| Headless UI | https://headlessui.com | Accessible components      |

### IDE Integration

| IDE      | Resource                            |
| -------- | ----------------------------------- |
| VS Code  | Tailwind CSS IntelliSense extension |
| WebStorm | Built-in Tailwind support           |
| Neovim   | tailwindcss-language-server         |

---

## Pattern Compatibility Checklist

### Must Support (Critical)

- [x] Static class strings (single/double quotes)
- [x] className attribute (React)
- [x] class attribute (HTML, Vue, Svelte, Qwik, Astro)
- [x] @apply directive
- [x] @layer components/utilities
- [x] All responsive prefixes
- [x] Dark mode variants
- [x] Hover/Focus/Active states
- [x] Arbitrary values `[...]`
- [x] Opacity modifiers `/50`
- [x] Negative values `-ml-4`
- [x] Important modifier `!`

### Should Support (Important)

- [x] Template literals (static parts)
- [x] Ternary expressions
- [x] clsx/classnames arguments
- [x] cn() function (shadcn/ui)
- [x] twMerge() function
- [x] cva() patterns
- [x] Svelte class: directive
- [x] Group/Peer variants
- [x] Container queries

### Nice to Have

- [ ] Dynamic class construction (limited support)
- [ ] tailwind-variants (tv)
- [ ] Computed class objects
- [ ] classList.add/remove

---

## Testing Strategy

### For Each Pattern Category

1. **Extraction Test**: Can we find these classes in source files?
2. **Transformation Test**: Can we replace them in output?
3. **CSS Selector Test**: Are CSS selectors updated correctly?
4. **Source Map Test**: Do source maps remain accurate?

### Test Files Needed

```
tests/
├── patterns/
│   ├── html-patterns.test.ts
│   ├── jsx-patterns.test.ts
│   ├── vue-patterns.test.ts
│   ├── svelte-patterns.test.ts
│   ├── css-directives.test.ts
│   ├── utility-functions.test.ts
│   ├── arbitrary-values.test.ts
│   └── variants.test.ts
```

---

## Resources to Monitor

### For New Features

- https://github.com/tailwindlabs/tailwindcss/releases
- https://tailwindcss.com/blog
- https://twitter.com/tailwindcss

### For Community Patterns

- https://github.com/aniftyco/awesome-tailwindcss
- https://github.com/topics/tailwindcss
- Stack Overflow: tailwind-css tag

---

## Advanced Pattern Discovery

### Layout Patterns (from docs)

| Pattern              | Classes                                   | Source          |
| -------------------- | ----------------------------------------- | --------------- |
| Centered Container   | `max-w-4xl mx-auto`                       | staticmania.com |
| Flex Layout          | `flex items-center justify-between gap-4` | kombai.com      |
| Grid Layout          | `grid grid-cols-3 gap-6`                  | telerik.com     |
| Absolute Positioning | `absolute top-0 right-0 bottom-0 left-0`  | telerik.com     |
| Fixed Header         | `fixed top-0 inset-x-0`                   | tailwindcss.com |
| Sticky Sidebar       | `sticky top-0`                            | tailwindcss.com |

### Typography Patterns

| Pattern                   | Classes                                                                      |
| ------------------------- | ---------------------------------------------------------------------------- |
| Prose (Typography plugin) | `prose prose-lg prose-blue`                                                  |
| Text truncation           | `truncate`, `line-clamp-3`                                                   |
| Text gradients            | `bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent` |
| Writing modes             | `[writing-mode:vertical-rl]`                                                 |
| Text shadows              | `[text-shadow:2px_2px_4px_rgba(0,0,0,0.5)]`                                  |

### Animation Patterns

| Pattern             | Classes                                           |
| ------------------- | ------------------------------------------------- |
| Transitions         | `transition-all duration-300 ease-in-out`         |
| Transforms          | `transform hover:scale-105 hover:-translate-y-1`  |
| Keyframe animations | `animate-spin`, `animate-pulse`, `animate-bounce` |
| Custom animations   | `animate-[wiggle_1s_ease-in-out_infinite]`        |

### Form Patterns

| Pattern         | Classes                                                        |
| --------------- | -------------------------------------------------------------- |
| Input styling   | `border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500` |
| Checkbox custom | `appearance-none checked:bg-blue-500`                          |
| Range slider    | `accent-blue-500`                                              |
| Form validation | `invalid:border-red-500 valid:border-green-500`                |

### Interactive Patterns

| Pattern        | Classes                                                       |
| -------------- | ------------------------------------------------------------- |
| Dropdown menus | `group`, `group-hover:block`, `invisible group-hover:visible` |
| Modals         | `fixed inset-0 bg-black/50 backdrop-blur-sm`                  |
| Tooltips       | `peer`, `peer-hover:opacity-100`                              |
| Accordions     | `open:rotate-180`, `details`, `summary`                       |

### Pseudo-Element Patterns

| Pattern        | Example                                           |
| -------------- | ------------------------------------------------- |
| Before/After   | `before:content-[''] before:absolute`             |
| First-letter   | `first-letter:text-7xl first-letter:font-bold`    |
| Selection      | `selection:bg-blue-500 selection:text-white`      |
| Placeholder    | `placeholder:text-gray-400 placeholder:italic`    |
| File input     | `file:mr-4 file:py-2 file:px-4 file:rounded-full` |
| Marker (lists) | `marker:text-blue-500`                            |

### State Patterns

| State            | Variants                                              |
| ---------------- | ----------------------------------------------------- |
| User interaction | `hover:`, `focus:`, `active:`, `visited:`             |
| Form states      | `disabled:`, `enabled:`, `checked:`, `indeterminate:` |
| Validity         | `valid:`, `invalid:`, `required:`, `optional:`        |
| Parent states    | `group-hover:`, `group-focus:`, `group-active:`       |
| Sibling states   | `peer-hover:`, `peer-focus:`, `peer-checked:`         |
| Child states     | `has-[:checked]:`, `has-[>img]:`                      |

### Print & Media Patterns

| Pattern            | Classes                                                     |
| ------------------ | ----------------------------------------------------------- |
| Print styles       | `print:hidden`, `print:text-black`                          |
| Motion preferences | `motion-reduce:transition-none`, `motion-safe:animate-spin` |
| Contrast           | `contrast-more:border-2`, `contrast-less:opacity-75`        |
| Portrait/Landscape | `portrait:hidden`, `landscape:flex`                         |

### RTL/LTR Patterns

| Pattern            | Classes                                    |
| ------------------ | ------------------------------------------ |
| Logical properties | `ms-4` (margin-start), `me-4` (margin-end) |
| Direction-aware    | `rtl:space-x-reverse`, `ltr:ml-4`          |
| Start/End          | `start-0`, `end-0`, `ps-4`, `pe-4`         |

### Container Query Patterns (v4)

```html
<!-- Named containers -->
<div class="@container/main">
  <div class="@lg/main:flex @md/main:grid">
    <!-- Size containers -->
    <div class="@container">
      <div class="@lg:text-xl @md:text-lg @sm:text-base">
        <!-- Container with min/max -->
        <div class="@[320px]:flex @[768px]:grid"></div>
      </div>
    </div>
  </div>
</div>
```

### Data Attribute Patterns (v4)

```html
<!-- State-based -->
<div data-state="open" class="data-[state=open]:bg-green-500">
  <div data-selected class="data-[selected]:ring-2">
    <!-- Boolean attributes -->
    <button data-loading class="data-[loading]:opacity-50">
      <!-- Parent data attributes -->
      <div data-theme="dark" class="group">
        <span class="group-data-[theme=dark]:text-white"></span>
      </div>
    </button>
  </div>
</div>
```

### ARIA Patterns (v4)

```html
<button aria-pressed="true" class="aria-pressed:bg-blue-500">
  <input aria-invalid="true" class="aria-invalid:border-red-500" />
  <div aria-hidden="true" class="aria-hidden:opacity-0">
    <nav aria-current="page" class="aria-[current=page]:font-bold"></nav>
  </div>
</button>
```

### Supports Patterns

```html
<!-- Feature detection -->
<div class="supports-[display:grid]:grid">
  <div class="supports-[backdrop-filter]:backdrop-blur-sm">
    <!-- Not supports -->
    <div class="not-supports-[display:grid]:flex"></div>
  </div>
</div>
```

---

## Regex Patterns for Extraction

### HTML/JSX Class Detection

```javascript
// Double/single quotes
/class(?:Name)?=["']([^"']+)["']/g

// Template literals
/class(?:Name)?=\{`([^`]+)`\}/g

// Ternary in braces
/class(?:Name)?=\{[^}]*\?[\s]*["']([^"']+)["'][\s]*:[\s]*["']([^"']+)["'][^}]*\}/g
```

### CSS Directive Detection

```javascript
// @apply
/@apply\s+([^;]+);/g

// @layer components/utilities
/@layer\s+(components|utilities)\s*\{([^}]+)\}/g

// @theme
/@theme\s*\{([^}]+)\}/g
```

### Utility Function Detection

```javascript
// clsx, classnames, cn, twMerge
/(?:clsx|classnames|cn|twMerge)\s*\(\s*["'`]([^"'`]+)["'`]/g

// cva base classes
/cva\s*\(\s*["'`]([^"'`]+)["'`]/g
```

---

## Documentation Update Workflow

1. **Weekly**: Check https://github.com/tailwindlabs/tailwindcss/releases
2. **Monthly**: Review https://tailwindcss.com/blog for new patterns
3. **Per release**: Update compatibility matrix
4. **Quarterly**: Audit all pattern categories

---

## Next Steps

1. **Audit each pattern category** against our current implementation
2. **Add missing pattern tests** to our test suite
3. **Document unsupported patterns** with workarounds
4. **Monitor new releases** for new syntax/patterns
5. **Create automated pattern discovery** from Tailwind docs
