"use client";

import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { BasicClasses } from "@/components/BasicClasses";
import { ResponsiveDemo } from "@/components/ResponsiveDemo";
import { DarkModeDemo } from "@/components/DarkModeDemo";
import { HoverStates } from "@/components/HoverStates";
import { GroupPeerDemo } from "@/components/GroupPeerDemo";
import { CustomComponents } from "@/components/CustomComponents";
import { ContainerQueries } from "@/components/ContainerQueries";

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gray-50 transition-colors dark:bg-gray-900">
        <Navigation darkMode={darkMode} setDarkMode={setDarkMode} />

        <div className="container mx-auto max-w-7xl p-8">
          {/* Header */}
          <header className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
              Tailwind CSS v4 (React) + Next.js + shadcn/ui
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Tailwind CSS v4 <strong>class obfuscation</strong> with : custom class extractor +
              unplugin-tailwindcss-mangle
            </p>
          </header>

          {/* Test Grid */}
          <div className="grid gap-8">
            <BasicClasses />
            <ResponsiveDemo />
            <DarkModeDemo />
            <HoverStates />
            <GroupPeerDemo />
            <ContainerQueries />
            <CustomComponents />
          </div>
        </div>
      </div>
    </div>
  );
}
