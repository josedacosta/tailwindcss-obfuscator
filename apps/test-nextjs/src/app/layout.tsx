import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Test Next.js - TailwindCSS Obfuscator",
  description: "Test app for tailwindcss-obfuscator with Next.js",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100">{children}</body>
    </html>
  );
}
