import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tailwind CSS v3 + Next.js + shadcn/ui",
  description: "Next.js app with Tailwind CSS v3 + shadcn/ui class obfuscation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gray-50 dark:bg-gray-900`}>
        {children}
      </body>
    </html>
  );
}
