"use client";

import * as React from "react";
import {
  Check,
  ChevronDown,
  Code,
  Copy,
  CornerDownLeft,
  CreditCard,
  HelpCircle,
  Info,
  Link2,
  Loader2,
  Mail,
  MoreHorizontal,
  RefreshCw,
  Search,
  Star,
} from "lucide-react";
import { ButtonGroup, ButtonGroupText } from "@/components/ui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Section, SubSection } from "./helpers";

export function InputGroupShowcase() {
  return (
    <Section
      title="29. Input Group"
      id="input-group"
      docUrl="https://ui.shadcn.com/docs/components/input-group"
    >
      <SubSection title="Icon">
        <div className="grid w-full max-w-sm gap-6">
          <InputGroup>
            <InputGroupInput placeholder="Search..." />
            <InputGroupAddon>
              <Search className="h-4 w-4" />
            </InputGroupAddon>
          </InputGroup>
          <InputGroup>
            <InputGroupInput type="email" placeholder="Enter your email" />
            <InputGroupAddon>
              <Mail className="h-4 w-4" />
            </InputGroupAddon>
          </InputGroup>
          <InputGroup>
            <InputGroupInput placeholder="Card number" />
            <InputGroupAddon>
              <CreditCard className="h-4 w-4" />
            </InputGroupAddon>
            <InputGroupAddon align="inline-end">
              <Check className="h-4 w-4" />
            </InputGroupAddon>
          </InputGroup>
          <InputGroup>
            <InputGroupInput placeholder="Card number" />
            <InputGroupAddon align="inline-end">
              <Star className="h-4 w-4" />
              <Info className="h-4 w-4" />
            </InputGroupAddon>
          </InputGroup>
        </div>
      </SubSection>
      <SubSection title="Text">
        <div className="grid w-full max-w-sm gap-6">
          <InputGroup>
            <InputGroupAddon>
              <InputGroupText>$</InputGroupText>
            </InputGroupAddon>
            <InputGroupInput placeholder="0.00" />
            <InputGroupAddon align="inline-end">
              <InputGroupText>USD</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
          <InputGroup>
            <InputGroupAddon>
              <InputGroupText>https://</InputGroupText>
            </InputGroupAddon>
            <InputGroupInput placeholder="example.com" className="!pl-0.5" />
            <InputGroupAddon align="inline-end">
              <InputGroupText>.com</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
          <InputGroup>
            <InputGroupInput placeholder="Enter your username" />
            <InputGroupAddon align="inline-end">
              <InputGroupText>@company.com</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
          <InputGroup>
            <InputGroupTextarea placeholder="Enter your message" />
            <InputGroupAddon align="block-end">
              <InputGroupText className="text-muted-foreground text-xs">
                120 characters left
              </InputGroupText>
            </InputGroupAddon>
          </InputGroup>
        </div>
      </SubSection>
      <SubSection title="Button">
        <div className="grid w-full max-w-sm gap-6">
          <InputGroup>
            <InputGroupInput placeholder="https://x.com/shadcn" readOnly />
            <InputGroupAddon align="inline-end">
              <InputGroupButton aria-label="Copy" title="Copy" size="icon-xs">
                <Copy className="h-4 w-4" />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          <InputGroup>
            <InputGroupInput placeholder="Type to search..." />
            <InputGroupAddon align="inline-end">
              <InputGroupButton variant="secondary">Search</InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </div>
      </SubSection>
      <SubSection title="Tooltip">
        <div className="grid w-full max-w-sm gap-4">
          <InputGroup>
            <InputGroupInput placeholder="Enter password" type="password" />
            <InputGroupAddon align="inline-end">
              <Tooltip>
                <TooltipTrigger asChild>
                  <InputGroupButton variant="ghost" aria-label="Info" size="icon-xs">
                    <Info className="h-4 w-4" />
                  </InputGroupButton>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Password must be at least 8 characters</p>
                </TooltipContent>
              </Tooltip>
            </InputGroupAddon>
          </InputGroup>
          <InputGroup>
            <InputGroupInput placeholder="Your email address" />
            <InputGroupAddon align="inline-end">
              <Tooltip>
                <TooltipTrigger asChild>
                  <InputGroupButton variant="ghost" aria-label="Help" size="icon-xs">
                    <HelpCircle className="h-4 w-4" />
                  </InputGroupButton>
                </TooltipTrigger>
                <TooltipContent>
                  <p>We&apos;ll use this to send you notifications</p>
                </TooltipContent>
              </Tooltip>
            </InputGroupAddon>
          </InputGroup>
          <InputGroup>
            <InputGroupInput placeholder="Enter API key" />
            <Tooltip>
              <TooltipTrigger asChild>
                <InputGroupAddon>
                  <InputGroupButton variant="ghost" aria-label="Help" size="icon-xs">
                    <HelpCircle className="h-4 w-4" />
                  </InputGroupButton>
                </InputGroupAddon>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Click for help with API keys</p>
              </TooltipContent>
            </Tooltip>
          </InputGroup>
        </div>
      </SubSection>
      <SubSection title="Textarea">
        <div className="grid w-full max-w-md gap-4">
          <InputGroup>
            <InputGroupTextarea
              id="textarea-code"
              placeholder="console.log('Hello, world!');"
              className="min-h-[200px]"
            />
            <InputGroupAddon align="block-end" className="border-t">
              <InputGroupText>Line 1, Column 1</InputGroupText>
              <InputGroupButton size="sm" className="ml-auto" variant="default">
                Run <CornerDownLeft className="ml-1 h-3 w-3" />
              </InputGroupButton>
            </InputGroupAddon>
            <InputGroupAddon align="block-start" className="border-b">
              <InputGroupText className="font-mono font-medium">
                <Code className="mr-1 h-4 w-4" />
                script.js
              </InputGroupText>
              <InputGroupButton className="ml-auto" size="icon-xs">
                <RefreshCw className="h-4 w-4" />
              </InputGroupButton>
              <InputGroupButton variant="ghost" size="icon-xs">
                <Copy className="h-4 w-4" />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </div>
      </SubSection>
      <SubSection title="Spinner">
        <div className="grid w-full max-w-sm gap-4">
          <InputGroup data-disabled>
            <InputGroupInput placeholder="Searching..." disabled />
            <InputGroupAddon align="inline-end">
              <Spinner />
            </InputGroupAddon>
          </InputGroup>
          <InputGroup data-disabled>
            <InputGroupInput placeholder="Processing..." disabled />
            <InputGroupAddon>
              <Spinner />
            </InputGroupAddon>
          </InputGroup>
          <InputGroup data-disabled>
            <InputGroupInput placeholder="Saving changes..." disabled />
            <InputGroupAddon align="inline-end">
              <InputGroupText>Saving...</InputGroupText>
              <Spinner />
            </InputGroupAddon>
          </InputGroup>
          <InputGroup data-disabled>
            <InputGroupInput placeholder="Refreshing data..." disabled />
            <InputGroupAddon>
              <Loader2 className="h-4 w-4 animate-spin" />
            </InputGroupAddon>
            <InputGroupAddon align="inline-end">
              <InputGroupText className="text-muted-foreground">Please wait...</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
        </div>
      </SubSection>
      <SubSection title="Label">
        <div className="grid w-full max-w-sm gap-4">
          <InputGroup>
            <InputGroupInput id="ig-email" placeholder="shadcn" />
            <InputGroupAddon>
              <Label htmlFor="ig-email">@</Label>
            </InputGroupAddon>
          </InputGroup>
          <InputGroup>
            <InputGroupInput id="ig-email-2" placeholder="shadcn@vercel.com" />
            <InputGroupAddon align="block-start">
              <Label htmlFor="ig-email-2" className="text-foreground">
                Email
              </Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <InputGroupButton
                    variant="ghost"
                    aria-label="Help"
                    className="ml-auto rounded-full"
                    size="icon-xs"
                  >
                    <Info className="h-4 w-4" />
                  </InputGroupButton>
                </TooltipTrigger>
                <TooltipContent>
                  <p>We&apos;ll use this to send you notifications</p>
                </TooltipContent>
              </Tooltip>
            </InputGroupAddon>
          </InputGroup>
        </div>
      </SubSection>
      <SubSection title="Dropdown">
        <div className="grid w-full max-w-sm gap-4">
          <InputGroup>
            <InputGroupInput placeholder="Enter file name" />
            <InputGroupAddon align="inline-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <InputGroupButton variant="ghost" aria-label="More" size="icon-xs">
                    <MoreHorizontal className="h-4 w-4" />
                  </InputGroupButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem>Copy path</DropdownMenuItem>
                  <DropdownMenuItem>Open location</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </InputGroupAddon>
          </InputGroup>
          <InputGroup className="[--radius:1rem]">
            <InputGroupInput placeholder="Enter search query" />
            <InputGroupAddon align="inline-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <InputGroupButton variant="ghost" className="!pr-1.5 text-xs">
                    Search In... <ChevronDown className="ml-1 h-3 w-3" />
                  </InputGroupButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="[--radius:0.95rem]">
                  <DropdownMenuItem>Documentation</DropdownMenuItem>
                  <DropdownMenuItem>Blog Posts</DropdownMenuItem>
                  <DropdownMenuItem>Changelog</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </InputGroupAddon>
          </InputGroup>
        </div>
      </SubSection>
      <SubSection title="Button Group">
        <div className="grid w-full max-w-sm gap-6">
          <ButtonGroup>
            <ButtonGroupText asChild>
              <Label htmlFor="ig-url">https://</Label>
            </ButtonGroupText>
            <InputGroup>
              <InputGroupInput id="ig-url" />
              <InputGroupAddon align="inline-end">
                <Link2 className="h-4 w-4" />
              </InputGroupAddon>
            </InputGroup>
            <ButtonGroupText>.com</ButtonGroupText>
          </ButtonGroup>
        </div>
      </SubSection>
    </Section>
  );
}
