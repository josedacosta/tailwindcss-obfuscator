"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Section, SubSection } from "./helpers";

export function KbdShowcase() {
  return (
    <Section title="32. Kbd" id="kbd" docUrl="https://ui.shadcn.com/docs/components/kbd">
      <SubSection title="Kbd">
        <div className="flex flex-col items-center gap-4">
          <KbdGroup>
            <Kbd>⌘</Kbd>
            <Kbd>⇧</Kbd>
            <Kbd>⌥</Kbd>
            <Kbd>⌃</Kbd>
          </KbdGroup>
          <KbdGroup>
            <Kbd>Ctrl</Kbd>
            <span>+</span>
            <Kbd>B</Kbd>
          </KbdGroup>
        </div>
      </SubSection>
      <SubSection title="Group">
        <div className="flex flex-col items-center gap-4">
          <p className="text-muted-foreground text-sm">
            Use{" "}
            <KbdGroup>
              <Kbd>Ctrl + B</Kbd>
              <Kbd>Ctrl + K</Kbd>
            </KbdGroup>{" "}
            to open the command palette
          </p>
        </div>
      </SubSection>
      <SubSection title="Button">
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="outline" size="sm" className="pr-2">
            Accept <Kbd>⏎</Kbd>
          </Button>
          <Button variant="outline" size="sm" className="pr-2">
            Cancel <Kbd>Esc</Kbd>
          </Button>
        </div>
      </SubSection>
      <SubSection title="Shortcuts">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <KbdGroup>
              <Kbd>⌘</Kbd>
              <Kbd>K</Kbd>
            </KbdGroup>
            <span className="text-muted-foreground text-sm">Command menu</span>
          </div>
          <div className="flex items-center gap-2">
            <KbdGroup>
              <Kbd>⌘</Kbd>
              <Kbd>S</Kbd>
            </KbdGroup>
            <span className="text-muted-foreground text-sm">Save</span>
          </div>
          <div className="flex items-center gap-2">
            <KbdGroup>
              <Kbd>Ctrl</Kbd>
              <Kbd>C</Kbd>
            </KbdGroup>
            <span className="text-muted-foreground text-sm">Copy</span>
          </div>
          <div className="flex items-center gap-2">
            <KbdGroup>
              <Kbd>Shift</Kbd>
              <Kbd>Enter</Kbd>
            </KbdGroup>
            <span className="text-muted-foreground text-sm">New line</span>
          </div>
        </div>
      </SubSection>
    </Section>
  );
}
