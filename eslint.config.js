import js from "@eslint/js";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import prettier from "eslint-config-prettier";
import globals from "globals";

export default tseslint.config(
  // Global ignores
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/.next/**",
      "**/.nuxt/**",
      "**/.output/**",
      "**/.nitro/**",
      "**/.svelte-kit/**",
      "**/.react-router/**",
      "**/.astro/**",
      "**/.qwik/**",
      "**/.solid/**",
      "**/.vercel/**",
      "**/.vinxi/**",
      "**/.turbo/**",
      "**/.tw-obfuscation/**",
      "**/.tw-patch/**",
      "**/coverage/**",
      "**/out/**",
      "**/public/build/**",
      "jose/**",
      "github/**",
      "reports/**",
      "docs/.vitepress/dist/**",
      "docs/.vitepress/cache/**",
      "**/next-env.d.ts",
      "**/*.min.js",
    ],
  },

  // Base JS/TS config
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // Global settings
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
  },

  // TypeScript files
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },

  // React/JSX files (excluding non-React JSX frameworks: Solid, Qwik)
  {
    files: ["**/*.jsx", "**/*.tsx"],
    ignores: ["apps/test-solidjs/**", "apps/test-qwik/**"],
    plugins: {
      react,
      "react-hooks": reactHooks,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react/no-unescaped-entities": "off",
      "react/no-unknown-property": ["error", { ignore: ["cmdk-input-wrapper"] }],
    },
  },

  // Tailwind config files - allow require()
  {
    files: ["**/tailwind.config.ts", "**/tailwind.config.js"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },

  // Test files - relax rules common in test setups
  {
    files: ["**/*.test.ts", "**/*.test.tsx", "**/tests/**", "**/__tests__/**"],
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unsafe-function-type": "off",
    },
  },

  // Plugin source — bundler types are dynamic by nature
  {
    files: ["packages/tailwindcss-obfuscator/src/plugins/**/*.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },

  // Vite env shim
  {
    files: ["**/vite-env.d.ts"],
    rules: {
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },

  // Prettier (must be last to override other formatting rules)
  prettier
);
