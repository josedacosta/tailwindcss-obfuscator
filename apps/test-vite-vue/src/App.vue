<script setup lang="ts">
import { ref, computed } from "vue";

const count = ref(0);
const theme = ref<"light" | "dark">("light");

const alertTypes = ["info", "success", "warning", "error"] as const;
type AlertType = (typeof alertTypes)[number];

function getAlertClasses(type: AlertType) {
  const classes: Record<AlertType, string> = {
    info: "bg-blue-50 border-blue-200 text-blue-800",
    success: "bg-green-50 border-green-200 text-green-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    error: "bg-red-50 border-red-200 text-red-800",
  };
  return classes[type];
}

const themeClass = computed(() =>
  theme.value === "light" ? "bg-gray-100" : "bg-gray-900"
);

function toggleTheme() {
  theme.value = theme.value === "light" ? "dark" : "light";
}
</script>

<template>
  <div :class="['min-h-screen transition-colors duration-300', themeClass]">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold text-gray-900">
            TailwindCSS Obfuscator - Vue Test
          </h1>
          <button
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            @click="toggleTheme"
          >
            Toggle Theme
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Counter Section -->
      <section class="mb-8">
        <div class="bg-white rounded-xl shadow-lg p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4">Counter Example</h3>
          <div class="flex items-center gap-4">
            <button
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              @click="count++"
            >
              Increment
            </button>
            <span class="text-xl font-mono text-gray-700">{{ count }}</span>
            <button
              class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              @click="count = 0"
            >
              Reset
            </button>
          </div>
        </div>
      </section>

      <!-- Alerts Section -->
      <section class="mb-8 space-y-4">
        <h2 class="text-xl font-semibold text-gray-900">Alerts</h2>
        <div
          v-for="type in alertTypes"
          :key="type"
          :class="['p-4 rounded-lg border', getAlertClasses(type)]"
        >
          This is a {{ type }} alert
        </div>
      </section>

      <!-- Cards Grid -->
      <section class="mb-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Feature Cards</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h3 class="text-lg font-bold text-gray-900 mb-2">Vue 3</h3>
            <p class="text-gray-600">Full support for Vue 3 Composition API</p>
            <div class="mt-4 flex gap-2">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Composition API
              </span>
            </div>
          </div>
          <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h3 class="text-lg font-bold text-gray-900 mb-2">SFC Support</h3>
            <p class="text-gray-600">Single File Components with scoped styles</p>
            <div class="mt-4 flex gap-2">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                .vue files
              </span>
            </div>
          </div>
          <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h3 class="text-lg font-bold text-gray-900 mb-2">TypeScript</h3>
            <p class="text-gray-600">First-class TypeScript support</p>
            <div class="mt-4 flex gap-2">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Type Safe
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- Dynamic Classes with v-bind -->
      <section class="mb-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Dynamic Binding</h2>
        <div class="space-y-4">
          <div
            v-for="n in 5"
            :key="n"
            :class="[
              'p-4 rounded-lg',
              n % 2 === 0 ? 'bg-blue-100' : 'bg-green-100',
              `opacity-${20 * n}`,
            ]"
          >
            Item {{ n }} with dynamic opacity
          </div>
        </div>
      </section>

      <!-- Excluded class -->
      <section class="mb-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Excluded Classes</h2>
        <div class="no-obfuscate p-4 bg-yellow-100 rounded">
          This div has "no-obfuscate" class which should be excluded
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-800 text-white py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p class="text-gray-400">TailwindCSS Obfuscator - Vite + Vue Test App</p>
      </div>
    </footer>
  </div>
</template>
