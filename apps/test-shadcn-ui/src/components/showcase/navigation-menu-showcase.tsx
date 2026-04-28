"use client";

import * as React from "react";
import { CheckCircle2, Circle, CircleHelp } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Section, SubSection } from "./helpers";

export function NavigationMenuShowcase() {
  return (
    <Section
      title="36. Navigation Menu"
      id="navigation-menu"
      docUrl="https://ui.shadcn.com/docs/components/navigation-menu"
    >
      <SubSection title="Navigation Menu">
        <NavigationMenu>
          <NavigationMenuList className="flex-wrap">
            <NavigationMenuItem>
              <NavigationMenuTrigger>Home</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <a
                        className="from-muted/50 to-muted flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b p-4 no-underline outline-none transition-all duration-200 focus:shadow-md md:p-6"
                        href="#"
                      >
                        <div className="mb-2 text-lg font-medium sm:mt-4">shadcn/ui</div>
                        <p className="text-muted-foreground text-sm leading-tight">
                          Beautifully designed components built with Tailwind CSS.
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <a className="hover:bg-accent block rounded-md p-3" href="#">
                        <div className="text-sm font-medium leading-none">Introduction</div>
                        <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                          Re-usable components built using Radix UI and Tailwind CSS.
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <a className="hover:bg-accent block rounded-md p-3" href="#">
                        <div className="text-sm font-medium leading-none">Installation</div>
                        <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                          How to install dependencies and structure your app.
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <a className="hover:bg-accent block rounded-md p-3" href="#">
                        <div className="text-sm font-medium leading-none">Typography</div>
                        <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                          Styles for headings, paragraphs, lists...etc
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Components</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-2 sm:w-[400px] md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  {[
                    {
                      title: "Alert Dialog",
                      description:
                        "A modal dialog that interrupts the user with important content.",
                    },
                    {
                      title: "Hover Card",
                      description: "For sighted users to preview content available behind a link.",
                    },
                    {
                      title: "Progress",
                      description:
                        "Displays an indicator showing the completion progress of a task.",
                    },
                    {
                      title: "Scroll-area",
                      description: "Visually or semantically separates content.",
                    },
                    {
                      title: "Tabs",
                      description: "A set of layered sections of content—known as tab panels.",
                    },
                    {
                      title: "Tooltip",
                      description: "A popup that displays information related to an element.",
                    },
                  ].map((component) => (
                    <li key={component.title}>
                      <NavigationMenuLink asChild>
                        <a className="hover:bg-accent block rounded-md p-3" href="#">
                          <div className="text-sm font-medium leading-none">{component.title}</div>
                          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                            {component.description}
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <a href="#">Docs</a>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>List</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[300px] gap-4">
                  <li>
                    <NavigationMenuLink asChild>
                      <a className="hover:bg-accent block rounded-md p-3" href="#">
                        <div className="font-medium">Components</div>
                        <div className="text-muted-foreground">
                          Browse all components in the library.
                        </div>
                      </a>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <a className="hover:bg-accent block rounded-md p-3" href="#">
                        <div className="font-medium">Documentation</div>
                        <div className="text-muted-foreground">Learn how to use the library.</div>
                      </a>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <a className="hover:bg-accent block rounded-md p-3" href="#">
                        <div className="font-medium">Blog</div>
                        <div className="text-muted-foreground">Read our latest blog posts.</div>
                      </a>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Simple</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[200px] gap-4">
                  <li>
                    <NavigationMenuLink asChild>
                      <a className="hover:bg-accent block rounded-md p-3" href="#">
                        Components
                      </a>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <a className="hover:bg-accent block rounded-md p-3" href="#">
                        Documentation
                      </a>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <a className="hover:bg-accent block rounded-md p-3" href="#">
                        Blocks
                      </a>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>With Icon</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[200px] gap-4">
                  <li>
                    <NavigationMenuLink asChild>
                      <a
                        className="hover:bg-accent flex items-center gap-2 rounded-md p-3"
                        href="#"
                      >
                        <CircleHelp className="h-4 w-4" />
                        Backlog
                      </a>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <a
                        className="hover:bg-accent flex items-center gap-2 rounded-md p-3"
                        href="#"
                      >
                        <Circle className="h-4 w-4" />
                        To Do
                      </a>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <a
                        className="hover:bg-accent flex items-center gap-2 rounded-md p-3"
                        href="#"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Done
                      </a>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </SubSection>
    </Section>
  );
}
