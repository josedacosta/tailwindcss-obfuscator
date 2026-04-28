import { defineConfig } from "@tailwindcss-mangle/config";

export default defineConfig({
  registry: {
    output: {
      file: ".tw-obfuscation/class-list.json",
    },
  },
  transformer: {
    registry: {
      file: ".tw-obfuscation/class-list.json",
    },
    generator: {
      classPrefix: "tw-",
    },
  },
});
