import "./style.css";

const root = document.getElementById("app");

const card = (title, body) =>
  `<div class="rounded-lg bg-white p-6 shadow-md hover:shadow-lg transition-shadow">
    <h3 class="mb-2 text-lg font-semibold text-gray-800">${title}</h3>
    <p class="text-sm text-gray-600">${body}</p>
  </div>`;

root.innerHTML = `
  <main class="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 px-4 py-12">
    <div class="mx-auto max-w-4xl">
      <header class="mb-12 text-center">
        <h1 class="text-4xl font-extrabold text-gray-900 mb-4">Webpack 5 + Tailwind v4</h1>
        <p class="text-lg text-gray-600">Standalone Webpack build verifying tailwindcss-obfuscator/webpack.</p>
      </header>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        ${card("Static classes", "Plain HTML strings rewritten to obfuscated names.")}
        ${card("@apply", "Component utilities resolve to obfuscated selectors.")}
        ${card("Variants", "hover:, focus:, md: still rewrite correctly.")}
        ${card("Arbitrary values", "Brackets like w-[42px] survive the round-trip.")}
      </div>
    </div>
  </main>
`;
