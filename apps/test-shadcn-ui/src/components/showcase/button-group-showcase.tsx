"use client";

import * as React from "react";
import {
  ChevronDown,
  VolumeOff,
  Check,
  AlertTriangle,
  UserRoundX,
  Share,
  Copy,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Search,
  MoreHorizontal,
  MailCheck,
  Archive,
  Clock,
  CalendarPlus,
  ListFilter,
  Tag,
  Bot,
  Plus,
  AudioLines,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Section, SubSection } from "./helpers";

export function ButtonGroupShowcase() {
  const [buttonGroupLabel, setButtonGroupLabel] = React.useState("personal");
  const [voiceEnabled, setVoiceEnabled] = React.useState(false);

  return (
    <Section
      title="9. Button Group"
      id="button-group"
      docUrl="https://ui.shadcn.com/docs/components/button-group"
    >
      <SubSection title="Dropdown Menu">
        <ButtonGroup>
          <Button variant="outline">Follow</Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="!pl-2">
                <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="[--radius:1rem]">
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <VolumeOff className="mr-2 h-4 w-4" />
                  Mute Conversation
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Check className="mr-2 h-4 w-4" />
                  Mark as Read
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Report Conversation
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <UserRoundX className="mr-2 h-4 w-4" />
                  Block User
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share className="mr-2 h-4 w-4" />
                  Share Conversation
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Conversation
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Conversation
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </ButtonGroup>
      </SubSection>
      <SubSection title="Nested">
        <ButtonGroup>
          <ButtonGroup>
            <Button variant="outline" size="sm">
              1
            </Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <Button variant="outline" size="sm">
              3
            </Button>
            <Button variant="outline" size="sm">
              4
            </Button>
            <Button variant="outline" size="sm">
              5
            </Button>
          </ButtonGroup>
          <ButtonGroup>
            <Button variant="outline" size="sm" aria-label="Previous">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" aria-label="Next">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </ButtonGroup>
        </ButtonGroup>
      </SubSection>
      <SubSection title="With Input">
        <ButtonGroup>
          <Input placeholder="Search..." />
          <Button variant="outline" aria-label="Search">
            <Search />
          </Button>
        </ButtonGroup>
      </SubSection>
      <SubSection title="With Dropdown Menu">
        <ButtonGroup>
          <ButtonGroup className="hidden sm:flex">
            <Button variant="outline" size="icon" aria-label="Go Back">
              <ArrowLeft />
            </Button>
          </ButtonGroup>
          <ButtonGroup>
            <Button variant="outline">Archive</Button>
            <Button variant="outline">Report</Button>
          </ButtonGroup>
          <ButtonGroup>
            <Button variant="outline">Snooze</Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" aria-label="More Options">
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <MailCheck className="mr-2 h-4 w-4" />
                    Mark as Read
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Archive className="mr-2 h-4 w-4" />
                    Archive
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Clock className="mr-2 h-4 w-4" />
                    Snooze
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <CalendarPlus className="mr-2 h-4 w-4" />
                    Add to Calendar
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <ListFilter className="mr-2 h-4 w-4" />
                    Add to List
                  </DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <Tag className="mr-2 h-4 w-4" />
                      Label As...
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      <DropdownMenuRadioGroup
                        value={buttonGroupLabel}
                        onValueChange={setButtonGroupLabel}
                      >
                        <DropdownMenuRadioItem value="personal">Personal</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="work">Work</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="other">Other</DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Trash
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </ButtonGroup>
        </ButtonGroup>
      </SubSection>
      <SubSection title="With Popover">
        <ButtonGroup>
          <Button variant="outline">
            <Bot className="mr-2 h-4 w-4" /> Copilot
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Open Popover">
                <ChevronDown />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="rounded-xl p-0 text-sm">
              <div className="px-4 py-3">
                <div className="text-sm font-medium">Agent Tasks</div>
              </div>
              <Separator />
              <div className="p-4 text-sm">
                <Textarea
                  placeholder="Describe your task in natural language."
                  className="mb-4 resize-none"
                />
                <p className="mb-2 font-medium">Start a new task with Copilot</p>
                <p className="text-muted-foreground">
                  Describe your task in natural language. Copilot will work in the background and
                  open a pull request for your review.
                </p>
              </div>
            </PopoverContent>
          </Popover>
        </ButtonGroup>
      </SubSection>
      <SubSection title="Sizes">
        <div className="flex flex-col items-start gap-4">
          <ButtonGroup>
            <Button variant="outline" size="sm">
              Small
            </Button>
            <Button variant="outline" size="sm">
              Button
            </Button>
            <Button variant="outline" size="sm">
              Group
            </Button>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </ButtonGroup>
          <ButtonGroup>
            <Button variant="outline">Default</Button>
            <Button variant="outline">Button</Button>
            <Button variant="outline">Group</Button>
            <Button variant="outline" size="icon">
              <Plus />
            </Button>
          </ButtonGroup>
          <ButtonGroup>
            <Button variant="outline" size="lg">
              Large
            </Button>
            <Button variant="outline" size="lg">
              Button
            </Button>
            <Button variant="outline" size="lg">
              Group
            </Button>
            <Button variant="outline" size="lg">
              <Plus className="h-5 w-5" />
            </Button>
          </ButtonGroup>
        </div>
      </SubSection>
      <SubSection title="With Input Group">
        <ButtonGroup className="[--radius:9999rem]">
          <ButtonGroup>
            <Button variant="outline" size="icon">
              <Plus />
            </Button>
          </ButtonGroup>
          <ButtonGroup>
            <InputGroup>
              <InputGroupInput
                placeholder={voiceEnabled ? "Record and send audio..." : "Send a message..."}
                disabled={voiceEnabled}
              />
              <InputGroupAddon align="inline-end">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InputGroupButton
                      onClick={() => setVoiceEnabled(!voiceEnabled)}
                      size="icon-xs"
                      data-active={voiceEnabled}
                      className="data-[active=true]:bg-orange-100 data-[active=true]:text-orange-700 dark:data-[active=true]:bg-orange-800 dark:data-[active=true]:text-orange-100"
                      aria-pressed={voiceEnabled}
                    >
                      <AudioLines />
                    </InputGroupButton>
                  </TooltipTrigger>
                  <TooltipContent>Voice Mode</TooltipContent>
                </Tooltip>
              </InputGroupAddon>
            </InputGroup>
          </ButtonGroup>
        </ButtonGroup>
      </SubSection>
    </Section>
  );
}
