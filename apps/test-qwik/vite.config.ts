import { defineConfig } from "vite";
import { qwikVite } from "@builder.io/qwik/optimizer";
import { qwikCity } from "@builder.io/qwik-city/vite";
import tailwindcss from "@tailwindcss/vite";
import { tailwindCssObfuscatorVite } from "tailwindcss-obfuscator/vite";

export default defineConfig(() => {
  return {
    plugins: [
      qwikCity(),
      qwikVite(),
      tailwindcss(),
      tailwindCssObfuscatorVite({
        debug: true,
        content: ["./src/**/*.{tsx,ts,jsx,js}"],
      }),
    ],
    dev: {
      headers: {
        "Cache-Control": "public, max-age=0",
      },
    },
    preview: {
      headers: {
        "Cache-Control": "public, max-age=600",
      },
    },
  };
});
