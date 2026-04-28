import { defineConfig } from "@tailwindcss-mangle/config";

export default defineConfig({
  registry: {
    output: {
      file: ".tw-patch/tw-class-list.json",
    },
  },
  transformer: {
    registry: {
      file: ".tw-patch/tw-class-list.json",
    },
    generator: {
      classPrefix: "tw-",
    },
  },
});
