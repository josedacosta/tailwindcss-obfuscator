import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import "./index.css";

/**
 * Renders into light DOM so global Tailwind styles (and the obfuscator's
 * rewritten class names) apply. Shadow-DOM Lit components would need
 * adoptedStyleSheets to share the bundle's CSS, which is out of scope for
 * this regression test — the focus here is class extraction, not encapsulation.
 */
abstract class LightDomElement extends LitElement {
  protected createRenderRoot() {
    return this;
  }
}

@customElement("my-counter")
export class MyCounter extends LightDomElement {
  @state() private count = 0;

  render() {
    return html`
      <section class="mx-auto max-w-2xl space-y-4 px-6 py-12">
        <h1 class="text-4xl font-extrabold tracking-tight text-slate-900">
          Lit + Tailwind v4 obfuscation test
        </h1>
        <p class="text-base leading-relaxed text-slate-600">
          Lit's <code class="rounded bg-slate-100 px-1 py-0.5 text-sm">html\`\`</code> tagged
          template literal contains every
          <code class="rounded bg-slate-100 px-1 py-0.5 text-sm">class="…"</code>
          attribute the obfuscator must extract and rewrite.
        </p>
        <div class="border-brand-500 rounded-lg border bg-white p-6 shadow-md">
          <h2 class="text-brand-700 mb-3 text-2xl font-bold">Counter</h2>
          <p class="mb-4 text-lg text-slate-700">
            Count: <span class="text-brand-700 font-mono font-bold">${this.count}</span>
          </p>
          <button
            class="bg-brand-500 hover:bg-brand-700 inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold text-white transition-colors"
            @click=${() => this.count++}
          >
            Increment
          </button>
        </div>
      </section>
    `;
  }
}

@customElement("my-card")
export class MyCard extends LightDomElement {
  render() {
    return html`
      <section class="mx-auto max-w-2xl px-6 pb-12">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div class="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h3 class="mb-2 text-xl font-bold text-slate-900">Card 1</h3>
            <p class="text-sm text-slate-600">
              Distinct utility set so we can verify cross-component class deduplication.
            </p>
          </div>
          <div class="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h3 class="mb-2 text-xl font-bold text-slate-900">Card 2</h3>
            <p class="text-sm text-slate-600">
              Responsive variant (<code class="rounded bg-slate-100 px-1 py-0.5 text-xs"
                >sm:grid-cols-2</code
              >) must obfuscate alongside its base utility.
            </p>
          </div>
        </div>
      </section>
    `;
  }
}
