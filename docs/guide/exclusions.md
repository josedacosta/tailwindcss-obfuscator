# Exclusions

Some classes must stay unobfuscated. Here's how to configure them.

## `exclude` option

```ts
TailwindObfuscator({
  exclude: [
    // Exact strings
    "dark",
    "light",
    "active",

    // RegExp patterns
    /^prose/, // Tailwind Typography
    /^data-\[/, // Data attributes
    /^group\//, // Group variants
    /^peer\//, // Peer variants
  ],
});
```

## Common use cases

### Dark mode

```ts
exclude: ["dark", "light"];
```

The `dark` and `light` classes are typically toggled on `<html>` or `<body>` and must stay readable for the theme switcher.

### Tailwind Typography

```ts
exclude: [/^prose/];
```

The `@tailwindcss/typography` plugin uses `prose-*` classes that may be targeted by external CSS.

### Data attributes (shadcn/ui)

```ts
exclude: [/^data-\[/];
```

shadcn/ui relies on selectors like `data-[state=open]:bg-accent`. The `data-[` prefix must be preserved.

### Groups and peers

```ts
exclude: [/^group\//, /^peer\//, "group", "peer"];
```

The `group-*` and `peer-*` variants require the `group` and `peer` classes to stay intact.

### Animation classes

```ts
exclude: [/^animate-/, /^motion-/];
```

Use this when you have CSS animations that target classes by name.

## `preserve` option

To preserve specific functions:

```ts
TailwindObfuscator({
  preserve: {
    // String arguments to these functions are left as-is
    functions: [
      "debugClass", // Debugging
      "analyticsTrack", // Analytics
    ],

    // These classes are never obfuscated
    classes: ["no-obfuscate", "keep-visible"],
  },
});
```

## `filter` option

For custom filtering logic:

```ts
TailwindObfuscator({
  filter: (className) => {
    // Skip classes that start with 'keep-'
    if (className.startsWith("keep-")) return false;

    // Skip classes whose numeric suffix is > 100
    const match = className.match(/(\d+)$/);
    if (match && parseInt(match[1]) > 100) return false;

    // Obfuscate everything else
    return true;
  },
});
```
