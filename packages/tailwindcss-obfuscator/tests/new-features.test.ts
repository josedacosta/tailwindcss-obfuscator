/**
 * Tests for new features from tailwindcss-patch
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";

// Cache system
import { CacheStore, createCacheStore, initializeCache, saveCache } from "../src/core/cache.js";

// Configuration file support
import { findConfigFile, defineConfig } from "../src/core/config.js";

// Token extraction with positions
import {
  extractWithPositions,
  extractTokensFromFile,
  extractTokensFromFiles,
  groupTokensByFile,
} from "../src/core/tokens.js";

// Context with new options
import {
  createContext,
  resolveOptions,
  saveMapping,
  exportSimpleMapping,
} from "../src/core/context.js";

describe("CacheStore", () => {
  let tempDir: string;
  let cacheStore: CacheStore;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "tw-obfuscator-test-"));
    cacheStore = new CacheStore(tempDir, "merge");
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it("should not exist initially", () => {
    expect(cacheStore.exists()).toBe(false);
  });

  it("should write and read cache", () => {
    const mapping = new Map([
      ["flex", "tw-a"],
      ["items-center", "tw-b"],
    ]);

    cacheStore.write(mapping, { tailwindVersion: "3" });

    expect(cacheStore.exists()).toBe(true);

    const cached = cacheStore.read();
    expect(cached).not.toBeNull();
    expect(cached?.mapping["flex"]).toBe("tw-a");
    expect(cached?.mapping["items-center"]).toBe("tw-b");
    expect(cached?.metadata?.tailwindVersion).toBe("3");
  });

  it("should clear cache", () => {
    const mapping = new Map([["flex", "tw-a"]]);
    cacheStore.write(mapping);

    expect(cacheStore.exists()).toBe(true);

    cacheStore.clear();

    expect(cacheStore.exists()).toBe(false);
  });

  it("should load into context with merge strategy", () => {
    const mapping = new Map([
      ["flex", "tw-a"],
      ["grid", "tw-b"],
    ]);
    cacheStore.write(mapping);

    const ctx = createContext({}, "production");
    ctx.classMap.set("items-center", "tw-c");

    cacheStore.loadIntoContext(ctx);

    // Should have both cached and existing classes
    expect(ctx.classMap.get("flex")).toBe("tw-a");
    expect(ctx.classMap.get("grid")).toBe("tw-b");
    expect(ctx.classMap.get("items-center")).toBe("tw-c");
  });

  it("should load into context with overwrite strategy", () => {
    const overwriteStore = new CacheStore(tempDir, "overwrite");
    const mapping = new Map([["flex", "tw-a"]]);
    overwriteStore.write(mapping);

    const ctx = createContext({}, "production");
    ctx.classMap.set("items-center", "tw-c");

    overwriteStore.loadIntoContext(ctx);

    // Should only have cached classes
    expect(ctx.classMap.get("flex")).toBe("tw-a");
    expect(ctx.classMap.has("items-center")).toBe(false);
  });

  it("should save from context", () => {
    const ctx = createContext({}, "production");
    ctx.classMap.set("flex", "tw-a");
    ctx.classMap.set("grid", "tw-b");
    ctx.detectedTailwindVersion = "4";

    cacheStore.saveFromContext(ctx);

    const cached = cacheStore.read();
    expect(cached?.mapping["flex"]).toBe("tw-a");
    expect(cached?.mapping["grid"]).toBe("tw-b");
    expect(cached?.metadata?.tailwindVersion).toBe("4");
    expect(cached?.metadata?.totalClasses).toBe(2);
  });
});

describe("createCacheStore", () => {
  it("should return null when cache is disabled", () => {
    const ctx = createContext({ cache: { enabled: false } }, "production");
    const store = createCacheStore(ctx);
    expect(store).toBeNull();
  });

  it("should return CacheStore when cache is enabled", () => {
    const ctx = createContext({ cache: { enabled: true } }, "production");
    const store = createCacheStore(ctx);
    expect(store).toBeInstanceOf(CacheStore);
  });
});

describe("Configuration file support", () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "tw-obfuscator-config-"));
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it("should find tailwindcss-obfuscator.config.js", () => {
    fs.writeFileSync(
      path.join(tempDir, "tailwindcss-obfuscator.config.js"),
      "export default { prefix: 'test-' };"
    );

    const configPath = findConfigFile(tempDir);
    expect(configPath).toBe(path.join(tempDir, "tailwindcss-obfuscator.config.js"));
  });

  it("should find tw-obfuscator.config.js", () => {
    fs.writeFileSync(
      path.join(tempDir, "tw-obfuscator.config.js"),
      "export default { prefix: 'test-' };"
    );

    const configPath = findConfigFile(tempDir);
    expect(configPath).toBe(path.join(tempDir, "tw-obfuscator.config.js"));
  });

  it("should return null when no config file exists", () => {
    const configPath = findConfigFile(tempDir);
    expect(configPath).toBeNull();
  });

  it("should prefer tailwindcss-obfuscator.config.ts over .js", () => {
    fs.writeFileSync(
      path.join(tempDir, "tailwindcss-obfuscator.config.ts"),
      "export default { prefix: 'ts-' };"
    );
    fs.writeFileSync(
      path.join(tempDir, "tailwindcss-obfuscator.config.js"),
      "export default { prefix: 'js-' };"
    );

    const configPath = findConfigFile(tempDir);
    expect(configPath).toBe(path.join(tempDir, "tailwindcss-obfuscator.config.ts"));
  });
});

describe("defineConfig", () => {
  it("should return config object as-is", () => {
    const config = { prefix: "x-", verbose: true };
    const result = defineConfig(config);
    expect(result).toEqual(config);
  });

  it("should call config function", () => {
    const configFn = () => ({ prefix: "fn-", debug: true });
    const result = defineConfig(configFn);
    expect(result).toEqual({ prefix: "fn-", debug: true });
  });
});

describe("Token extraction with positions", () => {
  it("should extract class positions from HTML", () => {
    const content = `<div class="flex items-center">Hello</div>`;
    const tokens = extractWithPositions(content, "test.html");

    expect(tokens.length).toBeGreaterThan(0);
    const flexToken = tokens.find((t) => t.rawCandidate === "flex");
    expect(flexToken).toBeDefined();
    expect(flexToken?.file).toBe("test.html");
    expect(flexToken?.line).toBe(1);
    expect(flexToken?.column).toBeGreaterThan(0);
  });

  it("should extract class positions from JSX", () => {
    const content = `<div className="flex items-center">Hello</div>`;
    const tokens = extractWithPositions(content, "test.tsx");

    const flexToken = tokens.find((t) => t.rawCandidate === "flex");
    expect(flexToken).toBeDefined();
    expect(flexToken?.file).toBe("test.tsx");
  });

  it("should track line numbers correctly", () => {
    const content = `
<div class="flex">
  <span class="items-center">
    Hello
  </span>
</div>`;
    const tokens = extractWithPositions(content, "test.html");

    const flexToken = tokens.find((t) => t.rawCandidate === "flex");
    const itemsToken = tokens.find((t) => t.rawCandidate === "items-center");

    expect(flexToken?.line).toBe(2);
    expect(itemsToken?.line).toBe(3);
  });

  it("should include line text", () => {
    const content = `<div class="flex items-center">Hello</div>`;
    const tokens = extractWithPositions(content, "test.html");

    const flexToken = tokens.find((t) => t.rawCandidate === "flex");
    expect(flexToken?.lineText).toContain("flex");
  });
});

describe("extractTokensFromFiles", () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "tw-tokens-"));
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it("should extract tokens from multiple files", () => {
    const file1 = path.join(tempDir, "test1.html");
    const file2 = path.join(tempDir, "test2.html");

    fs.writeFileSync(file1, '<div class="flex">A</div>');
    fs.writeFileSync(file2, '<div class="grid">B</div>');

    const report = extractTokensFromFiles([file1, file2], ["**/*.html"]);

    expect(report.fileCount).toBe(2);
    expect(report.tokens.some((t) => t.rawCandidate === "flex")).toBe(true);
    expect(report.tokens.some((t) => t.rawCandidate === "grid")).toBe(true);
  });

  it("should skip non-existent files", () => {
    const file1 = path.join(tempDir, "exists.html");
    const file2 = path.join(tempDir, "missing.html");

    fs.writeFileSync(file1, '<div class="flex">A</div>');

    const report = extractTokensFromFiles([file1, file2]);

    expect(report.fileCount).toBe(1);
    expect(report.skipped?.length).toBe(1);
    expect(report.skipped?.[0].file).toBe(file2);
  });
});

describe("groupTokensByFile", () => {
  it("should group tokens by file path", () => {
    const report = {
      tokens: [
        { rawCandidate: "flex", file: "/a/test1.html", line: 1, column: 1 },
        { rawCandidate: "grid", file: "/a/test1.html", line: 2, column: 1 },
        { rawCandidate: "block", file: "/a/test2.html", line: 1, column: 1 },
      ],
      fileCount: 2,
      sources: ["**/*.html"],
    };

    const grouped = groupTokensByFile(report);

    expect(grouped.size).toBe(2);
    expect(grouped.get("/a/test1.html")?.length).toBe(2);
    expect(grouped.get("/a/test2.html")?.length).toBe(1);
  });

  it("should support relative paths", () => {
    const report = {
      tokens: [{ rawCandidate: "flex", file: "/base/src/test.html", line: 1, column: 1 }],
      fileCount: 1,
      sources: [],
    };

    const grouped = groupTokensByFile(report, { relativeTo: "/base" });

    expect(grouped.has("src/test.html")).toBe(true);
  });
});

describe("New options in resolveOptions", () => {
  it("should have default mapping options", () => {
    const options = resolveOptions({});

    expect(options.mapping.enabled).toBe(true);
    expect(options.mapping.file).toBe(".tw-obfuscation/class-mapping.json");
    expect(options.mapping.pretty).toBe(true);
    expect(options.mapping.format).toBe("json");
  });

  it("should have default cache options", () => {
    const options = resolveOptions({});

    expect(options.cache.enabled).toBe(true);
    expect(options.cache.directory).toBe(".tw-obfuscation/cache");
    expect(options.cache.strategy).toBe("merge");
  });

  it("should have default trackPositions", () => {
    const options = resolveOptions({});
    expect(options.trackPositions).toBe(false);
  });

  it("should allow overriding mapping options", () => {
    const options = resolveOptions({
      mapping: {
        enabled: false,
        file: "custom/path.json",
        pretty: 4,
        format: "text",
      },
    });

    expect(options.mapping.enabled).toBe(false);
    expect(options.mapping.file).toBe("custom/path.json");
    expect(options.mapping.pretty).toBe(4);
    expect(options.mapping.format).toBe("text");
  });

  it("should allow overriding cache options", () => {
    const options = resolveOptions({
      cache: {
        enabled: false,
        directory: "custom/cache",
        strategy: "overwrite",
      },
    });

    expect(options.cache.enabled).toBe(false);
    expect(options.cache.directory).toBe("custom/cache");
    expect(options.cache.strategy).toBe("overwrite");
  });
});

describe("Mapping output", () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "tw-mapping-"));
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it("should not save when mapping is disabled", () => {
    const ctx = createContext(
      {
        mapping: { enabled: false },
      },
      "production"
    );
    ctx.classMap.set("flex", "tw-a");

    saveMapping(ctx, tempDir);

    const expectedPath = path.join(tempDir, ".tw-obfuscation", "class-mapping.json");
    expect(fs.existsSync(expectedPath)).toBe(false);
  });

  it("should save JSON with pretty printing", () => {
    const ctx = createContext(
      {
        mapping: { enabled: true, file: "mapping.json", pretty: 2 },
      },
      "production"
    );
    ctx.classMapping.classes["flex"] = {
      original: "flex",
      obfuscated: "tw-a",
      usedIn: ["test.tsx"],
      occurrences: 1,
    };

    saveMapping(ctx, tempDir);

    const content = fs.readFileSync(path.join(tempDir, "mapping.json"), "utf-8");
    expect(content).toContain("\n"); // Pretty printed has newlines
  });

  it("should export simple mapping", () => {
    const ctx = createContext({}, "production");
    ctx.classMap.set("flex", "tw-a");
    ctx.classMap.set("grid", "tw-b");

    exportSimpleMapping(ctx, tempDir, "simple-map.json");

    const content = fs.readFileSync(
      path.join(tempDir, ".tw-obfuscation", "simple-map.json"),
      "utf-8"
    );
    const mapping = JSON.parse(content);

    expect(mapping["flex"]).toBe("tw-a");
    expect(mapping["grid"]).toBe("tw-b");
  });
});

describe("Nuxt plugin export", () => {
  it("should export nuxtModule", async () => {
    const { nuxtModule, tailwindcssObfuscatorNuxt } = await import("../src/plugins/nuxt.js");

    expect(nuxtModule).toBeDefined();
    expect(typeof nuxtModule).toBe("function");
    expect(tailwindcssObfuscatorNuxt).toBe(nuxtModule);
  });

  it("should have module meta", async () => {
    const { nuxtModule } = await import("../src/plugins/nuxt.js");

    // Module meta is attached to the function
    expect(nuxtModule.meta).toBeDefined();
    expect(nuxtModule.meta.name).toBe("tailwindcss-obfuscator");
    expect(nuxtModule.meta.configKey).toBe("tailwindcssObfuscator");
  });

  it("should accept options and nuxt as parameters", async () => {
    const { nuxtModule } = await import("../src/plugins/nuxt.js");

    // The function should accept two parameters: options and nuxt
    expect(nuxtModule.length).toBe(2);
  });
});
