#!/usr/bin/env node
/**
 * Post-build pass for Next.js Static Site Generation output.
 *
 * Next emits pre-rendered HTML and SSR JS chunks to `.next/server/**`
 * outside webpack's `processAssets` hook, so the obfuscator's webpack
 * plugin never sees those files. Walk them after `next build` and apply
 * `transformContent` using the mapping the build phase wrote.
 */
import { existsSync, readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const cwd = process.cwd();
const mappingPath = join(cwd, ".tw-obfuscation", "class-mapping.json");
const serverDir = join(cwd, ".next", "server");

if (!existsSync(mappingPath)) {
  console.error("[tw-obfuscator] post-build: missing class mapping, skipping.");
  process.exit(0);
}
if (!existsSync(serverDir)) {
  console.error("[tw-obfuscator] post-build: no .next/server directory, skipping.");
  process.exit(0);
}

const { transformContent, createContext, setSharedContext } = await import(
  "tailwindcss-obfuscator/internals"
);

const mappingFile = JSON.parse(readFileSync(mappingPath, "utf-8"));
const ctx = createContext({ prefix: "tw-" }, "production");
for (const [original, entry] of Object.entries(mappingFile.classes ?? {})) {
  ctx.classMap.set(original, entry.obfuscated);
}
setSharedContext(ctx);

let totalReplacements = 0;
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) {
      if (name === "node_modules") continue;
      walk(full);
    } else if (st.isFile() && /\.(html|rsc|js|mjs|cjs)$/.test(name)) {
      const src = readFileSync(full, "utf-8");
      const result = transformContent(src, full, ctx);
      if (result.replacements > 0) {
        writeFileSync(full, result.transformed);
        totalReplacements += result.replacements;
      }
    }
  }
};
walk(serverDir);
console.log(`[tw-obfuscator] post-build: ${totalReplacements} replacements in .next/server`);
