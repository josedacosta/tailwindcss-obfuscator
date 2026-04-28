# Tailwind CSS Patterns Reference

This document provides a comprehensive reference of ALL Tailwind CSS patterns supported by `tailwindcss-obfuscator`.

## Pattern Hierarchy

Every Tailwind CSS class follows this structure:

```
[prefix:]<variant-list>:<utility>[/<modifier>][!]

Where:
  - prefix: optional theme prefix (configurable)
  - variant-list: colon-separated variants (0 or more)
  - utility: root[-value] or [property:value]
  - modifier: /value or /[value] or /(--var)
  - !: important (trailing or leading)
```

---

## 1. Static Utilities

Simple utilities without values.

| Category           | Examples                                                                   |
| ------------------ | -------------------------------------------------------------------------- |
| **Display**        | `flex`, `block`, `hidden`, `inline`, `inline-block`, `grid`, `inline-flex` |
| **Position**       | `static`, `fixed`, `absolute`, `relative`, `sticky`                        |
| **Visibility**     | `visible`, `invisible`, `collapse`                                         |
| **Overflow**       | `overflow-auto`, `overflow-hidden`, `overflow-scroll`                      |
| **Float**          | `float-left`, `float-right`, `float-none`                                  |
| **Clear**          | `clear-left`, `clear-right`, `clear-both`                                  |
| **Box**            | `box-border`, `box-content`                                                |
| **Isolation**      | `isolate`, `isolation-auto`                                                |
| **Object Fit**     | `object-contain`, `object-cover`, `object-fill`, `object-none`             |
| **Flexbox**        | `flex-row`, `flex-col`, `flex-wrap`, `flex-nowrap`                         |
| **Grid**           | `grid-flow-row`, `grid-flow-col`, `grid-flow-dense`                        |
| **Justify**        | `justify-start`, `justify-center`, `justify-end`, `justify-between`        |
| **Align**          | `items-start`, `items-center`, `items-end`, `items-stretch`                |
| **Text**           | `uppercase`, `lowercase`, `capitalize`, `normal-case`                      |
| **Font Style**     | `italic`, `not-italic`                                                     |
| **Decoration**     | `underline`, `line-through`, `no-underline`, `overline`                    |
| **Whitespace**     | `whitespace-normal`, `whitespace-nowrap`, `whitespace-pre`                 |
| **Word Break**     | `break-normal`, `break-words`, `break-all`, `break-keep`                   |
| **Hyphens**        | `hyphens-none`, `hyphens-manual`, `hyphens-auto`                           |
| **Cursor**         | `cursor-pointer`, `cursor-wait`, `cursor-text`, `cursor-move`              |
| **Pointer Events** | `pointer-events-none`, `pointer-events-auto`                               |
| **Resize**         | `resize`, `resize-none`, `resize-x`, `resize-y`                            |
| **User Select**    | `select-none`, `select-text`, `select-all`, `select-auto`                  |
| **Appearance**     | `appearance-none`, `appearance-auto`                                       |

---

## 2. Functional Utilities with Values

Utilities that accept theme-based or arbitrary values.

### Spacing

```css
/* Padding */
p-0, p-1, p-2, p-4, p-8, p-px
pt-4, pr-4, pb-4, pl-4
px-4, py-4

/* Margin */
m-0, m-1, m-2, m-4, m-8, m-auto
mt-4, mr-4, mb-4, ml-4
mx-4, my-4

/* Space Between */
space-x-4, space-y-4
space-x-reverse, space-y-reverse

/* Gap */
gap-4, gap-x-4, gap-y-4
```

### Sizing

```css
/* Width */
w-0, w-1, w-full, w-screen, w-auto, w-min, w-max, w-fit
w-1/2, w-1/3, w-2/3, w-1/4, w-3/4  /* Fractions */

/* Height */
h-0, h-1, h-full, h-screen, h-auto, h-min, h-max, h-fit
h-1/2, h-1/3, h-2/3  /* Fractions */

/* Min/Max */
min-w-0, min-w-full, min-w-min, min-w-max
max-w-none, max-w-xs, max-w-sm, max-w-md, max-w-lg, max-w-xl, max-w-screen-sm
min-h-0, min-h-full, min-h-screen
max-h-none, max-h-full, max-h-screen
```

### Colors

```css
/* Background */
bg-transparent, bg-current, bg-inherit
bg-white, bg-black, bg-slate-50, bg-slate-100, ..., bg-slate-900
bg-red-500, bg-blue-500, bg-green-500, ...

/* Text */
text-transparent, text-current, text-inherit
text-white, text-black, text-slate-500, ...

/* Border */
border-transparent, border-current
border-white, border-black, border-slate-500, ...

/* Outline */
outline-transparent, outline-current
outline-white, outline-black, ...

/* Ring */
ring-transparent, ring-current
ring-white, ring-black, ring-blue-500, ...

/* Accent */
accent-auto, accent-inherit, accent-current
accent-blue-500, ...

/* Caret */
caret-transparent, caret-current
caret-blue-500, ...
```

### Typography

```css
/* Font Size */
text-xs, text-sm, text-base, text-lg, text-xl, text-2xl, ...

/* Font Weight */
font-thin, font-light, font-normal, font-medium, font-semibold, font-bold, ...

/* Line Height */
leading-none, leading-tight, leading-normal, leading-relaxed, leading-loose
leading-3, leading-4, leading-5, ...

/* Letter Spacing */
tracking-tighter, tracking-tight, tracking-normal, tracking-wide, tracking-wider

/* Text Align */
text-left, text-center, text-right, text-justify

/* Font Family */
font-sans, font-serif, font-mono
```

### Borders

```css
/* Border Width */
border, border-0, border-2, border-4, border-8
border-t, border-r, border-b, border-l
border-t-0, border-t-2, ...

/* Border Radius */
rounded, rounded-none, rounded-sm, rounded-md, rounded-lg, rounded-xl, rounded-2xl, rounded-full
rounded-t, rounded-r, rounded-b, rounded-l
rounded-tl, rounded-tr, rounded-bl, rounded-br

/* Border Style */
border-solid, border-dashed, border-dotted, border-double, border-hidden, border-none
```

### Effects

```css
/* Shadow (v3 naming) */
shadow, shadow-sm, shadow-md, shadow-lg, shadow-xl, shadow-2xl, shadow-inner, shadow-none

/* Shadow (v4 naming - shifted scale) */
shadow-xs, shadow-sm, shadow-md, shadow-lg, shadow-xl, shadow-2xl

/* Inset shadows (v4) */
inset-shadow-xs, inset-shadow-sm, inset-shadow-md, inset-shadow-lg
inset-shadow-none

/* Inset ring (v4) */
inset-ring, inset-ring-0, inset-ring-1, inset-ring-2, inset-ring-4, inset-ring-8

/* Opacity */
opacity-0, opacity-5, opacity-10, ..., opacity-100

/* Mix Blend */
mix-blend-normal, mix-blend-multiply, mix-blend-screen, ...

/* Background Blend */
bg-blend-normal, bg-blend-multiply, ...
```

### Gradients (v4 Enhanced)

```css
/* Linear gradients */
bg-linear-to-t, bg-linear-to-tr, bg-linear-to-r, bg-linear-to-br
bg-linear-to-b, bg-linear-to-bl, bg-linear-to-l, bg-linear-to-tl
bg-linear-[25deg]
bg-linear-[to_top_left]

/* Radial gradients (v4) */
bg-radial
bg-radial-[at_25%_25%]
bg-radial-[circle_at_center]
bg-radial-[ellipse_at_top]

/* Conic gradients (v4) */
bg-conic
bg-conic-[from_45deg]
bg-conic/[in_hsl_longer_hue]

/* Gradient stops */
from-red-500, via-yellow-500, to-green-500
from-0%, from-10%, from-50%
via-30%, via-50%
to-90%, to-100%
```

### Transforms

```css
/* Scale */
scale-0, scale-50, scale-75, scale-90, scale-95, scale-100, scale-105, scale-110, scale-125, scale-150
scale-x-50, scale-y-50

/* Rotate */
rotate-0, rotate-1, rotate-2, rotate-3, rotate-6, rotate-12, rotate-45, rotate-90, rotate-180

/* Translate */
translate-x-0, translate-x-1, translate-x-full, translate-x-1/2
translate-y-0, translate-y-1, translate-y-full, translate-y-1/2

/* Skew */
skew-x-0, skew-x-1, skew-x-2, skew-x-3, skew-x-6, skew-x-12
skew-y-0, skew-y-1, skew-y-2, skew-y-3, skew-y-6, skew-y-12

/* Origin */
origin-center, origin-top, origin-top-right, origin-right, ...
```

### 3D Transforms (v4)

```css
/* 3D Rotate */
rotate-x-0, rotate-x-45, rotate-x-90, rotate-x-180
rotate-y-0, rotate-y-45, rotate-y-90, rotate-y-180
rotate-z-0, rotate-z-45, rotate-z-90, rotate-z-180

/* 3D Scale */
scale-z-0, scale-z-50, scale-z-100, scale-z-150

/* 3D Translate */
translate-z-0, translate-z-4, translate-z-8, translate-z-px

/* Perspective */
perspective-none, perspective-50, perspective-100, perspective-500, perspective-1000
perspective-origin-center, perspective-origin-top

/* Transform style */
transform-3d, transform-flat

/* Backface visibility */
backface-visible, backface-hidden
```

### Filters

```css
/* Blur */
blur, blur-none, blur-sm, blur-md, blur-lg, blur-xl, blur-2xl, blur-3xl

/* Brightness */
brightness-0, brightness-50, brightness-75, brightness-90, brightness-100, brightness-105, brightness-110, brightness-125, brightness-150, brightness-200

/* Contrast */
contrast-0, contrast-50, contrast-75, contrast-100, contrast-125, contrast-150, contrast-200

/* Drop Shadow */
drop-shadow, drop-shadow-sm, drop-shadow-md, drop-shadow-lg, drop-shadow-xl, drop-shadow-2xl, drop-shadow-none

/* Grayscale */
grayscale, grayscale-0

/* Hue Rotate */
hue-rotate-0, hue-rotate-15, hue-rotate-30, hue-rotate-60, hue-rotate-90, hue-rotate-180

/* Invert */
invert, invert-0

/* Saturate */
saturate-0, saturate-50, saturate-100, saturate-150, saturate-200

/* Sepia */
sepia, sepia-0
```

### Transitions

```css
/* Transition Property */
transition, transition-none, transition-all, transition-colors, transition-opacity, transition-shadow, transition-transform

/* Duration */
duration-0, duration-75, duration-100, duration-150, duration-200, duration-300, duration-500, duration-700, duration-1000

/* Timing Function */
ease-linear, ease-in, ease-out, ease-in-out

/* Delay */
delay-0, delay-75, delay-100, delay-150, delay-200, delay-300, delay-500, delay-700, delay-1000
```

### Animations

```css
animate-none, animate-spin, animate-ping, animate-pulse, animate-bounce
```

---

## 3. Arbitrary Values

Custom values using bracket syntax `[...]`.

### Colors

```css
bg-[#1da1f2]
bg-[rgb(255,0,0)]
bg-[rgba(0,0,0,0.5)]
bg-[hsl(200,100%,50%)]
bg-[oklch(0.7_0.15_200)]
text-[#ff0000]
border-[rgb(100,100,100)]
```

### Sizes

```css
w-[100px]
h-[50vh]
p-[13px]
m-[2rem]
gap-[1.5em]
max-w-[30ch]
```

### Calculations

```css
/* calc() - Dynamic calculations */
w-[calc(100%-2rem)]
h-[calc(100vh-80px)]
top-[calc(50%-1rem)]
max-w-[calc(50%+1rem)]
p-[calc(theme(spacing.4)+2px)]

/* min() - Minimum value */
w-[min(100%,500px)]
h-[min(50vh,300px)]
max-w-[min(90vw,1200px)]

/* max() - Maximum value */
w-[max(50%,200px)]
h-[max(100vh,400px)]
font-size-[max(16px,1rem)]

/* clamp() - Fluid between min and max */
p-[clamp(1rem,5vw,3rem)]
text-[clamp(1rem,2.5vw,2rem)]
w-[clamp(200px,50vw,800px)]
gap-[clamp(0.5rem,3vw,2rem)]

/* Using theme values in calculations */
h-[calc(100%-theme(space.8))]
w-[calc(100vw-theme(spacing.12))]
```

### Viewport Units

```css
h-[100vh]
h-[100svh]                            /* Small viewport height */
h-[100lvh]                            /* Large viewport height */
h-[100dvh]                            /* Dynamic viewport height */
w-[100vw]
w-[100svw]                            /* Small viewport width */
min-h-[100svh]
max-h-[100lvh]
```

### Container Query Units

```css
w-[50cqw]                             /* Container query width */
h-[50cqh]                             /* Container query height */
p-[5cqi]                              /* Container query inline */
m-[10cqb]                             /* Container query block */
gap-[2cqmin]                          /* Container query min */
gap-[2cqmax]                          /* Container query max */
```

### Spaces in Arbitrary Values

Use underscores `_` to represent spaces:

```css
/* Content with space */
content-['Hello_World']
before:content-['→_']

/* Grid template areas */
[grid-template-areas:'header_header'_'sidebar_main']

/* Text shadow with spaces */
[text-shadow:2px_2px_4px_rgba(0,0,0,0.5)]

/* Box shadow */
[box-shadow:0_10px_15px_-3px_rgba(0,0,0,0.1)]
```

### URLs

```css
bg-[url('/images/hero.png')]
bg-[url('/path/to/image.svg')]
```

### Arbitrary Properties

```css
[mask-type:alpha]
[--my-var:100px]
[clip-path:circle(50%)]
[writing-mode:vertical-rl]
[text-shadow:2px_2px_4px_rgba(0,0,0,0.5)]
```

### With Type Hints

```css
bg-[color:red]
bg-[color:var(--my-color)]
text-[length:16px]
```

---

## 4. CSS Variable Syntax (v4)

### Parenthesis Shorthand

```css
bg-(--my-color)                    /* = bg-[var(--my-color)] */
text-(--brand-color)
border-(--border-color)
```

### With Type Hints

```css
bg-(color:--my-bg)
text-(length:--heading-size)
```

### With Fallback Values

```css
bg-(color:--my-color,#0088cc)      /* = bg-[var(--my-color,#0088cc)] */
```

---

## 5. Modifiers

### Opacity Modifier

```css
bg-blue-500/50                     /* 50% opacity */
text-red-600/75                    /* 75% opacity */
border-gray-300/25                 /* 25% opacity */
```

### Arbitrary Opacity

```css
bg-black/[0.08]
bg-white/[.85]
text-black/[50%]
```

### CSS Variable Opacity

```css
bg-blue-500/(--my-opacity)
text-black/(--text-alpha)
```

---

## 6. Variants

### Responsive Breakpoints

```css
/* Standard breakpoints */
sm:flex                            /* >= 640px */
md:grid                            /* >= 768px */
lg:hidden                          /* >= 1024px */
xl:block                           /* >= 1280px */
2xl:flex                           /* >= 1536px */

/* Extended breakpoints (v4) */
3xl:flex                           /* Custom */
4xl:grid                           /* Custom */
5xl:hidden                         /* Custom */
6xl:block                          /* Custom */
7xl:flex                           /* Custom */

/* Max variants */
max-sm:hidden                      /* < 640px */
max-md:flex                        /* < 768px */
max-lg:grid                        /* < 1024px */

/* Arbitrary breakpoints */
min-[320px]:flex
max-[768px]:hidden
```

### State Variants

```css
/* Interactive states */
hover:bg-blue-600
focus:ring-2
active:scale-95
visited:text-purple-600
target:bg-yellow-100

/* Focus variants */
focus-within:ring-2
focus-visible:outline-2

/* Form states */
disabled:opacity-50
enabled:cursor-pointer
checked:bg-blue-500
indeterminate:bg-gray-300
default:ring-2
invalid:border-red-500
valid:border-green-500
required:after:content-['*']
optional:border-gray-300
user-valid:border-green-500          /* Valid after user interaction */
user-invalid:border-red-500          /* Invalid after user interaction */
in-range:border-green-500
out-of-range:border-red-500
placeholder-shown:border-gray-300
autofill:bg-yellow-100
read-only:bg-gray-100

/* Element states */
empty:hidden
inert:opacity-50                     /* Elements with inert attribute */
```

### Positional Variants

```css
first:mt-0
last:mb-0
odd:bg-gray-100
even:bg-white
first-of-type:rounded-t
last-of-type:rounded-b
only:py-4
only-of-type:mx-auto
```

### Pseudo-Element Variants

```css
before:content-['']
after:absolute
first-letter:text-7xl
first-line:uppercase
marker:text-blue-500
selection:bg-blue-500
file:mr-4
placeholder:text-gray-400
backdrop:bg-black/50
```

### Dark Mode

```css
dark:bg-gray-900
dark:text-white
dark:hover:bg-gray-800
```

### Print

```css
print:hidden
print:bg-white
print:text-black
```

### Motion Preferences

```css
motion-safe:animate-spin
motion-reduce:animate-none
motion-reduce:transition-none
```

### Contrast Preferences

```css
contrast-more:border-2
contrast-less:opacity-75
```

### Pointer Device Queries

```css
pointer-fine:cursor-pointer           /* Accurate pointer (mouse/trackpad) */
pointer-coarse:p-4                    /* Coarse pointer (touchscreen) */
pointer-none:hidden                   /* No pointing device */
any-pointer-fine:cursor-pointer       /* Any accurate pointing device */
any-pointer-coarse:text-lg            /* Any coarse pointing device */
```

### Accessibility Queries

```css
forced-colors:border-2                /* High contrast mode */
not-forced-colors:shadow-lg           /* Not in forced colors mode */
inverted-colors:filter-none           /* Inverted colors scheme */
noscript:hidden                       /* JavaScript disabled */
```

### Orientation

```css
portrait:flex-col
landscape:flex-row
```

### Direction (RTL/LTR)

```css
rtl:text-right
ltr:text-left
rtl:space-x-reverse
```

### Open State

```css
open:bg-white
open:rotate-180
```

### Group/Peer Variants

```css
/* Group hover */
group-hover:bg-blue-500
group-focus:ring-2
group-active:scale-95

/* Named groups */
group/sidebar:hover:bg-gray-100
group-hover/item:text-blue-500

/* Peer variants */
peer-hover:text-blue-500
peer-focus:ring-2
peer-checked:bg-blue-500
peer-invalid:border-red-500

/* Named peers */
peer/input:focus:ring-2
peer-checked/checkbox:bg-blue-500

/* With data/aria */
group-data-[state=open]:block
group-aria-expanded:rotate-180
peer-data-[checked]:bg-blue-500
```

### Has/Not Variants

```css
has-[:checked]:bg-blue-500
has-[input]:border
has-[img]:p-0
not-first:mt-4
not-last:mb-4
```

### Data Attribute Variants

```css
data-[state=open]:bg-green-500
data-[selected]:bg-blue-500
data-[disabled]:opacity-50
data-[orientation=vertical]:flex-col
data-[size=lg]:text-xl
```

### ARIA Variants

```css
aria-pressed:bg-blue-500
aria-selected:bg-gray-100
aria-expanded:rotate-180
aria-hidden:hidden
aria-disabled:opacity-50
aria-[current=page]:font-bold
aria-[sort=ascending]:bg-gray-100
```

### Supports Queries

```css
supports-[display:grid]:grid
supports-[backdrop-filter]:backdrop-blur
supports-grid:grid
supports-flex:flex
```

### Container Queries (v4)

```css
/* Container class */
@container @container/sidebar

/* Container variants - Small sizes */
@3xs:flex                             /* 16rem (256px) */
@2xs:flex                             /* 18rem (288px) */
@xs:flex                              /* 20rem (320px) */

/* Container variants - Standard sizes */
@sm:flex                              /* 24rem (384px) */
@md:grid                              /* 28rem (448px) */
@lg:hidden                            /* 32rem (512px) */
@xl:block                             /* 36rem (576px) */
@2xl:flex                             /* 42rem (672px) */

/* Container variants - Extended sizes */
@3xl:text-xl                          /* 48rem (768px) */
@4xl:grid-cols-4                      /* 56rem (896px) */
@5xl:gap-8                            /* 64rem (1024px) */
@6xl:p-12                             /* 72rem (1152px) */
@7xl:max-w-screen                     /* 80rem (1280px) */

/* Named container variants */
@sm/sidebar:flex
@lg/main:grid-cols-3
@3xs/card:p-2
@xs/widget:hidden

/* Arbitrary container sizes */
@[500px]:flex
@[min-width:300px]:hidden

/* Min/Max container variants */
@min-sm:flex
@max-lg:hidden
@min-[400px]:grid
@max-[800px]:block
@min-3xs:p-1
@max-xs:hidden;
```

### Wildcard Selectors (v4)

```css
*:flex                             /* Direct children */
*:p-4
**:flex                            /* All descendants */
**:text-sm
hover:*:opacity-100                /* With other variants */
group-hover:*:visible
```

### In Variants (v4)

```css
in-hover:bg-blue-500
in-focus:ring-2
in-data-[state=open]:block
in-[.sidebar]:bg-gray-100
in-[[data-active]]:font-bold
```

### nth Variants (v4)

```css
nth-2:bg-gray-100
nth-3:mt-4
nth-5:border-t
nth-[2n+1]:bg-gray-50
nth-[3n]:bg-blue-50
nth-[odd]:bg-gray-100
nth-[even]:bg-white
nth-last-2:mb-0
nth-last-[2n]:border-b
nth-of-type-2:text-lg
nth-of-type-[3n+1]:font-bold
nth-last-of-type-2:opacity-50
nth-last-of-type-[2n]:hidden
```

### Starting Style (v4)

```css
starting:opacity-0
starting:scale-95
starting:translate-y-4
open:starting:opacity-0
group-open:starting:scale-100
```

### Forced Colors (v4)

```css
forced-colors:outline
forced-colors:border-2
forced-colors:text-[ButtonText]
```

### Arbitrary Variants

```css
[&_p]:text-blue-500
[&>img]:rounded-lg
[&:hover]:bg-red-500
[@media(min-width:640px)]:flex
[@media(prefers-color-scheme:dark)]:bg-gray-900
[@supports(display:grid)]:grid
[@supports(backdrop-filter:blur(1px))]:backdrop-blur
[@container(min-width:640px)]:flex
```

---

## 7. Important Modifier

```css
/* Leading ! (legacy) */
!bg-red-500
!flex
!p-4
hover:!bg-red-500

/* Trailing ! (v4) */
flex!
bg-red-500!
p-4!
hover:bg-blue-500!
md:flex!
dark:text-white!
```

---

## 8. Negative Values

```css
/* Spacing */
-m-4
-mt-8
-p-2
-ml-4
-mr-auto

/* Transforms */
-translate-x-4
-translate-y-full
-rotate-45
-skew-x-12
-scale-75

/* With variants */
hover:-translate-y-1
md:-mt-4
```

---

## 9. Stacked Variants

Multiple variants can be combined with `:`:

```css
sm:hover:bg-blue-500
dark:md:hover:bg-gray-700
lg:focus:first:bg-red-500
group-hover:dark:text-white
sm:dark:hover:focus:bg-blue-500
md:aria-pressed:data-[state=open]:bg-green-500
*:hover:opacity-100
@lg:dark:bg-gray-800
nth-[2n]:first:mt-0
```

---

## 10. CSS Directives

### @apply

```css
.btn {
  @apply rounded-lg px-4 py-2;
}

.card {
  @apply flex items-center justify-between p-6;
  @apply transition-shadow hover:shadow-lg;
}
```

### @layer

```css
@layer components {
  .card {
    @apply rounded-xl p-6 shadow-lg;
  }
}

@layer utilities {
  .text-shadow {
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  }
}
```

### @theme (v4)

```css
@theme {
  --color-primary: #3b82f6;
  --spacing-18: 4.5rem;
  --breakpoint-3xl: 1920px;
}
```

### @utility (v4)

Define custom utility classes:

```css
@utility text-shadow {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

@utility text-shadow-lg {
  text-shadow: 4px 4px 8px rgba(0, 0, 0, 0.5);
}
```

### @variant (v4)

Define custom variants:

```css
@variant hocus (&:hover, &:focus);

/* Usage: hocus:bg-blue-500 */
```

### @custom-variant (v4)

Define complex custom variants:

```css
@custom-variant theme-dark (&:where([data-theme="dark"], [data-theme="dark"] *));

/* Usage: theme-dark:bg-gray-900 */
```

### @reference (v4)

Reference other CSS files for IntelliSense and type checking (CSS Modules):

```css
@reference "tailwindcss";
@reference "../styles/theme.css";
```

### @source (v4)

Add additional source files for class detection:

```css
@source "../components/**/*.jsx";
@source "../lib/utils.ts";
```

---

## 11. Framework-Specific Patterns

### React/JSX

```jsx
<div className="flex items-center">
<div className={`flex ${isActive ? 'bg-blue-500' : ''}`}>
<div className={isActive ? "bg-blue-500" : "bg-gray-500"}>
```

### Vue

```vue
<div class="flex items-center">
<div :class="{ 'bg-blue-500': isActive }">
<div :class="['flex', isActive ? 'bg-blue' : 'bg-gray']">
<div v-bind:class="{ 'text-red-500': hasError }">
```

### Svelte

```svelte
<div class="flex items-center">
<div class:bg-red-500={hasError}>
<div class:flex>
<div class:list={["flex", isActive && "bg-blue-500"]}>
```

### Astro

```astro
<div class="flex items-center">
<div class:list={["flex", { "bg-blue-500": isActive }]}>
```

### Qwik

```tsx
<div class="flex items-center">
<div class={`flex ${isActive ? 'bg-blue-500' : ''}`}>
```

---

## 12. Utility Function Patterns

### cn() / clsx() / classnames()

```jsx
cn("flex", { "bg-blue-500": isActive });
clsx("flex items-center", condition && "hidden");
classnames("p-4", { "bg-red-500": hasError, hidden: !isVisible });
```

### twMerge()

```jsx
twMerge("p-4", customPadding);
twMerge("bg-red-500", "bg-blue-500"); // Last one wins
```

### cva() (class-variance-authority)

```jsx
const button = cva("flex items-center justify-center", {
  variants: {
    intent: {
      primary: "bg-blue-500 text-white",
      secondary: "bg-gray-200 text-gray-800",
    },
    size: {
      sm: "text-sm px-2 py-1",
      md: "text-base px-4 py-2",
    },
  },
  compoundVariants: [{ intent: "primary", size: "sm", class: "uppercase font-bold" }],
  defaultVariants: {
    intent: "primary",
    size: "md",
  },
});
```

### tv() (tailwind-variants)

```jsx
const button = tv({
  base: "flex items-center justify-center",
  variants: {
    color: {
      primary: "bg-blue-500",
      secondary: "bg-gray-500",
    },
  },
  slots: {
    base: "rounded-lg shadow-md",
    header: "p-4 border-b",
    body: "p-4",
    footer: "p-4 border-t",
  },
});
```

---

## Pattern Validation

### Valid Patterns

```css
flex                              /* Static utility */
p-4                               /* Functional utility */
bg-red-500                        /* Color utility */
hover:bg-blue-500                 /* Single variant */
sm:md:lg:hover:bg-blue-500        /* Stacked variants */
bg-[#1da1f2]                      /* Arbitrary value */
bg-(--my-color)                   /* CSS variable shorthand */
bg-red-500/50                     /* Opacity modifier */
!flex                             /* Important (leading) */
flex!                             /* Important (trailing) */
-translate-x-4                    /* Negative value */
group-hover/sidebar:text-white    /* Named group */
@lg/main:flex                     /* Named container */
[&_p]:text-blue-500               /* Arbitrary variant */
data-[state=open]:bg-green-500    /* Data attribute */
nth-[2n+1]:bg-gray-50             /* nth variant */
```

### Invalid Patterns

```css
flex-                             /* Incomplete utility */
bg-                               /* Incomplete utility */
hover:                            /* Incomplete variant */
flex/50                           /* Static with modifier (invalid) */
bg-[]                             /* Empty arbitrary value */
bg-[                              /* Unclosed bracket */
bg-(my-color)                     /* Parenthesis without -- */
```

---

## Obfuscation Scope

### Classes that ARE obfuscated

- All utility root names: `flex`, `bg`, `text`, etc.
- All variant names: `hover`, `focus`, `sm`, `md`, etc.
- Named color values: `red-500`, `blue-600`, etc.

### Classes that are NOT obfuscated

- Arbitrary value contents: `#0088cc`, `13px`, `var(--color)` inside `[...]`
- CSS variable names: `--my-color`
- Data attribute values inside `data-[...]`
- Type hints: `color`, `length` in `[color:red]`

---

## Version Compatibility

| Pattern                        | v3     | v4  |
| ------------------------------ | ------ | --- |
| Static utilities               | ✅     | ✅  |
| Functional utilities           | ✅     | ✅  |
| Arbitrary values `[...]`       | ✅     | ✅  |
| CSS variable shorthand `(...)` | ❌     | ✅  |
| Container queries              | Plugin | ✅  |
| Container sizes @3xs-@7xl      | ❌     | ✅  |
| Wildcard selectors `*:`, `**:` | ❌     | ✅  |
| In variants                    | ❌     | ✅  |
| nth variants                   | ❌     | ✅  |
| Starting style                 | ❌     | ✅  |
| Forced colors                  | ❌     | ✅  |
| Trailing important `!`         | ❌     | ✅  |
| user-valid / user-invalid      | ❌     | ✅  |
| inert variant                  | ❌     | ✅  |
| Pointer device queries         | ❌     | ✅  |
| noscript variant               | ❌     | ✅  |
| @theme directive               | ❌     | ✅  |
| @utility directive             | ❌     | ✅  |
| @variant directive             | ❌     | ✅  |
| @custom-variant directive      | ❌     | ✅  |
| @reference directive           | ❌     | ✅  |
| @source directive              | ❌     | ✅  |

---

## CSS Functions (v4)

### --alpha() function

Modify the alpha channel of a color:

```css
/* In theme definitions */
@theme {
  --color-primary-50: oklch(from var(--color-primary) l c h / --alpha(10%));
}
```

### --spacing() function

Calculate spacing values:

```css
/* Dynamic spacing */
@theme {
  --spacing-gutter: --spacing(4);
  --spacing-container: calc(--spacing(8) + 2rem);
}
```

### theme() function

Reference theme values in arbitrary values:

```css
p-[theme(spacing.4)]
bg-[theme(colors.blue.500)]
border-[theme(borderWidth.2)]
w-[calc(100%-theme(spacing.8))]
```

---

## v3 → v4 Utility Name Changes

Some utilities have been renamed in v4. The obfuscator supports both versions.

| v3 Name            | v4 Name                | Notes                |
| ------------------ | ---------------------- | -------------------- |
| `shadow-sm`        | `shadow-xs`            | Scale shifted        |
| `shadow`           | `shadow-sm`            | Scale shifted        |
| `shadow-md`        | `shadow-md`            | Unchanged            |
| `shadow-lg`        | `shadow-lg`            | Unchanged            |
| `outline-none`     | `outline-hidden`       | Renamed              |
| `bg-gradient-to-*` | `bg-linear-to-*`       | Renamed              |
| `ring-offset-*`    | Deprecated             | Use `outline-offset` |
| `decoration-slice` | `box-decoration-slice` | Renamed              |
| `decoration-clone` | `box-decoration-clone` | Renamed              |

### Syntax Changes

| v3 Syntax         | v4 Syntax         | Notes                      |
| ----------------- | ----------------- | -------------------------- |
| `bg-[--color]`    | `bg-(--color)`    | CSS variable shorthand     |
| `!flex`           | `flex!`           | Important at end preferred |
| `grid-cols-[a,b]` | `grid-cols-[a_b]` | Underscores for spaces     |
