"use client";

import * as React from "react";
import { ArrowUpRight, FolderOpen, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { InputGroup, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { Section, SubSection } from "./helpers";

export function EmptyShowcase() {
  return (
    <Section title="24. Empty" id="empty" docUrl="https://ui.shadcn.com/docs/components/empty">
      <SubSection title="Empty">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FolderOpen />
            </EmptyMedia>
            <EmptyTitle>No Projects Yet</EmptyTitle>
            <EmptyDescription>
              Create your first project to start organizing your work and collaborate with your
              team.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button>
              <Plus />
              Create Project
            </Button>
            <Button variant="ghost">
              Learn More
              <ArrowUpRight />
            </Button>
          </EmptyContent>
        </Empty>
      </SubSection>
      <SubSection title="InputGroup">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Search />
            </EmptyMedia>
            <EmptyTitle className="text-7xl font-bold">404</EmptyTitle>
            <EmptyDescription>
              We couldn&apos;t find the page you were looking for. Check the URL or try searching
              below.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <InputGroup>
              <InputGroupInput placeholder="Search..." />
              <InputGroupButton>
                <Search className="h-4 w-4" />
              </InputGroupButton>
            </InputGroup>
          </EmptyContent>
        </Empty>
      </SubSection>
    </Section>
  );
}
