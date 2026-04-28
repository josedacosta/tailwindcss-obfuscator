"use client";

import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Section, SubSection } from "./helpers";

export function HoverCardShowcase() {
  return (
    <Section
      title="27. Hover Card"
      id="hover-card"
      docUrl="https://ui.shadcn.com/docs/components/hover-card"
    >
      <SubSection title="User Preview">
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="link">@nextjs</Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="flex justify-between space-x-4">
              <Avatar>
                <AvatarImage src="https://github.com/vercel.png" />
                <AvatarFallback>VC</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold">@nextjs</h4>
                <p className="text-sm">The React Framework – created and maintained by @vercel.</p>
                <div className="flex items-center pt-2">
                  <CalendarIcon className="text-muted-foreground mr-2 h-4 w-4" />
                  <span className="text-muted-foreground text-xs">Joined December 2021</span>
                </div>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </SubSection>
    </Section>
  );
}
