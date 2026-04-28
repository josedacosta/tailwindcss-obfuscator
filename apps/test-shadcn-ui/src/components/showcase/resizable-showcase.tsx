"use client";

import * as React from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Section, SubSection } from "./helpers";

export function ResizableShowcase() {
  return (
    <Section
      title="41. Resizable"
      id="resizable"
      docUrl="https://ui.shadcn.com/docs/components/resizable"
    >
      <SubSection title="Vertical">
        <ResizablePanelGroup
          direction="vertical"
          className="min-h-[200px] max-w-md rounded-lg border md:min-w-[450px]"
        >
          <ResizablePanel defaultSize={25}>
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">Header</span>
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={75}>
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">Content</span>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </SubSection>
      <SubSection title="Handle">
        <ResizablePanelGroup
          direction="horizontal"
          className="min-h-[200px] max-w-md rounded-lg border md:min-w-[450px]"
        >
          <ResizablePanel defaultSize={25}>
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">Sidebar</span>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={75}>
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">Content</span>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </SubSection>
      <SubSection title="Nested">
        <ResizablePanelGroup
          direction="horizontal"
          className="max-w-md rounded-lg border md:min-w-[450px]"
        >
          <ResizablePanel defaultSize={50}>
            <div className="flex h-[200px] items-center justify-center p-6">
              <span className="font-semibold">One</span>
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={50}>
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel defaultSize={25}>
                <div className="flex h-full items-center justify-center p-6">
                  <span className="font-semibold">Two</span>
                </div>
              </ResizablePanel>
              <ResizableHandle />
              <ResizablePanel defaultSize={75}>
                <div className="flex h-full items-center justify-center p-6">
                  <span className="font-semibold">Three</span>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </SubSection>
    </Section>
  );
}
