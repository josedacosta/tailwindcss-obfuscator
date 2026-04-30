# Tailwind CSS v4 - Implementation Checklist

**Status:** In Progress
**Updated:** 2025-12-08
**Package:** tailwindcss-obfuscator

---

## Current Implementation Status

### ✅ Already Implemented (Confirmed by Code Review)

#### Variants

- ✅ Container queries: `@sm:`, `@md:`, `@lg:`, `@xl:`, `@2xl:`
- ✅ Container min/max: `@min-[400px]:`, `@max-[800px]:`
- ✅ Named containers: `@lg/sidebar:`, `@[500px]/card:`
- ✅ Data attributes: `data-[state=open]:`, `data-disabled:`
- ✅ ARIA variants: `aria-[current=page]:`, `aria-pressed:`
- ✅ `not-*` variants: `not-hover:`, `not-focus:` (basic support)
- ✅ `in-*` variants: `in-hover:`, `in-data-[state=open]:` (basic support)
- ✅ `nth-*` variants: `nth-1:`, `nth-[2n+1]:`, `nth-even:`, `nth-odd:`
- ✅ Nested brackets: `in-[[data-active]]:` (pattern exists)

#### Utilities

- ✅ Arbitrary values: `bg-[#1da1f2]`, `w-[calc(100%-2rem)]`
- ✅ Opacity modifiers: `bg-blue-500/50`, `text-white/75`
- ✅ CSS variables (v3 syntax): `bg-[var(--my-color)]`

#### Code Locations

- `src/extractors/base.ts` lines 148-206: VARIANT_PREFIXES includes v4 variants
- `src/extractors/base.ts` lines 1206-1227: Variant patterns for not/in/nth
- `src/extractors/base.ts` lines 1044-1051: Container query patterns

---

## ❌ Missing Implementation (Must Add)

### High Priority (Breaking Changes)

#### 1. Wildcard Selectors (`*:`, `**:`)

**Status:** ❌ NOT IMPLEMENTED
**Impact:** HIGH - Common pattern in v4

**Required Changes:**

```typescript
// src/extractors/base.ts - Line ~168
export const VARIANT_PREFIXES = [
  // ... existing variants ...
  // Wildcard selectors (v4)
  "*", // ADD
  "**", // ADD
];
```

**Test Case:**

```html
<ul class="**:text-gray-500 *:py-2 *:first:pt-0"></ul>
```

**Files to modify:**

- `src/extractors/base.ts` - Add to VARIANT_PREFIXES
- `src/extractors/base.ts` - Update normalizeClassName() to handle `*` and `**`
- `src/transformers/jsx.ts` - Preserve wildcard selectors during transformation

---

#### 2. CSS Variable Parentheses Syntax `(--var)`

**Status:** ❌ NOT IMPLEMENTED
**Impact:** HIGH - v4 breaking change

**Current:** Only supports `bg-[var(--color)]` (v3 syntax)
**v4 Syntax:** `bg-(--brand-color)`

**Required Changes:**

```typescript
// src/extractors/base.ts - Add pattern
export const CSS_VARIABLE_PARENTHESES_PATTERN = /\((?:[\w-]+:)?--[\w-]+(?:,[^)]+)?\)/g;

// Add to isTailwindClass() patterns
/^(?:bg|text|border(?:-[trblxyse])?|outline|ring(?:-offset)?|shadow|accent|caret|fill|stroke|divide(?:-[xy])?|from|via|to)-\((?:[\w-]+:)?--[\w-]+(?:,[^)]+)?\)(?:\/(?:\d+|\[[^\]]+\]))?$/,
```

**Test Cases:**

```html
<div class="bg-(--brand-color)"></div>
<div class="text-(color:--my-var)"></div>
<div class="bg-(--fallback,#1da1f2)"></div>
```

**Files to modify:**

- `src/extractors/base.ts` - Add CSS_VARIABLE_PARENTHESES_PATTERN
- `src/extractors/base.ts` - Add pattern to isTailwindClass()
- `src/extractors/jsx.ts` - Handle parentheses in extraction

---

#### 3. Arbitrary Values with Underscores

**Status:** ❌ NOT IMPLEMENTED
**Impact:** HIGH - v4 breaking change

**v3:** `grid-cols-[max-content,auto]` (commas)
**v4:** `grid-cols-[max-content_auto]` (underscores)

**Required Changes:**

```typescript
// src/extractors/base.ts - Update extractClassesFromString()
// Handle underscores as spaces within arbitrary values

// Add pattern to isTailwindClass()
/^[\w-]+-\[[^\]]*_[^\]]*\]$/,
```

**Test Cases:**

```html
<div class="grid-cols-[max-content_auto]"></div>
<div class="grid-rows-[100px_1fr_50px]"></div>
```

**Files to modify:**

- `src/extractors/base.ts` - Update extractClassesFromString() logic
- `src/extractors/base.ts` - Add pattern to isTailwindClass()

---

#### 4. Important Modifier Position Enforcement

**Status:** ⚠️ PARTIAL - Accepts both positions
**Impact:** MEDIUM - v4 standardizes on END position

**v3:** `!flex` or `flex!`
**v4:** `flex!` (ONLY at end)

**Required Changes:**

```typescript
// src/transformers/jsx.ts - Normalize important position
function normalizeImportantPosition(className: string): string {
  // Move ! to end if at beginning
  if (className.startsWith("!")) {
    return className.substring(1) + "!";
  }
  return className;
}
```

**Test Cases:**

```html
<!-- Input (v3 style) -->
<div class="!flex !bg-red-500"></div>

<!-- Expected output (v4 style) -->
<div class="flex! bg-red-500!"></div>
```

**Files to modify:**

- `src/transformers/jsx.ts` - Add normalizeImportantPosition()
- `src/transformers/html.ts` - Add normalizeImportantPosition()

---

#### 5. Variant Order Preservation

**Status:** ⚠️ NEEDS VERIFICATION
**Impact:** HIGH - v4 evaluates left-to-right

**v3:** `first:*:pt-0` (right-to-left)
**v4:** `*:first:pt-0` (left-to-right)

**Required Changes:**

- Ensure transformation preserves exact variant order
- Don't reorder variants during obfuscation

**Test Cases:**

```html
<ul class="*:first:pt-0 *:last:pb-0"></ul>
<div class="hover:not-focus:bg-gray-100"></div>
```

**Files to verify:**

- `src/transformers/jsx.ts` - Verify no variant reordering
- `src/transformers/html.ts` - Verify no variant reordering

---

### Medium Priority (New Utilities)

#### 6. 3D Transform Utilities

**Status:** ❌ NOT IMPLEMENTED
**Impact:** MEDIUM - New v4 feature

**Required Additions:**

```typescript
// src/extractors/base.ts - Add to FUNCTIONAL_UTILITY_PREFIXES
"rotate-x",
"rotate-y",
"rotate-z",
"scale-z",
"translate-z",
"perspective",
"perspective-origin",

// Add to STATIC_UTILITIES
"transform-3d",

// Add patterns to isTailwindClass()
/^-?rotate-[xyz]-(?:\d+|[\w.-]+|\[[^\]]+\])$/,
/^-?scale-z-(?:\d+|[\w.-]+|\[[^\]]+\])$/,
/^-?translate-z-(?:\d+|[\w.-]+|\[[^\]]+\])$/,
/^perspective-(?:\d+|[\w.-]+|\[[^\]]+\])$/,
/^perspective-origin-(?:[\w-]+|\[[^\]]+\])$/,
/^transform-3d$/,
```

**Test Cases:**

```html
<div class="rotate-x-45 rotate-y-90 rotate-z-180"></div>
<div class="scale-z-150 translate-z-4"></div>
<div class="perspective-1000 perspective-origin-center transform-3d"></div>
```

---

#### 7. Inset Shadow & Ring Utilities

**Status:** ❌ NOT IMPLEMENTED
**Impact:** MEDIUM - New v4 feature

**Required Additions:**

```typescript
// src/extractors/base.ts - Add to FUNCTIONAL_UTILITY_PREFIXES
"inset-shadow",
"inset-ring",

// Add patterns to isTailwindClass()
/^inset-shadow-(?:xs|sm|md|lg|xl|2xl|[\w.-]+|\[[^\]]+\])$/,
/^inset-ring-(?:\d+|[\w.-]+|\[[^\]]+\])$/,
```

**Test Cases:**

```html
<div class="inset-shadow-sm inset-shadow-md"></div>
<input class="inset-ring-1 inset-ring-2"></input>
```

---

#### 8. New Gradient Types (Radial & Conic)

**Status:** ❌ NOT IMPLEMENTED
**Impact:** MEDIUM - New v4 feature

**Required Additions:**

```typescript
// src/extractors/base.ts - Add to FUNCTIONAL_UTILITY_PREFIXES
"bg-linear",    // Replaces bg-gradient-to
"bg-radial",
"bg-conic",

// Add to STATIC_UTILITIES
"via-none",

// Add patterns to isTailwindClass()
/^bg-(?:linear|radial|conic)-(?:[\w-]+|\[[^\]]+\])(?:\/[\w\[\]]+)?$/,
/^bg-linear-\d+$/,
/^via-none$/,
/^(?:from|via|to)-\d+%$/,  // Gradient stop positions
```

**Test Cases:**

```html
<div class="bg-linear-to-r from-red-500 to-blue-500"></div>
<div class="bg-radial-[at_25%_25%] from-white to-black to-75%"></div>
<div class="bg-conic/[in_hsl_longer_hue] from-red-600 to-red-600"></div>
<div class="bg-linear-to-r via-none from-red-500 via-orange-500"></div>
```

---

#### 9. Renamed Utility Support (Dual Recognition)

**Status:** ❌ NOT IMPLEMENTED
**Impact:** MEDIUM - Need to support both v3 and v4

**Required Changes:**

```typescript
// src/extractors/base.ts - Add v4 renamed utilities to STATIC_UTILITIES
"outline-hidden",  // v4 for outline-none
"text-ellipsis",   // v4 for overflow-ellipsis

// Add v4 utilities to patterns
// shadow-xs, shadow-sm (v4) vs shadow-sm, shadow (v3)
// rounded-xs, rounded-sm (v4) vs rounded-sm, rounded (v3)
// blur-xs, blur-sm (v4) vs blur-sm, blur (v3)

// Create mapping for renamed utilities
export const V4_RENAMED_UTILITIES = {
  // v3 -> v4
  'shadow-sm': 'shadow-xs',
  'shadow': 'shadow-sm',
  'rounded-sm': 'rounded-xs',
  'rounded': 'rounded-sm',
  'blur-sm': 'blur-xs',
  'blur': 'blur-sm',
  'outline-none': 'outline-hidden',
  'flex-shrink': 'shrink',
  'flex-grow': 'grow',
  'overflow-ellipsis': 'text-ellipsis',
  'decoration-slice': 'box-decoration-slice',
  'decoration-clone': 'box-decoration-clone',
};
```

**Test Cases:**

```html
<!-- v3 syntax -->
<div class="rounded-sm shadow-sm blur-sm"></div>
<div class="flex-shrink overflow-ellipsis outline-none"></div>

<!-- v4 syntax -->
<div class="shadow-xs rounded-xs blur-xs"></div>
<div class="outline-hidden shrink text-ellipsis"></div>
```

---

### Low Priority (Nice to Have)

#### 10. Field Sizing Utilities

**Status:** ❌ NOT IMPLEMENTED
**Impact:** LOW - Niche feature

```typescript
// Add to STATIC_UTILITIES
"field-sizing-content",
"field-sizing-fixed",
```

#### 11. Color Scheme Utilities

**Status:** ❌ NOT IMPLEMENTED
**Impact:** LOW - Niche feature

```typescript
// Add to STATIC_UTILITIES
"color-scheme-auto",
"color-scheme-light",
"color-scheme-dark",
```

#### 12. Font Stretch Utilities

**Status:** ❌ NOT IMPLEMENTED
**Impact:** LOW - Variable fonts

```typescript
// Add to FUNCTIONAL_UTILITY_PREFIXES
"font-stretch",

// Add pattern
/^font-stretch-(?:condensed|expanded|ultra-condensed|[\w.-]+|\[[^\]]+\])$/,
```

---

## Implementation Priority Order

### Phase 1: Critical Breaking Changes (Week 1)

1. ✅ Wildcard selectors (`*:`, `**:`)
2. ✅ CSS variable parentheses `(--var)`
3. ✅ Arbitrary values with underscores
4. ✅ Important modifier position enforcement
5. ✅ Variant order preservation verification

### Phase 2: High-Value New Features (Week 2)

6. ✅ 3D transform utilities
7. ✅ Inset shadow & ring utilities
8. ✅ New gradient types (radial & conic)
9. ✅ Renamed utility support (dual recognition)

### Phase 3: Nice to Have (Week 3)

10. ⬜ Field sizing utilities
11. ⬜ Color scheme utilities
12. ⬜ Font stretch utilities
13. ⬜ Dynamic grid columns (`grid-cols-15`)

---

## Testing Strategy

### Unit Tests Required

Create test files:

- ✅ `tests/extractors/v4-variants.test.ts` - Wildcard, not, in, nth
- ✅ `tests/extractors/v4-utilities.test.ts` - 3D transforms, shadows, gradients
- ✅ `tests/extractors/v4-syntax.test.ts` - CSS var parentheses, underscores
- ✅ `tests/transformers/v4-preservation.test.ts` - Variant order, important position

### Integration Tests Required

Test with actual v4 projects:

- ✅ `apps/test-tailwind-v4/` - Already exists
- ✅ Create comprehensive example components using all v4 features
- ✅ Verify obfuscation works correctly
- ✅ Verify CSS output is valid

---

## Documentation Updates

### Files to Update

- ✅ `README.md` - Add v4 features section
- ✅ `docs/guide/tailwind-v4-support.md` - NEW comprehensive guide
- ✅ `CHANGELOG.md` - Document v4 support additions
- ✅ `packages/tailwindcss-obfuscator/README.md` - Update with v4 examples

---

## Compatibility Strategy

### Version Detection

```typescript
// Auto-detect Tailwind version from project
export function detectTailwindVersion(projectRoot: string): "3" | "4" {
  // Check for @import "tailwindcss" in CSS files
  // Check for @tailwind directives (v3)
  // Check package.json for tailwindcss version
}
```

### Dual Support Mode

- Support BOTH v3 and v4 syntax simultaneously
- Don't force users to migrate
- Detect version and adapt patterns accordingly

---

## Files Requiring Modification

### Core Files (High Priority)

1. `src/extractors/base.ts` - ⚠️ PRIMARY FILE
   - Add v4 variants to VARIANT_PREFIXES
   - Add v4 utilities to STATIC_UTILITIES
   - Add v4 prefixes to FUNCTIONAL_UTILITY_PREFIXES
   - Update isTailwindClass() with v4 patterns
   - Update normalizeClassName() for wildcards

2. `src/extractors/jsx.ts` - ⚠️ SECONDARY
   - Handle CSS variable parentheses
   - Handle arbitrary underscores

3. `src/transformers/jsx.ts` - ⚠️ SECONDARY
   - Add important position normalization
   - Verify variant order preservation

### Supporting Files

4. `src/core/types.ts` - Document v4 support
5. `src/plugins/vite.ts` - Add v4 detection
6. `src/cli/index.ts` - Add v4 options

---

## Success Criteria

### Definition of Done

- ✅ All high-priority patterns recognized and extracted
- ✅ All transformations preserve v4 syntax correctness
- ✅ Test coverage >90% for v4 features
- ✅ Documentation complete with examples
- ✅ Works with existing v3 projects (backward compatible)
- ✅ Works with pure v4 projects
- ✅ Works with mixed v3/v4 projects

### Verification Steps

1. Run full test suite: `pnpm test`
2. Build all test apps: `pnpm build`
3. Visual inspection of obfuscated output
4. Manual testing in browser
5. Performance benchmarks (should be similar to v3)

---

## Timeline Estimate

- **Phase 1 (Critical):** 5-7 days
- **Phase 2 (High-Value):** 3-5 days
- **Phase 3 (Nice to Have):** 2-3 days
- **Testing & Documentation:** 3-4 days

**Total:** 13-19 days (2.5-4 weeks)

---

## Risk Assessment

### High Risk

- ⚠️ CSS variable parentheses syntax may conflict with function calls
- ⚠️ Wildcard selectors may be ambiguous in some contexts
- ⚠️ Variant order changes could break existing obfuscated CSS

### Mitigation

- Extensive testing with real-world v4 projects
- Provide migration guide for users
- Add backward compatibility mode
- Detailed documentation of breaking changes

---

## Related Documents

- **Full Analysis:** [v4 Features Analysis](./tailwind-v4-features-analysis)
- **Quick Reference:** [v4 Quick Reference](./tailwind-v4-summary)
- **Official v4 Upgrade Guide:** https://tailwindcss.com/docs/upgrade-guide

---

**Last Updated:** 2025-12-08
**Next Review:** After Phase 1 completion
