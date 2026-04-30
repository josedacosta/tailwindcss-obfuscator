import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import tailwindcss from "@tailwindcss/vite";
import tailwindcssObfuscator from "tailwindcss-obfuscator/vite";

export default defineConfig({
  plugins: [
    preact(),
    tailwindcss(),
    tailwindcssObfuscator({
      prefix: "tw-",
      verbose: true,
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
