"use client";

import { useState } from "react";

export function GroupPeerDemo() {
  const [checked, setChecked] = useState(false);

  return (
    <section
      className="rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800"
      data-testid="group-peer"
    >
      <h2 className="mb-4 flex items-center gap-2 text-2xl font-semibold text-gray-900 dark:text-white">
        <span className="text-green-500">5.</span> Group & Peer Variants
      </h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Group hover */}
        <div className="group cursor-pointer rounded-lg bg-gray-100 p-4 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600">
          <p className="mb-2 text-gray-900 dark:text-white">Hover this card (group)</p>
          <span className="text-gray-500 transition-colors group-hover:text-blue-500">
            group-hover:text-blue-500
          </span>
          <div className="mt-2 rounded bg-blue-500 p-2 text-white opacity-0 transition-opacity group-hover:opacity-100">
            group-hover:opacity-100
          </div>
        </div>

        {/* State-based toggle (React alternative to peer) */}
        <div className="space-y-4">
          <button
            onClick={() => setChecked(!checked)}
            className="w-full cursor-pointer rounded-lg bg-gray-100 p-4 text-left text-gray-900 hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          >
            Click to toggle: {checked ? "ON" : "OFF"}
          </button>
          {checked ? (
            <div className="rounded-lg bg-green-500 p-4 text-white">
              State is ON - Component visible
            </div>
          ) : (
            <div className="rounded-lg bg-red-500 p-4 text-white">
              State is OFF - Different component
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
