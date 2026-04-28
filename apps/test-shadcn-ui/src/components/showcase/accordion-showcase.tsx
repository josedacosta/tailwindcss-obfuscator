"use client";

import * as React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Section, SubSection } from "./helpers";

export function AccordionShowcase() {
  return (
    <Section
      title="1. Accordion"
      id="accordion"
      docUrl="https://ui.shadcn.com/docs/components/accordion"
    >
      <SubSection title="Single Selection (Collapsible)">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>Is it accessible?</AccordionTrigger>
            <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Is it styled?</AccordionTrigger>
            <AccordionContent>
              Yes. It comes with default styles that matches the other components.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Is it animated?</AccordionTrigger>
            <AccordionContent>
              Yes. It&apos;s animated by default, but you can disable it.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </SubSection>

      <SubSection title="Multiple Selection">
        <Accordion type="multiple" className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>Can I select multiple items?</AccordionTrigger>
            <AccordionContent>
              Yes! This accordion allows multiple items to be open at the same time.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>How does it work?</AccordionTrigger>
            <AccordionContent>
              Set type=&quot;multiple&quot; to enable this behavior.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </SubSection>
    </Section>
  );
}
