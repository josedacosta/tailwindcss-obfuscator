import { defineConfig } from "@tailwindcss-mangle/config";

export default defineConfig({
  transformer: {
    // Path to the extracted class list from our custom script
    registry: {
      file: ".tw-obfuscation/class-list.json",
    },
    // Only process JS/TS/HTML files, exclude CSS (which Tailwind v4 handles differently)
    sources: {
      include: [/\.(html|js|cjs|mjs|ts|cts|mts|jsx|tsx)(?:$|\?)/],
      exclude: [/\.css$/, /node_modules/],
    },
    // Don't mangle classes that might be dynamically used
    filter: (className) => {
      // Skip classes that start with common dynamic prefixes
      if (/^(js-|no-|is-|has-)/.test(className)) {
        return false;
      }
      return true;
    },
  },
});
