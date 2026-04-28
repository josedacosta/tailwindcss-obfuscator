# Class utilities

`tailwindcss-obfuscator` automatically detects classes inside the popular class-utility helpers.

## Supported helpers

| Function       | Package                  | Support |
| -------------- | ------------------------ | ------- |
| `cn()`         | shadcn/ui                | Full    |
| `clsx()`       | clsx                     | Full    |
| `classnames()` | classnames               | Full    |
| `classNames()` | classnames               | Full    |
| `twMerge()`    | tailwind-merge           | Full    |
| `cva()`        | class-variance-authority | Full    |
| `tv()`         | tailwind-variants        | Full    |

## Examples

### `cn()` — shadcn/ui

```tsx
import { cn } from "@/lib/utils";

// All these classes will be obfuscated
<div className={cn("flex items-center", isActive && "bg-blue-500", disabled ? "opacity-50" : "opacity-100")}>;
```

### `clsx()`

```tsx
import clsx from "clsx";

<button
  className={clsx("px-4 py-2 rounded", {
    "bg-blue-500 text-white": variant === "primary",
    "bg-gray-200 text-gray-800": variant === "secondary",
  })}
>;
```

### `cva()` — class-variance-authority

```tsx
import { cva } from "class-variance-authority";

const buttonVariants = cva(
  // Base classes — obfuscated
  "inline-flex items-center justify-center rounded-md font-medium",
  {
    variants: {
      variant: {
        // All these classes will be obfuscated
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
      },
    },
  }
);
```

### `twMerge()`

```tsx
import { twMerge } from "tailwind-merge";

// Classes are merged, then obfuscated
<div
  className={twMerge(
    "px-4 py-2 bg-blue-500",
    "px-6", // overrides px-4
  )}
>;
```

### `tv()` — tailwind-variants

```tsx
import { tv } from "tailwind-variants";

const button = tv({
  base: "font-medium rounded-full active:opacity-80",
  variants: {
    color: {
      primary: "bg-blue-500 text-white",
      secondary: "bg-purple-500 text-white",
    },
    size: {
      sm: "text-sm px-4 py-1",
      md: "text-base px-6 py-2",
    },
  },
});
```

## Template literals

Template literals are supported too:

```tsx
// Supported
<div className={`flex ${isActive ? 'bg-blue-500' : 'bg-gray-500'}`}>

// Supported inside cn()
<div className={cn(`
  flex
  items-center
  ${size === 'lg' ? 'p-6' : 'p-4'}
`)}>
```

## Framework-specific patterns

### Vue — `:class` binding

```vue
<!-- Object syntax -->
<div :class="{ 'bg-blue-500': isActive, 'text-white': true }">

<!-- Array syntax -->
<div :class="['flex', isActive ? 'bg-blue-500' : 'bg-gray-500']">

<!-- Mixed syntax -->
<div :class="[baseClass, { 'bg-blue-500': isActive }]">

<!-- v-bind:class -->
<div v-bind:class="{ 'hover:bg-blue-600': true }">
```

### Svelte — `class:` directive

```svelte
<!-- class: directive -->
<div class:bg-red-500={hasError} class:flex>Content</div>

<!-- class:list directive -->
<div class:list={["flex", "items-center", { "bg-red-500": isActive }]}>
```

### Astro — `class:list` directive

```astro
---
const isActive = true;
---
<div class:list={["flex", "items-center", { "bg-red-500": isActive }]}>
  Content
</div>
```

### Qwik — `class$` binding

```tsx
// Qwik reactive class binding
<div class$={"flex items-center bg-blue-500"}>Content</div>
```

## Limitations

### Dynamic classes are not supported

```tsx
// ❌ DOES NOT WORK — class assembled at runtime
const color = 'blue'
<div className={`bg-${color}-500`}>

// ✅ WORKS — complete static class strings
<div className={color === 'blue' ? 'bg-blue-500' : 'bg-red-500'}>
```

### All variants must be static

```tsx
// ❌ DOES NOT WORK
const sizes = ["sm", "md", "lg"];
sizes.map((s) => `text-${s}`);

// ✅ WORKS
const sizeClasses = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};
```
