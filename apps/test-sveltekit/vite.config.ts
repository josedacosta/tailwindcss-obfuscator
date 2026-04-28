import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { tailwindCssObfuscatorVite } from "tailwindcss-obfuscator/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    sveltekit(),
    tailwindcss(),
    tailwindCssObfuscatorVite({
      debug: true,
      content: ["./src/**/*.{svelte,ts,js}"],
    }),
  ],
});
