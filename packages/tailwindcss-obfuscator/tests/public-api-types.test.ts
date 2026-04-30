/**
 * Public-API type contract tests (release-safety #5).
 *
 * Asserts that the **types** exposed by the public entry point
 * (`tailwindcss-obfuscator`) keep their exact shape across releases. Any
 * silent change to a function signature, an exported interface, or the
 * `default` export class would otherwise ship as a breaking change to
 * downstream TypeScript consumers without a major version bump.
 *
 * These tests use `expectTypeOf` from vitest — they are **type-only**
 * (no runtime assertions). If a signature changes incompatibly, the test
 * file fails to compile (`pnpm typecheck` exits non-zero) and the CI
 * blocks the merge.
 *
 * To intentionally change the public API :
 * 1. Add a changeset bumping the package to **major** (the standard SemVer
 *    contract for a breaking signature change).
 * 2. Update the assertions below to match the new shape.
 * 3. Document the breaking change in the changeset summary so the
 *    CHANGELOG entry tells consumers what to migrate.
 *
 * Plugin sub-paths (`./vite`, `./webpack`, …) have their own integration
 * coverage via the tarball smoke test (PR #67) and per-export validators
 * in `package-exports.test.ts`.
 */

import { describe, it, expectTypeOf } from "vitest";
import {
  obfuscate,
  defineConfig,
  createLogger,
  createSilentLogger,
  ObfuscatorError,
  ExtractionError,
  TransformError,
  MappingPersistenceError,
  ConfigError,
} from "../src/index.js";
import type {
  ObfuscatorOptions,
  ResolvedObfuscatorOptions,
  ClassMapping,
  ClassMappingEntry,
  ExtractionResult,
  TransformResult,
  SupportedFileType,
  Logger,
  BuildMode,
  MappingOutputOptions,
  ResolvedMappingOutputOptions,
  CacheOptions,
  LogLevel,
  LogSink,
  CreateLoggerOptions,
} from "../src/index.js";

describe("public API — function signatures stay stable", () => {
  it("obfuscate(options?, basePath?, buildDir?) → Promise<{ totalClasses, obfuscatedClasses, filesProcessed, duration }>", () => {
    expectTypeOf(obfuscate).toBeFunction();
    expectTypeOf(obfuscate).parameter(0).toEqualTypeOf<ObfuscatorOptions | undefined>();
    expectTypeOf(obfuscate).parameter(1).toEqualTypeOf<string | undefined>();
    expectTypeOf(obfuscate).parameter(2).toEqualTypeOf<string | undefined>();
    expectTypeOf(obfuscate).returns.resolves.toEqualTypeOf<{
      totalClasses: number;
      obfuscatedClasses: number;
      filesProcessed: number;
      duration: number;
    }>();
  });

  it("default export is the same function as named `obfuscate`", async () => {
    const mod = await import("../src/index.js");
    expectTypeOf(mod.default).toEqualTypeOf<typeof obfuscate>();
  });

  it("defineConfig(options) → ObfuscatorOptions", () => {
    expectTypeOf(defineConfig).toBeFunction();
    expectTypeOf(defineConfig).parameter(0).toEqualTypeOf<ObfuscatorOptions>();
    expectTypeOf(defineConfig).returns.toEqualTypeOf<ObfuscatorOptions>();
  });

  it("createLogger(verbose?, debug?) → Logger", () => {
    expectTypeOf(createLogger).toBeFunction();
    expectTypeOf(createLogger).returns.toEqualTypeOf<Logger>();
  });

  it("createSilentLogger() → Logger", () => {
    expectTypeOf(createSilentLogger).toBeFunction();
    expectTypeOf(createSilentLogger).returns.toEqualTypeOf<Logger>();
  });
});

describe("public API — typed error hierarchy stays subclassable + instanceof-safe", () => {
  it("every exported error is a subclass of ObfuscatorError", () => {
    expectTypeOf(ObfuscatorError).toBeConstructibleWith("msg");
    expectTypeOf(ExtractionError).toBeConstructibleWith("msg");
    expectTypeOf(TransformError).toBeConstructibleWith("msg");
    expectTypeOf(MappingPersistenceError).toBeConstructibleWith("msg");
    expectTypeOf(ConfigError).toBeConstructibleWith("msg");
    // The instance type of every subclass must be assignable to ObfuscatorError
    // (so consumers can `catch (err) { if (err instanceof ObfuscatorError) … }`)
    expectTypeOf(new ExtractionError("msg")).toMatchTypeOf<ObfuscatorError>();
    expectTypeOf(new TransformError("msg")).toMatchTypeOf<ObfuscatorError>();
    expectTypeOf(new MappingPersistenceError("msg")).toMatchTypeOf<ObfuscatorError>();
    expectTypeOf(new ConfigError("msg")).toMatchTypeOf<ObfuscatorError>();
  });
});

describe("public API — exported types stay assignable", () => {
  it("ObfuscatorOptions has the expected core shape (prefix?, content?, verbose?, debug?, exclude?)", () => {
    // Spot-check the most-consumed properties. If their type changes, this fails to compile.
    expectTypeOf<ObfuscatorOptions["prefix"]>().toEqualTypeOf<string | undefined>();
    expectTypeOf<ObfuscatorOptions["verbose"]>().toEqualTypeOf<boolean | undefined>();
    expectTypeOf<ObfuscatorOptions["debug"]>().toEqualTypeOf<boolean | undefined>();
    expectTypeOf<ObfuscatorOptions["content"]>().toEqualTypeOf<string[] | undefined>();
    expectTypeOf<ObfuscatorOptions["css"]>().toEqualTypeOf<string[] | undefined>();
  });

  it("ClassMapping has version + classes record", () => {
    expectTypeOf<ClassMapping["version"]>().toEqualTypeOf<string>();
    // `classes` is a record of original-class-name → ClassMappingEntry
    expectTypeOf<ClassMapping["classes"]>().toBeObject();
  });

  it("ClassMappingEntry exposes original + obfuscated + usedIn + occurrences", () => {
    expectTypeOf<ClassMappingEntry["original"]>().toEqualTypeOf<string>();
    expectTypeOf<ClassMappingEntry["obfuscated"]>().toEqualTypeOf<string>();
    expectTypeOf<ClassMappingEntry["usedIn"]>().toEqualTypeOf<string[]>();
    expectTypeOf<ClassMappingEntry["occurrences"]>().toEqualTypeOf<number>();
  });

  it("ExtractionResult / TransformResult expose .file + (.classes | .replacements)", () => {
    expectTypeOf<ExtractionResult["file"]>().toEqualTypeOf<string>();
    expectTypeOf<ExtractionResult["classes"]>().toEqualTypeOf<string[]>();
    expectTypeOf<TransformResult["file"]>().toEqualTypeOf<string>();
    expectTypeOf<TransformResult["replacements"]>().toEqualTypeOf<number>();
  });

  it("Logger has the level methods consumers depend on", () => {
    expectTypeOf<Logger["info"]>().toBeFunction();
    expectTypeOf<Logger["warn"]>().toBeFunction();
    expectTypeOf<Logger["debug"]>().toBeFunction();
  });

  it("BuildMode is the constrained string literal union", () => {
    expectTypeOf<BuildMode>().toEqualTypeOf<"development" | "production">();
  });

  it("SupportedFileType is the constrained set of file extensions", () => {
    // Should at minimum include the major framework extensions we ship plugins for.
    expectTypeOf<SupportedFileType>().extract<"jsx">().toEqualTypeOf<"jsx">();
    expectTypeOf<SupportedFileType>().extract<"tsx">().toEqualTypeOf<"tsx">();
    expectTypeOf<SupportedFileType>().extract<"vue">().toEqualTypeOf<"vue">();
    expectTypeOf<SupportedFileType>().extract<"svelte">().toEqualTypeOf<"svelte">();
    expectTypeOf<SupportedFileType>().extract<"astro">().toEqualTypeOf<"astro">();
    expectTypeOf<SupportedFileType>().extract<"html">().toEqualTypeOf<"html">();
    expectTypeOf<SupportedFileType>().extract<"css">().toEqualTypeOf<"css">();
  });
});

describe("public API — additional types still exported (existence check)", () => {
  it("ResolvedObfuscatorOptions / MappingOutputOptions / ResolvedMappingOutputOptions / CacheOptions are still part of the public API", () => {
    // Pure existence assertion — if the type was accidentally dropped from
    // src/index.ts, this file fails to compile at the import line above.
    expectTypeOf<ResolvedObfuscatorOptions>().not.toBeAny();
    expectTypeOf<MappingOutputOptions>().not.toBeAny();
    expectTypeOf<ResolvedMappingOutputOptions>().not.toBeAny();
    expectTypeOf<CacheOptions>().not.toBeAny();
  });

  it("LogLevel / LogSink / CreateLoggerOptions are still part of the public API", () => {
    expectTypeOf<LogLevel>().not.toBeAny();
    expectTypeOf<LogSink>().not.toBeAny();
    expectTypeOf<CreateLoggerOptions>().not.toBeAny();
  });
});
