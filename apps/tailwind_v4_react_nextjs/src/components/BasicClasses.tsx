export function BasicClasses() {
  return (
    <section
      className="rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800"
      data-testid="basic-classes"
    >
      <h2 className="mb-4 flex items-center gap-2 text-2xl font-semibold text-gray-900 dark:text-white">
        <span className="text-green-500">1.</span> Basic Classes
      </h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-lg bg-red-500 p-4 text-center text-white">bg-red-500</div>
        <div className="rounded-lg bg-blue-500 p-4 text-center text-white">bg-blue-500</div>
        <div className="rounded-lg bg-green-500 p-4 text-center text-white">bg-green-500</div>
        <div className="rounded-lg bg-yellow-500 p-4 text-center text-black">bg-yellow-500</div>
      </div>
    </section>
  );
}
