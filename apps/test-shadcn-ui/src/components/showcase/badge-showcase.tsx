"use client";

import * as React from "react";
import { Check, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Section, SubSection } from "./helpers";

export function BadgeShowcase() {
  return (
    <Section title="6. Badge" id="badge" docUrl="https://ui.shadcn.com/docs/components/badge">
      <SubSection title="All Variants">
        <div className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
        </div>
      </SubSection>
      <SubSection title="With Icons & Custom Colors">
        <div className="flex flex-wrap gap-2">
          <Badge>
            <Check className="mr-1 h-3 w-3" /> Verified
          </Badge>
          <Badge variant="secondary">
            <User className="mr-1 h-3 w-3" /> User
          </Badge>
          <Badge className="bg-green-500 hover:bg-green-600">Success</Badge>
          <Badge className="bg-yellow-500 hover:bg-yellow-600">Warning</Badge>
          <Badge className="bg-blue-500 hover:bg-blue-600">Info</Badge>
        </div>
      </SubSection>
    </Section>
  );
}
