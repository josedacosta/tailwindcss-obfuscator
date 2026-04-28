"use client";

import * as React from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Section, SubSection } from "./helpers";

export function SheetShowcase() {
  return (
    <Section title="45. Sheet" id="sheet" docUrl="https://ui.shadcn.com/docs/components/sheet">
      <SubSection title="Default">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">Open</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Edit profile</SheetTitle>
              <SheetDescription>
                Make changes to your profile here. Click save when you&apos;re done.
              </SheetDescription>
            </SheetHeader>
            <div className="grid flex-1 auto-rows-min gap-6 px-4">
              <div className="grid gap-3">
                <Label htmlFor="sheet-demo-name">Name</Label>
                <Input id="sheet-demo-name" defaultValue="Pedro Duarte" />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="sheet-demo-username">Username</Label>
                <Input id="sheet-demo-username" defaultValue="@peduarte" />
              </div>
            </div>
            <SheetFooter>
              <Button type="submit">Save changes</Button>
              <SheetClose asChild>
                <Button variant="outline">Close</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </SubSection>
      <SubSection title="All Sides">
        <div className="flex flex-wrap gap-4">
          {(["top", "right", "bottom", "left"] as const).map((side) => (
            <Sheet key={side}>
              <SheetTrigger asChild>
                <Button variant="outline" className="capitalize">
                  {side}
                </Button>
              </SheetTrigger>
              <SheetContent side={side}>
                <SheetHeader>
                  <SheetTitle>Sheet from {side}</SheetTitle>
                  <SheetDescription>This sheet slides in from the {side}.</SheetDescription>
                </SheetHeader>
                <div className="grid flex-1 auto-rows-min gap-6 px-4">
                  <p>Sheet content goes here.</p>
                </div>
                <SheetFooter>
                  <SheetClose asChild>
                    <Button>Close</Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          ))}
        </div>
      </SubSection>
    </Section>
  );
}
