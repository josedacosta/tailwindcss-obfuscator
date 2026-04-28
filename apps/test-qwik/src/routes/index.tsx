import { component$, useSignal } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

const FeatureCard = component$((props: { title: string; icon: string; description: string }) => {
  return (
    <div class="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
      <div class="bg-qwik-100 mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
        <span class="text-2xl">{props.icon}</span>
      </div>
      <h3 class="mb-2 text-lg font-semibold text-gray-800">{props.title}</h3>
      <p class="text-sm text-gray-600">{props.description}</p>
    </div>
  );
});

export default component$(() => {
  const count = useSignal(0);

  const features = [
    {
      title: "Resumability",
      icon: "⏯️",
      description: "No hydration needed - Qwik resumes where the server left off.",
    },
    {
      title: "Lazy Loading",
      icon: "🦥",
      description: "Only loads JavaScript when interactions require it.",
    },
    {
      title: "O(1) Startup",
      icon: "🚀",
      description: "Constant time to interactive, regardless of app complexity.",
    },
    {
      title: "Familiar JSX",
      icon: "💡",
      description: "React-like syntax with signals for reactivity.",
    },
    {
      title: "Tailwind v4",
      icon: "🎨",
      description: "Modern CSS-first styling with Tailwind CSS v4.",
    },
    {
      title: "Obfuscated",
      icon: "🔒",
      description: "Class names obfuscated for production security.",
    },
  ];

  return (
    <main class="from-qwik-100 to-primary-100 min-h-screen bg-gradient-to-br px-4 py-12">
      <div class="mx-auto max-w-5xl">
        {/* Header */}
        <header class="mb-12 text-center">
          <h1 class="mb-4 text-4xl font-extrabold text-gray-900 md:text-5xl">
            Qwik + Tailwind CSS v4
          </h1>
          <p class="mx-auto max-w-2xl text-lg text-gray-600">
            Instant-on web apps with resumability. Testing tailwindcss-obfuscator integration.
          </p>
        </header>

        {/* Counter */}
        <div class="mb-12 rounded-xl bg-white p-8 text-center shadow-lg">
          <h2 class="mb-6 text-2xl font-bold text-gray-800">Resumable Counter</h2>
          <div class="flex items-center justify-center gap-6">
            <button
              onClick$={() => count.value--}
              class="h-14 w-14 rounded-full bg-red-500 text-2xl font-bold text-white shadow-md transition-colors hover:bg-red-600"
            >
              -
            </button>
            <span class="text-qwik-600 min-w-[100px] text-5xl font-bold">{count.value}</span>
            <button
              onClick$={() => count.value++}
              class="h-14 w-14 rounded-full bg-green-500 text-2xl font-bold text-white shadow-md transition-colors hover:bg-green-600"
            >
              +
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div class="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              title={feature.title}
              icon={feature.icon}
              description={feature.description}
            />
          ))}
        </div>

        {/* CTA Buttons */}
        <div class="flex flex-wrap justify-center gap-4">
          <button class="bg-qwik-600 hover:bg-qwik-500 rounded-lg px-8 py-4 font-semibold text-white shadow-lg transition-colors">
            Get Started
          </button>
          <button class="bg-primary-600 hover:bg-primary-700 rounded-lg px-8 py-4 font-semibold text-white shadow-lg transition-colors">
            Documentation
          </button>
          <button class="rounded-lg border-2 border-gray-300 px-8 py-4 font-semibold text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-50">
            View Source
          </button>
        </div>
      </div>
    </main>
  );
});

export const head: DocumentHead = {
  title: "Qwik + Tailwind CSS v4",
  meta: [
    {
      name: "description",
      content: "Testing tailwindcss-obfuscator with Qwik",
    },
  ],
};
