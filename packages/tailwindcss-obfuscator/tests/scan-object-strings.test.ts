import { describe, it, expect } from "vitest";
import { extractClassListLikeStrings } from "../src/extractors/jsx.js";

describe("extractClassListLikeStrings — lookup-table extraction", () => {
  it("picks up class strings stored in object property values", () => {
    const src = `
      export const CONFIDENCE_LEVEL_COLORS = {
        1: { badge: 'border-slate-400/30 bg-slate-400/10 text-slate-600 dark:text-slate-400', bar: 'bg-slate-400' },
        2: { badge: 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400', bar: 'bg-amber-500' },
        3: { badge: 'border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-400',         bar: 'bg-sky-500' },
      };
    `;
    const classes = extractClassListLikeStrings(src, "ConfidenceBadge.tsx");
    expect(classes).toContain("border-slate-400/30");
    expect(classes).toContain("bg-slate-400/10");
    expect(classes).toContain("text-slate-600");
    expect(classes).toContain("border-sky-500/30");
    expect(classes).toContain("bg-sky-500/10");
    expect(classes).toContain("text-sky-700");
    expect(classes).toContain("dark:text-sky-400");
    // Single-token strings (`'bg-slate-400'`) are intentionally NOT included
    // in this pass — they require the user to wrap them or safelist.
    expect(classes).not.toContain("bg-slate-400");
  });

  it("picks up template-literal class strings in object positions", () => {
    const src = "const x = { foo: `flex items-center gap-2` };";
    const classes = extractClassListLikeStrings(src, "x.ts");
    expect(classes).toEqual(expect.arrayContaining(["flex", "items-center", "gap-2"]));
  });

  it("does NOT extract from prose strings (unrecognized tokens)", () => {
    const src = `
      const labels = {
        en: "Hello world",
        fr: "Bonjour le monde",
        ja: "こんにちは 世界",
      };
    `;
    const classes = extractClassListLikeStrings(src, "labels.ts");
    expect(classes).toHaveLength(0);
  });

  it("does NOT extract single-word strings even when they look like utilities", () => {
    const src = `
      const role = "info";
      const color = "red";
      const layout = "flex";
    `;
    const classes = extractClassListLikeStrings(src, "config.ts");
    expect(classes).toHaveLength(0);
  });

  it("does NOT extract config strings where some tokens are non-Tailwind", () => {
    // Mixed — only "rounded" is a class, the rest are prose. Should be skipped.
    const src = `
      const help = "Click rounded the button to continue";
    `;
    const classes = extractClassListLikeStrings(src, "x.ts");
    expect(classes).toHaveLength(0);
  });

  it("strips template-literal expressions before per-token validation", () => {
    const src = "const x = `flex items-center ${dynamic} gap-2`;";
    const classes = extractClassListLikeStrings(src, "x.ts");
    expect(classes).toEqual(expect.arrayContaining(["flex", "items-center", "gap-2"]));
  });

  it("deduplicates repeated tokens across multiple strings", () => {
    const src = `
      const a = "flex items-center";
      const b = "flex items-center justify-between";
    `;
    const classes = extractClassListLikeStrings(src, "x.ts");
    const flexCount = classes.filter((c) => c === "flex").length;
    expect(flexCount).toBe(1);
    expect(classes).toContain("justify-between");
  });

  it("ignores strings shorter than 3 characters", () => {
    const src = `const x = { a: "ab", b: "cd" };`;
    const classes = extractClassListLikeStrings(src, "x.ts");
    expect(classes).toHaveLength(0);
  });
});
