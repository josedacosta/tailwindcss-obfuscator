export function ResponsiveDemo() {
  return (
    <section
      className="rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800"
      data-testid="responsive-variants"
    >
      <h2 className="mb-4 flex items-center gap-2 text-2xl font-semibold text-gray-900 dark:text-white">
        <span className="text-green-500">2.</span> Responsive Variants
      </h2>
      <div className="space-y-4">
        <div className="rounded-lg bg-purple-500 p-4 text-center text-sm text-white sm:text-base md:text-lg lg:text-xl xl:text-2xl">
          Resize: text-sm → sm:text-base → md:text-lg → lg:text-xl → xl:text-2xl
        </div>
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex-1 rounded-lg bg-pink-500 p-4 text-center text-white">
            flex-col → sm:flex-row (1)
          </div>
          <div className="flex-1 rounded-lg bg-pink-600 p-4 text-center text-white">
            flex-col → sm:flex-row (2)
          </div>
        </div>
      </div>
    </section>
  );
}
