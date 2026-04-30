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
      // Coverage floor for the unit-tested surface (release-safety v2,
      // 2026-04-30). The numerator is "src/**/*.ts minus src/cli/** and
      // src/plugins/**" — i.e. everything in src/core, src/extractors,
      // src/transformers, src/utils, plus the root barrels (index.ts,
      // internals.ts). Baselined at -5 pts below the measured baseline
      // (Stmt 74.95 / Br 65.65 / Func 70.05 / Lines 76.89) so this gate
      // catches regressions of more than ~5 points without being a
      // tripwire on the next normal change. Bump the thresholds upward
      // as actual coverage climbs ; never lower them silently.
      thresholds: {
        statements: 70,
        branches: 60,
        functions: 65,
        lines: 72,
      },
    },
  },
});
