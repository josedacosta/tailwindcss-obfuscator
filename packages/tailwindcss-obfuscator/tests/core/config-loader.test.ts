import { describe, it, expect } from "vitest";
import * as os from "os";
import * as path from "path";
import * as fs from "fs/promises";
import { findConfigFile, loadConfigFile, loadConfig, defineConfig } from "../../src/core/config.js";
import type { ObfuscatorOptions } from "../../src/core/types.js";

async function withTmp<T>(fn: (dir: string) => Promise<T>): Promise<T> {
  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "obf-config-"));
  try {
    return await fn(tmp);
  } finally {
    await fs.rm(tmp, { recursive: true, force: true });
  }
}

describe("findConfigFile", () => {
  it("returns null when no config file exists", async () => {
    await withTmp(async (dir) => {
      expect(findConfigFile(dir)).toBeNull();
    });
  });

  it("finds .ts config first when both .ts and .js are present", async () => {
    await withTmp(async (dir) => {
      await fs.writeFile(path.join(dir, "tailwindcss-obfuscator.config.ts"), "export default {};");
      await fs.writeFile(path.join(dir, "tailwindcss-obfuscator.config.js"), "export default {};");
      const found = findConfigFile(dir);
      expect(found).not.toBeNull();
      expect(found).toContain("tailwindcss-obfuscator.config.ts");
    });
  });

  it("finds the legacy tw-obfuscator.config.* shorthand", async () => {
    await withTmp(async (dir) => {
      await fs.writeFile(path.join(dir, "tw-obfuscator.config.js"), "module.exports = {};");
      const found = findConfigFile(dir);
      expect(found).toContain("tw-obfuscator.config.js");
    });
  });
});

describe("loadConfigFile", () => {
  it("loads a default-export ESM config (.mjs)", async () => {
    await withTmp(async (dir) => {
      const file = path.join(dir, "tailwindcss-obfuscator.config.mjs");
      const cfg: ObfuscatorOptions = { prefix: "tw-", verbose: true };
      await fs.writeFile(file, `export default ${JSON.stringify(cfg)};\n`);
      const loaded = await loadConfigFile(file);
      expect(loaded).toEqual(cfg);
    });
  });

  it("loads a JSON config", async () => {
    await withTmp(async (dir) => {
      const file = path.join(dir, "obfuscator.json");
      const cfg: ObfuscatorOptions = { prefix: "x-" };
      await fs.writeFile(file, JSON.stringify(cfg));
      const loaded = await loadConfigFile(file);
      expect(loaded).toEqual(cfg);
    });
  });

  it("returns the result of the factory when default export is a function", async () => {
    await withTmp(async (dir) => {
      const file = path.join(dir, "tailwindcss-obfuscator.config.mjs");
      await fs.writeFile(file, `export default function () { return { prefix: 'fn-' }; };\n`);
      const loaded = await loadConfigFile(file);
      expect(loaded).toEqual({ prefix: "fn-" });
    });
  });

  it("returns {} when default export is null/undefined", async () => {
    await withTmp(async (dir) => {
      const file = path.join(dir, "tailwindcss-obfuscator.config.mjs");
      await fs.writeFile(file, `export default null;\n`);
      const loaded = await loadConfigFile(file);
      expect(loaded).toEqual({});
    });
  });

  it("falls back to direct module export when no default is present", async () => {
    await withTmp(async (dir) => {
      const file = path.join(dir, "tailwindcss-obfuscator.config.mjs");
      await fs.writeFile(file, `export const prefix = 'named-';\n`);
      const loaded = await loadConfigFile(file);
      expect(loaded).toMatchObject({ prefix: "named-" });
    });
  });

  it("throws on invalid JSON", async () => {
    await withTmp(async (dir) => {
      const file = path.join(dir, "broken.json");
      await fs.writeFile(file, "{ not valid json");
      await expect(loadConfigFile(file)).rejects.toThrow(/Cannot parse JSON config file/);
    });
  });

  it("throws on unsupported file extension", async () => {
    await withTmp(async (dir) => {
      const file = path.join(dir, "config.toml");
      await fs.writeFile(file, "prefix = 'x'");
      await expect(loadConfigFile(file)).rejects.toThrow(/Unsupported config file extension/);
    });
  });

  it("throws with a helpful message when a JS file fails to import", async () => {
    await withTmp(async (dir) => {
      const file = path.join(dir, "bad.mjs");
      await fs.writeFile(file, "throw new Error('boom');\n");
      await expect(loadConfigFile(file)).rejects.toThrow(/Cannot load config file/);
    });
  });
});

describe("loadConfig", () => {
  it("returns null when no config is found in projectRoot", async () => {
    await withTmp(async (dir) => {
      const result = await loadConfig(dir);
      expect(result).toBeNull();
    });
  });

  it("returns { path, config } when a config exists", async () => {
    await withTmp(async (dir) => {
      const file = path.join(dir, "tailwindcss-obfuscator.config.mjs");
      await fs.writeFile(file, `export default { prefix: 'p-' };\n`);
      const result = await loadConfig(dir);
      expect(result).not.toBeNull();
      expect(result!.path).toBe(file);
      expect(result!.config).toEqual({ prefix: "p-" });
    });
  });
});

describe("defineConfig", () => {
  it("returns the object identity for a static config", () => {
    const cfg: ObfuscatorOptions = { prefix: "tw-" };
    expect(defineConfig(cfg)).toBe(cfg);
  });

  it("invokes the factory and returns its result", () => {
    const cfg: ObfuscatorOptions = { prefix: "fn-" };
    expect(defineConfig(() => cfg)).toBe(cfg);
  });
});
