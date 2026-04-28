"use client";

import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Section, SubSection } from "./helpers";

export function LabelShowcase() {
  return (
    <Section title="33. Label" id="label" docUrl="https://ui.shadcn.com/docs/components/label">
      <SubSection title="Label">
        <div className="flex items-center space-x-2">
          <Checkbox id="label-terms" />
          <Label htmlFor="label-terms">Accept terms and conditions</Label>
        </div>
      </SubSection>
    </Section>
  );
}
