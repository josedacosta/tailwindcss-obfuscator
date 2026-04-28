import { useState } from "react";
import clsx from "clsx";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">
            TailwindCSS Obfuscator - Tailwind v3 Test
          </h1>
          <p className="mt-1 text-sm text-gray-500">Testing with Tailwind CSS v3.4.x</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Counter Section */}
        <section className="mb-8">
          <div className="card">
            <h3 className="mb-4 text-lg font-bold text-gray-900">Counter Example</h3>
            <div className="flex items-center gap-4">
              <button className="btn btn-primary" onClick={() => setCount((c) => c + 1)}>
                Increment
              </button>
              <span className="font-mono text-xl text-gray-700">{count}</span>
              <button
                className="rounded-lg bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300"
                onClick={() => setCount(0)}
              >
                Reset
              </button>
            </div>
          </div>
        </section>

        {/* Tailwind v3 Features */}
        <section className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Tailwind v3 Features</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="card transition-shadow hover:shadow-xl">
              <h3 className="mb-2 text-lg font-bold text-gray-900">JIT Compiler</h3>
              <p className="text-gray-600">Just-in-Time compilation for faster builds</p>
              <div className="mt-4">
                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                  Fast
                </span>
              </div>
            </div>
            <div className="card transition-shadow hover:shadow-xl">
              <h3 className="mb-2 text-lg font-bold text-gray-900">@apply Directive</h3>
              <p className="text-gray-600">Compose utilities in CSS with @apply</p>
              <div className="mt-4">
                <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                  CSS
                </span>
              </div>
            </div>
            <div className="card transition-shadow hover:shadow-xl">
              <h3 className="mb-2 text-lg font-bold text-gray-900">Arbitrary Values</h3>
              <p className="text-gray-600">Use bracket notation for custom values</p>
              <div className="mt-4">
                <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
                  Flexible
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Arbitrary Values Test */}
        <section className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Arbitrary Values (v3)</h2>
          <div className="space-y-4">
            <div className="from-primary-500 flex h-[80px] w-[300px] items-center justify-center rounded-lg bg-gradient-to-r to-purple-500">
              <span className="font-bold text-white">Custom dimensions</span>
            </div>
            <div className="rounded bg-[#1e293b] p-[15px] text-[#f1f5f9]">
              Arbitrary padding and colors
            </div>
          </div>
        </section>

        {/* State Variants */}
        <section className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">State Variants</h2>
          <div className="flex flex-wrap gap-4">
            <button className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 active:bg-blue-700">
              Hover, Focus, Active
            </button>
            <div className="group cursor-pointer rounded bg-gray-100 p-4">
              <span className="text-gray-600 group-hover:text-blue-600">Group hover</span>
            </div>
          </div>
        </section>

        {/* Responsive Design */}
        <section className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Responsive Design</h2>
          <div className="rounded-lg bg-white p-4 shadow">
            <p className="text-sm sm:text-base md:text-lg lg:text-xl">
              Text size changes at breakpoints
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-6">
              {["red", "orange", "yellow", "green", "blue", "purple"].map((color) => (
                <div key={color} className={clsx("h-10 rounded", `bg-${color}-500`)} />
              ))}
            </div>
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
          <p className="text-gray-400">TailwindCSS Obfuscator - Tailwind v3 Test App</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
