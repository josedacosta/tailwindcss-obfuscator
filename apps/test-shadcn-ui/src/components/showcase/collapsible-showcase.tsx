"use client";

import * as React from "react";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Section, SubSection } from "./helpers";

export function CollapsibleShowcase() {
  const [isCollapsibleOpen, setIsCollapsibleOpen] = React.useState(false);

  return (
    <Section
      title="15. Collapsible"
      id="collapsible"
      docUrl="https://ui.shadcn.com/docs/components/collapsible"
    >
      <SubSection title="Basic Collapsible">
        <Collapsible
          open={isCollapsibleOpen}
          onOpenChange={setIsCollapsibleOpen}
          className="w-[350px] space-y-2"
        >
          <div className="flex items-center justify-between space-x-4 px-4">
            <h4 className="text-sm font-semibold">@peduarte starred 3 repositories</h4>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-9 p-0">
                <ChevronsUpDown className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
          </div>
          <div className="rounded-md border px-4 py-3 font-mono text-sm">@radix-ui/primitives</div>
          <CollapsibleContent className="space-y-2">
            <div className="rounded-md border px-4 py-3 font-mono text-sm">@radix-ui/colors</div>
            <div className="rounded-md border px-4 py-3 font-mono text-sm">@stitches/react</div>
          </CollapsibleContent>
        </Collapsible>
      </SubSection>
    </Section>
  );
}
