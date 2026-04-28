/**
 * Optional validation of extracted classes against a resolved Tailwind config.
 *
 * Tailwind ships its own `resolveConfig` helper that returns the fully merged
 * theme. We don't depend on it directly (Tailwind is not a peer dependency of
 * this package), so the helpers here accept either a pre-resolved config
 * object or a path to a `tailwind.config.{js,cjs,mjs,ts}` file from which we
 * try to dynamically import `resolveConfig` from the host project's
 * `tailwindcss` install.
 *
 * The validator is deliberately conservative: when Tailwind cannot be loaded
 * or the config is missing, every class is treated as valid (no false
 * negatives). It's a *whitelist* applied on top of the regex extractor — not
 * a replacement for it.
 */

import * as fs from "fs";
import * as path from "path";
import { pathToFileURL } from "url";

/**
 * Subset of the resolved Tailwind config we care about for validation.
 */
export interface ResolvedTailwindConfig {
  prefix?: string;
  separator?: string;
  theme?: Record<string, unknown>;
  safelist?: Array<string | { pattern: RegExp }>;
  blocklist?: string[];
}

/**
 * The class-validation interface returned by {@link createTailwindValidator}.
 */
export interface TailwindValidator {
  /** True when the validator was successfully wired to a Tailwind install. */
  enabled: boolean;
  /** Returns true if `className` is considered valid by Tailwind config. */
  isValid(className: string): boolean;
  /** The configured prefix (or empty string). */
  prefix: string;
  /** The variant separator (default `:`). */
  separator: string;
}

/**
 * Pass-through validator that accepts every class. Returned when no config
 * is available so callers can use the same interface unconditionally.
 */
export function noopTailwindValidator(): TailwindValidator {
  return {
    enabled: false,
    isValid: () => true,
    prefix: "",
    separator: ":",
  };
}

/**
 * Build a validator from an already-resolved Tailwind config object. The
 * returned validator honors `prefix`, `separator`, `safelist`, and
 * `blocklist`. It does not attempt full theme-aware validation — Tailwind's
 * JIT engine is the authoritative source for that — but it filters out
 * classes that are obviously outside the configured surface.
 */
export function createTailwindValidator(resolved: ResolvedTailwindConfig): TailwindValidator {
  const prefix = resolved.prefix ?? "";
  const separator = resolved.separator ?? ":";
  const safe = new Set<string>();
  const safePatterns: RegExp[] = [];
  for (const item of resolved.safelist ?? []) {
    if (typeof item === "string") safe.add(item);
    else if (item && item.pattern instanceof RegExp) safePatterns.push(item.pattern);
  }
  const blocked = new Set<string>(resolved.blocklist ?? []);

  return {
    enabled: true,
    prefix,
    separator,
    isValid(className: string): boolean {
      if (blocked.has(className)) return false;
      if (safe.has(className)) return true;
      if (safePatterns.some((p) => p.test(className))) return true;

      // A configured prefix means utility classes must start with it (after
      // any leading variant block). Reject classes that drop the prefix.
      if (prefix.length > 0) {
        const utility = className.split(separator).pop() ?? className;
        const stripped = utility.replace(/^!/, "").replace(/^-/, "");
        if (!stripped.startsWith(prefix)) return false;
      }
      return true;
    },
  };
}

/**
 * Try to load `tailwind.config.*` from the project root and return a
 * resolved config. Returns `null` when no config is found or when the host
 * project does not ship `tailwindcss` (in which case we cannot resolve).
 *
 * The returned object is the *raw* config from disk — pass it through
 * {@link createTailwindValidator} to obtain a validator.
 */
export async function loadResolvedTailwindConfig(
  projectRoot: string
): Promise<ResolvedTailwindConfig | null> {
  const candidates = [
    "tailwind.config.ts",
    "tailwind.config.mts",
    "tailwind.config.js",
    "tailwind.config.mjs",
    "tailwind.config.cjs",
  ];

  let configPath: string | null = null;
  for (const c of candidates) {
    const full = path.join(projectRoot, c);
    if (fs.existsSync(full)) {
      configPath = full;
      break;
    }
  }
  if (!configPath) return null;

  let userConfig: ResolvedTailwindConfig;
  try {
    const fileUrl = pathToFileURL(configPath).href;
    const mod = (await import(fileUrl)) as Record<string, unknown>;
    userConfig = (mod.default ?? mod) as ResolvedTailwindConfig;
  } catch {
    return null;
  }

  // Try to use Tailwind's own resolveConfig if available in the host project.
  try {
    const resolveModuleUrl = pathToFileURL(
      require.resolve("tailwindcss/resolveConfig", { paths: [projectRoot] })
    ).href;
    const resolveMod = (await import(resolveModuleUrl)) as {
      default?: (c: ResolvedTailwindConfig) => ResolvedTailwindConfig;
    };
    if (typeof resolveMod.default === "function") {
      return resolveMod.default(userConfig);
    }
  } catch {
    // tailwindcss not installed in host project; return the raw config.
  }

  return userConfig;
}

/**
 * Convenience: attempt to construct a validator from `projectRoot`,
 * silently falling back to a no-op validator on any failure.
 */
export async function tryCreateTailwindValidator(projectRoot: string): Promise<TailwindValidator> {
  try {
    const resolved = await loadResolvedTailwindConfig(projectRoot);
    if (!resolved) return noopTailwindValidator();
    return createTailwindValidator(resolved);
  } catch {
    return noopTailwindValidator();
  }
}
