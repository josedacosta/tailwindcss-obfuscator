import "./style.css";
import { tv } from "tailwind-variants";

// Regression test for issue #61 : the obfuscator MUST extract and obfuscate
// every class string inside a tv() call's base / variants / compoundVariants.
// Before the fix, only the inline template-literal classes at the bottom were
// obfuscated and the entire tv() body shipped raw to production.

const button = tv({
  base: "inline-flex items-center justify-center rounded font-semibold transition-colors",
  variants: {
    intent: {
      primary: "bg-blue-600 text-white hover:bg-blue-700",
      danger: "bg-red-600 text-white hover:bg-red-700",
      ghost: "bg-transparent text-blue-600 hover:bg-blue-50",
    },
    size: {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg",
    },
  },
  compoundVariants: [{ intent: "primary", size: "lg", class: "shadow-lg shadow-blue-500/30" }],
  defaultVariants: { intent: "primary", size: "md" },
});

const card = tv({
  base: "rounded-lg border border-slate-200 bg-white p-6 shadow-md",
  variants: { elevated: { true: "shadow-xl ring-1 ring-slate-100" } },
});

const root = document.getElementById("app");
root.innerHTML = `
  <main class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 px-4 py-12">
    <div class="mx-auto max-w-3xl space-y-6">
      <h1 class="text-4xl font-extrabold text-slate-900 mb-2">tailwind-variants regression test (#61)</h1>
      <p class="text-slate-600 mb-6">
        Every <code>tv()</code> base/variant/compoundVariant string above
        should appear as <code>tw-XXX</code> in the bundle. If you see raw
        Tailwind class names in the rendered DOM, the obfuscator missed them.
      </p>

      <div class="${card({ elevated: true })}">
        <h2 class="text-2xl font-bold mb-4">Buttons</h2>
        <div class="flex flex-wrap gap-3">
          <button class="${button({ intent: "primary", size: "sm" })}">Primary sm</button>
          <button class="${button({ intent: "primary", size: "md" })}">Primary md</button>
          <button class="${button({ intent: "primary", size: "lg" })}">Primary lg (compound)</button>
          <button class="${button({ intent: "danger", size: "md" })}">Danger</button>
          <button class="${button({ intent: "ghost", size: "md" })}">Ghost</button>
        </div>
      </div>
    </div>
  </main>
`;
