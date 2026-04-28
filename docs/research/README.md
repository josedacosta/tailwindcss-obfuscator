# Tailwind CSS v4 Research Documentation

This directory contains comprehensive research and analysis of Tailwind CSS v4 features, with a focus on requirements for the `tailwindcss-obfuscator` package.

---

## Documents Overview

### 1. `tailwind-v4-features-analysis.md` 📖 **FULL REFERENCE**

**Purpose:** Complete technical reference for all v4 features and changes

**Contents:**

- Browser requirements and dependencies
- Breaking changes from v3 to v4
- New variants (container queries, logical variants, wildcards)
- New utilities (3D transforms, shadows, gradients)
- Renamed/changed utilities
- Removed/deprecated utilities
- Arbitrary value syntax changes
- Configuration changes (CSS-first)
- Pattern recognition requirements
- Comprehensive test cases

**Use When:**

- Implementing new v4 features
- Need detailed technical specifications
- Writing tests for v4 patterns
- Debugging v4 class extraction issues

**Length:** ~2,500 lines (comprehensive)

---

### 2. `tailwind-v4-summary.md` ⚡ **QUICK REFERENCE**

**Purpose:** Quick lookup for v4 changes and patterns

**Contents:**

- Critical changes summary table
- New variants overview
- New utilities overview
- Renamed utilities comparison
- Key regex patterns
- Current package status
- Action items list
- Quick test cases

**Use When:**

- Need quick reference during development
- Checking if a feature is supported
- Looking up regex patterns
- Quick status check

**Length:** ~350 lines (concise)

---

### 3. `v4-implementation-checklist.md` ✅ **ACTION PLAN**

**Purpose:** Step-by-step implementation guide with priority order

**Contents:**

- Current implementation status (what's done)
- Missing features (what's needed)
- Priority-ordered implementation phases
- Specific code changes required
- Files to modify with line numbers
- Test strategy
- Timeline estimates
- Success criteria
- Risk assessment

**Use When:**

- Planning v4 implementation work
- Tracking implementation progress
- Deciding what to work on next
- Creating tasks/issues
- Estimating work effort

**Length:** ~800 lines (actionable)

---

## Key Findings Summary

### ✅ Already Implemented (Good News!)

The package **already supports** many v4 features:

- Container queries: `@sm:`, `@lg:`, `@[500px]:`
- Container min/max: `@min-[400px]:`, `@max-[800px]:`
- Named containers: `@lg/sidebar:`, `@[500px]/card:`
- Data attributes: `data-[state=open]:`, `data-disabled:`
- ARIA variants: `aria-[current=page]:`, `aria-pressed:`
- `not-*`, `in-*`, `nth-*` variants (basic support)
- Nested brackets: `in-[[data-active]]:`
- Opacity modifiers: `bg-blue-500/50`

### ❌ Critical Missing Features

These **MUST be added** for full v4 support:

1. **Wildcard selectors:** `*:`, `**:`
2. **CSS variable parentheses:** `bg-(--brand-color)`
3. **Arbitrary underscores:** `grid-cols-[max-content_auto]`
4. **Important at END:** Enforce `flex!` (not `!flex`)
5. **3D transforms:** `rotate-x-45`, `perspective-1000`
6. **New gradients:** `bg-radial-*`, `bg-conic-*`
7. **Inset shadows:** `inset-shadow-*`, `inset-ring-*`
8. **Renamed utilities:** Support both v3 and v4 names

---

## Implementation Priority

### 🔴 Phase 1: Critical Breaking Changes (Week 1)

**Estimated:** 5-7 days

1. Wildcard selectors (`*:`, `**:`)
2. CSS variable parentheses `(--var)`
3. Arbitrary values with underscores
4. Important modifier position enforcement
5. Variant order preservation

**Impact:** HIGH - These are breaking changes in v4

---

### 🟡 Phase 2: High-Value Features (Week 2)

**Estimated:** 3-5 days

6. 3D transform utilities
7. Inset shadow & ring utilities
8. New gradient types
9. Renamed utility support (dual recognition)

**Impact:** MEDIUM - New features users will expect

---

### 🟢 Phase 3: Nice to Have (Week 3)

**Estimated:** 2-3 days

10. Field sizing utilities
11. Color scheme utilities
12. Font stretch utilities
13. Dynamic grid columns

**Impact:** LOW - Niche features

---

## Quick Start: Implementation Guide

### Step 1: Review Current Status

```bash
# Read the checklist
cat v4-implementation-checklist.md

# Check what's already done
grep -n "✅" v4-implementation-checklist.md

# See what's missing
grep -n "❌" v4-implementation-checklist.md
```

### Step 2: Choose a Feature to Implement

Start with Phase 1 (critical breaking changes):

- Begin with **wildcard selectors** (easiest)
- Then **CSS variable parentheses**
- Then **arbitrary underscores**

### Step 3: Implement Changes

Follow the checklist for each feature:

1. Modify `src/extractors/base.ts` (patterns)
2. Modify `src/extractors/jsx.ts` (extraction)
3. Modify `src/transformers/jsx.ts` (transformation)
4. Add tests in `tests/`
5. Run tests: `pnpm test`

### Step 4: Test with Real v4 Projects

```bash
# Use existing test app
cd apps/test-tailwind-v4

# Add test components with new features
# Build and verify
pnpm build
```

### Step 5: Document Changes

Update:

- `CHANGELOG.md` - What was added
- `README.md` - New feature examples
- This checklist - Mark items as ✅

---

## Code Examples

### Wildcard Selectors Example

```typescript
// src/extractors/base.ts
export const VARIANT_PREFIXES = [
  // ... existing variants ...
  "*", // Direct children wildcard
  "**", // All descendants wildcard
];
```

```html
<!-- Test case -->
<ul class="**:text-gray-500 *:py-2 *:first:pt-0">
  <li>Item 1</li>
  <li>Item 2</li>
</ul>
```

### CSS Variable Parentheses Example

```typescript
// src/extractors/base.ts
// Add pattern to isTailwindClass()
/^(?:bg|text|border)-\(--[\w-]+\)$/,
```

```html
<!-- Test case -->
<div class="bg-(--brand-color) text-(color:--my-var)"></div>
```

### 3D Transforms Example

```typescript
// src/extractors/base.ts
export const FUNCTIONAL_UTILITY_PREFIXES = [
  // ... existing prefixes ...
  "rotate-x",
  "rotate-y",
  "rotate-z",
  "perspective",
];
```

```html
<!-- Test case -->
<div class="rotate-x-45 perspective-1000 transform-3d"></div>
```

---

## Testing Strategy

### Unit Tests

Create in `packages/tailwindcss-obfuscator/tests/`:

```typescript
// tests/extractors/v4-wildcards.test.ts
describe("v4 wildcard selectors", () => {
  it("should extract *: variant", () => {
    const classes = extractFromJsx('<ul class="*:py-2">');
    expect(classes).toContain("*:py-2");
  });

  it("should extract **: variant", () => {
    const classes = extractFromJsx('<div class="**:text-gray-500">');
    expect(classes).toContain("**:text-gray-500");
  });
});
```

### Integration Tests

Test with real v4 projects in `apps/test-tailwind-v4/`:

```tsx
// Test component with v4 features
export function V4TestComponent() {
  return (
    <div className="@lg:flex bg-(--brand-color) *:py-2">
      <div className="rotate-x-45 perspective-1000">3D Transform Test</div>
    </div>
  );
}
```

---

## Common Pitfalls & Solutions

### Pitfall 1: Wildcard `*` Conflicts

**Problem:** `*` might conflict with glob patterns or regex

**Solution:**

```typescript
// Escape wildcard in regex
const escaped = className.replace(/\*/g, "\\*");
```

### Pitfall 2: CSS Variable Parentheses vs Function Calls

**Problem:** `calc()`, `rgb()` might be mistaken for CSS variables

**Solution:**

```typescript
// Only match if preceded by utility prefix
/^(?:bg|text|border)-\(--[\w-]+\)$/; // Correct
```

### Pitfall 3: Variant Order Changes

**Problem:** v4 evaluates left-to-right, v3 was right-to-left

**Solution:**

- Don't reorder variants during transformation
- Preserve exact input order
- Add tests to verify order preservation

---

## Performance Considerations

### Pattern Matching

- New v4 patterns add complexity to regex matching
- Benchmark before/after: `pnpm benchmark`
- Expected impact: <5% slower (acceptable)

### Caching

- Wildcard selectors may reduce cache hit rate
- CSS variable parentheses are static (good for caching)
- Monitor cache performance in real projects

---

## Migration Guide for Users

When v4 support is complete, provide migration guide:

### For v3 Projects

```javascript
// tailwind.config.js
export default {
  obfuscator: {
    tailwindVersion: "3", // Explicit v3 mode
  },
};
```

### For v4 Projects

```javascript
// tailwind.config.js
export default {
  obfuscator: {
    tailwindVersion: "4", // Explicit v4 mode
  },
};
```

### Auto-Detection (Recommended)

```javascript
// tailwind.config.js
export default {
  obfuscator: {
    tailwindVersion: "auto", // Default - auto-detect
  },
};
```

---

## Documentation Structure

```
docs/
├── research/
│   ├── README.md (this file)
│   ├── tailwind-v4-features-analysis.md (full reference)
│   ├── tailwind-v4-summary.md (quick reference)
│   └── v4-implementation-checklist.md (action plan)
├── guide/
│   └── tailwind-v4-support.md (user-facing guide - TO CREATE)
└── reference/
    └── patterns.md (regex patterns reference - TO CREATE)
```

---

## External Resources

### Official Tailwind CSS v4 Docs

- [v4.0 Release Blog Post](https://tailwindcss.com/blog/tailwindcss-v4)
- [Upgrade Guide](https://tailwindcss.com/docs/upgrade-guide)
- [v4 Alpha Announcement](https://tailwindcss.com/blog/tailwindcss-v4-alpha)

### Community Resources

- [Moving from Tailwind 3 to 4 in Next.js 15](https://www.9thco.com/labs/moving-from-tailwind-3-to-tailwind-4)
- [Tailwind CSS v4 Breaking Changes](https://www.siaji.com/2025/02/03/Tailwind-CSS-v4-Breaking-Changes-and-Exciting-Features/)
- [shadcn/ui Tailwind v4 Guide](https://ui.shadcn.com/docs/tailwind-v4)

---

## Timeline & Milestones

### Milestone 1: Phase 1 Complete

- **Date:** [TBD]
- **Deliverables:** All critical breaking changes implemented
- **Verification:** All Phase 1 tests passing

### Milestone 2: Phase 2 Complete

- **Date:** [TBD]
- **Deliverables:** All high-value features implemented
- **Verification:** All Phase 2 tests passing

### Milestone 3: Release

- **Date:** [TBD]
- **Deliverables:**
  - Full v4 support
  - Documentation complete
  - Migration guide published
  - Blog post written

---

## Contributing

When adding new v4 features:

1. **Update this README** - Add to status section
2. **Update checklist** - Mark items as ✅
3. **Add tests** - Comprehensive test coverage
4. **Update docs** - User-facing documentation
5. **Update CHANGELOG** - Document changes

---

## Questions & Issues

### Common Questions

**Q: Do I need to migrate my v3 project to use this?**
A: No! The obfuscator supports both v3 and v4 simultaneously.

**Q: What happens if I use v4 syntax in a v3 project?**
A: The obfuscator will detect and handle it correctly (auto-detection mode).

**Q: Will this break my existing obfuscated CSS?**
A: No, the mapping is preserved. Existing obfuscated classes remain the same.

**Q: How do I know if I'm using v4 features?**
A: Check for `@import "tailwindcss"` in your CSS (v4) vs `@tailwind` directives (v3).

### Reporting Issues

If you find v4 patterns not being recognized:

1. Check the checklist to see if it's known
2. Create minimal reproduction case
3. Open issue with pattern example
4. Reference this research directory

---

## Acknowledgments

Research compiled from:

- Official Tailwind CSS v4 documentation
- Community blog posts and tutorials
- Analysis of `tailwindlabs/tailwindcss` source code
- Testing with real-world v4 projects

---

**Last Updated:** 2025-12-08
**Maintained By:** tailwindcss-obfuscator team
**Status:** Research complete, implementation in progress
