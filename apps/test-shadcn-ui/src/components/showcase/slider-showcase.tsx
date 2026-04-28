"use client";

import * as React from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Section, SubSection } from "./helpers";

export function SliderShowcase() {
  return (
    <Section title="48. Slider" id="slider" docUrl="https://ui.shadcn.com/docs/components/slider">
      <SubSection title="Different Values">
        <div className="max-w-md space-y-8">
          <div className="space-y-2">
            <Label>Default (50)</Label>
            <Slider defaultValue={[50]} max={100} step={1} />
          </div>
          <div className="space-y-2">
            <Label>Range</Label>
            <Slider defaultValue={[25, 75]} max={100} step={1} />
          </div>
          <div className="space-y-2">
            <Label>With Steps (10)</Label>
            <Slider defaultValue={[50]} max={100} step={10} />
          </div>
        </div>
      </SubSection>
    </Section>
  );
}
