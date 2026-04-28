import type { NextConfig } from "next";
import TailwindCSSObfuscator from "tailwindcss-obfuscator/webpack";

const nextConfig: NextConfig = {
  webpack: (config, { dev }) => {
    // Only apply obfuscation in production builds
    if (!dev) {
      config.plugins = config.plugins || [];
      config.plugins.push(
        TailwindCSSObfuscator({
          prefix: "tw-",
          verbose: true,
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
            strategy: "merge",
          },
        })
      );
    }
    return config;
  },
};

export default nextConfig;
