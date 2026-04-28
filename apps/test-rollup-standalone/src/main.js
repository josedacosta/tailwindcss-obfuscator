import "./style.css";

const root = document.getElementById("app");
const card = (t, b) =>
  `<article class="rounded-lg bg-white p-6 shadow-md hover:shadow-lg transition-shadow">
    <h3 class="mb-2 text-lg font-semibold text-gray-800">${t}</h3>
    <p class="text-sm text-gray-600">${b}</p>
  </article>`;

root.innerHTML = `
  <main class="min-h-screen bg-gradient-to-br from-emerald-100 to-cyan-100 px-4 py-12">
    <div class="mx-auto max-w-4xl">
      <h1 class="text-4xl font-extrabold text-gray-900 mb-4 text-center">Rollup + Tailwind v4</h1>
      <p class="text-center text-lg text-gray-600 mb-8">Standalone Rollup verifying tailwindcss-obfuscator/rollup.</p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        ${card("Plain Rollup", "No meta-framework, no Vite, no Webpack.")}
        ${card("@apply", "Component utilities resolve to obfuscated selectors.")}
        ${card("Custom hashes", "Asset hashing matches Rollup's output config.")}
        ${card("ESM only", "ESM bundle, modern browser target.")}
      </div>
    </div>
  </main>
`;
