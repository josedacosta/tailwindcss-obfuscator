import { defineConfig } from "tsup";

export default defineConfig([
  // Main entry (public API)
  {
    entry: ["src/index.ts"],
    format: ["esm", "cjs"],
    dts: true,
    clean: true,
    sourcemap: true,
    external: ["vite", "webpack", "rollup", "esbuild"],
  },
  // Internals subpath (advanced API)
  {
    entry: ["src/internals.ts"],
    format: ["esm", "cjs"],
    dts: true,
    sourcemap: true,
    external: ["vite", "webpack", "rollup", "esbuild"],
  },
  // Webpack plugin
  {
    entry: ["src/plugins/webpack.ts"],
    format: ["esm", "cjs"],
    dts: true,
    outDir: "dist/plugins",
    sourcemap: true,
    external: ["webpack"],
  },
  // Vite plugin
  {
    entry: ["src/plugins/vite.ts"],
    format: ["esm", "cjs"],
    dts: true,
    outDir: "dist/plugins",
    sourcemap: true,
    external: ["vite"],
  },
  // Rollup plugin
  {
    entry: ["src/plugins/rollup.ts"],
    format: ["esm", "cjs"],
    dts: true,
    outDir: "dist/plugins",
    sourcemap: true,
    external: ["rollup"],
  },
  // esbuild plugin
  {
    entry: ["src/plugins/esbuild.ts"],
    format: ["esm", "cjs"],
    dts: true,
    outDir: "dist/plugins",
    sourcemap: true,
    external: ["esbuild"],
  },
  // Nuxt plugin
  {
    entry: ["src/plugins/nuxt.ts"],
    format: ["esm", "cjs"],
    dts: true,
    outDir: "dist/plugins",
    sourcemap: true,
    external: ["nuxt", "@nuxt/kit"],
  },
  // CLI
  {
    entry: ["src/cli/index.ts", "src/cli/bin.ts"],
    format: ["esm", "cjs"],
    dts: true,
    outDir: "dist/cli",
    sourcemap: true,
    banner: {
      js: "#!/usr/bin/env node",
    },
  },
]);
