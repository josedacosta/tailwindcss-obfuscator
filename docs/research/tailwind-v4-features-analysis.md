# Tailwind CSS v4 - Comprehensive Features Analysis for Obfuscation

**Document Version:** 1.0
**Generated:** 2025-12-08
**Tailwind CSS Version:** v4.0 (Released January 22, 2025)
**Purpose:** Complete reference for v4 patterns that must be supported by tailwindcss-obfuscator

---

## Table of Contents

1. [Browser Requirements](#browser-requirements)
2. [Breaking Changes](#breaking-changes)
3. [New Variants](#new-variants)
4. [New Utilities](#new-utilities)
5. [Renamed/Changed Utilities](#renamedchanged-utilities)
6. [Removed/Deprecated Utilities](#removeddeprecated-utilities)
7. [Gradient API Changes](#gradient-api-changes)
8. [Dynamic Utility Values](#dynamic-utility-values)
9. [Arbitrary Value Syntax Changes](#arbitrary-value-syntax-changes)
10. [Configuration Changes](#configuration-changes)
11. [Obfuscation Requirements](#obfuscation-requirements)
12. [Pattern Recognition Updates](#pattern-recognition-updates)

---

## Browser Requirements

**Minimum versions:**

- Safari 16.4+
- Chrome 111+
- Firefox 128+

**Key features used:**

- `@property` declarations
- `color-mix()` function
- Native cascade layers
- Container queries

---

## Breaking Changes

### 1. Import System

**v3:**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**v4:**

```css
@import "tailwindcss";
```

**Obfuscation Impact:** None - CSS imports are not obfuscated

---

### 2. Important Modifier Position

**v3:** `!` goes at the beginning or end

```html
<div class="bg-red-500! !flex"></div>
```

**v4:** `!` now consistently goes at the END

```html
<div class="flex! bg-red-500!"></div>
```

**Obfuscation Impact:** Must recognize `!` suffix in class patterns

---

### 3. Arbitrary Value Syntax

#### CSS Variables

**v3:**

```html
<div class="bg-[--brand-color]"></div>
```

**v4:**

```html
<div class="bg-(--brand-color)"></div>
```

**Pattern:** Parentheses `()` instead of brackets `[]` for CSS variables

#### Commas in Arbitrary Values

**v3:**

```html
<div class="grid-cols-[max-content,auto]"></div>
```

**v4:**

```html
<div class="grid-cols-[max-content_auto]"></div>
```

**Pattern:** Underscores `_` instead of commas for spaces

**Obfuscation Impact:** Must parse both bracket and parenthesis syntax for arbitrary values

---

### 4. Variant Stacking Order

**v3:** Right to left evaluation

```html
<ul class="py-4 first:*:pt-0 last:*:pb-0"></ul>
```

**v4:** Left to right evaluation

```html
<ul class="py-4 *:first:pt-0 *:last:pb-0"></ul>
```

**Obfuscation Impact:** Variant order matters, must preserve exact sequence

---

## New Variants

### Container Query Variants (v4)

| Variant Pattern       | Description               | Example                    |
| --------------------- | ------------------------- | -------------------------- |
| `@sm:`                | Min-width container query | `@sm:flex`                 |
| `@md:`                | Min-width container query | `@md:grid`                 |
| `@lg:`                | Min-width container query | `@lg:block`                |
| `@xl:`                | Min-width container query | `@xl:hidden`               |
| `@2xl:`               | Min-width container query | `@2xl:flex`                |
| `@max-sm:`            | Max-width container query | `@max-sm:hidden`           |
| `@max-md:`            | Max-width container query | `@max-md:block`            |
| `@max-lg:`            | Max-width container query | `@max-lg:flex`             |
| `@max-xl:`            | Max-width container query | `@max-xl:grid`             |
| `@[500px]:`           | Arbitrary min-width       | `@[500px]:flex`            |
| `@[min-width:300px]:` | Arbitrary query           | `@[min-width:300px]:block` |
| `@min-[400px]:`       | Arbitrary min-width       | `@min-[400px]:grid`        |
| `@max-[800px]:`       | Arbitrary max-width       | `@max-[800px]:hidden`      |
| `@[500px]/card:`      | Named container query     | `@[500px]/card:flex`       |
| `@lg/sidebar:`        | Named container query     | `@lg/sidebar:block`        |

**Stackable:**

```html
<div class="@min-md:@max-xl:hidden"></div>
```

---

### Logical Variants (v4)

#### `not-*` Variant (Negation)

**Pattern:** `not-{pseudo}:`

**Examples:**

```html
<div class="not-hover:opacity-75"><!-- Styles when NOT hovering --></div>
<div class="not-focus:text-gray-500"><!-- Styles when NOT focused --></div>
<div class="not-first:border-t"><!-- All except first child --></div>
```

**Supports:**

- Pseudo-classes: `not-hover:`, `not-focus:`, `not-active:`, `not-visited:`
- Structural: `not-first:`, `not-last:`, `not-odd:`, `not-even:`
- Media queries: `not-supports-hanging-punctuation:`

---

#### `in-*` Variant (Descendant Styling)

**Pattern:** `in-{selector}:`

**Purpose:** Style descendants without needing `.group` class

**Examples:**

```html
<div>
  <p class="in-hover:text-blue-500"><!-- Styles when ANY ancestor is hovered --></p>
</div>

<div>
  <span class="in-data-[state=open]:bg-blue-500">
    <!-- Styles when ancestor has data-state="open" -->
  </span>
</div>
```

**Supports:**

- Pseudo-classes: `in-hover:`, `in-focus:`, `in-active:`
- Data attributes: `in-data-[state=open]:`
- ARIA attributes: `in-aria-expanded:`
- Nested brackets: `in-[[data-active]]:`

---

#### `descendant` Variant

**Pattern:** `descendant:`

**Purpose:** Apply styles to ALL descendant elements

**Example:**

```html
<div class="descendant:text-gray-800">
  <!-- All descendants get text-gray-800 -->
</div>
```

---

#### `inert` Variant

**Pattern:** `inert:`

**Purpose:** Style elements with the `inert` attribute

**Example:**

```html
<div inert class="inert:opacity-50"><!-- Dimmed when inert --></div>
```

---

#### `nth-*` Variants

**Pattern:** `nth-{n}:` or `nth-[expression]:`

**Examples:**

```html
<li class="nth-1:font-bold"><!-- First item --></li>
<li class="nth-2:bg-gray-100"><!-- Second item --></li>
<li class="nth-even:bg-blue-50"><!-- Even items --></li>
<li class="nth-odd:bg-white"><!-- Odd items --></li>
<li class="nth-[2n+1]:text-red-500"><!-- Custom expression --></li>
```

**Variants:**

- `nth-{n}:` - nth-child(n)
- `nth-even:` - nth-child(even)
- `nth-odd:` - nth-child(odd)
- `nth-[expression]:` - nth-child(expression)
- `nth-last-{n}:` - nth-last-child(n)
- `nth-of-type-{n}:` - nth-of-type(n)
- `nth-last-of-type-{n}:` - nth-last-of-type(n)

---

#### `open` Variant

**Pattern:** `open:`

**Purpose:** Targets `:popover-open` state

**Example:**

```html
<div popover class="open:bg-blue-500"><!-- Styled when popover is open --></div>
```

---

#### `starting:` Variant

**Pattern:** `starting:`

**Purpose:** CSS `@starting-style` animations on element appearance

**Example:**

```html
<div popover class="transition-discrete starting:open:opacity-0">
  <!-- Animates from opacity-0 when appearing -->
</div>
```

---

### Wildcard Selectors (v4)

| Pattern | Description     | Example            |
| ------- | --------------- | ------------------ |
| `*:`    | Direct children | `*:first:pt-0`     |
| `**:`   | All descendants | `**:text-gray-500` |

**Example:**

```html
<ul class="*:border-b *:py-2">
  <!-- All direct children get py-2 and border-b -->
  <li>Item 1</li>
  <li>Item 2</li>
</ul>
```

---

## New Utilities

### Shadow Utilities (v4)

#### `inset-shadow-*`

**Pattern:** `inset-shadow-{size}`

**Purpose:** Inset box shadows (multiple layers supported)

**Examples:**

```html
<div class="inset-shadow-sm"><!-- Small inset shadow --></div>
<div class="inset-shadow-md"><!-- Medium inset shadow --></div>
<div class="inset-shadow-lg"><!-- Large inset shadow --></div>
<div class="inset-shadow-[0_2px_4px_rgba(0,0,0,0.1)]"><!-- Arbitrary --></div>
```

---

#### `inset-ring-*`

**Pattern:** `inset-ring-{width}`

**Purpose:** Inset ring shadows

**Examples:**

```html
<input class="inset-ring-1"><!-- 1px inset ring --></input>
<input class="inset-ring-2"><!-- 2px inset ring --></input>
<input class="inset-ring-[3px]"><!-- Arbitrary inset ring --></input>
```

---

### Form & Input Utilities (v4)

#### `field-sizing-*`

**Pattern:** `field-sizing-{value}`

**Purpose:** Auto-resize textareas without JavaScript

**Examples:**

```html
<textarea class="field-sizing-content"><!-- Auto-resize to content --></textarea>
<textarea class="field-sizing-fixed"><!-- Fixed size --></textarea>
```

---

#### `color-scheme-*`

**Pattern:** `color-scheme-{mode}`

**Purpose:** Light/dark scrollbar support

**Examples:**

```html
<div class="color-scheme-light"><!-- Light scrollbars --></div>
<div class="color-scheme-dark"><!-- Dark scrollbars --></div>
<div class="color-scheme-auto"><!-- Auto scrollbars --></div>
```

---

### Typography Utilities (v4)

#### `font-stretch-*`

**Pattern:** `font-stretch-{value}`

**Purpose:** Variable font width control

**Examples:**

```html
<p class="font-stretch-condensed">Condensed text</p>
<p class="font-stretch-expanded">Expanded text</p>
<p class="font-stretch-ultra-condensed">Ultra condensed</p>
<p class="font-stretch-[75%]">Arbitrary stretch</p>
```

---

### 3D Transform Utilities (v4)

| Pattern                         | Description           | Example                     |
| ------------------------------- | --------------------- | --------------------------- |
| `rotate-x-{deg}`                | 3D X-axis rotation    | `rotate-x-45`               |
| `rotate-y-{deg}`                | 3D Y-axis rotation    | `rotate-y-90`               |
| `rotate-z-{deg}`                | 3D Z-axis rotation    | `rotate-z-180`              |
| `scale-z-{value}`               | 3D Z-axis scaling     | `scale-z-150`               |
| `translate-z-{value}`           | 3D Z-axis translation | `translate-z-4`             |
| `perspective-{value}`           | Perspective distance  | `perspective-1000`          |
| `perspective-origin-{position}` | Perspective origin    | `perspective-origin-center` |
| `transform-3d`                  | Enable 3D transforms  | `transform-3d`              |

**Example:**

```html
<div class="perspective-distant">
  <article class="rotate-x-51 rotate-z-43 transform-3d">
    <!-- 3D rotated card -->
  </article>
</div>
```

**Negative values supported:**

```html
<div class="-rotate-x-45 -translate-z-4"></div>
```

---

## Renamed/Changed Utilities

### Shadow/Radius/Blur Scale Renamed

| v3 Class           | v4 Class           | Type          |
| ------------------ | ------------------ | ------------- |
| `shadow-sm`        | `shadow-xs`        | Box shadow    |
| `shadow`           | `shadow-sm`        | Box shadow    |
| `drop-shadow-sm`   | `drop-shadow-xs`   | Drop shadow   |
| `drop-shadow`      | `drop-shadow-sm`   | Drop shadow   |
| `blur-sm`          | `blur-xs`          | Blur filter   |
| `blur`             | `blur-sm`          | Blur filter   |
| `backdrop-blur-sm` | `backdrop-blur-xs` | Backdrop blur |
| `backdrop-blur`    | `backdrop-blur-sm` | Backdrop blur |
| `rounded-sm`       | `rounded-xs`       | Border radius |
| `rounded`          | `rounded-sm`       | Border radius |

**Obfuscation Impact:** Must support BOTH v3 and v4 naming conventions

---

### Outline Utilities Changed

**v3:**

```html
<input class="outline-none"><!-- No outline --></input>
<input class="outline outline-2"><!-- 2px outline --></input>
```

**v4:**

```html
<input class="outline-hidden"><!-- Accessibility-friendly "no outline" --></input>
<input class="outline-2"><!-- 2px solid outline (default solid style) --></input>
<input class="outline"><!-- 1px solid outline (NEW default width) --></input>
```

**Changes:**

- `outline-none` → `outline-hidden` (better for accessibility)
- `outline` now sets `outline-width: 1px` by default (was no width)
- `outline-{number}` now defaults to `outline-style: solid`

---

### Ring Utility Defaults Changed

**v3 Defaults:**

- Width: `3px`
- Color: `blue-500`

**v4 Defaults:**

- Width: `1px`
- Color: `currentColor`

**Examples:**

**v3:**

```html
<input class="ring ring-blue-500"><!-- 3px blue ring --></input>
```

**v4 equivalent:**

```html
<input class="ring-3 ring-blue-500"><!-- Must specify width explicitly --></input>
```

---

### Border Color Default Changed

**v3 Default:** `gray-200`
**v4 Default:** `currentColor`

**Required change:**

```html
<!-- v3: -->
<div class="border px-2 py-3">
  <!-- v4: Must specify color explicitly -->
  <div class="border border-gray-200 px-2 py-3"></div>
</div>
```

---

## Removed/Deprecated Utilities

### Opacity Modifier Utilities Removed

**All `-opacity-*` utilities removed in favor of `/` modifier syntax:**

| Deprecated v3            | v4 Replacement            |
| ------------------------ | ------------------------- |
| `bg-opacity-50`          | `bg-black/50`             |
| `text-opacity-75`        | `text-white/75`           |
| `border-opacity-25`      | `border-gray-500/25`      |
| `divide-opacity-30`      | `divide-blue-500/30`      |
| `ring-opacity-60`        | `ring-red-500/60`         |
| `placeholder-opacity-40` | `placeholder-gray-400/40` |

**Examples:**

```html
<div class="bg-blue-500/50"><!-- 50% opacity --></div>
<div class="bg-red-500/[0.85]"><!-- Arbitrary opacity --></div>
```

---

### Flex Utilities Renamed

| Deprecated v3   | v4 Replacement |
| --------------- | -------------- |
| `flex-shrink-0` | `shrink-0`     |
| `flex-shrink`   | `shrink`       |
| `flex-grow-0`   | `grow-0`       |
| `flex-grow`     | `grow`         |

---

### Text/Decoration Utilities Renamed

| Deprecated v3       | v4 Replacement         |
| ------------------- | ---------------------- |
| `overflow-ellipsis` | `text-ellipsis`        |
| `decoration-slice`  | `box-decoration-slice` |
| `decoration-clone`  | `box-decoration-clone` |

---

## Gradient API Changes

### Linear Gradients (Renamed from `bg-gradient-*`)

**v3:**

```html
<div class="bg-gradient-to-r from-red-500 to-blue-500"></div>
```

**v4:**

```html
<div class="bg-linear-to-r from-red-500 to-blue-500"></div>
```

**Patterns:**

- `bg-linear-to-r` - Linear gradient to right
- `bg-linear-to-l` - Linear gradient to left
- `bg-linear-to-t` - Linear gradient to top
- `bg-linear-to-b` - Linear gradient to bottom
- `bg-linear-to-tr` - Linear gradient to top-right
- `bg-linear-to-tl` - Linear gradient to top-left
- `bg-linear-to-br` - Linear gradient to bottom-right
- `bg-linear-to-bl` - Linear gradient to bottom-left

**Angle-based:**

```html
<div class="bg-linear-45"><!-- 45-degree gradient --></div>
<div class="bg-linear-90"><!-- 90-degree gradient --></div>
<div class="bg-linear-[135deg]"><!-- Arbitrary angle --></div>
```

**Interpolation modifiers:**

```html
<div class="bg-linear-to-r/srgb"><!-- sRGB interpolation --></div>
<div class="bg-linear-to-r/oklch"><!-- OKLch interpolation --></div>
<div class="bg-linear-to-r/hsl"><!-- HSL interpolation --></div>
```

---

### Conic Gradients (NEW in v4)

**Pattern:** `bg-conic-{angle}` or `bg-conic-[arbitrary]`

**Examples:**

```html
<div class="bg-conic from-red-500 to-blue-500"><!-- Basic conic --></div>
<div class="bg-conic-[from_45deg] from-purple-500 to-pink-500"><!-- From angle --></div>
<div class="bg-conic-[at_25%_25%] from-white to-black"><!-- Position --></div>
<div class="bg-conic/[in_hsl_longer_hue] from-red-600 to-red-600"><!-- Interpolation --></div>
```

---

### Radial Gradients (NEW in v4)

**Pattern:** `bg-radial-{shape}` or `bg-radial-[arbitrary]`

**Examples:**

```html
<div class="bg-radial from-blue-500 to-transparent"><!-- Basic radial --></div>
<div class="bg-radial-[circle] from-red-500 to-yellow-500"><!-- Circle shape --></div>
<div class="bg-radial-[at_25%_25%] from-white to-zinc-900"><!-- Position --></div>
<div class="bg-radial-[ellipse_at_center] from-purple-500 to-pink-500"><!-- Ellipse --></div>
```

**Gradient stop positions:**

```html
<div class="bg-radial from-white to-black to-75%"><!-- Stop at 75% --></div>
```

---

### Gradient Variant Behavior Changed

**v3 behavior:** Applying a gradient variant resets the ENTIRE gradient

**v4 behavior:** Variants preserve existing values, only override specified ones

**Example:**

```html
<!-- v3: dark:from-blue-500 resets "to-*" to transparent -->
<div class="bg-gradient-to-r from-red-500 to-yellow-400 dark:from-blue-500">
  <!-- v4: Must explicitly unset with via-none -->
  <div
    class="bg-linear-to-r dark:via-none from-red-500 via-orange-400 to-yellow-400 dark:from-blue-500 dark:to-teal-400"
  ></div>
</div>
```

**New utility:** `via-none` to unset three-stop gradients

---

## Dynamic Utility Values

### Grid Columns (No Configuration Needed)

**v3:** Required configuration for custom grid columns
**v4:** Any numeric value works out of the box

**Examples:**

```html
<div class="grid-cols-15 grid"><!-- 15 columns --></div>
<div class="grid-cols-20 grid"><!-- 20 columns --></div>
<div class="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))]"><!-- Arbitrary --></div>
```

---

### Data Attributes (No Configuration Needed)

**v3:** Required `@layer` declaration for custom data attributes
**v4:** Boolean data attributes work out of the box

**Examples:**

```html
<div data-current class="data-current:opacity-100 opacity-75">
  <!-- Automatically detects data-current attribute -->
</div>

<div data-state="open" class="data-[state=open]:bg-blue-500">
  <!-- Value-based data attributes -->
</div>

<button data-loading class="data-loading:animate-spin">
  <!-- Boolean data attribute -->
</button>
```

---

### Spacing Scale (Single Variable)

**v4:** All spacing utilities dynamically accept any multiplier

**CSS variable:**

```css
@layer theme {
  :root {
    --spacing: 0.25rem;
  }
}
```

**Generated utilities:**

```css
.mt-8 {
  margin-top: calc(var(--spacing) * 8);
}
.w-17 {
  width: calc(var(--spacing) * 17);
}
.pr-29 {
  padding-right: calc(var(--spacing) * 29);
}
.gap-73 {
  gap: calc(var(--spacing) * 73);
}
```

**Examples:**

```html
<div class="mt-17"><!-- Any number works --></div>
<div class="px-73"><!-- No configuration needed --></div>
<div class="gap-142"><!-- Infinite possibilities --></div>
```

---

## Configuration Changes

### CSS-First Configuration (v4)

**v3:** JavaScript `tailwind.config.js`
**v4:** CSS `@theme` directive (recommended)

**v4 CSS configuration:**

```css
@import "tailwindcss";

@theme {
  --font-display: "Satoshi", "sans-serif";
  --breakpoint-3xl: 1920px;
  --color-avocado-100: oklch(0.99 0 0);
  --color-avocado-500: oklch(0.84 0.18 117.33);
  --ease-fluid: cubic-bezier(0.3, 0, 0, 1);
  --ease-snappy: cubic-bezier(0.2, 0, 0, 1);
}
```

**Generated classes:**

```html
<div class="font-display"><!-- Uses --font-display --></div>
<div class="3xl:hidden"><!-- Uses --breakpoint-3xl --></div>
<div class="bg-avocado-500"><!-- Uses --color-avocado-500 --></div>
<div class="ease-fluid"><!-- Uses --ease-fluid --></div>
```

---

### JavaScript Config Still Supported (with @config)

**v4:** JavaScript config requires explicit `@config` directive

```css
@config "../../tailwind.config.js";
@import "tailwindcss";
```

**Removed config options in v4:**

- `corePlugins` - No way to disable core utilities
- `safelist` - Not supported
- `separator` - Not supported

---

### Theme Function Changed

**v3:**

```css
background-color: theme(colors.red.500);
```

**v4:** Prefer CSS variables

```css
background-color: var(--color-red-500);
```

**For media queries (CSS variables don't work):**

```css
@media (width >= theme(--breakpoint-xl)) {
  /* ... */
}
```

---

### Container Utility Configuration Removed

**v3:** `center` and `padding` configuration options
**v4:** Use `@utility` directive to customize

```css
@utility container {
  margin-inline: auto;
  padding-inline: 2rem;
}
```

---

## Obfuscation Requirements

### Critical Patterns for Extraction

The obfuscator **MUST** recognize and extract the following v4-specific patterns:

#### 1. Container Query Variants

```regex
@(?:sm|md|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl)(?:\/[\w-]+)?:
@(?:min|max)-(?:sm|md|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl)(?:\/[\w-]+)?:
@\[[^\]]+\](?:\/[\w-]+)?:
@(?:min|max)-\[[^\]]+\](?:\/[\w-]+)?:
```

**Examples to extract:**

- `@lg:flex`
- `@min-[400px]:grid`
- `@max-[800px]:hidden`
- `@[500px]/card:block`

#### 2. Logical Variants

```regex
not-[\w-]+:
not-\[[^\]]+\]:
in-[\w-]+:
in-\[[^\]]+\]:
in-[\w-]+-\[[^\]]+\]:
in-\[\[[^\]]+\]\]:
nth-\d+:
nth-\[[^\]]+\]:
nth-(?:even|odd):
```

**Examples to extract:**

- `not-hover:opacity-50`
- `in-hover:text-blue-500`
- `nth-2:font-bold`
- `nth-[2n+1]:bg-gray-50`

#### 3. Wildcard Selectors

```regex
\*:[\w-]+
\*\*:[\w-]+
```

**Examples to extract:**

- `*:first:pt-0`
- `**:text-gray-500`

#### 4. New Utilities

```regex
inset-shadow-(?:xs|sm|md|lg|xl|2xl|[\w.-]+|\[[^\]]+\])
inset-ring-(?:\d+|[\w.-]+|\[[^\]]+\])
field-sizing-(?:content|fixed)
color-scheme-(?:light|dark|auto)
font-stretch-(?:condensed|expanded|ultra-condensed|[\w.-]+|\[[^\]]+\])
```

**Examples to extract:**

- `inset-shadow-sm`
- `inset-ring-2`
- `field-sizing-content`
- `color-scheme-dark`
- `font-stretch-condensed`

#### 5. 3D Transform Utilities

```regex
-?rotate-[xyz]-(?:\d+|[\w.-]+|\[[^\]]+\])
-?scale-z-(?:\d+|[\w.-]+|\[[^\]]+\])
-?translate-z-(?:\d+|[\w.-]+|\[[^\]]+\])
perspective-(?:\d+|[\w.-]+|\[[^\]]+\])
perspective-origin-(?:[\w-]+|\[[^\]]+\])
transform-3d
```

**Examples to extract:**

- `rotate-x-45`
- `scale-z-150`
- `translate-z-4`
- `perspective-1000`
- `transform-3d`

#### 6. Gradient Utilities

```regex
bg-(?:linear|radial|conic)-(?:[\w-]+|\[[^\]]+\])(?:\/[\w\[\]]+)?
bg-linear-\d+
bg-linear-to-[rltb]{1,2}
via-none
to-\d+%
```

**Examples to extract:**

- `bg-linear-to-r`
- `bg-radial-[at_25%_25%]`
- `bg-conic/[in_hsl_longer_hue]`
- `via-none`
- `to-75%`

#### 7. Arbitrary Value Syntax (v4)

```regex
[\w-]+-\((?:[\w-]+:)?--[\w-]+(?:,[^)]+)?\)
[\w-]+-\[[^\]]*_[^\]]*\]
```

**Examples to extract:**

- `bg-(--brand-color)` - CSS variable with parentheses
- `text-(color:--my-var)` - CSS variable with property prefix
- `grid-cols-[max-content_auto]` - Underscores for spaces

#### 8. Renamed Utilities (Support Both v3 and v4)

```regex
(?:shadow|drop-shadow|blur|backdrop-blur|rounded)-xs
outline-hidden
shrink-\d+
grow-\d+
text-ellipsis
box-decoration-(?:slice|clone)
```

**Examples to extract:**

- `shadow-xs` (v4) and `shadow-sm` (v3)
- `outline-hidden` (v4) and `outline-none` (v3)
- `shrink-0` (v4) and `flex-shrink-0` (v3)

#### 9. Dynamic Utilities

```regex
grid-cols-\d+
grid-rows-\d+
data-[\w-]+:
data-\[[^\]]+\]:
```

**Examples to extract:**

- `grid-cols-15`
- `data-current:opacity-100`
- `data-[state=open]:bg-blue-500`

---

### Transformation Requirements

When transforming classes, the obfuscator **MUST**:

1. **Preserve variant order:** v4 evaluates left-to-right

   ```html
   <!-- Correct order MUST be preserved -->
   <div class="*:first:pt-0"></div>
   ```

2. **Preserve important modifier position:** `!` must stay at END

   ```html
   <div class="flex! bg-red-500!"></div>
   ```

3. **Preserve arbitrary value syntax:**
   - Parentheses for CSS variables: `bg-(--color)`
   - Underscores for spaces: `grid-cols-[max-content_auto]`

4. **Handle nested brackets:**

   ```html
   <div class="in-[[data-active]]:bg-blue-500"></div>
   ```

5. **Support opacity modifiers:**

   ```html
   <div class="bg-blue-500/50 text-white/75"></div>
   ```

6. **Support gradient stop positions:**
   ```html
   <div class="from-white to-black to-75%"></div>
   ```

---

## Pattern Recognition Updates

### Updated `VARIANT_PREFIXES` Array

Add the following to the variant prefixes list:

```typescript
// Container queries (v4)
"@sm", "@md", "@lg", "@xl", "@2xl", "@3xl", "@4xl", "@5xl", "@6xl", "@7xl",
"@min", "@max",

// Logical variants (v4)
"not", "in", "nth", "nth-last", "nth-of-type", "nth-last-of-type",
"descendant", "inert", "open", "starting",

// Wildcard selectors (v4)
"*", "**",
```

---

### Updated `STATIC_UTILITIES` Set

Add the following static utilities:

```typescript
// v4 utilities
"transform-3d",
"via-none",
"outline-hidden",
"color-scheme-auto",
"color-scheme-light",
"color-scheme-dark",
"field-sizing-content",
"field-sizing-fixed",
```

---

### Updated `FUNCTIONAL_UTILITY_PREFIXES` Array

Add the following functional prefixes:

```typescript
// v4 utilities
"inset-shadow",
"inset-ring",
"font-stretch",
"rotate-x",
"rotate-y",
"rotate-z",
"scale-z",
"translate-z",
"perspective",
"perspective-origin",
"bg-linear",
"bg-radial",
"bg-conic",
```

---

### Updated `isTailwindClass()` Function Patterns

Add the following regex patterns:

```typescript
// Container queries (v4)
/^@(?:sm|md|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl)(?:\/[\w-]+)?$/,
/^@(?:min|max)-(?:sm|md|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl)(?:\/[\w-]+)?$/,
/^@\[[^\]]+\](?:\/[\w-]+)?$/,
/^@(?:min|max)-\[[^\]]+\](?:\/[\w-]+)?$/,

// Logical variants (v4)
/^not-[\w-]+$/,
/^not-\[[^\]]+\]$/,
/^in-[\w-]+$/,
/^in-\[[^\]]+\]$/,
/^in-[\w-]+-\[[^\]]+\]$/,
/^in-\[\[[^\]]+\]\]$/,
/^nth-\d+$/,
/^nth-\[[^\]]+\]$/,
/^nth-(?:even|odd)$/,

// New utilities (v4)
/^inset-(?:shadow|ring)-(?:xs|sm|md|lg|xl|2xl|\d+|[\w.-]+|\[[^\]]+\])$/,
/^field-sizing-(?:content|fixed)$/,
/^color-scheme-(?:light|dark|auto)$/,
/^font-stretch-(?:condensed|expanded|ultra-condensed|[\w.-]+|\[[^\]]+\])$/,

// 3D transforms (v4)
/^-?rotate-[xyz]-(?:\d+|[\w.-]+|\[[^\]]+\])$/,
/^-?scale-z-(?:\d+|[\w.-]+|\[[^\]]+\])$/,
/^-?translate-z-(?:\d+|[\w.-]+|\[[^\]]+\])$/,
/^perspective-(?:\d+|[\w.-]+|\[[^\]]+\])$/,
/^perspective-origin-(?:[\w-]+|\[[^\]]+\])$/,
/^transform-3d$/,

// Gradients (v4)
/^bg-(?:linear|radial|conic)-(?:[\w-]+|\[[^\]]+\])(?:\/[\w\[\]]+)?$/,
/^bg-linear-\d+$/,
/^via-none$/,
/^to-\d+%$/,

// CSS variable syntax (v4)
/^[\w-]+-\((?:[\w-]+:)?--[\w-]+(?:,[^)]+)?\)(?:\/[\w\[\]]+)?$/,

// Arbitrary values with underscores (v4)
/^[\w-]+-\[[^\]]*_[^\]]*\]$/,
```

---

## Color Palette - P3 (OKLch) Format

**v4:** All default colors use `oklch` instead of `rgb`

**Format:**

```css
--color-blue-500: oklch(0.84 0.18 117.33);
--color-red-600: oklch(0.53 0.12 118.34);
```

**Structure:** `oklch(lightness saturation hue)`

**Obfuscation Impact:** No change - color values in arbitrary classes remain unchanged

---

## Summary: Key Obfuscation Challenges

### High Priority

1. **Container query variants with arbitrary values and named containers**
   - `@min-[400px]:`, `@[500px]/card:`, `@lg/sidebar:`

2. **Logical variants with nested brackets**
   - `in-[[data-active]]:`, `in-data-[state=open]:`

3. **Wildcard selectors with variants**
   - `*:first:pt-0`, `**:text-gray-500`

4. **CSS variable parentheses syntax**
   - `bg-(--brand-color)`, `text-(color:--my-var)`

5. **Arbitrary values with underscores**
   - `grid-cols-[max-content_auto]`

6. **3D transform utilities**
   - `rotate-x-45`, `translate-z-4`, `perspective-1000`

7. **New gradient types**
   - `bg-radial-[at_25%_25%]`, `bg-conic/[in_hsl_longer_hue]`

8. **Important modifier at END**
   - `flex!`, `bg-red-500!`

### Medium Priority

9. **Renamed utilities (support both v3 and v4)**
   - `shadow-xs` vs `shadow-sm`, `outline-hidden` vs `outline-none`

10. **Dynamic grid columns**
    - `grid-cols-15`, `grid-cols-[any-value]`

11. **Boolean data attributes**
    - `data-current:opacity-100`

12. **Gradient stop positions**
    - `to-75%`, `from-white`

### Low Priority

13. **Field sizing utilities**
    - `field-sizing-content`

14. **Color scheme utilities**
    - `color-scheme-dark`

15. **Font stretch utilities**
    - `font-stretch-condensed`

---

## Testing Requirements

### Test Cases Needed

1. **Container queries:**

   ```html
   <div class="@lg:flex @min-[400px]:grid @max-[800px]:hidden"></div>
   <div class="@[500px]/card:block @lg/sidebar:flex"></div>
   ```

2. **Logical variants:**

   ```html
   <div class="not-hover:opacity-50 in-hover:text-blue-500"></div>
   <div class="nth-2:font-bold nth-[2n+1]:bg-gray-50"></div>
   <div class="in-[[data-active]]:bg-blue-500"></div>
   ```

3. **Wildcard selectors:**

   ```html
   <ul class="**:text-gray-500 *:py-2 *:first:pt-0"></ul>
   ```

4. **New utilities:**

   ```html
   <div class="inset-shadow-sm inset-ring-2 field-sizing-content"></div>
   <div class="color-scheme-dark font-stretch-condensed"></div>
   <div class="rotate-x-45 translate-z-4 perspective-1000 transform-3d"></div>
   ```

5. **Gradients:**

   ```html
   <div class="bg-linear-to-r from-red-500 to-blue-500"></div>
   <div class="bg-radial-[at_25%_25%] from-white to-black to-75%"></div>
   <div class="bg-conic/[in_hsl_longer_hue] from-red-600 to-red-600"></div>
   ```

6. **CSS variable syntax:**

   ```html
   <div class="bg-(--brand-color) text-(color:--my-var)"></div>
   ```

7. **Arbitrary values with underscores:**

   ```html
   <div class="grid-cols-[max-content_auto]"></div>
   ```

8. **Important modifier:**

   ```html
   <div class="flex! bg-red-500! hover:bg-red-600!"></div>
   ```

9. **Renamed utilities:**

   ```html
   <div class="shadow-xs rounded-xs blur-xs"></div>
   <div class="outline-hidden shrink-0 text-ellipsis"></div>
   ```

10. **Dynamic utilities:**
    ```html
    <div class="grid-cols-15 data-current:opacity-100"></div>
    ```

---

## References

- [Tailwind CSS v4.0 Release](https://tailwindcss.com/blog/tailwindcss-v4)
- [Upgrade Guide](https://tailwindcss.com/docs/upgrade-guide)
- [v4 Alpha Announcement](https://tailwindcss.com/blog/tailwindcss-v4-alpha)

---

## Document Status

**Current Package Support** (audited 2026-04-30 against `packages/tailwindcss-obfuscator/src/core/patterns/`):

- ✅ Container queries (`@sm:`, `@lg:`, `@[500px]:`)
- ✅ Data attributes (`data-[state=open]:`)
- ✅ ARIA variants (`aria-[current=page]:`)
- ✅ Arbitrary values with brackets
- ✅ CSS variable shorthand (v3 syntax `[--var]`)
- ✅ Wildcard selectors `*:` and `**:` — `variants.ts`
- ✅ CSS variable parentheses syntax `bg-(--brand)`, `text-(color:--my-var)` — `validators.ts`
- ✅ Arbitrary values with underscores `grid-cols-[max-content_auto]` — `validators.ts`
- ✅ `inset-shadow-*`, `inset-ring-*` utilities — `utilities.ts`
- ✅ 3D transform utilities (`rotate-x-*`, `rotate-y-*`, `rotate-z-*`, `scale-z-*`, `translate-z-*`, `perspective-*`, `perspective-origin-*`, `transform-3d`) — `utilities.ts`
- ✅ New gradient types (`bg-radial-*`, `bg-conic-*`) — `utilities.ts`
- ✅ `field-sizing-*`, `color-scheme-*`, `font-stretch-*` — `utilities.ts`
- ✅ Renamed utilities recognition (both v3 names like `flex-shrink` and v4 names like `shrink`) — `utilities.ts`
- ✅ Important modifier at END (`flex!` accepted alongside `!flex`) — `validators.ts`
- ✅ Nested bracket support (`in-[[data-active]]:`) — basic patterns work; deeply-nested edge cases see [Limitations](../reference/limitations#not-in-nth-variants-supported-edge-cases-possible)
- ⚠️ **PARTIAL** — `not-*`, `in-*`, `nth-*` variants : basic shapes covered, deeply-nested arbitrary values may not extract — see [Limitations](../reference/limitations#not-in-nth-variants-supported-edge-cases-possible)
- ⚠️ **PARTIAL** — `tv()` (tailwind-variants) : simple flat patterns work, composed variants may break — tracked in [issue #61](https://github.com/josedacosta/tailwindcss-obfuscator/issues/61) and [Limitations](../reference/limitations)

**Verification** : every check above is exercised by [`tests/tailwind-v4-patterns.test.ts`](https://github.com/josedacosta/tailwindcss-obfuscator/blob/main/packages/tailwindcss-obfuscator/tests/tailwind-v4-patterns.test.ts) and [`tests/comprehensive-patterns.test.ts`](https://github.com/josedacosta/tailwindcss-obfuscator/blob/main/packages/tailwindcss-obfuscator/tests/comprehensive-patterns.test.ts) (44 + 86 cases).
