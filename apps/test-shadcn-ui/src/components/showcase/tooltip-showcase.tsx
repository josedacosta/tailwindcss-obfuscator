"use client";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Section, SubSection } from "./helpers";

export function TooltipShowcase() {
  return (
    <Section
      title="58. Tooltip"
      id="tooltip"
      docUrl="https://ui.shadcn.com/docs/components/tooltip"
    >
      <SubSection title="Different Positions">
        <div className="flex flex-wrap gap-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">Top</Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Tooltip on top</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">Right</Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Tooltip on right</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">Bottom</Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Tooltip on bottom</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">Left</Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Tooltip on left</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </SubSection>
    </Section>
  );
}
