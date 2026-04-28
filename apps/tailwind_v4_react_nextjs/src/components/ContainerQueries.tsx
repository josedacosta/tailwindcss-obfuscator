export function ContainerQueries() {
  return (
    <section
      className="rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800"
      data-testid="container-queries"
    >
      <h2 className="mb-4 flex items-center gap-2 text-2xl font-semibold text-gray-900 dark:text-white">
        <span className="text-green-500">6.</span> Container Queries (v4 Feature)
      </h2>
      <div className="@container rounded-lg bg-gray-100 p-4 dark:bg-gray-700">
        <div className="@sm:flex @sm:gap-4 @md:grid @md:grid-cols-3 @lg:grid-cols-4">
          <div className="@sm:mb-0 mb-2 rounded-lg bg-violet-500 p-4 text-center text-white">
            @sm:flex
          </div>
          <div className="@sm:mb-0 mb-2 rounded-lg bg-violet-600 p-4 text-center text-white">
            @md:grid-cols-3
          </div>
          <div className="@sm:mb-0 mb-2 rounded-lg bg-violet-700 p-4 text-center text-white">
            @lg:grid-cols-4
          </div>
          <div className="@lg:block hidden rounded-lg bg-violet-800 p-4 text-center text-white">
            @lg:block
          </div>
        </div>
      </div>
      <div className="@container/card mt-4 rounded-lg bg-gray-100 p-4 dark:bg-gray-700">
        <p className="@sm/card:text-lg @md/card:text-xl @lg/card:text-2xl text-gray-900 dark:text-white">
          Named container: @sm/card:text-lg @md/card:text-xl @lg/card:text-2xl
        </p>
      </div>
    </section>
  );
}
