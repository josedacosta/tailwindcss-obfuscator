"use client";

import * as React from "react";
import { ArrowUp } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Progress } from "@/components/ui/progress";
import { Section, SubSection } from "./helpers";

export function SpinnerShowcase() {
  return (
    <Section
      title="50. Spinner"
      id="spinner"
      docUrl="https://ui.shadcn.com/docs/components/spinner"
    >
      <SubSection title="Default">
        <div className="flex w-full max-w-xs flex-col gap-4 [--radius:1rem]">
          <Item variant="muted">
            <ItemMedia>
              <Spinner />
            </ItemMedia>
            <ItemContent>
              <ItemTitle className="line-clamp-1">Processing payment...</ItemTitle>
            </ItemContent>
            <ItemContent className="flex-none justify-end">
              <span className="text-sm tabular-nums">$100.00</span>
            </ItemContent>
          </Item>
        </div>
      </SubSection>
      <SubSection title="Size">
        <div className="flex items-center gap-6">
          <Spinner className="size-3" />
          <Spinner className="size-4" />
          <Spinner className="size-6" />
          <Spinner className="size-8" />
        </div>
      </SubSection>
      <SubSection title="Color">
        <div className="flex items-center gap-6">
          <Spinner className="size-6 text-red-500" />
          <Spinner className="size-6 text-green-500" />
          <Spinner className="size-6 text-blue-500" />
          <Spinner className="size-6 text-yellow-500" />
          <Spinner className="size-6 text-purple-500" />
        </div>
      </SubSection>
      <SubSection title="Button">
        <div className="flex flex-col items-center gap-4">
          <Button disabled size="sm">
            <Spinner />
            Loading...
          </Button>
          <Button variant="outline" disabled size="sm">
            <Spinner />
            Please wait
          </Button>
          <Button variant="secondary" disabled size="sm">
            <Spinner />
            Processing
          </Button>
        </div>
      </SubSection>
      <SubSection title="Badge">
        <div className="flex items-center gap-4 [--radius:1.2rem]">
          <Badge>
            <Spinner />
            Syncing
          </Badge>
          <Badge variant="secondary">
            <Spinner />
            Updating
          </Badge>
          <Badge variant="outline">
            <Spinner />
            Processing
          </Badge>
        </div>
      </SubSection>
      <SubSection title="Input Group">
        <div className="flex w-full max-w-md flex-col gap-4">
          <InputGroup>
            <InputGroupInput placeholder="Send a message..." disabled />
            <InputGroupAddon align="inline-end">
              <Spinner />
            </InputGroupAddon>
          </InputGroup>
          <InputGroup>
            <InputGroupTextarea placeholder="Send a message..." disabled />
            <InputGroupAddon align="block-end">
              <Spinner /> Validating...
              <InputGroupButton className="ml-auto" variant="default">
                <ArrowUp />
                <span className="sr-only">Send</span>
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </div>
      </SubSection>
      <SubSection title="Empty">
        <Empty className="w-full">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Spinner />
            </EmptyMedia>
            <EmptyTitle>Processing your request</EmptyTitle>
            <EmptyDescription>
              Please wait while we process your request. Do not refresh the page.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button variant="outline" size="sm">
              Cancel
            </Button>
          </EmptyContent>
        </Empty>
      </SubSection>
      <SubSection title="Item">
        <div className="flex w-full max-w-md flex-col gap-4 [--radius:1rem]">
          <Item variant="outline">
            <ItemMedia variant="icon">
              <Spinner />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Downloading...</ItemTitle>
              <ItemDescription>129 MB / 1000 MB</ItemDescription>
            </ItemContent>
            <ItemActions className="hidden sm:flex">
              <Button variant="outline" size="sm">
                Cancel
              </Button>
            </ItemActions>
            <ItemFooter>
              <Progress value={75} />
            </ItemFooter>
          </Item>
        </div>
      </SubSection>
    </Section>
  );
}
