import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tailwindcssObfuscator from "tailwindcss-obfuscator/vite";

export default defineConfig({
  plugins: [
    react(),
    // Tailwind v4 uses its own Vite plugin
    tailwindcss(),
    // Our obfuscator plugin
    tailwindcssObfuscator({
      prefix: "tw-",
      verbose: true,
      debug: true,
      preserve: { classes: ["no-obfuscate"] },
      mapping: {
        enabled: true,
        file: ".tw-obfuscation/class-mapping.json",
        pretty: 2,
      },
      cache: {
        enabled: true,
        directory: ".tw-obfuscation/cache",
        strategy: "merge",
      },
    }),
  ],
});
