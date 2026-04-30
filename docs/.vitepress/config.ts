import { withMermaid } from "vitepress-plugin-mermaid";
import fs from "node:fs";
import path from "node:path";

const SITE_URL = "https://josedacosta.github.io/tailwindcss-obfuscator";
const DOCS_ROOT = path.resolve(__dirname, "..");

export default withMermaid({
  title: "tailwindcss-obfuscator",
  description:
    "Obfuscate Tailwind CSS class names at build time. Vite, Webpack, Rollup, esbuild, Next.js, Nuxt, SvelteKit, Astro, Solid, Qwik, React Router 7, TanStack Router. Tailwind v3 + v4.",

  // GitHub Pages serves the site under https://josedacosta.github.io/tailwindcss-obfuscator/
  base: "/tailwindcss-obfuscator/",

  cleanUrls: true,
  lastUpdated: true,

  // Drop the prebuilt search index from older runs and the sample-app build artefacts.
  ignoreDeadLinks: true,

  // Generate sitemap.xml at build time. Required for SEO + AI crawler indexing.
  // Picked up by robots.txt's `Sitemap:` line.
  sitemap: {
    hostname: SITE_URL + "/",
  },

  // Per-page hook: inject SEO + social-share + LLM hints on every page.
  // Standard 2026 setup matching Anthropic docs / Vercel docs / Cloudflare docs.
  transformPageData(pageData) {
    const relPath = pageData.relativePath.replace(/\.md$/, "");
    const isIndex = relPath === "index" || relPath === "";
    const pageUrl = isIndex ? `${SITE_URL}/` : `${SITE_URL}/${relPath}`;
    const mdUrl = isIndex ? `${SITE_URL}/index.md` : `${SITE_URL}/${relPath}.md`;
    const pageTitle = pageData.frontmatter.title || pageData.title || "tailwindcss-obfuscator";
    const pageDescription =
      pageData.frontmatter.description ||
      pageData.description ||
      "Build-time Tailwind CSS class obfuscator. Cuts CSS bundle by 30–60% and protects your design system.";

    pageData.frontmatter.head = pageData.frontmatter.head || [];
    pageData.frontmatter.head.push(
      // ---- LLM/AI raw-markdown hints (PR #51) ----
      ["link", { rel: "alternate", type: "text/markdown", href: mdUrl }],
      ["meta", { name: "format-detection", content: "markdown-source-available" }],
      ["meta", { property: "ai:source", content: mdUrl }],
      // ---- SEO: canonical URL prevents duplicate-content penalty ----
      ["link", { rel: "canonical", href: pageUrl }],
      // ---- Open Graph: per-page title + description + URL for rich social previews ----
      ["meta", { property: "og:url", content: pageUrl }],
      ["meta", { property: "og:title", content: pageTitle }],
      ["meta", { property: "og:description", content: pageDescription }],
      ["meta", { property: "og:type", content: isIndex ? "website" : "article" }],
      [
        "meta",
        {
          property: "og:image",
          content: `${SITE_URL}/images/tailwindcss-obfuscator/logo-horizontal.svg`,
        },
      ],
      // ---- Twitter Card: large image preview ----
      ["meta", { name: "twitter:card", content: "summary_large_image" }],
      ["meta", { name: "twitter:title", content: pageTitle }],
      ["meta", { name: "twitter:description", content: pageDescription }],
      [
        "meta",
        {
          name: "twitter:image",
          content: `${SITE_URL}/images/tailwindcss-obfuscator/logo-horizontal.svg`,
        },
      ],
      // ---- Mobile chrome bar matches logo dark slate ----
      ["meta", { name: "theme-color", content: "#0f172a" }],
      // ---- Apple touch icon (square logo) ----
      [
        "link",
        {
          rel: "apple-touch-icon",
          sizes: "180x180",
          href: "/tailwindcss-obfuscator/images/tailwindcss-obfuscator/logo-square.svg",
        },
      ]
    );

    // ---- HowTo JSON-LD on framework setup guides ---------------------
    // Pages under /guide/<framework>.md (excluding the meta pages like
    // getting-started, options, exclusions, brand-assets, class-utilities)
    // are step-by-step setup guides — Google Rich Results displays them
    // as a "How to" carousel when this structured data is present.
    // We extract the H2 sections from the source markdown to populate
    // the `step` array.
    const META_GUIDES = new Set([
      "getting-started",
      "options",
      "exclusions",
      "brand-assets",
      "class-utilities",
      "what-is-it",
      "why-obfuscate",
    ]);
    if (relPath.startsWith("guide/") && !META_GUIDES.has(relPath.replace(/^guide\//, ""))) {
      try {
        const sourcePath = path.resolve(DOCS_ROOT, pageData.relativePath);
        const sourceMd = fs.readFileSync(sourcePath, "utf8");
        const steps = [...sourceMd.matchAll(/^##\s+(.+)$/gm)]
          .map((m) => m[1].trim().replace(/[`*_~]/g, ""))
          .filter(
            (name) => name && !/^(see also|references?|next steps?|further reading)$/i.test(name)
          )
          .slice(0, 8) // Google rich-results recommends ≤ 8 steps
          .map((name, idx) => ({
            "@type": "HowToStep",
            position: idx + 1,
            name,
            url: `${pageUrl}#${name
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-|-$/g, "")}`,
          }));
        if (steps.length >= 2) {
          pageData.frontmatter.head.push([
            "script",
            { type: "application/ld+json" },
            JSON.stringify({
              "@context": "https://schema.org",
              "@type": "HowTo",
              name: pageTitle,
              description: pageDescription,
              totalTime: "PT5M",
              tool: [{ "@type": "HowToTool", name: "tailwindcss-obfuscator (npm)" }],
              step: steps,
            }),
          ]);
        }
      } catch {
        // Page source not readable in build context — skip silently.
      }
    }
  },

  // After VitePress builds the static site, copy every source `.md` into the
  // dist tree as a static file (so /guide/sveltekit also exists as
  // /guide/sveltekit.md returning raw markdown). Also generate `llms-full.txt`,
  // a single concatenated file of the entire documentation for one-shot
  // download by LLM agents.
  async buildEnd(siteConfig) {
    const outDir = siteConfig.outDir;
    const allPages: { relPath: string; absPath: string; title: string; content: string }[] = [];

    // Walk every .md page (excluding node_modules, .vitepress, hidden dirs)
    const walk = (dir: string) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (entry.name.startsWith(".") || entry.name === "node_modules") continue;
        const abs = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          walk(abs);
        } else if (entry.isFile() && abs.endsWith(".md")) {
          const rel = path.relative(DOCS_ROOT, abs);
          const content = fs.readFileSync(abs, "utf8");
          // Pull the first H1 (or frontmatter title) for the index
          const titleMatch = content.match(/^title:\s*(.+)$/m) || content.match(/^#\s+(.+)$/m);
          const title = titleMatch ? titleMatch[1].trim() : rel;
          allPages.push({ relPath: rel, absPath: abs, title, content });
        }
      }
    };
    walk(DOCS_ROOT);

    // 1. Copy each .md to dist preserving directory layout
    for (const page of allPages) {
      const destPath = path.join(outDir, page.relPath);
      fs.mkdirSync(path.dirname(destPath), { recursive: true });
      fs.writeFileSync(destPath, page.content, "utf8");
    }

    // 2. Generate `llms-full.txt` — concatenated documentation indexed for LLMs.
    const lines: string[] = [];
    lines.push("# tailwindcss-obfuscator — full documentation");
    lines.push("");
    lines.push(`> Single-file mirror of every page on ${SITE_URL}/. Updated on each build.`);
    lines.push(`> Source repository: https://github.com/josedacosta/tailwindcss-obfuscator`);
    lines.push(`> Each page is also available individually at ${SITE_URL}/<path>.md`);
    lines.push("");
    lines.push("## Index");
    lines.push("");
    for (const p of allPages.sort((a, b) => a.relPath.localeCompare(b.relPath))) {
      const url = `${SITE_URL}/${p.relPath.replace(/\.md$/, "")}.md`;
      lines.push(`- [${p.title}](${url})`);
    }
    lines.push("");
    lines.push("---");
    lines.push("");
    for (const p of allPages.sort((a, b) => a.relPath.localeCompare(b.relPath))) {
      const url = `${SITE_URL}/${p.relPath.replace(/\.md$/, "")}.md`;
      lines.push(`# ${p.title}`);
      lines.push(`Source: ${url}`);
      lines.push("");
      lines.push(p.content);
      lines.push("");
      lines.push("---");
      lines.push("");
    }
    fs.writeFileSync(path.join(outDir, "llms-full.txt"), lines.join("\n"), "utf8");

    console.log(`[llm-optimization] Copied ${allPages.length} .md files + generated llms-full.txt`);
  },

  // Syntax highlighting with VSCode themes (light/dark)
  markdown: {
    theme: {
      light: "light-plus",
      dark: "dark-plus",
    },
  },

  head: [
    [
      "link",
      {
        rel: "icon",
        type: "image/svg+xml",
        href: "/tailwindcss-obfuscator/images/tailwindcss-obfuscator/logo-square.svg",
      },
    ],
    // PWA-lite manifest — surfaces "Add to Home Screen" on mobile + theme
    // colour at the OS chrome level. Icons reference the existing logo SVGs.
    ["link", { rel: "manifest", href: "/tailwindcss-obfuscator/manifest.webmanifest" }],
    // SoftwareApplication structured data — Google Rich Results recognises
    // this as the canonical metadata for an installable / cite-able tool.
    [
      "script",
      { type: "application/ld+json" },
      JSON.stringify({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "tailwindcss-obfuscator",
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Cross-platform (Node.js >= 20)",
        description:
          "Build-time Tailwind CSS class mangler & obfuscator. Cuts the CSS bundle by 30–60% and removes the Tailwind signature from the rendered HTML.",
        url: SITE_URL + "/",
        downloadUrl: "https://www.npmjs.com/package/tailwindcss-obfuscator",
        codeRepository: "https://github.com/josedacosta/tailwindcss-obfuscator",
        license: "https://opensource.org/licenses/MIT",
        author: {
          "@type": "Person",
          name: "José DA COSTA",
          url: "https://github.com/josedacosta",
        },
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      }),
    ],
    ["link", { rel: "preconnect", href: "https://fonts.googleapis.com" }],
    ["link", { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" }],
    [
      "link",
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap",
      },
    ],
    [
      "link",
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&display=swap",
      },
    ],
  ],

  themeConfig: {
    siteTitle: false,
    logo: {
      light: "/images/tailwindcss-obfuscator/logo-horizontal.svg",
      dark: "/images/tailwindcss-obfuscator/logo-horizontal-white.svg",
    },

    nav: [
      { text: "Guide", link: "/guide/getting-started" },
      { text: "Reference", link: "/reference/overview" },
      { text: "Research", link: "/research/ecosystem" },
      {
        text: "Links",
        items: [
          { text: "GitHub", link: "https://github.com/josedacosta/tailwindcss-obfuscator" },
          { text: "npm", link: "https://www.npmjs.com/package/tailwindcss-obfuscator" },
          { text: "Maintainer", link: "https://www.josedacosta.info" },
        ],
      },
    ],

    sidebar: {
      "/guide/": [
        {
          text: "📚 Sections",
          items: [
            { text: "📖 Guide", link: "/guide/getting-started" },
            { text: "📘 Reference", link: "/reference/overview" },
            { text: "🔬 Research", link: "/research/comparison" },
          ],
        },
        {
          text: "Introduction",
          items: [
            { text: "What is tailwindcss-obfuscator?", link: "/guide/what-is-it" },
            { text: "Getting Started", link: "/guide/getting-started" },
            { text: "Why Obfuscate?", link: "/guide/why-obfuscate" },
          ],
        },
        {
          text: "Meta-Frameworks",
          items: [
            { text: "Next.js", link: "/guide/nextjs" },
            { text: "Nuxt", link: "/guide/nuxt" },
            { text: "SvelteKit", link: "/guide/sveltekit" },
            { text: "Astro", link: "/guide/astro" },
            { text: "React Router (ex-Remix)", link: "/guide/react-router" },
          ],
        },
        {
          text: "Vite-based Frameworks",
          items: [
            { text: "Vite", link: "/guide/vite" },
            { text: "Vue 3", link: "/guide/vue" },
            { text: "Solid.js", link: "/guide/solid" },
            { text: "Qwik", link: "/guide/qwik" },
            { text: "TanStack Router", link: "/guide/tanstack-router" },
          ],
        },
        {
          text: "Bundlers (standalone)",
          items: [
            { text: "Webpack", link: "/guide/webpack-standalone" },
            { text: "Rollup", link: "/guide/rollup-standalone" },
            { text: "esbuild", link: "/guide/esbuild" },
            { text: "Rspack", link: "/guide/rspack" },
            { text: "Farm", link: "/guide/farm" },
          ],
        },
        {
          text: "Configuration",
          items: [
            { text: "Options", link: "/guide/options" },
            { text: "Class Utilities", link: "/guide/class-utilities" },
            { text: "Exclusions", link: "/guide/exclusions" },
          ],
        },
        {
          text: "Resources",
          items: [{ text: "Brand Assets", link: "/guide/brand-assets" }],
        },
      ],
      "/reference/": [
        {
          text: "📚 Sections",
          items: [
            { text: "📖 Guide", link: "/guide/getting-started" },
            { text: "📘 Reference", link: "/reference/overview" },
            { text: "🔬 Research", link: "/research/comparison" },
          ],
        },
        {
          text: "API Reference",
          items: [
            { text: "Overview", link: "/reference/overview" },
            { text: "Types", link: "/reference/types" },
          ],
        },
        {
          text: "Tailwind CSS Support",
          items: [
            { text: "Tailwind Patterns", link: "/reference/tailwind-patterns" },
            { text: "Compatibility Matrix", link: "/reference/compatibility" },
            { text: "Known Limitations (with reasons)", link: "/reference/limitations" },
            { text: "Tailwind Design System", link: "/reference/tailwind-design-system" },
          ],
        },
        {
          text: "Security & supply chain",
          items: [{ text: "Verification systems & scoring", link: "/reference/security" }],
        },
        {
          text: "Labs (validation reports)",
          collapsed: true,
          items: [
            {
              text: "Tailwind v3 — install guide",
              link: "/reference/labs/lab_tw3_installation_guide",
            },
            { text: "Tailwind v3 — HTML static", link: "/reference/labs/tailwind-v3-html" },
            { text: "Tailwind v3 — Next.js", link: "/reference/labs/tailwind-v3-nextjs" },
            { text: "Tailwind v4 — HTML static", link: "/reference/labs/tailwind-v4-html" },
            { text: "Tailwind v4 — Next.js", link: "/reference/labs/tailwind-v4-nextjs" },
          ],
        },
      ],
      "/research/": [
        {
          text: "📚 Sections",
          items: [
            { text: "📖 Guide", link: "/guide/getting-started" },
            { text: "📘 Reference", link: "/reference/overview" },
            { text: "🔬 Research", link: "/research/comparison" },
          ],
        },
        {
          text: "Comparison",
          items: [
            { text: "Approaches (4 families)", link: "/research/approaches" },
            { text: "Full comparison (all manglers)", link: "/research/comparison" },
          ],
        },
        {
          text: "Tailwind CSS",
          items: [
            { text: "Tailwind CSS Documentation", link: "/research/sources" },
            { text: "Why No Native Obfuscation?", link: "/research/why-no-native" },
          ],
        },
        {
          text: "Tailwind CSS v4",
          items: [
            { text: "v4 Research Overview", link: "/research/README" },
            { text: "v4 Features Analysis", link: "/research/tailwind-v4-features-analysis" },
            { text: "v4 Quick Reference", link: "/research/tailwind-v4-summary" },
            { text: "v4 Implementation Checklist", link: "/research/v4-implementation-checklist" },
          ],
        },
        {
          text: "Comparison with tailwindcss-mangle",
          items: [
            { text: "Mangle Ecosystem", link: "/research/ecosystem" },
            { text: "Mangle Lab Analysis", link: "/research/lab_tailwindcss_patch_analysis" },
            { text: "Mangle Tailwind v4 Issues", link: "/research/v4-issues" },
            {
              text: "tailwindcss-patch vs tailwindcss-obfuscator",
              link: "/research/tailwindcss-patch",
            },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/josedacosta/tailwindcss-obfuscator" },
    ],

    footer: {
      message: "Released under the MIT License.",
      copyright: `Copyright © ${new Date().getFullYear()} <a href="https://www.josedacosta.info" target="_blank" rel="noopener noreferrer">José DA COSTA</a>`,
    },

    search: {
      provider: "local",
    },

    editLink: {
      pattern: "https://github.com/josedacosta/tailwindcss-obfuscator/edit/main/docs/:path",
      text: "Edit this page on GitHub",
    },
  },
});
