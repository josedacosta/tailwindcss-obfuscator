import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import tailwindcssObfuscator from "tailwindcss-obfuscator/vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
    tailwindcssObfuscator({
      prefix: "tw-",
      verbose: true,
      // Lit components live in .ts files; default scan only includes .tsx/.jsx.
      content: ["**/*.html", "**/*.ts", "**/*.tsx", "**/*.jsx"],
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
