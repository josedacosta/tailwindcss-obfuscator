import { existsSync, readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import tailwindcssObfuscator from "tailwindcss-obfuscator/vite";

const obfuscatorOptions = {
  prefix: "tw-",
  verbose: true,
  debug: true,
  preserve: {
    classes: ["no-obfuscate"],
  },
  mapping: {
    enabled: true,
    file: ".tw-obfuscation/class-mapping.json",
    pretty: 2,
  },
  cache: {
    enabled: true,
    directory: ".tw-obfuscation/cache",
    strategy: "merge" as const,
  },
};

export default defineNuxtConfig({
  compatibilityDate: "2024-12-01",
  devtools: { enabled: true },

  css: ["~/assets/css/main.css"],

  vite: {
    plugins: [tailwindcss(), tailwindcssObfuscator(obfuscatorOptions)],
  },

  hooks: {
    // Nitro produces the SSR bundle (.output/server/**) via Rollup, after the
    // Vite phase. Walk those files and rewrite the original Tailwind classes
    // using the mapping the Vite build just wrote.
    async close() {
      const mappingPath = join(process.cwd(), ".tw-obfuscation", "class-mapping.json");
      const outputDir = join(process.cwd(), ".output");
      if (!existsSync(mappingPath) || !existsSync(outputDir)) return;

      const { transformContent, createContext, setSharedContext } =
        await import("tailwindcss-obfuscator/internals");
      const mappingFile = JSON.parse(readFileSync(mappingPath, "utf-8"));
      const ctx = createContext(obfuscatorOptions, "production");
      for (const [original, entry] of Object.entries(mappingFile.classes ?? {})) {
        ctx.classMap.set(original, (entry as { obfuscated: string }).obfuscated);
      }
      setSharedContext(ctx);

      let totalReplacements = 0;
      const walk = (dir: string) => {
        if (!existsSync(dir)) return;
        for (const name of readdirSync(dir)) {
          const full = join(dir, name);
          const st = statSync(full);
          if (st.isDirectory()) {
            if (name === "node_modules") continue;
            walk(full);
          } else if (st.isFile() && /\.(mjs|cjs|js|html|css)$/.test(name)) {
            const src = readFileSync(full, "utf-8");
            const result = transformContent(src, full, ctx);
            if (result.replacements > 0) {
              writeFileSync(full, result.transformed);
              totalReplacements += result.replacements;
            }
          }
        }
      };
      // Nitro splits its build into two siblings under `.output/`:
      //   - server/  → SSR runtime + Rollup-bundled chunks (Vite never sees)
      //   - public/_nuxt/  → static assets including bundled error pages
      // Walk both so neither escapes obfuscation.
      walk(join(outputDir, "server"));
      walk(join(outputDir, "public"));

      console.log(`[tw-obfuscator] Nitro post-pass: ${totalReplacements} replacements`);
    },
  },
});
