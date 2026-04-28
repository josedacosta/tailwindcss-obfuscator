"use client";

import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Section, SubSection } from "./helpers";

export function SkeletonShowcase() {
  return (
    <Section
      title="47. Skeleton"
      id="skeleton"
      docUrl="https://ui.shadcn.com/docs/components/skeleton"
    >
      <SubSection title="Card & Content Skeleton">
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[90%]" />
            <Skeleton className="h-4 w-[80%]" />
          </div>
        </div>
      </SubSection>
    </Section>
  );
}
