/* eslint-disable react/no-unknown-property */
// Preact uses the standard `class` attribute (not React's `className`).
// We deliberately use both forms below to verify the obfuscator handles both
// extracted shapes — `class` (Preact-native) and `className` (React-compat).

import { useState } from "preact/hooks";
import { signal } from "@preact/signals";

const count = signal(0);

export function App() {
  const [active, setActive] = useState(true);

  return (
    <main class="from-brand-50 min-h-screen bg-gradient-to-br to-white px-6 py-12">
      <div class="mx-auto max-w-2xl space-y-6">
        <h1 class="text-4xl font-extrabold tracking-tight text-slate-900">
          Preact + Tailwind v4 obfuscation test
        </h1>

        <p class="text-base leading-relaxed text-slate-600">
          This app exercises the JSX extractor against Preact&apos;s{" "}
          <code class="rounded bg-slate-100 px-1 py-0.5 text-sm">class</code> attribute (vs
          React&apos;s
          <code className="rounded bg-slate-100 px-1 py-0.5 text-sm">className</code>) and
          Preact&apos;s signal-based reactive class bindings.
        </p>

        <div
          class={
            active
              ? "border-brand-500 rounded-lg border bg-white p-6 shadow-md"
              : "rounded-lg border border-slate-200 bg-slate-50 p-6"
          }
        >
          <h2 class="mb-3 text-2xl font-bold text-slate-900">Counter</h2>
          <p class="mb-4 text-lg text-slate-700">
            Count: <span class="text-brand-700 font-mono font-bold">{count.value}</span>
          </p>
          <div class="flex gap-3">
            <button
              type="button"
              onClick={() => count.value++}
              class="bg-brand-500 hover:bg-brand-700 inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold text-white transition-colors"
            >
              Increment
            </button>
            <button
              type="button"
              onClick={() => setActive(!active)}
              class="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100"
            >
              Toggle border
            </button>
          </div>
        </div>

        <ul class="space-y-2">
          <li class="flex items-center gap-2 text-sm text-slate-600">
            <span class="bg-brand-500 size-2 rounded-full"></span>
            Static class strings — must obfuscate
          </li>
          <li class="flex items-center gap-2 text-sm text-slate-600">
            <span class="bg-brand-500 size-2 rounded-full"></span>
            Ternary class expressions — must obfuscate both branches
          </li>
          <li class="flex items-center gap-2 text-sm text-slate-600">
            <span class="bg-brand-500 size-2 rounded-full"></span>
            Multiple class attributes per element — must all transform
          </li>
        </ul>
      </div>
    </main>
  );
}
