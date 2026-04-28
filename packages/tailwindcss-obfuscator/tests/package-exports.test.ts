/**
 * Cross-package-manager parity guards.
 *
 * Both regressions below are silent (TypeScript / pnpm dev workspace can mask them
 * because the workspace package.json is reachable via the path). They only surface
 * when the published tarball is consumed by an end-user via `npm install`,
 * `yarn add`, or `pnpm add`. These tests run against the workspace package.json
 * so they catch the bug at PR time rather than at npm-publish time.
 */

import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pkgPath = resolve(__dirname, "..", "package.json");
const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));

describe("package.json — cross-package-manager parity", () => {
  describe('"./package.json" must be in exports', () => {
    it("exposes ./package.json so downstream tools can read package metadata", () => {
      // Many bundlers (Vite, Webpack, esbuild), framework probes (Next.js,
      // Nuxt), and IDE TS plugins do `require("tailwindcss-obfuscator/package.json")`
      // to read the version / engines / exports. Without this entry, every
      // such tool throws ERR_PACKAGE_PATH_NOT_EXPORTED on Node 20+.
      expect(pkg.exports["./package.json"]).toBe("./package.json");
    });
  });

  describe("engines must NOT pin a specific package manager", () => {
    it('engines must contain ONLY "node" — no "pnpm", "yarn", "npm" pins', () => {
      // Pinning a PM in engines (e.g. "pnpm": ">=9.0.0") leaks the maintainer's
      // local toolchain to consumers and triggers `EBADENGINE` warnings on
      // npm/yarn install. Only `engines.node` is acceptable for a published
      // library.
      const enginesKeys = Object.keys(pkg.engines || {});
      expect(enginesKeys).toEqual(["node"]);
    });
  });

  describe("every plugin entry has both ESM + CJS + types", () => {
    const expectedEntries = [
      ".",
      "./internals",
      "./webpack",
      "./vite",
      "./rollup",
      "./esbuild",
      "./rspack",
      "./farm",
      "./cli",
      "./nuxt",
    ];

    it.each(expectedEntries)("entry %s exposes types + import + require", (entry) => {
      const exp = pkg.exports[entry];
      expect(exp).toBeTypeOf("object");
      expect(exp.types, `${entry}.types is missing`).toMatch(/\.d\.ts$/);
      expect(exp.import, `${entry}.import is missing or wrong ext`).toMatch(/\.js$/);
      expect(exp.require, `${entry}.require is missing or wrong ext`).toMatch(/\.cjs$/);
    });
  });

  describe("optional bundler peerDependencies", () => {
    const optionalPeers = ["@farmfe/core", "@rspack/core", "esbuild", "rollup", "vite", "webpack"];

    it.each(optionalPeers)("%s must be marked optional", (peer) => {
      expect(
        pkg.peerDependenciesMeta?.[peer]?.optional,
        `${peer} must be optional so npm/yarn/pnpm don't error when the consumer doesn't install it`
      ).toBe(true);
    });

    it("tailwindcss must NOT be marked optional (it's a hard requirement)", () => {
      expect(pkg.peerDependencies.tailwindcss).toBeDefined();
      expect(pkg.peerDependenciesMeta?.tailwindcss?.optional).not.toBe(true);
    });
  });
});
