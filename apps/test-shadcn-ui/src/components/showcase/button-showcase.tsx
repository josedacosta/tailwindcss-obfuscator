"use client";

import * as React from "react";
import { Plus, Mail, ArrowRight, Loader2, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section, SubSection } from "./helpers";

export function ButtonShowcase() {
  return (
    <Section title="8. Button" id="button" docUrl="https://ui.shadcn.com/docs/components/button">
      <SubSection title="All Variants">
        <div className="flex flex-wrap gap-4">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
      </SubSection>
      <SubSection title="Sizes">
        <div className="flex flex-wrap items-center gap-4">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
          <Button size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </SubSection>
      <SubSection title="With Icons & States">
        <div className="flex flex-wrap gap-4">
          <Button>
            <Mail className="mr-2 h-4 w-4" /> Email
          </Button>
          <Button variant="outline">
            Next <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading
          </Button>
          <Button disabled>Disabled</Button>
        </div>
      </SubSection>
      <SubSection title="Icon & Rounded">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Button variant="outline" size="icon" aria-label="Add">
              <Plus />
            </Button>
            <Button variant="outline" size="icon" aria-label="Settings">
              <Settings />
            </Button>
            <Button variant="outline" size="icon" aria-label="Email">
              <Mail />
            </Button>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button variant="outline" size="icon" className="rounded-full" aria-label="Add">
              <Plus />
            </Button>
            <Button variant="secondary" size="icon" className="rounded-full" aria-label="Settings">
              <Settings />
            </Button>
            <Button size="icon" className="rounded-full" aria-label="Email">
              <Mail />
            </Button>
          </div>
        </div>
      </SubSection>
    </Section>
  );
}
