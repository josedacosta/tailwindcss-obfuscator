import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Test shadcn/ui - TailwindCSS Obfuscator",
  description: "Test app for tailwindcss-obfuscator with shadcn/ui patterns",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
}
