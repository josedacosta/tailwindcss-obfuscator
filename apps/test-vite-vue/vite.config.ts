import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import tailwindcssObfuscator from "tailwindcss-obfuscator/vite";

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
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
