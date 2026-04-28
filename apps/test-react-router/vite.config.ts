import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import tailwindCssObfuscator from "tailwindcss-obfuscator/vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
    reactRouter(),
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
