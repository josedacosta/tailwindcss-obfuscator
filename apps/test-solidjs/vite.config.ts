import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import tailwindcss from "@tailwindcss/vite";
import { tailwindCssObfuscatorVite } from "tailwindcss-obfuscator/vite";

export default defineConfig({
  plugins: [
    solidPlugin(),
    tailwindcss(),
    tailwindCssObfuscatorVite({
      debug: true,
      content: ["./src/**/*.{tsx,ts,jsx,js}"],
    }),
  ],
  build: {
    target: "esnext",
  },
});
