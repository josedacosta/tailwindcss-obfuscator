"use client";

import * as React from "react";
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Section, SubSection } from "./helpers";

export function ContextMenuShowcase() {
  const [showStatusBar, setShowStatusBar] = React.useState(true);
  const [showActivityBar, setShowActivityBar] = React.useState(false);
  const [position, setPosition] = React.useState("bottom");

  return (
    <Section
      title="18. Context Menu"
      id="context-menu"
      docUrl="https://ui.shadcn.com/docs/components/context-menu"
    >
      <SubSection title="Context Menu">
        <ContextMenu>
          <ContextMenuTrigger className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm">
            Right click here
          </ContextMenuTrigger>
          <ContextMenuContent className="w-52">
            <ContextMenuItem inset>
              Back
              <ContextMenuShortcut>⌘[</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem inset disabled>
              Forward
              <ContextMenuShortcut>⌘]</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem inset>
              Reload
              <ContextMenuShortcut>⌘R</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuSub>
              <ContextMenuSubTrigger inset>More Tools</ContextMenuSubTrigger>
              <ContextMenuSubContent className="w-44">
                <ContextMenuItem>Save Page...</ContextMenuItem>
                <ContextMenuItem>Create Shortcut...</ContextMenuItem>
                <ContextMenuItem>Name Window...</ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem>Developer Tools</ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
              </ContextMenuSubContent>
            </ContextMenuSub>
            <ContextMenuSeparator />
            <ContextMenuCheckboxItem checked={showStatusBar} onCheckedChange={setShowStatusBar}>
              Show Bookmarks
            </ContextMenuCheckboxItem>
            <ContextMenuCheckboxItem checked={showActivityBar} onCheckedChange={setShowActivityBar}>
              Show Full URLs
            </ContextMenuCheckboxItem>
            <ContextMenuSeparator />
            <ContextMenuRadioGroup value={position} onValueChange={setPosition}>
              <ContextMenuLabel inset>People</ContextMenuLabel>
              <ContextMenuRadioItem value="top">Pedro Duarte</ContextMenuRadioItem>
              <ContextMenuRadioItem value="bottom">Colm Tuite</ContextMenuRadioItem>
            </ContextMenuRadioGroup>
          </ContextMenuContent>
        </ContextMenu>
      </SubSection>
    </Section>
  );
}
