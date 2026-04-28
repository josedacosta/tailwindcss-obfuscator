"use client";

import Link from "next/link";

interface NavigationProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

export function Navigation({ darkMode, setDarkMode }: NavigationProps) {
  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md dark:bg-gray-800">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
            TW v4 + Next.js + shadcn/ui
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/" className="font-semibold text-blue-500 dark:text-blue-400">
              Home
            </Link>
            <Link
              href="/showcase"
              className="text-gray-600 transition-colors hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400"
            >
              Components
            </Link>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="rounded-lg bg-gray-200 px-4 py-2 text-gray-900 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            >
              {darkMode ? "Light" : "Dark"}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
