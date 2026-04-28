"use client";

import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Section, SubSection } from "./helpers";

export function AvatarShowcase() {
  return (
    <Section title="5. Avatar" id="avatar" docUrl="https://ui.shadcn.com/docs/components/avatar">
      <SubSection title="Sizes & Fallbacks">
        <div className="flex flex-wrap items-center gap-4">
          <Avatar className="h-6 w-6">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback className="text-xs">CN</AvatarFallback>
          </Avatar>
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Avatar className="h-12 w-12">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Avatar className="h-16 w-16">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback className="bg-blue-500 text-white">AB</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback className="bg-green-500 text-white">CD</AvatarFallback>
          </Avatar>
        </div>
      </SubSection>
      <SubSection title="Avatar Group">
        <div className="flex -space-x-4">
          <Avatar className="border-background border-2">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Avatar className="border-background border-2">
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <Avatar className="border-background border-2">
            <AvatarFallback>AB</AvatarFallback>
          </Avatar>
          <Avatar className="border-background border-2">
            <AvatarFallback className="bg-muted">+3</AvatarFallback>
          </Avatar>
        </div>
      </SubSection>
    </Section>
  );
}
