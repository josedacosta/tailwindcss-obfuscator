# Configuration Options

This page documents every option exposed by `tailwindcss-obfuscator`.

## Core options

### `prefix`

Prefix prepended to every obfuscated class name.

| Property | Value    |
| -------- | -------- |
| Type     | `string` |
| Default  | `"tw-"`  |

```ts
TailwindObfuscator({
  prefix: "x-", // bg-blue-500 → x-a8k2
});
```

::: tip
Use a short prefix to keep the bundle small. An empty prefix (`""`) is allowed but discouraged: it can collide with other classes in the page.
:::

---

### `randomize`

Generate random class names for maximum protection.

| Property | Value     |
| -------- | --------- |
| Type     | `boolean` |
| Default  | `true`    |

```ts
TailwindObfuscator({
  randomize: true, // Different names on every build (recommended)
  randomize: false, // Predictable sequential names (tw-a, tw-b, tw-c…)
});
```

**Comparison:**

| Mode               | Build 1   | Build 2   | Security |
| ------------------ | --------- | --------- | -------- |
| `randomize: true`  | `tw-k7x2` | `tw-m9p4` | ✅ High  |
| `randomize: false` | `tw-a`    | `tw-a`    | ❌ Low   |

::: warning
Disabling randomisation makes the obfuscation predictable and therefore easy to reverse.
:::

---

### `randomLength`

Length of the random portion of the generated class name (excluding the prefix).

| Property | Value    |
| -------- | -------- |
| Type     | `number` |
| Default  | `4`      |

```ts
TailwindObfuscator({
  randomLength: 4, // tw-a8k2 (7 chars total)
  randomLength: 6, // tw-a8k2m9 (9 chars total)
});
```

**Combination space:**

| Length | Combinations  | Sufficient for     |
| ------ | ------------- | ------------------ |
| 3      | 33,696        | ~500 classes       |
| **4**  | **1,213,056** | **~5,000 classes** |
| 5      | 43,669,816    | ~50,000 classes    |

::: info
With `randomLength: 4`, you have 1.2 million possible combinations — enough for 99.9 % of projects.
:::

---

### `verbose`

Enable verbose logging during the build.

| Property | Value     |
| -------- | --------- |
| Type     | `boolean` |
| Default  | `false`   |

```ts
TailwindObfuscator({
  verbose: true,
});
```

Sample output:

```
[tailwindcss-obfuscator] Scanning src/App.tsx...
[tailwindcss-obfuscator] Found 42 classes
[tailwindcss-obfuscator] Transforming styles.css...
```

---

### `debug`

Enable debug mode with even more detailed logs.

| Property | Value     |
| -------- | --------- |
| Type     | `boolean` |
| Default  | `false`   |

```ts
TailwindObfuscator({
  debug: true,
});
```

---

## Class filtering

### `exclude`

List of classes to **exclude** from obfuscation. Accepts strings and regular expressions.

| Property | Value                  |
| -------- | ---------------------- |
| Type     | `(string \| RegExp)[]` |
| Default  | `[]`                   |

```ts
TailwindObfuscator({
  exclude: [
    "dark", // Exclude the exact class "dark"
    "light", // Exclude the exact class "light"
    /^prose/, // Exclude every class starting with "prose"
    /^data-\[/, // Exclude arbitrary data attributes
  ],
});
```

**Common patterns:**

| Pattern       | Matches                              |
| ------------- | ------------------------------------ |
| `'dark'`      | `dark` (dark mode)                   |
| `/^prose/`    | `prose`, `prose-lg`, `prose-invert`… |
| `/^animate-/` | `animate-spin`, `animate-pulse`…     |

---

### `include`

List of classes to **include** (whitelist). When set, **only** these classes are obfuscated.

| Property | Value                  |
| -------- | ---------------------- |
| Type     | `(string \| RegExp)[]` |
| Default  | `[]` (everything)      |

```ts
TailwindObfuscator({
  include: [
    /^bg-/, // Only bg-* classes
    /^text-/, // Only text-* classes
  ],
});
```

::: warning
`include` skips obfuscation for everything else. Use it carefully.
:::

---

### `filter`

Custom predicate that decides whether a class should be obfuscated.

| Property | Value                            |
| -------- | -------------------------------- |
| Type     | `(className: string) => boolean` |
| Default  | `null`                           |

```ts
TailwindObfuscator({
  filter: (className) => {
    // Skip debug-prefixed classes
    if (className.startsWith("debug-")) return false;
    // Skip very short classes
    if (className.length <= 3) return false;
    // Obfuscate everything else
    return true;
  },
});
```

---

## Source files

### `content`

Glob patterns for files scanned to extract classes.

| Property | Value                                      |
| -------- | ------------------------------------------ |
| Type     | `string[]`                                 |
| Default  | `["**/*.{html,jsx,tsx,vue,svelte,astro}"]` |

```ts
TailwindObfuscator({
  content: ["src/**/*.{js,ts,jsx,tsx}", "components/**/*.vue", "pages/**/*.astro"],
});
```

---

### `css`

Glob patterns for the CSS files to transform.

| Property | Value          |
| -------- | -------------- |
| Type     | `string[]`     |
| Default  | `["**/*.css"]` |

```ts
TailwindObfuscator({
  css: ["src/**/*.css", "styles/**/*.css"],
});
```

---

## Mapping and cache

### `mapping`

Mapping file output options. The mapping file stores the correspondence between original and obfuscated class names.

| Property | Value    |
| -------- | -------- |
| Type     | `object` |

```ts
TailwindObfuscator({
  mapping: {
    enabled: true, // Emit the mapping file
    file: ".tw-obfuscation/class-mapping.json", // Output path
    pretty: true, // Pretty-print JSON (or pass an indent number)
    format: "json", // 'json' or 'text'
  },
});
```

**Sample emitted file:**

```json
{
  "version": "1.0.0",
  "generatedAt": "2024-01-15T10:30:00.000Z",
  "classes": {
    "bg-blue-500": {
      "original": "bg-blue-500",
      "obfuscated": "tw-k7x2",
      "usedIn": ["src/App.tsx", "src/Button.tsx"],
      "occurrences": 5
    }
  }
}
```

---

### `cache`

Cache settings to speed up subsequent builds.

| Property | Value    |
| -------- | -------- |
| Type     | `object` |

```ts
TailwindObfuscator({
  cache: {
    enabled: true, // Enable the cache
    directory: ".tw-obfuscation/cache", // Cache folder
    strategy: "merge", // 'merge' or 'overwrite'
  },
});
```

| Strategy    | Description                   |
| ----------- | ----------------------------- |
| `merge`     | Merge with the existing cache |
| `overwrite` | Replace the cache wholesale   |

---

## Advanced options

### `tailwindVersion`

Tailwind CSS major version to target.

| Property | Value                  |
| -------- | ---------------------- |
| Type     | `'3' \| '4' \| 'auto'` |
| Default  | `'auto'`               |

```ts
TailwindObfuscator({
  tailwindVersion: "auto", // Auto-detect (recommended)
  tailwindVersion: "4", // Force Tailwind v4
  tailwindVersion: "3", // Force Tailwind v3
});
```

---

### `sourcemap`

Generate source maps for debugging.

| Property | Value     |
| -------- | --------- |
| Type     | `boolean` |
| Default  | `true`    |

```ts
TailwindObfuscator({
  sourcemap: true, // Emit .map files
  sourcemap: false, // No source maps (smaller production bundle)
});
```

---

### `refresh`

Re-extract the class list on every build instead of relying on the cache.

| Property | Value                          |
| -------- | ------------------------------ |
| Type     | `boolean`                      |
| Default  | `true` in dev, `false` in prod |

```ts
TailwindObfuscator({
  refresh: true, // Always rescan source files
  refresh: false, // Use the cache when present
});
```

---

### `classGenerator`

Custom function that generates the obfuscated class name from the index and the original.

| Property | Value                                              |
| -------- | -------------------------------------------------- |
| Type     | `(index: number, originalClass: string) => string` |
| Default  | Random generator                                   |

```ts
TailwindObfuscator({
  // Sequential short names: a, b, c, …, aa, ab, …
  classGenerator: (index) => {
    const chars = "abcdefghijklmnopqrstuvwxyz";
    let result = "";
    let n = index;
    do {
      result = chars[n % 26] + result;
      n = Math.floor(n / 26) - 1;
    } while (n >= 0);
    return result;
  },
});
```

::: warning
Using a custom `classGenerator` disables the automatic randomisation.
:::

---

### `preserve`

Classes and functions to keep out of the obfuscator's reach.

| Property | Value    |
| -------- | -------- |
| Type     | `object` |

```ts
TailwindObfuscator({
  preserve: {
    // String arguments to these functions are left as-is
    functions: ["debugClass", "analyticsTrack", "testId"],

    // These classes are never obfuscated
    classes: ["no-obfuscate", "keep-visible"],
  },
});
```

**Example:**

```tsx
// Arguments to debugClass() are NOT obfuscated
const debug = debugClass("debug-border debug-bg");

// cn() is transformed normally
const styles = cn("bg-blue-500", "text-white"); // → cn('tw-a', 'tw-b')
```

---

### `ignoreVueScoped`

Preserve Vue scoped selectors (`[data-v-*]`).

| Property | Value     |
| -------- | --------- |
| Type     | `boolean` |
| Default  | `true`    |

```ts
TailwindObfuscator({
  ignoreVueScoped: true, // Preserve [data-v-xxxxx]
});
```

---

### `useAst`

Use the AST extractor for more accurate class detection in JS/TS files.

| Property | Value     |
| -------- | --------- |
| Type     | `boolean` |
| Default  | `true`    |

```ts
TailwindObfuscator({
  useAst: true, // More accurate, slightly slower
  useAst: false, // Regex-only (faster)
});
```

---

### `usePostcss`

Use PostCSS for more accurate CSS file transformation.

| Property | Value     |
| -------- | --------- |
| Type     | `boolean` |
| Default  | `true`    |

```ts
TailwindObfuscator({
  usePostcss: true, // More accurate, slightly slower
  usePostcss: false, // Regex-only (faster)
});
```

---

## Complete examples

### Minimal configuration

```ts
import { TailwindObfuscator } from "tailwindcss-obfuscator/vite";

export default defineConfig({
  plugins: [
    TailwindObfuscator(), // All defaults
  ],
});
```

### Recommended production configuration

```ts
TailwindObfuscator({
  prefix: "tw-",
  randomize: true,
  randomLength: 4,
  exclude: ["dark", "light"],
  mapping: {
    enabled: true,
    pretty: false, // Compact JSON in production
  },
});
```

### Development configuration

```ts
TailwindObfuscator({
  verbose: true,
  debug: true,
  refresh: true,
  mapping: {
    pretty: 2, // Pretty-printed JSON for readability
  },
});
```

### Project using Tailwind Typography

```ts
TailwindObfuscator({
  exclude: [
    /^prose/, // prose-* classes
    /^not-prose/, // not-prose classes
  ],
});
```

### Strict whitelist

```ts
TailwindObfuscator({
  include: [/^bg-/, /^text-/, /^p-/, /^m-/, /^flex/, /^grid/],
});
```

---

## In-source directives

### Ignore comment

Use `tw-obfuscate-ignore` to skip a single line:

```tsx
{
  /* tw-obfuscate-ignore */
}
<div className="debug-class analytics-tracker">Unobfuscated content</div>;
```

### `twIgnore` tag

Use the `twIgnore` tagged template literal:

```tsx
const twIgnore = String.raw;

const classes = `${twIgnore`debug-info`} bg-blue-500`;
// Result: "debug-info tw-a8k2"
```

---

## Defaults summary

| Option            | Default                       |
| ----------------- | ----------------------------- |
| `prefix`          | `"tw-"`                       |
| `randomize`       | `true`                        |
| `randomLength`    | `4`                           |
| `verbose`         | `false`                       |
| `debug`           | `false`                       |
| `exclude`         | `[]`                          |
| `include`         | `[]`                          |
| `tailwindVersion` | `"auto"`                      |
| `sourcemap`       | `true`                        |
| `refresh`         | `true` (dev) / `false` (prod) |
| `ignoreVueScoped` | `true`                        |
| `useAst`          | `true`                        |
| `usePostcss`      | `true`                        |
