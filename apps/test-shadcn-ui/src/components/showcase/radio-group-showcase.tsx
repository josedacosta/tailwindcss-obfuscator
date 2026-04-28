"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Section, SubSection } from "./helpers";

export function RadioGroupShowcase() {
  return (
    <Section
      title="40. Radio Group"
      id="radio-group"
      docUrl="https://ui.shadcn.com/docs/components/radio-group"
    >
      <SubSection title="Vertical & Horizontal">
        <div className="space-y-6">
          <RadioGroup defaultValue="comfortable">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="default" id="r1" />
              <Label htmlFor="r1">Default</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="comfortable" id="r2" />
              <Label htmlFor="r2">Comfortable</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="compact" id="r3" />
              <Label htmlFor="r3">Compact</Label>
            </div>
          </RadioGroup>
          <RadioGroup defaultValue="option-1" className="flex gap-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="option-1" id="o1" />
              <Label htmlFor="o1">Option 1</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="option-2" id="o2" />
              <Label htmlFor="o2">Option 2</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="option-3" id="o3" />
              <Label htmlFor="o3">Option 3</Label>
            </div>
          </RadioGroup>
        </div>
      </SubSection>
    </Section>
  );
}
