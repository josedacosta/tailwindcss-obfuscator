"use client";

export function HoverStates() {
  return (
    <section
      className="rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800"
      data-testid="hover-states"
    >
      <h2 className="mb-4 flex items-center gap-2 text-2xl font-semibold text-gray-900 dark:text-white">
        <span className="text-green-500">4.</span> Hover / Focus / Active
      </h2>
      <div className="flex flex-wrap gap-4">
        <button className="rounded-lg bg-blue-500 px-6 py-3 text-white transition-colors hover:bg-blue-700 active:bg-blue-800">
          hover:bg-blue-700
        </button>
        <button className="rounded-lg bg-green-500 px-6 py-3 text-white transition-transform hover:scale-110 active:scale-95">
          hover:scale-110
        </button>
        <input
          type="text"
          placeholder="Focus me"
          className="rounded-lg border-2 border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>
    </section>
  );
}
