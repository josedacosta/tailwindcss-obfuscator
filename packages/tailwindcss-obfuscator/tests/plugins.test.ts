/**
 * Tests for bundler plugins (Vite, Webpack, Rollup, esbuild)
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// Import plugin factories
import { tailwindCssObfuscatorVite } from "../src/plugins/vite.js";
import {
  TailwindCssObfuscatorPlugin,
  tailwindCssObfuscatorWebpack,
} from "../src/plugins/webpack.js";
import { tailwindCssObfuscatorRollup } from "../src/plugins/rollup.js";
import { tailwindCssObfuscatorEsbuild } from "../src/plugins/esbuild.js";

describe("Vite Plugin", () => {
  it("should create a plugin with the correct name", () => {
    const plugin = tailwindCssObfuscatorVite();
    expect(plugin.name).toBe("tailwindcss-obfuscator");
  });

  it("should have required Vite plugin hooks", () => {
    const plugin = tailwindCssObfuscatorVite();

    expect(plugin.configResolved).toBeDefined();
    expect(typeof plugin.configResolved).toBe("function");

    expect(plugin.buildStart).toBeDefined();
    expect(typeof plugin.buildStart).toBe("function");

    expect(plugin.transform).toBeDefined();
    expect(typeof plugin.transform).toBe("function");

    expect(plugin.transformIndexHtml).toBeDefined();
    expect(typeof plugin.transformIndexHtml).toBe("function");

    expect(plugin.generateBundle).toBeDefined();
    expect(typeof plugin.generateBundle).toBe("function");

    // Since the migration to unplugin, finalization happens via buildEnd
    // (which Vite invokes after the bundle is generated) instead of a
    // separate closeBundle hook.
    expect(plugin.buildEnd).toBeDefined();
    expect(typeof plugin.buildEnd).toBe("function");
  });

  it("should accept custom options", () => {
    const plugin = tailwindCssObfuscatorVite({
      prefix: "x-",
      verbose: true,
      preserve: {
        classes: ["dark", "light"],
        functions: ["debugClass"],
      },
    });

    expect(plugin.name).toBe("tailwindcss-obfuscator");
  });

  it("should handle configResolved", () => {
    const plugin = tailwindCssObfuscatorVite();

    // Simulate Vite's resolved config
    const mockConfig = {
      command: "build",
      root: "/test/project",
    };

    // Should not throw
    expect(() => {
      (plugin.configResolved as Function)(mockConfig);
    }).not.toThrow();
  });
});

describe("Webpack Plugin", () => {
  it("should create a plugin instance with factory function", () => {
    const plugin = tailwindCssObfuscatorWebpack();
    expect(plugin).toBeInstanceOf(TailwindCssObfuscatorPlugin);
  });

  it("should create a plugin instance with constructor", () => {
    const plugin = new TailwindCssObfuscatorPlugin();
    expect(plugin).toBeInstanceOf(TailwindCssObfuscatorPlugin);
  });

  it("should have apply method", () => {
    const plugin = new TailwindCssObfuscatorPlugin();
    expect(plugin.apply).toBeDefined();
    expect(typeof plugin.apply).toBe("function");
  });

  it("should accept custom options", () => {
    const plugin = new TailwindCssObfuscatorPlugin({
      prefix: "x-",
      verbose: true,
    });
    expect(plugin).toBeInstanceOf(TailwindCssObfuscatorPlugin);
  });
});

describe("Rollup Plugin", () => {
  it("should create a plugin with the correct name", () => {
    const plugin = tailwindCssObfuscatorRollup();
    expect(plugin.name).toBe("tailwindcss-obfuscator");
  });

  it("should have required Rollup plugin hooks", () => {
    const plugin = tailwindCssObfuscatorRollup();

    expect(plugin.buildStart).toBeDefined();
    expect(typeof plugin.buildStart).toBe("function");

    expect(plugin.transform).toBeDefined();
    expect(typeof plugin.transform).toBe("function");

    expect(plugin.generateBundle).toBeDefined();
    expect(typeof plugin.generateBundle).toBe("function");

    // Since the migration to unplugin, finalization happens via buildEnd
    // (which Rollup invokes after the bundle is generated) instead of a
    // separate closeBundle hook.
    expect(plugin.buildEnd).toBeDefined();
    expect(typeof plugin.buildEnd).toBe("function");
  });

  it("should accept custom options", () => {
    const plugin = tailwindCssObfuscatorRollup({
      prefix: "x-",
      verbose: true,
      preserve: {
        classes: ["dark"],
      },
    });

    expect(plugin.name).toBe("tailwindcss-obfuscator");
  });
});

describe("esbuild Plugin", () => {
  it("should create a plugin with the correct name", () => {
    const plugin = tailwindCssObfuscatorEsbuild();
    expect(plugin.name).toBe("tailwindcss-obfuscator");
  });

  it("should have setup function", () => {
    const plugin = tailwindCssObfuscatorEsbuild();
    expect(plugin.setup).toBeDefined();
    expect(typeof plugin.setup).toBe("function");
  });

  it("should accept custom options", () => {
    const plugin = tailwindCssObfuscatorEsbuild({
      prefix: "x-",
      verbose: true,
    });

    expect(plugin.name).toBe("tailwindcss-obfuscator");
  });

  it("should register build hooks", () => {
    const plugin = tailwindCssObfuscatorEsbuild();

    // Since the migration to a shared `unplugin` factory, the esbuild
    // adapter inspects `initialOptions` before deciding which hooks to
    // register, so the mock must include it.
    const mockBuild = {
      initialOptions: { plugins: [], outdir: "dist" },
      onStart: vi.fn(),
      onLoad: vi.fn(),
      onEnd: vi.fn(),
      onResolve: vi.fn(),
      esbuild: { version: "0.24.0" },
    };

    plugin.setup(mockBuild as any);

    expect(mockBuild.onStart).toHaveBeenCalled();
    expect(mockBuild.onEnd).toHaveBeenCalled();
  });
});

describe("Plugin Options", () => {
  const testOptions = {
    prefix: "custom-",
    verbose: true,
    debug: true,
    sourcemap: false,
    tailwindVersion: "4" as const,
    preserve: {
      functions: ["debugClass", "analyticsClass"],
      classes: ["dark", "light", "system"],
    },
    exclude: ["hidden", /^animate-/],
    include: [/^bg-/, /^text-/],
    useAst: true,
    usePostcss: true,
    ignoreVueScoped: true,
  };

  it("Vite plugin should accept all options", () => {
    expect(() => tailwindCssObfuscatorVite(testOptions)).not.toThrow();
  });

  it("Webpack plugin should accept all options", () => {
    expect(() => new TailwindCssObfuscatorPlugin(testOptions)).not.toThrow();
  });

  it("Rollup plugin should accept all options", () => {
    expect(() => tailwindCssObfuscatorRollup(testOptions)).not.toThrow();
  });

  it("esbuild plugin should accept all options", () => {
    expect(() => tailwindCssObfuscatorEsbuild(testOptions)).not.toThrow();
  });
});

describe("Custom Class Generator", () => {
  const customGenerator = (index: number, original: string) => `c${index}`;

  it("should work with Vite plugin", () => {
    expect(() => tailwindCssObfuscatorVite({ classGenerator: customGenerator })).not.toThrow();
  });

  it("should work with Webpack plugin", () => {
    expect(
      () => new TailwindCssObfuscatorPlugin({ classGenerator: customGenerator })
    ).not.toThrow();
  });

  it("should work with Rollup plugin", () => {
    expect(() => tailwindCssObfuscatorRollup({ classGenerator: customGenerator })).not.toThrow();
  });

  it("should work with esbuild plugin", () => {
    expect(() => tailwindCssObfuscatorEsbuild({ classGenerator: customGenerator })).not.toThrow();
  });
});

describe("Custom Filter Function", () => {
  const customFilter = (className: string) => className.startsWith("tw-");

  it("should work with Vite plugin", () => {
    expect(() => tailwindCssObfuscatorVite({ filter: customFilter })).not.toThrow();
  });

  it("should work with Webpack plugin", () => {
    expect(() => new TailwindCssObfuscatorPlugin({ filter: customFilter })).not.toThrow();
  });

  it("should work with Rollup plugin", () => {
    expect(() => tailwindCssObfuscatorRollup({ filter: customFilter })).not.toThrow();
  });

  it("should work with esbuild plugin", () => {
    expect(() => tailwindCssObfuscatorEsbuild({ filter: customFilter })).not.toThrow();
  });
});
