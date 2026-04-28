export function DarkModeDemo() {
  return (
    <section
      className="rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800"
      data-testid="dark-mode"
    >
      <h2 className="mb-4 flex items-center gap-2 text-2xl font-semibold text-gray-900 dark:text-white">
        <span className="text-green-500">3.</span> Dark Mode
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg bg-gray-100 p-4 text-center text-gray-900 dark:bg-gray-700 dark:text-gray-100">
          bg-gray-100 → dark:bg-gray-700
        </div>
        <div className="rounded-lg border-2 border-gray-300 p-4 text-center text-gray-900 dark:border-gray-600 dark:text-white">
          border-gray-300 → dark:border-gray-600
        </div>
        <div className="rounded-lg bg-white p-4 text-center text-gray-900 shadow-lg dark:bg-gray-700 dark:text-white dark:shadow-gray-900/50">
          shadow-lg → dark:shadow-gray-900/50
        </div>
      </div>
    </section>
  );
}
