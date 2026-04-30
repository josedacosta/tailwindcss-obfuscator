import { describe, it, expect } from "vitest";
import * as os from "os";
import * as path from "path";
import * as fs from "fs/promises";
import {
  noopTailwindValidator,
  createTailwindValidator,
  loadResolvedTailwindConfig,
  tryCreateTailwindValidator,
  type ResolvedTailwindConfig,
} from "../../src/core/tailwind-validator.js";

describe("noopTailwindValidator", () => {
  it("reports disabled and accepts every class", () => {
    const v = noopTailwindValidator();
    expect(v.enabled).toBe(false);
    expect(v.prefix).toBe("");
    expect(v.separator).toBe(":");
    expect(v.isValid("anything-at-all")).toBe(true);
    expect(v.isValid("")).toBe(true);
    expect(v.isValid("hover:bg-red-500/50")).toBe(true);
  });
});

describe("createTailwindValidator", () => {
  it("defaults prefix to empty string and separator to ':' when omitted", () => {
    const v = createTailwindValidator({});
    expect(v.enabled).toBe(true);
    expect(v.prefix).toBe("");
    expect(v.separator).toBe(":");
  });

  it("accepts every class when no prefix / safelist / blocklist", () => {
    const v = createTailwindValidator({});
    expect(v.isValid("flex")).toBe(true);
    expect(v.isValid("hover:underline")).toBe(true);
    expect(v.isValid("anything")).toBe(true);
  });

  it("rejects every class explicitly listed in blocklist", () => {
    const v = createTailwindValidator({ blocklist: ["bg-red-500", "text-xs"] });
    expect(v.isValid("bg-red-500")).toBe(false);
    expect(v.isValid("text-xs")).toBe(false);
    expect(v.isValid("flex")).toBe(true);
  });

  it("string safelist entries always pass even with a configured prefix", () => {
    const v = createTailwindValidator({
      prefix: "tw-",
      safelist: ["unprefixed-but-allowed"],
    });
    expect(v.isValid("unprefixed-but-allowed")).toBe(true);
    expect(v.isValid("tw-flex")).toBe(true);
    expect(v.isValid("flex")).toBe(false);
  });

  it("regex safelist entries are honored", () => {
    const v = createTailwindValidator({
      prefix: "tw-",
      safelist: [{ pattern: /^bg-red-\d+$/ }],
    });
    expect(v.isValid("bg-red-500")).toBe(true);
    expect(v.isValid("bg-red-100")).toBe(true);
    expect(v.isValid("bg-blue-500")).toBe(false);
  });

  it("ignores malformed safelist entries (no pattern, not a string)", () => {
    const v = createTailwindValidator({
      // intentionally malformed entries
      safelist: [
        // @ts-expect-error - intentionally non-RegExp pattern to test runtime tolerance
        { pattern: "not-a-regexp" },
        // @ts-expect-error - intentionally null entry to test runtime tolerance
        null,
        // @ts-expect-error - intentionally numeric entry to test runtime tolerance
        42,
      ],
    });
    expect(v.isValid("anything")).toBe(true);
  });

  it("requires prefix on the trailing utility segment when prefix is configured", () => {
    const v = createTailwindValidator({ prefix: "tw-" });
    expect(v.isValid("tw-flex")).toBe(true);
    expect(v.isValid("hover:tw-flex")).toBe(true);
    expect(v.isValid("hover:focus:tw-bg-red-500")).toBe(true);
    expect(v.isValid("flex")).toBe(false);
    expect(v.isValid("hover:bg-red-500")).toBe(false);
  });

  it("strips leading '!' (important) before checking prefix", () => {
    const v = createTailwindValidator({ prefix: "tw-" });
    expect(v.isValid("!tw-flex")).toBe(true);
    expect(v.isValid("hover:!tw-bg-red-500")).toBe(true);
  });

  it("strips leading '-' (negative) before checking prefix", () => {
    const v = createTailwindValidator({ prefix: "tw-" });
    expect(v.isValid("-tw-mt-4")).toBe(true);
  });

  it("honors a non-default separator when splitting variant block", () => {
    const v = createTailwindValidator({ prefix: "tw-", separator: "__" });
    expect(v.isValid("hover__tw-flex")).toBe(true);
    expect(v.isValid("hover__flex")).toBe(false);
  });

  it("blocklist takes precedence over safelist", () => {
    const v = createTailwindValidator({
      blocklist: ["bg-red-500"],
      safelist: ["bg-red-500"],
    });
    expect(v.isValid("bg-red-500")).toBe(false);
  });
});

describe("loadResolvedTailwindConfig", () => {
  it("returns null when no tailwind.config.* file exists in projectRoot", async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "tw-validator-"));
    try {
      const result = await loadResolvedTailwindConfig(tmp);
      expect(result).toBeNull();
    } finally {
      await fs.rm(tmp, { recursive: true, force: true });
    }
  });

  it("preserves user-provided prefix and separator after load", async () => {
    // Note: when a Tailwind install is reachable in the workspace,
    // `tailwindcss/resolveConfig` will be invoked and the returned object
    // is a fully merged config. We only assert that the user-set fields
    // survive the resolve step.
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "tw-validator-"));
    try {
      const cfg: ResolvedTailwindConfig = { prefix: "tw-", separator: "::" };
      await fs.writeFile(
        path.join(tmp, "tailwind.config.mjs"),
        `export default ${JSON.stringify(cfg)};\n`
      );
      const result = await loadResolvedTailwindConfig(tmp);
      expect(result).not.toBeNull();
      expect(result!.prefix).toBe("tw-");
      expect(result!.separator).toBe("::");
    } finally {
      await fs.rm(tmp, { recursive: true, force: true });
    }
  });

  it("returns null when the config file throws on import", async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "tw-validator-"));
    try {
      await fs.writeFile(path.join(tmp, "tailwind.config.mjs"), "throw new Error('boom');\n");
      const result = await loadResolvedTailwindConfig(tmp);
      expect(result).toBeNull();
    } finally {
      await fs.rm(tmp, { recursive: true, force: true });
    }
  });
});

describe("tryCreateTailwindValidator", () => {
  it("returns the noop validator when projectRoot has no config", async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "tw-validator-"));
    try {
      const v = await tryCreateTailwindValidator(tmp);
      expect(v.enabled).toBe(false);
      expect(v.isValid("anything")).toBe(true);
    } finally {
      await fs.rm(tmp, { recursive: true, force: true });
    }
  });

  it("returns an enabled validator when a parseable config exists", async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "tw-validator-"));
    try {
      await fs.writeFile(
        path.join(tmp, "tailwind.config.mjs"),
        `export default { prefix: "tw-" };\n`
      );
      const v = await tryCreateTailwindValidator(tmp);
      expect(v.enabled).toBe(true);
      expect(v.prefix).toBe("tw-");
      expect(v.isValid("tw-flex")).toBe(true);
      expect(v.isValid("flex")).toBe(false);
    } finally {
      await fs.rm(tmp, { recursive: true, force: true });
    }
  });
});
