"use client";

import * as React from "react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Section, SubSection } from "./helpers";

export function DropdownMenuShowcase() {
  const [showNewDialog, setShowNewDialog] = React.useState(false);
  const [showShareDialog, setShowShareDialog] = React.useState(false);

  return (
    <Section
      title="23. Dropdown Menu"
      id="dropdown-menu"
      docUrl="https://ui.shadcn.com/docs/components/dropdown-menu"
    >
      <SubSection title="Dropdown Menu">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Open</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="start">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem>
                Profile
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                Billing
                <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                Settings
                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                Keyboard shortcuts
                <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem>Email</DropdownMenuItem>
                    <DropdownMenuItem>Message</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>More...</DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuItem>
                New Team
                <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>GitHub</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuItem disabled>API</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              Log out
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SubSection>
      <SubSection title="Dialog">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40" align="end">
            <DropdownMenuLabel>File Actions</DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem onSelect={() => setShowNewDialog(true)}>
                New File...
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setShowShareDialog(true)}>
                Share...
              </DropdownMenuItem>
              <DropdownMenuItem disabled>Download</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New File</DialogTitle>
              <DialogDescription>
                Provide a name for your new file. Click create when you&apos;re done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-3 pb-3">
              <Label htmlFor="dropdown-filename">File Name</Label>
              <Input id="dropdown-filename" name="filename" placeholder="document.txt" />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Share File</DialogTitle>
              <DialogDescription>
                Anyone with the link will be able to view this file.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-3">
              <div className="grid gap-3">
                <Label htmlFor="dropdown-email">Email Address</Label>
                <Input
                  id="dropdown-email"
                  name="email"
                  type="email"
                  placeholder="shadcn@vercel.com"
                  autoComplete="off"
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="dropdown-message">Message (Optional)</Label>
                <Textarea id="dropdown-message" name="message" placeholder="Check out this file" />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Send Invite</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SubSection>
    </Section>
  );
}
