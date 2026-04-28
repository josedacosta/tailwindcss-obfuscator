import { defineConfig } from "vitepress";

export default defineConfig({
  title: "tailwindcss-obfuscator",
  description:
    "Obfuscate Tailwind CSS class names at build time. Vite, Webpack, Rollup, esbuild, Next.js, Nuxt, SvelteKit, Astro, Solid, Qwik, React Router 7, TanStack Router. Tailwind v3 + v4.",

  // GitHub Pages serves the site under https://josedacosta.github.io/tailwindcss-obfuscator/
  base: "/tailwindcss-obfuscator/",

  cleanUrls: true,
  lastUpdated: true,

  // Drop the prebuilt search index from older runs and the sample-app build artefacts.
  ignoreDeadLinks: true,

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
            { text: "TanStack Router", link: "/guide/tanstack-router" },
          ],
        },
        {
          text: "Bundlers (standalone)",
          items: [
            { text: "Webpack", link: "/guide/webpack-standalone" },
            { text: "Rollup", link: "/guide/rollup-standalone" },
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
            { text: "Tailwind Design System", link: "/reference/tailwind-design-system" },
          ],
        },
      ],
      "/research/": [
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
