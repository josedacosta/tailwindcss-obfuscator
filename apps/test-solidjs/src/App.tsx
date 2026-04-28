import { createSignal, For } from "solid-js";

function Counter() {
  const [count, setCount] = createSignal(0);

  return (
    <div class="rounded-xl bg-white p-8 text-center shadow-lg">
      <h2 class="mb-6 text-2xl font-bold text-gray-800">Reactive Counter</h2>
      <div class="flex items-center justify-center gap-6">
        <button
          onClick={() => setCount((c) => c - 1)}
          class="h-14 w-14 rounded-full bg-red-500 text-2xl font-bold text-white shadow-md transition-colors hover:bg-red-600"
        >
          -
        </button>
        <span class="text-solid-600 min-w-[100px] text-5xl font-bold">{count()}</span>
        <button
          onClick={() => setCount((c) => c + 1)}
          class="h-14 w-14 rounded-full bg-green-500 text-2xl font-bold text-white shadow-md transition-colors hover:bg-green-600"
        >
          +
        </button>
      </div>
    </div>
  );
}

function FeatureCard(props: { title: string; icon: string; description: string }) {
  return (
    <div class="rounded-lg bg-white p-6 shadow-md transition-all hover:-translate-y-1 hover:shadow-lg">
      <div class="bg-solid-100 mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
        <span class="text-2xl">{props.icon}</span>
      </div>
      <h3 class="mb-2 text-lg font-semibold text-gray-800">{props.title}</h3>
      <p class="text-sm text-gray-600">{props.description}</p>
    </div>
  );
}

export default function App() {
  const features = [
    {
      title: "Fine-grained Reactivity",
      icon: "⚡",
      description: "Updates only what changes, no virtual DOM diffing needed.",
    },
    {
      title: "Small Bundle Size",
      icon: "📦",
      description: "Solid.js compiles away the framework for minimal overhead.",
    },
    {
      title: "Familiar Syntax",
      icon: "💡",
      description: "JSX-based syntax that feels natural for React developers.",
    },
    {
      title: "Tailwind CSS v4",
      icon: "🎨",
      description: "Modern CSS-first configuration with custom themes.",
    },
    {
      title: "Class Obfuscation",
      icon: "🔒",
      description: "Protect your styling with obfuscated class names.",
    },
    {
      title: "TypeScript Ready",
      icon: "📝",
      description: "First-class TypeScript support out of the box.",
    },
  ];

  return (
    <div class="from-solid-100 to-primary-100 min-h-screen bg-gradient-to-br px-4 py-12">
      <div class="mx-auto max-w-5xl">
        {/* Header */}
        <header class="mb-12 text-center">
          <h1 class="mb-4 text-4xl font-extrabold text-gray-900 md:text-5xl">
            Solid.js + Tailwind CSS v4
          </h1>
          <p class="mx-auto max-w-2xl text-lg text-gray-600">
            Simple and performant reactivity with fine-grained updates. Testing
            tailwindcss-obfuscator integration.
          </p>
        </header>

        {/* Counter */}
        <div class="mb-12">
          <Counter />
        </div>

        {/* Features Grid */}
        <div class="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <For each={features}>
            {(feature) => (
              <FeatureCard
                title={feature.title}
                icon={feature.icon}
                description={feature.description}
              />
            )}
          </For>
        </div>

        {/* CTA Buttons */}
        <div class="flex flex-wrap justify-center gap-4">
          <button class="bg-solid-600 hover:bg-solid-500 rounded-lg px-8 py-4 font-semibold text-white shadow-lg transition-colors">
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
    </div>
  );
}
