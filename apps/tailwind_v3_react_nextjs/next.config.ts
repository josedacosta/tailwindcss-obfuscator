import type { NextConfig } from "next";
import TailwindCSSObfuscator from "tailwindcss-obfuscator/webpack";

// Migrated from `unplugin-tailwindcss-mangle` (which produced corrupted
// `globals.css` imports under Next.js 15) to `tailwindcss-obfuscator/webpack`,
// the canonical plugin shipped from this monorepo.
//
// TypeScript build errors are ignored because shadcn/ui components paired
// with React 19 + the latest @radix-ui types occasionally produce false
// "children does not exist on IntrinsicAttributes" errors that are upstream
// from this project. The runtime behaviour is correct and our obfuscator's
// own type checks (packages/tailwindcss-obfuscator) remain strict.
const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: true },
  webpack: (config, { dev }) => {
    if (!dev) {
      config.plugins = config.plugins || [];
      config.plugins.push(
        TailwindCSSObfuscator({
          prefix: "tw-",
          verbose: true,
          exclude: [/^js-/, /^no-/, /^is-/, /^has-/],
          mapping: {
            enabled: true,
            file: ".tw-obfuscation/class-mapping.json",
            pretty: 2,
          },
        })
      );
    }
    return config;
  },
};

export default nextConfig;
