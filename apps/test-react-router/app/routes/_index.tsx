import { useState } from "react";
import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => {
  return [
    { title: "React Router v7 + Tailwind CSS v4" },
    { name: "description", content: "Testing tailwindcss-obfuscator with React Router v7" },
  ];
};

function FeatureCard({
  title,
  icon,
  description,
}: {
  title: string;
  icon: string;
  description: string;
}) {
  return (
    <div className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
      <div className="bg-rr-100 mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
        <span className="text-2xl">{icon}</span>
      </div>
      <h3 className="mb-2 text-lg font-semibold text-gray-800">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}

export default function Index() {
  const [count, setCount] = useState(0);

  const features = [
    { title: "Web Standards", icon: "🌐", description: "Built on web fundamentals." },
    { title: "Nested Routes", icon: "📂", description: "File-based routing with nested layouts." },
    { title: "Data Loading", icon: "⚡", description: "Loaders and actions on the server." },
    { title: "Error Boundaries", icon: "🛡️", description: "Graceful error handling per route." },
    { title: "Tailwind v4", icon: "🎨", description: "CSS-first styling." },
    { title: "Obfuscated", icon: "🔒", description: "Class names obfuscated in production." },
  ];

  return (
    <main className="from-rr-100 min-h-screen bg-gradient-to-br to-blue-100 px-4 py-12">
      <div className="mx-auto max-w-5xl">
        <header className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-extrabold text-gray-900 md:text-5xl">
            React Router v7 + Tailwind CSS v4
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            The successor to Remix. Server-side rendering, nested routes, loaders / actions.
          </p>
        </header>

        <div className="mb-12 rounded-xl bg-white p-8 text-center shadow-lg">
          <h2 className="mb-6 text-2xl font-bold text-gray-800">Interactive Counter</h2>
          <div className="flex items-center justify-center gap-6">
            <button
              onClick={() => setCount((c) => c - 1)}
              className="h-14 w-14 rounded-full bg-red-500 text-2xl font-bold text-white shadow-md transition-colors hover:bg-red-600"
            >
              -
            </button>
            <span className="text-rr-700 min-w-[100px] text-5xl font-bold">{count}</span>
            <button
              onClick={() => setCount((c) => c + 1)}
              className="h-14 w-14 rounded-full bg-green-500 text-2xl font-bold text-white shadow-md transition-colors hover:bg-green-600"
            >
              +
            </button>
          </div>
        </div>

        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <button className="bg-rr-500 hover:bg-rr-700 rounded-lg px-8 py-4 font-semibold text-white shadow-lg transition-colors">
            Get Started
          </button>
          <button className="rounded-lg bg-blue-600 px-8 py-4 font-semibold text-white shadow-lg transition-colors hover:bg-blue-700">
            Documentation
          </button>
          <button className="rounded-lg border-2 border-gray-300 px-8 py-4 font-semibold text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-50">
            View Source
          </button>
        </div>
      </div>
    </main>
  );
}
