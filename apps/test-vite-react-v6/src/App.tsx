import { useState } from "react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

// Component with dynamic classes
function Button({
  variant = "primary",
  className,
  children,
}: {
  variant?: "primary" | "secondary";
  className?: string;
  children: React.ReactNode;
}) {
  const baseClasses = "px-4 py-2 rounded-lg font-semibold transition-colors";
  const variantClasses = {
    primary: "bg-blue-500 text-white hover:bg-blue-600",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
  };

  return (
    <button className={twMerge(baseClasses, variantClasses[variant], className)}>{children}</button>
  );
}

// Component with conditional classes using clsx
function Alert({
  type = "info",
  message,
}: {
  type?: "info" | "success" | "warning" | "error";
  message: string;
}) {
  return (
    <div
      className={clsx("rounded-lg border p-4", {
        "border-blue-200 bg-blue-50 text-blue-800": type === "info",
        "border-green-200 bg-green-50 text-green-800": type === "success",
        "border-yellow-200 bg-yellow-50 text-yellow-800": type === "warning",
        "border-red-200 bg-red-50 text-red-800": type === "error",
      })}
    >
      {message}
    </div>
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

// Grid layout component
function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">{children}</div>;
}

// Badge component with arbitrary values
function Badge({ text, color }: { text: string; color: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-${color}-100 text-${color}-800`}
    >
      {text}
    </span>
  );
}

// Main App component
function App() {
  const [count, setCount] = useState(0);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  return (
    <div
      className={clsx(
        "min-h-screen transition-colors duration-300",
        theme === "light" ? "bg-gray-100" : "bg-gray-900"
      )}
    >
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">TailwindCSS Obfuscator Test</h1>
            <Button
              variant="secondary"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              Toggle Theme
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Counter section */}
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

        {/* Alerts section */}
        <section className="mb-8 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Alerts</h2>
          <Alert type="info" message="This is an info alert" />
          <Alert type="success" message="This is a success alert" />
          <Alert type="warning" message="This is a warning alert" />
          <Alert type="error" message="This is an error alert" />
        </section>

        {/* Cards grid */}
        <section className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Feature Cards</h2>
          <Grid>
            <Card title="Vite Integration">
              <p className="text-gray-600">Seamless integration with Vite build system</p>
              <div className="mt-4 flex gap-2">
                <Badge text="Fast" color="green" />
                <Badge text="Modern" color="blue" />
              </div>
            </Card>
            <Card title="React Support">
              <p className="text-gray-600">Full support for React components and JSX</p>
              <div className="mt-4 flex gap-2">
                <Badge text="JSX" color="purple" />
                <Badge text="Hooks" color="indigo" />
              </div>
            </Card>
            <Card title="Tailwind CSS">
              <p className="text-gray-600">Works with Tailwind v3 and v4</p>
              <div className="mt-4 flex gap-2">
                <Badge text="v3" color="cyan" />
                <Badge text="v4" color="teal" />
              </div>
            </Card>
          </Grid>
        </section>

        {/* Responsive utilities test */}
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

        {/* State variants test */}
        <section className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">State Variants</h2>
          <div className="flex flex-wrap gap-4">
            <button className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 active:bg-blue-700">
              Hover, Focus, Active
            </button>
            <input
              type="text"
              placeholder="Focus me"
              className="rounded border px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100"
            />
            <div className="group cursor-pointer rounded bg-gray-100 p-4">
              <span className="text-gray-600 group-hover:text-blue-600">Group hover effect</span>
            </div>
          </div>
        </section>

        {/* Arbitrary values test */}
        <section className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Arbitrary Values</h2>
          <div className="space-y-4">
            <div className="flex h-[100px] w-[300px] items-center justify-center rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
              <span className="font-bold text-white">Custom width/height</span>
            </div>
            <div className="rounded bg-[#1a1a2e] p-[13px] text-[#eee]">
              Arbitrary padding and colors
            </div>
            <div className="grid grid-cols-[1fr_2fr_1fr] gap-4">
              <div className="bg-blue-200 p-2 text-center">1fr</div>
              <div className="bg-blue-300 p-2 text-center">2fr</div>
              <div className="bg-blue-200 p-2 text-center">1fr</div>
            </div>
          </div>
        </section>

        {/* Class that should NOT be obfuscated */}
        <section className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Excluded Classes</h2>
          <div className="no-obfuscate rounded bg-yellow-100 p-4">
            This div has the "no-obfuscate" class which should be excluded
          </div>
          <div className="keep-me mt-4 rounded bg-green-100 p-4">
            This div has "keep-me" which matches "keep-*" pattern
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 py-8 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-gray-400">TailwindCSS Obfuscator - Vite + React Test App</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
