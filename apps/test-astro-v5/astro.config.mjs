import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import { tailwindCssObfuscatorVite } from "tailwindcss-obfuscator/vite";

export default defineConfig({
  vite: {
    plugins: [
      tailwindcss(),
      tailwindCssObfuscatorVite({
        debug: true,
        content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
      }),
    ],
  },
});
