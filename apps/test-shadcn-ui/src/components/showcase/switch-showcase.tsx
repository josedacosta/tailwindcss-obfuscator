"use client";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Section, SubSection } from "./helpers";

export function SwitchShowcase() {
  return (
    <Section title="51. Switch" id="switch" docUrl="https://ui.shadcn.com/docs/components/switch">
      <SubSection title="All States">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch id="sw-1" />
            <Label htmlFor="sw-1">Default</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="sw-2" defaultChecked />
            <Label htmlFor="sw-2">Checked</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="sw-3" disabled />
            <Label htmlFor="sw-3" className="text-muted-foreground">
              Disabled
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="sw-4" disabled defaultChecked />
            <Label htmlFor="sw-4" className="text-muted-foreground">
              Disabled Checked
            </Label>
          </div>
        </div>
      </SubSection>
    </Section>
  );
}
