/**
 * Turbopack post-build CLI smoke test.
 *
 * Turbopack does not expose a plugin API, so the supported obfuscation path
 * for Next.js + Turbopack is to run `tw-obfuscator run --build-dir .next`
 * AFTER `next build`. This test simulates a minimal `.next/` directory
 * (one CSS chunk, one HTML pre-render, one JS chunk) and verifies the
 * full extract → map → transform pipeline rewrites every reference
 * consistently across the three file types.
 *
 * Documented as Pattern A in docs/guide/nextjs.md (Turbopack section).
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdirSync, writeFileSync, readFileSync, rmSync, existsSync, readdirSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";

import { extractClasses } from "../src/extractors/index.js";
import { transformDirectory } from "../src/transformers/index.js";
import { createContext, initializeContext } from "../src/core/context.js";
import { createLogger } from "../src/utils/logger.js";

/**
 * fast-glob requires forward-slash glob patterns even on Windows, but
 * `path.join()` returns backslashes on Windows, which silently match
 * nothing. Normalise glob patterns to POSIX separators.
 */
const toPosix = (p: string): string => p.replace(/\\/g, "/");

describe("Turbopack post-build CLI pipeline", () => {
  let projectDir: string;
  let nextDir: string;
  let appDir: string;

  beforeEach(() => {
    projectDir = join(
      tmpdir(),
      `tw-obf-turbopack-${Date.now()}-${Math.random().toString(36).slice(2)}`
    );
    nextDir = join(projectDir, ".next");
    appDir = join(projectDir, "app");
    mkdirSync(appDir, { recursive: true });
    mkdirSync(join(nextDir, "static", "css"), { recursive: true });
    mkdirSync(join(nextDir, "server", "app"), { recursive: true });

    // Source file — what the user wrote.
    writeFileSync(
      join(appDir, "page.tsx"),
      `export default function Page() {
        return (
          <div className="flex items-center bg-blue-500 p-4 text-white">
            <span className="font-bold hover:underline">Hello</span>
          </div>
        );
      }`
    );

    // Simulated Turbopack outputs — these would normally be produced by `next build`.
    writeFileSync(
      join(nextDir, "static", "css", "app.css"),
      `.flex{display:flex}.items-center{align-items:center}.bg-blue-500{background-color:#3b82f6}.p-4{padding:1rem}.text-white{color:#fff}.font-bold{font-weight:700}.hover\\:underline:hover{text-decoration-line:underline}`
    );
    writeFileSync(
      join(nextDir, "server", "app", "page.html"),
      `<!doctype html><html><head><link rel="stylesheet" href="/_next/static/css/app.css"></head><body><div class="flex items-center bg-blue-500 p-4 text-white"><span class="font-bold hover:underline">Hello</span></div></body></html>`
    );
    writeFileSync(
      join(nextDir, "server", "app", "page.js"),
      `module.exports = function Page() { return { className: "flex items-center bg-blue-500 p-4 text-white" }; };`
    );
  });

  afterEach(() => {
    if (projectDir && existsSync(projectDir)) {
      rmSync(projectDir, { recursive: true, force: true });
    }
  });

  it("extracts source classes, generates a mapping, and rewrites every chunk type", async () => {
    const ctx = createContext(
      {
        prefix: "tw-",
        randomize: false,
        content: [toPosix(join(appDir, "**/*.{ts,tsx,js,jsx}"))],
        outputDir: join(projectDir, ".tw-obfuscation"),
      },
      "production"
    );
    const logger = createLogger({ verbose: false });
    initializeContext(ctx, projectDir, logger);

    await extractClasses(ctx, projectDir, logger);
    expect(ctx.classMap.size).toBeGreaterThan(0);
    expect(ctx.classMap.get("bg-blue-500")).toMatch(/^tw-/);
    expect(ctx.classMap.get("hover:underline")).toMatch(/^tw-/);

    const result = await transformDirectory(nextDir, ctx, logger, ["css", "html", "js"]);
    expect(result.totalReplacements).toBeGreaterThan(0);

    // Verify each chunk type was rewritten consistently.
    const cssOut = readFileSync(join(nextDir, "static", "css", "app.css"), "utf-8");
    const htmlOut = readFileSync(join(nextDir, "server", "app", "page.html"), "utf-8");
    const jsOut = readFileSync(join(nextDir, "server", "app", "page.js"), "utf-8");

    const obfBg = ctx.classMap.get("bg-blue-500")!;
    const obfFlex = ctx.classMap.get("flex")!;

    expect(cssOut).not.toContain(".bg-blue-500{");
    expect(cssOut).toContain(`.${obfBg}{`);

    expect(htmlOut).not.toMatch(/class="[^"]*\bbg-blue-500\b/);
    expect(htmlOut).toContain(obfBg);
    expect(htmlOut).toContain(obfFlex);

    expect(jsOut).not.toMatch(/className: "[^"]*\bbg-blue-500\b/);
    expect(jsOut).toContain(obfBg);
  });

  it("walks both .next/static/** and .next/server/** (the Turbopack output split)", async () => {
    const ctx = createContext(
      {
        prefix: "tw-",
        randomize: false,
        content: [toPosix(join(appDir, "**/*.{ts,tsx,js,jsx}"))],
        outputDir: join(projectDir, ".tw-obfuscation"),
      },
      "production"
    );
    const logger = createLogger({ verbose: false });
    initializeContext(ctx, projectDir, logger);

    await extractClasses(ctx, projectDir, logger);
    await transformDirectory(nextDir, ctx, logger, ["css", "html", "js"]);

    // Both subtrees were visited.
    const staticFiles = readdirSync(join(nextDir, "static", "css"));
    const serverFiles = readdirSync(join(nextDir, "server", "app"));
    expect(staticFiles).toContain("app.css");
    expect(serverFiles).toContain("page.html");
    expect(serverFiles).toContain("page.js");
  });
});
