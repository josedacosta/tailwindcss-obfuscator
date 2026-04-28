"use client";

import * as React from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Section, SubSection } from "./helpers";

export function AspectRatioShowcase() {
  return (
    <Section
      title="4. Aspect Ratio"
      id="aspect-ratio"
      docUrl="https://ui.shadcn.com/docs/components/aspect-ratio"
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <SubSection title="16:9 (Video)">
          <AspectRatio ratio={16 / 9} className="bg-muted overflow-hidden rounded-lg">
            <img
              src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&q=80"
              alt="16:9"
              className="h-full w-full object-cover"
            />
          </AspectRatio>
        </SubSection>
        <SubSection title="4:3 (Classic)">
          <AspectRatio ratio={4 / 3} className="bg-muted overflow-hidden rounded-lg">
            <img
              src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&q=80"
              alt="4:3"
              className="h-full w-full object-cover"
            />
          </AspectRatio>
        </SubSection>
        <SubSection title="1:1 (Square)">
          <AspectRatio ratio={1} className="bg-muted overflow-hidden rounded-lg">
            <img
              src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&q=80"
              alt="1:1"
              className="h-full w-full object-cover"
            />
          </AspectRatio>
        </SubSection>
        <SubSection title="21:9 (Ultrawide)">
          <AspectRatio ratio={21 / 9} className="bg-muted overflow-hidden rounded-lg">
            <img
              src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&q=80"
              alt="21:9"
              className="h-full w-full object-cover"
            />
          </AspectRatio>
        </SubSection>
      </div>
    </Section>
  );
}
