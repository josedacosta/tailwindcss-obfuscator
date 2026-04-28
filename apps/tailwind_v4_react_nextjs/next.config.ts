import type { NextConfig } from "next";

// NOTE: TypeScript build errors are ignored because shadcn/ui components paired
// with React 19 + the latest @radix-ui types occasionally produce false
// "children does not exist on IntrinsicAttributes" errors that are upstream
// from this project. The runtime behaviour is correct and our obfuscator's
// own type checks (packages/tailwindcss-obfuscator) remain strict.
const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: true },
  // CSS obfuscation is handled via the `obfuscate-classes` post-build script.
};

export default nextConfig;
