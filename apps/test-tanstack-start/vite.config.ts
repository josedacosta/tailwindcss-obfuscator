import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tailwindCssObfuscator from "tailwindcss-obfuscator/vite";

// This sample uses code-defined routes (createRoute / createRouter), so the
// TanStack Router *plugin* (which generates routes from src/routes/**) is
// intentionally not registered. Add it back if you switch to file-based routes.
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    tailwindCssObfuscator({
      prefix: "tw-",
      verbose: true,
      debug: true,
      preserve: { classes: ["no-obfuscate"] },
      mapping: {
        enabled: true,
        file: ".tw-obfuscation/class-mapping.json",
        pretty: 2,
      },
    }),
  ],
});
