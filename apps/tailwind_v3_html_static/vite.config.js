import { defineConfig } from "vite";
import { resolve } from "path";
import tailwindcssMangle from "unplugin-tailwindcss-mangle/vite";

export default defineConfig(({ mode }) => ({
  root: "src",
  plugins: [
    // Only enable class mangling in production build
    mode === "production" && tailwindcssMangle(),
  ].filter(Boolean),
  server: {
    port: 3002,
    open: true,
  },
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    minify: "esbuild",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        about: resolve(__dirname, "src/about.html"),
      },
    },
  },
}));
