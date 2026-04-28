"use client";

import { Toggle } from "@/components/ui/toggle";
import { Italic, Underline, Bookmark } from "lucide-react";
import { Section, SubSection } from "./helpers";

export function ToggleShowcase() {
  return (
    <Section title="56. Toggle" id="toggle" docUrl="https://ui.shadcn.com/docs/components/toggle">
      <SubSection title="All Examples">
        <div className="flex flex-wrap items-center gap-4">
          <Toggle
            aria-label="Toggle bookmark"
            size="sm"
            variant="outline"
            className="data-[state=on]:*:[svg]:fill-blue-500 data-[state=on]:*:[svg]:stroke-blue-500 data-[state=on]:bg-transparent"
          >
            <Bookmark className="h-4 w-4" />
            Bookmark
          </Toggle>
          <Toggle variant="outline" aria-label="Toggle italic">
            <Italic className="h-4 w-4" />
          </Toggle>
          <Toggle aria-label="Toggle italic">
            <Italic className="h-4 w-4" />
            Italic
          </Toggle>
          <Toggle size="sm" aria-label="Toggle italic sm">
            <Italic className="h-4 w-4" />
          </Toggle>
          <Toggle size="lg" aria-label="Toggle italic lg">
            <Italic className="h-4 w-4" />
          </Toggle>
          <Toggle aria-label="Toggle underline" disabled>
            <Underline className="h-4 w-4" />
          </Toggle>
        </div>
      </SubSection>
    </Section>
  );
}
