# Tailwind CSS v4 - Quick Reference Summary

**Generated:** 2025-12-08
**Full Analysis:** See [v4 Features Analysis](./tailwind-v4-features-analysis)

---

## Critical v4 Changes for Obfuscation

### 1. New Variants (Must Support)

| Variant           | Pattern                              | Example                  |
| ----------------- | ------------------------------------ | ------------------------ |
| Container queries | `@sm:`, `@lg:`, `@[500px]:`          | `@lg:flex`               |
| Container min/max | `@min-[400px]:`, `@max-[800px]:`     | `@min-[400px]:grid`      |
| Named containers  | `@lg/sidebar:`                       | `@lg/sidebar:block`      |
| Negation          | `not-hover:`, `not-first:`           | `not-hover:opacity-75`   |
| Descendant (in)   | `in-hover:`, `in-data-[state=open]:` | `in-hover:text-blue-500` |
| Nth-child         | `nth-1:`, `nth-[2n+1]:`              | `nth-2:font-bold`        |
| Wildcard          | `*:`, `**:`                          | `*:first:pt-0`           |
| Inert             | `inert:`                             | `inert:opacity-50`       |
| Open              | `open:`                              | `open:bg-blue-500`       |
| Starting          | `starting:`                          | `starting:opacity-0`     |

### 2. New Utilities (Must Support)

| Utility          | Pattern                                  | Example                  |
| ---------------- | ---------------------------------------- | ------------------------ |
| Inset shadows    | `inset-shadow-*`                         | `inset-shadow-sm`        |
| Inset rings      | `inset-ring-*`                           | `inset-ring-2`           |
| Field sizing     | `field-sizing-*`                         | `field-sizing-content`   |
| Color scheme     | `color-scheme-*`                         | `color-scheme-dark`      |
| Font stretch     | `font-stretch-*`                         | `font-stretch-condensed` |
| 3D rotations     | `rotate-x-*`, `rotate-y-*`, `rotate-z-*` | `rotate-x-45`            |
| 3D transforms    | `scale-z-*`, `translate-z-*`             | `translate-z-4`          |
| Perspective      | `perspective-*`                          | `perspective-1000`       |
| Radial gradients | `bg-radial-*`                            | `bg-radial-[at_25%_25%]` |
| Conic gradients  | `bg-conic-*`                             | `bg-conic-[from_45deg]`  |

### 3. Renamed Utilities (Support Both)

| v3                  | v4                     | Type       |
| ------------------- | ---------------------- | ---------- |
| `shadow-sm`         | `shadow-xs`            | Shadow     |
| `shadow`            | `shadow-sm`            | Shadow     |
| `rounded-sm`        | `rounded-xs`           | Radius     |
| `rounded`           | `rounded-sm`           | Radius     |
| `blur-sm`           | `blur-xs`              | Blur       |
| `blur`              | `blur-sm`              | Blur       |
| `outline-none`      | `outline-hidden`       | Outline    |
| `flex-shrink-*`     | `shrink-*`             | Flex       |
| `flex-grow-*`       | `grow-*`               | Flex       |
| `overflow-ellipsis` | `text-ellipsis`        | Text       |
| `decoration-slice`  | `box-decoration-slice` | Decoration |
| `bg-gradient-*`     | `bg-linear-*`          | Gradient   |

### 4. Removed Utilities (Only v4 Syntax)

| Removed v3         | v4 Replacement       |
| ------------------ | -------------------- |
| `bg-opacity-*`     | `bg-black/50`        |
| `text-opacity-*`   | `text-white/75`      |
| `border-opacity-*` | `border-gray-500/25` |

### 5. Syntax Changes (Critical)

#### CSS Variables

- **v3:** `bg-[--brand-color]` (brackets)
- **v4:** `bg-(--brand-color)` (parentheses) ⚠️

#### Arbitrary Values with Spaces

- **v3:** `grid-cols-[max-content,auto]` (commas)
- **v4:** `grid-cols-[max-content_auto]` (underscores) ⚠️

#### Important Modifier

- **v3:** `!flex` or `flex!`
- **v4:** `flex!` (ONLY at end) ⚠️

#### Variant Order

- **v3:** Right-to-left: `first:*:pt-0`
- **v4:** Left-to-right: `*:first:pt-0` ⚠️

### 6. Dynamic Values (No Config Needed)

```html
<!-- Grid columns - any number works -->
<div class="grid-cols-15 grid-cols-20 grid-cols-73"></div>

<!-- Spacing - any multiplier works -->
<div class="mt-17 px-73 gap-142"></div>

<!-- Data attributes - automatic -->
<div data-current class="data-current:opacity-100"></div>
```

---

## Regex Patterns for Extraction

### Container Queries

```regex
@(?:sm|md|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl)(?:\/[\w-]+)?:
@(?:min|max)-(?:sm|md|lg|xl|2xl)(?:\/[\w-]+)?:
@\[[^\]]+\](?:\/[\w-]+)?:
@(?:min|max)-\[[^\]]+\](?:\/[\w-]+)?:
```

### Logical Variants

```regex
not-[\w-]+:
in-[\w-]+:
in-\[[^\]]+\]:
nth-\d+:
nth-\[[^\]]+\]:
```

### Wildcard Selectors

```regex
\*:[\w-]+
\*\*:[\w-]+
```

### New Utilities

```regex
inset-(?:shadow|ring)-[\w-]+
field-sizing-(?:content|fixed)
color-scheme-(?:light|dark|auto)
font-stretch-[\w-]+
rotate-[xyz]-\d+
translate-z-\d+
perspective-\d+
bg-(?:radial|conic)-[\w\[\]-]+
```

### CSS Variable Syntax (v4)

```regex
[\w-]+-\(--[\w-]+\)
[\w-]+-\([\w-]+:--[\w-]+\)
```

### Arbitrary Values with Underscores

```regex
[\w-]+-\[[^\]]*_[^\]]*\]
```

---

## Current Package Status

### ✅ Supported (Confirmed)

- Basic container queries (`@sm:`, `@lg:`)
- Arbitrary container queries (`@[500px]:`)
- Data attributes (`data-[state=open]:`)
- ARIA variants (`aria-[current=page]:`)
- Arbitrary values with brackets
- CSS variables v3 syntax (`[--var]`)
- Opacity modifiers (`bg-blue-500/50`)

### ⚠️ Partial Support

- `not-*` variants (basic patterns)
- `in-*` variants (basic patterns)
- `nth-*` variants (basic patterns)

### ❌ Missing Support (Must Add)

**High Priority:**

1. Wildcard selectors (`*:`, `**:`)
2. CSS variable parentheses syntax `(--var)`
3. Arbitrary values with underscores
4. Named container queries (`@lg/sidebar:`)
5. Nested brackets (`in-[[data-active]]:`)
6. Important modifier at END enforcement
7. Variant order preservation (left-to-right)

**Medium Priority:** 8. 3D transform utilities (`rotate-x-*`, `perspective-*`) 9. Inset shadow/ring utilities 10. New gradient types (`bg-radial-*`, `bg-conic-*`) 11. Gradient stop positions (`to-75%`) 12. Renamed utility recognition (both v3 and v4)

**Low Priority:** 13. `field-sizing-*` utilities 14. `color-scheme-*` utilities 15. `font-stretch-*` utilities 16. Dynamic grid columns (`grid-cols-15`)

---

## Action Items

### Code Updates Required

1. **`src/extractors/base.ts`:**
   - Add v4 variants to `VARIANT_PREFIXES` array
   - Add v4 utilities to `STATIC_UTILITIES` set
   - Add v4 prefixes to `FUNCTIONAL_UTILITY_PREFIXES` array
   - Update `isTailwindClass()` with v4 regex patterns
   - Update `normalizeClassName()` for wildcard selectors

2. **`src/extractors/jsx.ts`:**
   - Handle CSS variable parentheses syntax
   - Handle arbitrary values with underscores
   - Handle nested brackets in variants

3. **`src/transformers/jsx.ts`:**
   - Preserve variant order (left-to-right)
   - Enforce important modifier at END
   - Handle wildcard selectors

4. **`src/transformers/css.ts`:**
   - Support 3D transform selectors
   - Support new gradient selectors
   - Handle renamed utilities (both v3 and v4)

### Test Coverage Needed

Create test files for:

- ✅ Container queries (basic)
- ❌ Named container queries
- ❌ Wildcard selectors
- ❌ Logical variants (comprehensive)
- ❌ 3D transforms
- ❌ New gradients
- ❌ CSS variable parentheses
- ❌ Arbitrary underscores
- ❌ Important modifier position
- ❌ Variant order preservation

---

## Quick Test Cases

```html
<!-- Container queries -->
<div class="@lg:flex @min-[400px]:grid @max-[800px]:hidden"></div>
<div class="@[500px]/card:block @lg/sidebar:flex"></div>

<!-- Logical variants -->
<div class="not-hover:opacity-50 in-hover:text-blue-500"></div>
<div class="nth-2:font-bold nth-[2n+1]:bg-gray-50"></div>
<div class="in-[[data-active]]:bg-blue-500"></div>

<!-- Wildcard selectors -->
<ul class="**:text-gray-500 *:py-2 *:first:pt-0"></ul>

<!-- 3D transforms -->
<div class="rotate-x-45 translate-z-4 perspective-1000 transform-3d"></div>

<!-- Gradients -->
<div class="bg-linear-to-r from-red-500 to-blue-500"></div>
<div class="bg-radial-[at_25%_25%] from-white to-black to-75%"></div>
<div class="bg-conic/[in_hsl_longer_hue] from-red-600 to-red-600"></div>

<!-- CSS variables (v4) -->
<div class="bg-(--brand-color) text-(color:--my-var)"></div>

<!-- Arbitrary underscores -->
<div class="grid-cols-[max-content_auto]"></div>

<!-- Important at END -->
<div class="flex! bg-red-500! hover:bg-red-600!"></div>

<!-- Renamed utilities -->
<div class="shadow-xs rounded-xs blur-xs"></div>
<div class="outline-hidden shrink-0 text-ellipsis"></div>

<!-- Dynamic utilities -->
<div class="grid-cols-15 data-current:opacity-100"></div>
```

---

## References

- **Full Analysis:** [v4 Features Analysis](./tailwind-v4-features-analysis)
- **Tailwind v4 Docs:** https://tailwindcss.com/docs/upgrade-guide
- **Release Post:** https://tailwindcss.com/blog/tailwindcss-v4

---

**Next Review Date:** After implementation of high-priority items
