"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Section, SubSection } from "./helpers";
import { frameworks, statuses } from "./data";

export function ComboboxShowcase() {
  const [comboboxOpen, setComboboxOpen] = React.useState(false);
  const [comboboxValue, setComboboxValue] = React.useState("");
  const [statusOpen, setStatusOpen] = React.useState(false);
  const [selectedStatus, setSelectedStatus] = React.useState<{
    value: string;
    label: string;
  } | null>(null);
  const [responsiveOpen, setResponsiveOpen] = React.useState(false);
  const [responsiveStatus, setResponsiveStatus] = React.useState<{
    value: string;
    label: string;
  } | null>(null);
  const isMobile = useIsMobile();

  return (
    <Section
      title="16. Combobox"
      id="combobox"
      docUrl="https://ui.shadcn.com/docs/components/combobox"
    >
      <SubSection title="Combobox">
        <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={comboboxOpen}
              className="w-[200px] justify-between"
            >
              {comboboxValue
                ? frameworks.find((f) => f.value === comboboxValue)?.label
                : "Select framework..."}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search framework..." className="h-9" />
              <CommandList>
                <CommandEmpty>No framework found.</CommandEmpty>
                <CommandGroup>
                  {frameworks.map((framework) => (
                    <CommandItem
                      key={framework.value}
                      value={framework.value}
                      onSelect={(currentValue) => {
                        setComboboxValue(currentValue === comboboxValue ? "" : currentValue);
                        setComboboxOpen(false);
                      }}
                    >
                      {framework.label}
                      <Check
                        className={cn(
                          "ml-auto",
                          comboboxValue === framework.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </SubSection>
      <SubSection title="Popover">
        <div className="flex items-center space-x-4">
          <p className="text-muted-foreground text-sm">Status</p>
          <Popover open={statusOpen} onOpenChange={setStatusOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[150px] justify-start">
                {selectedStatus ? <>{selectedStatus.label}</> : <>+ Set status</>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0" side="right" align="start">
              <Command>
                <CommandInput placeholder="Change status..." />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup>
                    {statuses.map((status) => (
                      <CommandItem
                        key={status.value}
                        value={status.value}
                        onSelect={(value) => {
                          setSelectedStatus(statuses.find((s) => s.value === value) || null);
                          setStatusOpen(false);
                        }}
                      >
                        {status.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </SubSection>
      <SubSection title="Responsive">
        {!isMobile ? (
          <Popover open={responsiveOpen} onOpenChange={setResponsiveOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[150px] justify-start">
                {responsiveStatus ? <>{responsiveStatus.label}</> : <>+ Set status</>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="start">
              <Command>
                <CommandInput placeholder="Filter status..." />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup>
                    {statuses.map((status) => (
                      <CommandItem
                        key={status.value}
                        value={status.value}
                        onSelect={(value) => {
                          setResponsiveStatus(statuses.find((s) => s.value === value) || null);
                          setResponsiveOpen(false);
                        }}
                      >
                        {status.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        ) : (
          <Drawer open={responsiveOpen} onOpenChange={setResponsiveOpen}>
            <DrawerTrigger asChild>
              <Button variant="outline" className="w-[150px] justify-start">
                {responsiveStatus ? <>{responsiveStatus.label}</> : <>+ Set status</>}
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <div className="mt-4 border-t">
                <Command>
                  <CommandInput placeholder="Filter status..." />
                  <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup>
                      {statuses.map((status) => (
                        <CommandItem
                          key={status.value}
                          value={status.value}
                          onSelect={(value) => {
                            setResponsiveStatus(statuses.find((s) => s.value === value) || null);
                            setResponsiveOpen(false);
                          }}
                        >
                          {status.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </div>
            </DrawerContent>
          </Drawer>
        )}
      </SubSection>
    </Section>
  );
}
