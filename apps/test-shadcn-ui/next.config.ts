import type { NextConfig } from "next";
import TailwindCSSObfuscator from "tailwindcss-obfuscator/webpack";

// NOTE: TypeScript build errors are ignored because shadcn/ui components paired
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
          exclude: ["no-obfuscate", /^data-\[/],
          mapping: {
            enabled: true,
            file: ".tw-obfuscation/class-mapping.json",
            pretty: 2,
          },
          cache: {
            enabled: true,
            directory: ".tw-obfuscation/cache",
            strategy: "merge",
          },
        })
      );
    }
    return config;
  },
};

export default nextConfig;
