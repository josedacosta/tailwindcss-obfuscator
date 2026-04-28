# Tailwind CSS v3 + HTML Static - Class Obfuscation Guide

## Overview

This guide covers class obfuscation for static HTML projects using Tailwind CSS v3. This approach uses `tailwindcss-patch` for class extraction and `unplugin-tailwindcss-mangle` for obfuscation.

## Architecture

```
tailwind.config.js  →  tailwindcss-patch  →  .tw-patch/tw-class-list.json
                                                      ↓
src/*.html          →  Vite build  →  unplugin-tailwindcss-mangle  →  dist/
src/*.css                                                              (obfuscated)
```

## Dependencies

```json
{
  "dependencies": {
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.17",
    "vite": "^6.0.5"
  },
  "devDependencies": {
    "tailwindcss-patch": "^3.0.1",
    "unplugin-tailwindcss-mangle": "^5.0.0"
  }
}
```

## Configuration Files

### tailwind.config.js

```javascript
export default {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#3b82f6",
        secondary: "#8b5cf6",
      },
    },
  },
  plugins: [],
};
```

### postcss.config.js

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

### tailwindcss-mangle.config.ts

```typescript
import { defineConfig } from "@tailwindcss-mangle/config";

export default defineConfig({
  registry: {
    output: {
      file: ".tw-patch/tw-class-list.json",
    },
  },
  transformer: {
    registry: {
      file: ".tw-patch/tw-class-list.json",
    },
    generator: {
      classPrefix: "tw-",
    },
  },
});
```

### vite.config.js

```javascript
import { defineConfig } from "vite";
import { resolve } from "path";
import tailwindcssMangle from "unplugin-tailwindcss-mangle/vite";

export default defineConfig(({ mode }) => ({
  root: "src",
  plugins: [mode === "production" && tailwindcssMangle()].filter(Boolean),
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        about: resolve(__dirname, "src/about.html"),
      },
    },
  },
}));
```

## CSS File (src/styles.css)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .btn {
    @apply rounded-lg px-4 py-2 font-medium transition-colors;
  }

  .btn-primary {
    @apply bg-primary hover:bg-primary/90 text-white;
  }
}
```

## Package.json Scripts

```json
{
  "scripts": {
    "postinstall": "tw-patch install",
    "dev": "vite",
    "build": "tw-patch extract && vite build",
    "extract-classes": "tw-patch extract"
  }
}
```

## Build Process

1. **postinstall**: `tw-patch install` patches the Tailwind package to enable class extraction
2. **extract**: `tw-patch extract` scans your files and generates `.tw-patch/tw-class-list.json`
3. **build**: Vite builds the project, and `unplugin-tailwindcss-mangle` replaces classes

## Result

### Before (Development)

```html
<div class="rounded-lg bg-blue-500 p-4 text-white hover:bg-blue-700">Button</div>
```

### After (Production)

```html
<div class="tw-a tw-b tw-c tw-d tw-e">Button</div>
```

## Troubleshooting

### Classes not being obfuscated

1. Check that `.tw-patch/tw-class-list.json` exists and contains your classes
2. Ensure you're building in production mode: `npm run build` (not `vite build` directly)
3. Verify `tailwindcss-mangle.config.ts` points to the correct JSON file

### Some classes missing

1. Ensure all HTML files are listed in `tailwind.config.js` content paths
2. Check for dynamic class construction (not supported)
3. Verify CSS `@apply` directives are being scanned

## Limitations

- Only static classes are obfuscated
- Dynamic class construction (`bg-${color}-500`) will NOT work
- Third-party component classes are not obfuscated
