"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Section, SubSection } from "./helpers";

export function InputShowcase() {
  return (
    <Section title="28. Input" id="input" docUrl="https://ui.shadcn.com/docs/components/input">
      <SubSection title="Default">
        <Input type="email" placeholder="Email" className="max-w-sm" />
      </SubSection>
      <SubSection title="File">
        <div className="grid w-full max-w-sm items-center gap-3">
          <Label htmlFor="input-picture">Picture</Label>
          <Input id="input-picture" type="file" />
        </div>
      </SubSection>
      <SubSection title="Disabled">
        <Input disabled type="email" placeholder="Email" className="max-w-sm" />
      </SubSection>
      <SubSection title="With Label">
        <div className="grid w-full max-w-sm items-center gap-3">
          <Label htmlFor="input-email">Email</Label>
          <Input type="email" id="input-email" placeholder="Email" />
        </div>
      </SubSection>
      <SubSection title="With Button">
        <div className="flex w-full max-w-sm items-center gap-2">
          <Input type="email" placeholder="Email" />
          <Button type="submit" variant="outline">
            Subscribe
          </Button>
        </div>
      </SubSection>
    </Section>
  );
}
