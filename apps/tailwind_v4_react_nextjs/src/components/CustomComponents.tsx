export function CustomComponents() {
  return (
    <section
      className="rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800"
      data-testid="custom-components"
    >
      <h2 className="mb-4 flex items-center gap-2 text-2xl font-semibold text-gray-900 dark:text-white">
        <span className="text-green-500">7.</span> Custom @apply Components
      </h2>
      <div className="flex flex-wrap gap-4">
        <button className="btn btn-primary">btn btn-primary</button>
        <button className="btn btn-secondary">btn btn-secondary</button>
        <div className="card">
          <p className="text-gray-900 dark:text-white">Custom .card component</p>
        </div>
        <span className="badge">badge</span>
        <span className="badge-success">badge-success</span>
      </div>
    </section>
  );
}
