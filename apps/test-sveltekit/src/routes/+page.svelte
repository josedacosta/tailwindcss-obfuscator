<script lang="ts">
  let count = $state(0);

  function increment() {
    count++;
  }

  function decrement() {
    count--;
  }
</script>

<svelte:head>
  <title>SvelteKit + Tailwind CSS v4</title>
  <meta name="description" content="tailwindcss-obfuscator end-to-end test on SvelteKit." />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100 py-12 px-4">
  <div class="max-w-4xl mx-auto">
    <!-- Header -->
    <header class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">
        SvelteKit + Tailwind CSS v4
      </h1>
      <p class="text-lg text-gray-600">
        Testing tailwindcss-obfuscator with SvelteKit
      </p>
    </header>

    <!-- Counter Card -->
    <div class="bg-white rounded-xl shadow-lg p-8 mb-8">
      <h2 class="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Interactive Counter
      </h2>

      <div class="flex items-center justify-center gap-6">
        <button
          onclick={decrement}
          class="w-12 h-12 rounded-full bg-red-500 text-white font-bold text-2xl hover:bg-red-600 transition-colors flex items-center justify-center"
        >
          -
        </button>

        <span class="text-5xl font-bold text-gray-800 min-w-[80px] text-center">
          {count}
        </span>

        <button
          onclick={increment}
          class="w-12 h-12 rounded-full bg-green-500 text-white font-bold text-2xl hover:bg-green-600 transition-colors flex items-center justify-center"
        >
          +
        </button>
      </div>
    </div>

    <!-- Features Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
        <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
          <span class="text-2xl">⚡</span>
        </div>
        <h3 class="text-lg font-semibold text-gray-800 mb-2">Fast</h3>
        <p class="text-gray-600 text-sm">
          SvelteKit compiles to minimal JavaScript for blazing performance.
        </p>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
        <div class="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mb-4">
          <span class="text-2xl">🎨</span>
        </div>
        <h3 class="text-lg font-semibold text-gray-800 mb-2">Stylish</h3>
        <p class="text-gray-600 text-sm">
          Tailwind CSS v4 with CSS-first configuration.
        </p>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
        <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
          <span class="text-2xl">🔒</span>
        </div>
        <h3 class="text-lg font-semibold text-gray-800 mb-2">Obfuscated</h3>
        <p class="text-gray-600 text-sm">
          Class names are obfuscated for production builds.
        </p>
      </div>
    </div>

    <!-- Buttons -->
    <div class="flex flex-wrap justify-center gap-4">
      <button class="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors">
        Primary Button
      </button>
      <button class="px-6 py-3 bg-secondary-600 text-white rounded-lg font-medium hover:bg-secondary-500 transition-colors">
        Secondary Button
      </button>
      <button class="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:border-gray-400 transition-colors">
        Outline Button
      </button>
    </div>
  </div>
</div>
