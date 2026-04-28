import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        theme === "light" ? "bg-gray-100" : "bg-gray-900"
      }`}
    >
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              TailwindCSS Obfuscator - Tailwind v4 Test
            </h1>
            <button
              className="rounded-lg bg-gray-200 px-4 py-2 text-gray-800 transition-colors hover:bg-gray-300"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              Toggle Theme
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Counter Section */}
        <section className="mb-8">
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <h3 className="mb-4 text-lg font-bold text-gray-900">Counter Example</h3>
            <div className="flex items-center gap-4">
              <button className="btn btnprimary" onClick={() => setCount((c) => c + 1)}>
                Increment
              </button>
              <span className="font-mono text-xl text-gray-700">{count}</span>
              <button
                className="rounded-lg bg-gray-200 px-4 py-2 text-gray-800 transition-colors hover:bg-gray-300"
                onClick={() => setCount(0)}
              >
                Reset
              </button>
            </div>
          </div>
        </section>

        {/* Tailwind v4 Features */}
        <section className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Tailwind v4 Features</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* CSS-first Configuration */}
            <div className="rounded-xl bg-white p-6 shadow-lg transition-shadow hover:shadow-xl">
              <h3 className="mb-2 text-lg font-bold text-gray-900">CSS-first Config</h3>
              <p className="mb-4 text-gray-600">Configuration using @theme directive in CSS</p>
              <div className="flex gap-2">
                <span className="bg-primary-100 text-primary-800 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium">
                  @theme
                </span>
              </div>
            </div>

            {/* Custom Utilities */}
            <div className="rounded-xl bg-white p-6 shadow-lg transition-shadow hover:shadow-xl">
              <h3 className="mb-2 text-lg font-bold text-gray-900">@utility Directive</h3>
              <p className="mb-4 text-gray-600">Define custom utilities directly in CSS</p>
              <div className="flex gap-2">
                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                  @utility
                </span>
              </div>
            </div>

            {/* Custom Variants */}
            <div className="rounded-xl bg-white p-6 shadow-lg transition-shadow hover:shadow-xl">
              <h3 className="mb-2 text-lg font-bold text-gray-900">@variant Directive</h3>
              <p className="mb-4 text-gray-600">Create custom variants in CSS</p>
              <div className="flex gap-2">
                <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
                  @variant
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* v4 Specific Classes */}
        <section className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">v4 Specific Classes</h2>
          <div className="space-y-4">
            {/* Using text-wrap balance (v4 feature) */}
            <div className="rounded-lg bg-white p-4 shadow">
              <p className="text-wrap-balance max-w-md text-lg">
                This text uses text-wrap-balance for better typography on narrow containers
              </p>
            </div>

            {/* Container query (v4 feature) */}
            <div className="@container rounded-lg bg-white p-4 shadow">
              <div className="@md:flex @md:items-center @md:gap-4">
                <div className="@md:mb-0 mb-2 rounded bg-blue-100 p-4">Container Query Item 1</div>
                <div className="rounded bg-green-100 p-4">Container Query Item 2</div>
              </div>
            </div>

            {/* Using custom hocus variant */}
            <button className="bg-primary-500 hocus:bg-primary-600 hocus:ring-2 hocus:ring-primary-300 rounded-lg px-4 py-2 text-white">
              Hover or Focus me (hocus variant)
            </button>
          </div>
        </section>

        {/* Gradient with v4 syntax */}
        <section className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Gradients</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="from-primary-500 flex h-24 items-center justify-center rounded-lg bg-gradient-to-r to-purple-500">
              <span className="font-bold text-white">Linear Gradient</span>
            </div>
            <div className="flex h-24 items-center justify-center rounded-lg bg-gradient-to-br from-green-400 via-blue-500 to-purple-600">
              <span className="font-bold text-white">Multi-stop Gradient</span>
            </div>
          </div>
        </section>

        {/* Responsive and State Variants */}
        <section className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Responsive Design</h2>
          <div className="rounded-lg bg-white p-4 shadow">
            <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl">
              This text changes size at different breakpoints
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {["red", "orange", "yellow", "green", "blue", "purple"].map((color) => (
                <div key={color} className={`h-12 rounded bg-${color}-500`} />
              ))}
            </div>
          </div>
        </section>

        {/* Excluded Class */}
        <section className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Excluded Classes</h2>
          <div className="no-obfuscate rounded bg-yellow-100 p-4">
            This div has "no-obfuscate" class which should be excluded
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 py-8 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-gray-400">TailwindCSS Obfuscator - Tailwind v4 Test App</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
