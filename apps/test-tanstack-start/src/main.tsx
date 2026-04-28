import React from "react";
import ReactDOM from "react-dom/client";
import {
  createRouter,
  RouterProvider,
  createRootRoute,
  createRoute,
  Outlet,
  Link,
} from "@tanstack/react-router";
import "./styles.css";

const rootRoute = createRootRoute({
  component: () => (
    <main className="from-ts-100 min-h-screen bg-gradient-to-br to-purple-100 px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-extrabold text-gray-900">
            TanStack Router + Tailwind v4
          </h1>
          <p className="text-lg text-gray-600">Obfuscation test for the TanStack ecosystem.</p>
        </header>
        <nav className="mb-8 flex justify-center gap-4">
          <Link
            to="/"
            className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white shadow-md transition-colors hover:bg-blue-700"
            activeProps={{ className: "ring-2 ring-blue-300" }}
          >
            Home
          </Link>
          <Link
            to="/about"
            className="rounded-lg bg-purple-600 px-4 py-2 font-medium text-white shadow-md transition-colors hover:bg-purple-700"
            activeProps={{ className: "ring-2 ring-purple-300" }}
          >
            About
          </Link>
        </nav>
        <Outlet />
      </div>
    </main>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: function HomePage() {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <article className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
          <h2 className="mb-2 text-xl font-bold text-gray-800">Type-safe routing</h2>
          <p className="text-sm text-gray-600">Routes know their params, search, and loaders.</p>
        </article>
        <article className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
          <h2 className="mb-2 text-xl font-bold text-gray-800">Built-in caching</h2>
          <p className="text-sm text-gray-600">Loader caching with deduplication out of the box.</p>
        </article>
      </div>
    );
  },
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: function AboutPage() {
    return (
      <article className="rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-4 text-2xl font-bold text-gray-800">About this app</h2>
        <p className="leading-relaxed text-gray-600">
          A minimal TanStack Router app verifying that{" "}
          <code className="rounded bg-gray-100 px-2 py-1 font-mono text-sm text-purple-700">
            tailwindcss-obfuscator
          </code>{" "}
          handles file-based and code-defined route patterns, including{" "}
          <code className="rounded bg-gray-100 px-2 py-1 font-mono text-sm text-purple-700">
            activeProps.className
          </code>
          .
        </p>
      </article>
    );
  },
});

const routeTree = rootRoute.addChildren([indexRoute, aboutRoute]);
const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
