"use client";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Section, SubSection } from "./helpers";

export function TextareaShowcase() {
  return (
    <Section
      title="54. Textarea"
      id="textarea"
      docUrl="https://ui.shadcn.com/docs/components/textarea"
    >
      <SubSection title="All States">
        <div className="grid max-w-md gap-4" suppressHydrationWarning>
          <div className="grid gap-2">
            <Label htmlFor="ta-1">Default</Label>
            <Textarea id="ta-1" placeholder="Type your message here." />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="ta-2">Disabled</Label>
            <Textarea id="ta-2" placeholder="Disabled" disabled />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="ta-3">With value</Label>
            <Textarea id="ta-3" defaultValue="This textarea has a default value." />
          </div>
        </div>
      </SubSection>
    </Section>
  );
}
