"use client";

import * as React from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Section, SubSection } from "./helpers";
import { tags, artworks } from "./data";

export function ScrollAreaShowcase() {
  return (
    <Section
      title="42. Scroll Area"
      id="scroll-area"
      docUrl="https://ui.shadcn.com/docs/components/scroll-area"
    >
      <SubSection title="Vertical">
        <ScrollArea className="h-72 w-48 rounded-md border">
          <div className="p-4">
            <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
            {tags.map((tag) => (
              <React.Fragment key={tag}>
                <div className="text-sm">{tag}</div>
                <Separator className="my-2" />
              </React.Fragment>
            ))}
          </div>
        </ScrollArea>
      </SubSection>
      <SubSection title="Horizontal Scrolling">
        <ScrollArea className="w-96 whitespace-nowrap rounded-md border">
          <div className="flex w-max space-x-4 p-4">
            {artworks.map((artwork) => (
              <figure key={artwork.artist} className="shrink-0">
                <div className="overflow-hidden rounded-md">
                  <img
                    src={artwork.art}
                    alt={`Photo by ${artwork.artist}`}
                    className="aspect-[3/4] h-fit w-fit object-cover"
                    width={300}
                    height={400}
                  />
                </div>
                <figcaption className="text-muted-foreground pt-2 text-xs">
                  Photo by <span className="text-foreground font-semibold">{artwork.artist}</span>
                </figcaption>
              </figure>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </SubSection>
    </Section>
  );
}
