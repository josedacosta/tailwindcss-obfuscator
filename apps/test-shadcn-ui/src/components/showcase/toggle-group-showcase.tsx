"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Bold, Italic, Underline, Star, Heart, Bookmark } from "lucide-react";
import { Section, SubSection } from "./helpers";

export function ToggleGroupShowcase() {
  return (
    <Section
      title="57. Toggle Group"
      id="toggle-group"
      docUrl="https://ui.shadcn.com/docs/components/toggle-group"
    >
      <SubSection title="Single & Multiple Selection">
        <div className="flex flex-wrap items-center gap-4">
          <ToggleGroup type="single">
            <ToggleGroupItem value="bold" aria-label="Toggle bold">
              <Bold className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="italic" aria-label="Toggle italic">
              <Italic className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="underline" aria-label="Toggle underline">
              <Underline className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
          <ToggleGroup type="multiple" variant="outline">
            <ToggleGroupItem value="bold" aria-label="Toggle bold">
              <Bold className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="italic" aria-label="Toggle italic">
              <Italic className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="underline" aria-label="Toggle underline">
              <Underline className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </SubSection>
      <SubSection title="Sizes">
        <div className="flex flex-wrap items-center gap-4">
          <ToggleGroup type="single" size="sm">
            <ToggleGroupItem value="bold" aria-label="Toggle bold">
              <Bold className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="italic" aria-label="Toggle italic">
              <Italic className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="underline" aria-label="Toggle underline">
              <Underline className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
          <ToggleGroup type="multiple" size="lg">
            <ToggleGroupItem value="bold" aria-label="Toggle bold">
              <Bold className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="italic" aria-label="Toggle italic">
              <Italic className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="underline" aria-label="Toggle underline">
              <Underline className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
          <ToggleGroup type="multiple" disabled>
            <ToggleGroupItem value="bold" aria-label="Toggle bold">
              <Bold className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="italic" aria-label="Toggle italic">
              <Italic className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="underline" aria-label="Toggle underline">
              <Underline className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </SubSection>
      <SubSection title="Spacing">
        <ToggleGroup type="multiple" variant="outline" spacing={2} size="sm">
          <ToggleGroupItem
            value="star"
            aria-label="Toggle star"
            className="data-[state=on]:*:[svg]:fill-yellow-500 data-[state=on]:*:[svg]:stroke-yellow-500 data-[state=on]:bg-transparent"
          >
            <Star className="h-4 w-4" />
            Star
          </ToggleGroupItem>
          <ToggleGroupItem
            value="heart"
            aria-label="Toggle heart"
            className="data-[state=on]:*:[svg]:fill-red-500 data-[state=on]:*:[svg]:stroke-red-500 data-[state=on]:bg-transparent"
          >
            <Heart className="h-4 w-4" />
            Heart
          </ToggleGroupItem>
          <ToggleGroupItem
            value="bookmark"
            aria-label="Toggle bookmark"
            className="data-[state=on]:*:[svg]:fill-blue-500 data-[state=on]:*:[svg]:stroke-blue-500 data-[state=on]:bg-transparent"
          >
            <Bookmark className="h-4 w-4" />
            Bookmark
          </ToggleGroupItem>
        </ToggleGroup>
      </SubSection>
    </Section>
  );
}
