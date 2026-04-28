"use client";

import * as React from "react";
import {
  AudioWaveform,
  BadgeCheck,
  Bell,
  BookOpen,
  Bot,
  ChevronRight,
  ChevronsUpDown,
  Command as CommandIcon,
  CreditCard,
  Folder,
  Forward,
  Frame,
  GalleryVerticalEnd,
  LogOut,
  Map,
  MoreHorizontal,
  PieChart,
  Plus,
  Settings2,
  Sparkles,
  SquareTerminal,
  Trash2,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Section, SubSection } from "./helpers";

export function SidebarShowcase() {
  return (
    <Section
      title="46. Sidebar"
      id="sidebar"
      docUrl="https://ui.shadcn.com/docs/components/sidebar"
    >
      <SubSection title="Full Sidebar with SidebarProvider">
        <p className="text-muted-foreground mb-4 text-sm">
          Complete sidebar with team switcher, collapsible navigation, projects, user menu, and
          breadcrumbs.
        </p>
        <div className="h-[600px] overflow-hidden rounded-lg border">
          <SidebarProvider defaultOpen={true}>
            <Sidebar collapsible="none">
              <SidebarHeader>
                {/* Team Switcher */}
                <SidebarMenu>
                  <SidebarMenuItem>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                          size="lg"
                          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                            <GalleryVerticalEnd className="size-4" />
                          </div>
                          <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-medium">Acme Inc</span>
                            <span className="truncate text-xs">Enterprise</span>
                          </div>
                          <ChevronsUpDown className="ml-auto" />
                        </SidebarMenuButton>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        align="start"
                        side="right"
                        sideOffset={4}
                      >
                        <DropdownMenuLabel className="text-muted-foreground text-xs">
                          Teams
                        </DropdownMenuLabel>
                        <DropdownMenuItem className="gap-2 p-2">
                          <div className="flex size-6 items-center justify-center rounded-md border">
                            <GalleryVerticalEnd className="size-3.5 shrink-0" />
                          </div>
                          Acme Inc
                          <DropdownMenuShortcut>⌘1</DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 p-2">
                          <div className="flex size-6 items-center justify-center rounded-md border">
                            <AudioWaveform className="size-3.5 shrink-0" />
                          </div>
                          Acme Corp.
                          <DropdownMenuShortcut>⌘2</DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 p-2">
                          <div className="flex size-6 items-center justify-center rounded-md border">
                            <CommandIcon className="size-3.5 shrink-0" />
                          </div>
                          Evil Corp.
                          <DropdownMenuShortcut>⌘3</DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2 p-2">
                          <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                            <Plus className="size-4" />
                          </div>
                          <div className="text-muted-foreground font-medium">Add team</div>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarHeader>
              <SidebarContent>
                {/* Platform Navigation */}
                <SidebarGroup>
                  <SidebarGroupLabel>Platform</SidebarGroupLabel>
                  <SidebarMenu>
                    <Collapsible asChild defaultOpen className="group/collapsible">
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton tooltip="Playground">
                            <SquareTerminal />
                            <span>Playground</span>
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            <SidebarMenuSubItem>
                              <SidebarMenuSubButton asChild>
                                <a href="#">History</a>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                            <SidebarMenuSubItem>
                              <SidebarMenuSubButton asChild>
                                <a href="#">Starred</a>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                            <SidebarMenuSubItem>
                              <SidebarMenuSubButton asChild>
                                <a href="#">Settings</a>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                    <Collapsible asChild className="group/collapsible">
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton tooltip="Models">
                            <Bot />
                            <span>Models</span>
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            <SidebarMenuSubItem>
                              <SidebarMenuSubButton asChild>
                                <a href="#">Genesis</a>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                            <SidebarMenuSubItem>
                              <SidebarMenuSubButton asChild>
                                <a href="#">Explorer</a>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                            <SidebarMenuSubItem>
                              <SidebarMenuSubButton asChild>
                                <a href="#">Quantum</a>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                    <Collapsible asChild className="group/collapsible">
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton tooltip="Documentation">
                            <BookOpen />
                            <span>Documentation</span>
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            <SidebarMenuSubItem>
                              <SidebarMenuSubButton asChild>
                                <a href="#">Introduction</a>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                            <SidebarMenuSubItem>
                              <SidebarMenuSubButton asChild>
                                <a href="#">Get Started</a>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                            <SidebarMenuSubItem>
                              <SidebarMenuSubButton asChild>
                                <a href="#">Tutorials</a>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                    <Collapsible asChild className="group/collapsible">
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton tooltip="Settings">
                            <Settings2 />
                            <span>Settings</span>
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            <SidebarMenuSubItem>
                              <SidebarMenuSubButton asChild>
                                <a href="#">General</a>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                            <SidebarMenuSubItem>
                              <SidebarMenuSubButton asChild>
                                <a href="#">Team</a>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                            <SidebarMenuSubItem>
                              <SidebarMenuSubButton asChild>
                                <a href="#">Billing</a>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  </SidebarMenu>
                </SidebarGroup>
                {/* Projects */}
                <SidebarGroup className="group-data-[collapsible=icon]:hidden">
                  <SidebarGroupLabel>Projects</SidebarGroupLabel>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <a href="#">
                          <Frame className="size-4" />
                          <span>Design Engineering</span>
                        </a>
                      </SidebarMenuButton>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <SidebarMenuAction showOnHover>
                            <MoreHorizontal />
                            <span className="sr-only">More</span>
                          </SidebarMenuAction>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-48 rounded-lg" side="right" align="start">
                          <DropdownMenuItem>
                            <Folder className="text-muted-foreground mr-2 size-4" />
                            View Project
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Forward className="text-muted-foreground mr-2 size-4" />
                            Share Project
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Trash2 className="text-muted-foreground mr-2 size-4" />
                            Delete Project
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <a href="#">
                          <PieChart className="size-4" />
                          <span>Sales & Marketing</span>
                        </a>
                      </SidebarMenuButton>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <SidebarMenuAction showOnHover>
                            <MoreHorizontal />
                            <span className="sr-only">More</span>
                          </SidebarMenuAction>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-48 rounded-lg" side="right" align="start">
                          <DropdownMenuItem>
                            <Folder className="text-muted-foreground mr-2 size-4" />
                            View Project
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Forward className="text-muted-foreground mr-2 size-4" />
                            Share Project
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Trash2 className="text-muted-foreground mr-2 size-4" />
                            Delete Project
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <a href="#">
                          <Map className="size-4" />
                          <span>Travel</span>
                        </a>
                      </SidebarMenuButton>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <SidebarMenuAction showOnHover>
                            <MoreHorizontal />
                            <span className="sr-only">More</span>
                          </SidebarMenuAction>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-48 rounded-lg" side="right" align="start">
                          <DropdownMenuItem>
                            <Folder className="text-muted-foreground mr-2 size-4" />
                            View Project
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Forward className="text-muted-foreground mr-2 size-4" />
                            Share Project
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Trash2 className="text-muted-foreground mr-2 size-4" />
                            Delete Project
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton className="text-sidebar-foreground/70">
                        <MoreHorizontal className="text-sidebar-foreground/70" />
                        <span>More</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroup>
              </SidebarContent>
              <SidebarFooter>
                {/* User Menu */}
                <SidebarMenu>
                  <SidebarMenuItem>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                          size="lg"
                          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                          <Avatar className="h-8 w-8 rounded-lg">
                            <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
                            <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                          </Avatar>
                          <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-medium">shadcn</span>
                            <span className="truncate text-xs">m@example.com</span>
                          </div>
                          <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        side="right"
                        align="end"
                        sideOffset={4}
                      >
                        <DropdownMenuLabel className="p-0 font-normal">
                          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                            <Avatar className="h-8 w-8 rounded-lg">
                              <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
                              <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                              <span className="truncate font-medium">shadcn</span>
                              <span className="truncate text-xs">m@example.com</span>
                            </div>
                          </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                          <DropdownMenuItem>
                            <Sparkles className="mr-2 size-4" />
                            Upgrade to Pro
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                          <DropdownMenuItem>
                            <BadgeCheck className="mr-2 size-4" />
                            Account
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <CreditCard className="mr-2 size-4" />
                            Billing
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Bell className="mr-2 size-4" />
                            Notifications
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <LogOut className="mr-2 size-4" />
                          Log out
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarFooter>
              <SidebarRail />
            </Sidebar>
            <SidebarInset>
              <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator
                  orientation="vertical"
                  className="mr-2 data-[orientation=vertical]:h-4"
                />
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href="#">Building Your Application</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </header>
              <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                  <div className="bg-muted/50 aspect-video rounded-xl" />
                  <div className="bg-muted/50 aspect-video rounded-xl" />
                  <div className="bg-muted/50 aspect-video rounded-xl" />
                </div>
                <div className="bg-muted/50 min-h-[200px] flex-1 rounded-xl" />
              </div>
            </SidebarInset>
          </SidebarProvider>
        </div>
      </SubSection>
    </Section>
  );
}
