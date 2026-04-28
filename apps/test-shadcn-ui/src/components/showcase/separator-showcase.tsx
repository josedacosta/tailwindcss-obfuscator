"use client";

import * as React from "react";
import { Separator } from "@/components/ui/separator";
import { Section, SubSection } from "./helpers";

export function SeparatorShowcase() {
  return (
    <Section
      title="44. Separator"
      id="separator"
      docUrl="https://ui.shadcn.com/docs/components/separator"
    >
      <SubSection title="Horizontal & Vertical">
        <div>
          <div className="space-y-1">
            <h4 className="text-sm font-medium">Radix Primitives</h4>
            <p className="text-muted-foreground text-sm">An open-source UI component library.</p>
          </div>
          <Separator className="my-4" />
          <div className="flex h-5 items-center space-x-4 text-sm">
            <div>Blog</div>
            <Separator orientation="vertical" />
            <div>Docs</div>
            <Separator orientation="vertical" />
            <div>Source</div>
          </div>
        </div>
      </SubSection>
    </Section>
  );
}
