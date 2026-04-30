import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["tests/**/*.test.ts"],
    coverage: {
      provider: "v8",
      // text-summary prints a 4-line block in CI logs ; json-summary feeds
      // any local dashboard ; lcov is the file Codecov ingests via
      // codecov/codecov-action ; html is the local browse-able report.
      reporter: ["text", "text-summary", "json", "json-summary", "lcov", "html"],
      reportsDirectory: "./coverage",
      include: ["src/**/*.ts"],
      // CLI bin and plugin adapters are pure unplugin shims exercised
      // end-to-end by verify-obfuscation.mjs + the tarball smoke test
      // (PR #67) — excluding them avoids a misleading 0% in the unit
      // coverage report.
      exclude: ["src/**/*.d.ts", "src/cli/**", "src/plugins/**"],
    },
  },
});
