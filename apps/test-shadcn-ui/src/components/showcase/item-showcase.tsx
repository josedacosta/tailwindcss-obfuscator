"use client";

import * as React from "react";
import { BadgeCheck, ChevronRight, ExternalLink, Plus, ShieldAlert } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription as ItemDesc,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item";
import { Section, SubSection } from "./helpers";

export function ItemShowcase() {
  return (
    <Section title="31. Item" id="item" docUrl="https://ui.shadcn.com/docs/components/item">
      <SubSection title="Item">
        <div className="flex w-full max-w-md flex-col gap-6">
          <Item variant="outline">
            <ItemContent>
              <ItemTitle>Basic Item</ItemTitle>
              <ItemDesc>A simple item with title and description.</ItemDesc>
            </ItemContent>
            <ItemActions>
              <Button variant="outline" size="sm">
                Action
              </Button>
            </ItemActions>
          </Item>
          <Item variant="outline" size="sm" asChild>
            <a href="#">
              <ItemMedia>
                <BadgeCheck className="size-5" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Your profile has been verified.</ItemTitle>
              </ItemContent>
              <ItemActions>
                <ChevronRight className="size-4" />
              </ItemActions>
            </a>
          </Item>
        </div>
      </SubSection>
      <SubSection title="Variants">
        <div className="flex max-w-md flex-col gap-6">
          <Item>
            <ItemContent>
              <ItemTitle>Default Variant</ItemTitle>
              <ItemDesc>Standard styling with subtle background and borders.</ItemDesc>
            </ItemContent>
            <ItemActions>
              <Button variant="outline" size="sm">
                Open
              </Button>
            </ItemActions>
          </Item>
          <Item variant="outline">
            <ItemContent>
              <ItemTitle>Outline Variant</ItemTitle>
              <ItemDesc>Outlined style with clear borders and transparent background.</ItemDesc>
            </ItemContent>
            <ItemActions>
              <Button variant="outline" size="sm">
                Open
              </Button>
            </ItemActions>
          </Item>
          <Item variant="muted">
            <ItemContent>
              <ItemTitle>Muted Variant</ItemTitle>
              <ItemDesc>Subdued appearance with muted colors for secondary content.</ItemDesc>
            </ItemContent>
            <ItemActions>
              <Button variant="outline" size="sm">
                Open
              </Button>
            </ItemActions>
          </Item>
        </div>
      </SubSection>
      <SubSection title="Icon">
        <div className="flex w-full max-w-lg flex-col gap-6">
          <Item variant="outline">
            <ItemMedia variant="icon">
              <ShieldAlert />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Security Alert</ItemTitle>
              <ItemDesc>New login detected from unknown device.</ItemDesc>
            </ItemContent>
            <ItemActions>
              <Button size="sm" variant="outline">
                Review
              </Button>
            </ItemActions>
          </Item>
        </div>
      </SubSection>
      <SubSection title="Avatar">
        <div className="flex w-full max-w-lg flex-col gap-6">
          <Item variant="outline">
            <ItemMedia>
              <Avatar className="size-10">
                <AvatarImage src="https://github.com/evilrabbit.png" />
                <AvatarFallback>ER</AvatarFallback>
              </Avatar>
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Evil Rabbit</ItemTitle>
              <ItemDesc>Last seen 5 months ago</ItemDesc>
            </ItemContent>
            <ItemActions>
              <Button size="icon-sm" variant="outline" className="rounded-full" aria-label="Invite">
                <Plus />
              </Button>
            </ItemActions>
          </Item>
          <Item variant="outline">
            <ItemMedia>
              <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarImage src="https://github.com/maxleiter.png" alt="@maxleiter" />
                  <AvatarFallback>ML</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarImage src="https://github.com/evilrabbit.png" alt="@evilrabbit" />
                  <AvatarFallback>ER</AvatarFallback>
                </Avatar>
              </div>
            </ItemMedia>
            <ItemContent>
              <ItemTitle>No Team Members</ItemTitle>
              <ItemDesc>Invite your team to collaborate on this project.</ItemDesc>
            </ItemContent>
            <ItemActions>
              <Button size="sm" variant="outline">
                Invite
              </Button>
            </ItemActions>
          </Item>
        </div>
      </SubSection>
      <SubSection title="Group">
        <div className="flex w-full max-w-md flex-col gap-6">
          <ItemGroup>
            {[
              {
                username: "shadcn",
                avatar: "https://github.com/shadcn.png",
                email: "shadcn@vercel.com",
              },
              {
                username: "maxleiter",
                avatar: "https://github.com/maxleiter.png",
                email: "maxleiter@vercel.com",
              },
              {
                username: "evilrabbit",
                avatar: "https://github.com/evilrabbit.png",
                email: "evilrabbit@vercel.com",
              },
            ].map((person, index, arr) => (
              <React.Fragment key={person.username}>
                <Item>
                  <ItemMedia>
                    <Avatar>
                      <AvatarImage src={person.avatar} className="grayscale" />
                      <AvatarFallback>{person.username.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </ItemMedia>
                  <ItemContent className="gap-1">
                    <ItemTitle>{person.username}</ItemTitle>
                    <ItemDesc>{person.email}</ItemDesc>
                  </ItemContent>
                  <ItemActions>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Plus />
                    </Button>
                  </ItemActions>
                </Item>
                {index !== arr.length - 1 && <ItemSeparator />}
              </React.Fragment>
            ))}
          </ItemGroup>
        </div>
      </SubSection>
      <SubSection title="Link">
        <div className="flex w-full max-w-md flex-col gap-4">
          <Item asChild>
            <a href="#">
              <ItemContent>
                <ItemTitle>Visit our documentation</ItemTitle>
                <ItemDesc>Learn how to get started with our components.</ItemDesc>
              </ItemContent>
              <ItemActions>
                <ChevronRight className="size-4" />
              </ItemActions>
            </a>
          </Item>
          <Item variant="outline" asChild>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <ItemContent>
                <ItemTitle>External resource</ItemTitle>
                <ItemDesc>Opens in a new tab with security attributes.</ItemDesc>
              </ItemContent>
              <ItemActions>
                <ExternalLink className="size-4" />
              </ItemActions>
            </a>
          </Item>
        </div>
      </SubSection>
    </Section>
  );
}
