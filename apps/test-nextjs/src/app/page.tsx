"use client";

import { useState } from "react";
import clsx from "clsx";

// Button component
function Button({
  variant = "primary",
  children,
  onClick,
}: {
  variant?: "primary" | "secondary";
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "rounded-lg px-4 py-2 font-semibold transition-colors",
        variant === "primary" && "bg-blue-500 text-white hover:bg-blue-600",
        variant === "secondary" && "bg-gray-200 text-gray-800 hover:bg-gray-300"
      )}
    >
      {children}
    </button>
  );
}

// Card component
function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-lg transition-shadow hover:shadow-xl">
      <h3 className="mb-4 text-lg font-bold text-gray-900">{title}</h3>
      {children}
    </div>
  );
}

export default function Home() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">
            TailwindCSS Obfuscator - Next.js Test
          </h1>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Counter */}
        <section className="mb-8">
          <Card title="Counter Example">
            <div className="flex items-center gap-4">
              <Button variant="primary" onClick={() => setCount((c) => c + 1)}>
                Increment
              </Button>
              <span className="font-mono text-xl text-gray-700">{count}</span>
              <Button variant="secondary" onClick={() => setCount(0)}>
                Reset
              </Button>
            </div>
          </Card>
        </section>

        {/* Cards Grid */}
        <section className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Feature Cards</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card title="Next.js App Router">
              <p className="text-gray-600">Full support for Next.js 13+ App Router</p>
              <div className="mt-4">
                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                  Server Components
                </span>
              </div>
            </Card>
            <Card title="Webpack Integration">
              <p className="text-gray-600">Uses Webpack plugin for class obfuscation</p>
              <div className="mt-4">
                <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                  Production Only
                </span>
              </div>
            </Card>
            <Card title="TypeScript">
              <p className="text-gray-600">Full TypeScript support</p>
              <div className="mt-4">
                <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
                  Type Safe
                </span>
              </div>
            </Card>
          </div>
        </section>

        {/* Responsive Test */}
        <section className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Responsive Design</h2>
          <div className="rounded-lg bg-white p-4 shadow">
            <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl">
              This text changes size at different breakpoints
            </p>
          </div>
        </section>

        {/* Excluded Class */}
        <section className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Excluded Classes</h2>
          <div className="no-obfuscate rounded bg-yellow-100 p-4">
            This div has the no-obfuscate class which should be excluded
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 py-8 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-gray-400">TailwindCSS Obfuscator - Next.js Test App</p>
        </div>
      </footer>
    </div>
  );
}
