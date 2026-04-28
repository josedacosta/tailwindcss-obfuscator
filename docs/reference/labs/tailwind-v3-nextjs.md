# Tailwind CSS v3 + Next.js - Class Obfuscation Guide

## Overview

This guide covers class obfuscation for Next.js applications using Tailwind CSS v3. This approach uses `tailwindcss-patch` for class extraction and `unplugin-tailwindcss-mangle` with Webpack integration.

## Architecture

```
tailwind.config.ts  →  tailwindcss-patch  →  .tw-patch/tw-class-list.json
                                                       ↓
src/**/*.tsx        →  Next.js build  →  unplugin-tailwindcss-mangle (webpack)  →  .next/
src/**/*.css                                                                       (obfuscated)
```

## Dependencies

```json
{
  "dependencies": {
    "next": "^15.1.2",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.17",
    "tailwindcss-patch": "^3.0.1",
    "typescript": "^5.7.2",
    "unplugin-tailwindcss-mangle": "^5.0.0"
  }
}
```

## Configuration Files

### tailwind.config.ts

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
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

export default config;
```

### postcss.config.mjs

```javascript
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config;
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

### next.config.ts

```typescript
import type { NextConfig } from "next";
import TailwindcssMangle from "unplugin-tailwindcss-mangle/webpack";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // Only apply obfuscation in production and on client-side
    if (process.env.NODE_ENV === "production" && !isServer) {
      config.plugins.push(TailwindcssMangle());
    }
    return config;
  },
};

export default nextConfig;
```

## CSS File (src/app/globals.css)

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

  .card {
    @apply rounded-xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800;
  }
}
```

## Package.json Scripts

```json
{
  "scripts": {
    "postinstall": "tw-patch install",
    "dev": "next dev",
    "build": "tw-patch extract && next build",
    "start": "next start",
    "extract-classes": "tw-patch extract"
  }
}
```

## React Component Best Practices

### DO: Use Static Classes

```tsx
// Good - complete class names
export function Button({ variant }: { variant: "primary" | "secondary" }) {
  const classes = {
    primary: "bg-blue-500 hover:bg-blue-700 text-white",
    secondary: "bg-gray-500 hover:bg-gray-700 text-white",
  };

  return <button className={`rounded px-4 py-2 ${classes[variant]}`}>Click me</button>;
}
```

### DON'T: Use Dynamic Class Construction

```tsx
// Bad - dynamic class names won't be obfuscated
export function Button({ color }: { color: string }) {
  return <button className={`bg-${color}-500 hover:bg-${color}-700`}>Click me</button>;
}
```

## Conditional Classes Pattern

```tsx
// Using ternary operators (good)
<div className={isActive ? "bg-blue-500" : "bg-gray-500"}>

// Using object mapping (good)
const statusColors = {
  success: "bg-green-500 text-white",
  error: "bg-red-500 text-white",
  warning: "bg-yellow-500 text-black",
};
<div className={statusColors[status]}>

// Using array join (good)
<div className={["p-4", "rounded-lg", isActive && "bg-blue-500"].filter(Boolean).join(" ")}>
```

## Server vs Client Components

Obfuscation works with both Server and Client components:

```tsx
// Server Component
export function ServerCard() {
  return (
    <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
      Server-rendered content
    </div>
  );
}

// Client Component
("use client");

export function ClientCard() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800 ${
        isHovered ? "ring-2 ring-blue-500" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      Client-rendered content
    </div>
  );
}
```

## Build Process

1. **postinstall**: `tw-patch install` patches Tailwind
2. **build**:
   - `tw-patch extract` generates class list
   - `next build` compiles the app
   - Webpack plugin obfuscates classes during bundling

## Result

### Before (Development)

```jsx
<div className="bg-blue-500 hover:bg-blue-700 text-white p-4 rounded-lg">
```

### After (Production Bundle)

```javascript
// In compiled JavaScript
createElement("div", { className: "tw-a tw-b tw-c tw-d tw-e" });
```
