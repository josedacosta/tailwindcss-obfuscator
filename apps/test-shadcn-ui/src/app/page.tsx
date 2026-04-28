"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { componentsList } from "@/components/showcase/data";

// Import all showcase components
import { AccordionShowcase } from "@/components/showcase/accordion-showcase";
import { AlertShowcase } from "@/components/showcase/alert-showcase";
import { AlertDialogShowcase } from "@/components/showcase/alert-dialog-showcase";
import { AspectRatioShowcase } from "@/components/showcase/aspect-ratio-showcase";
import { AvatarShowcase } from "@/components/showcase/avatar-showcase";
import { BadgeShowcase } from "@/components/showcase/badge-showcase";
import { BreadcrumbShowcase } from "@/components/showcase/breadcrumb-showcase";
import { ButtonShowcase } from "@/components/showcase/button-showcase";
import { ButtonGroupShowcase } from "@/components/showcase/button-group-showcase";
import { CalendarShowcase } from "@/components/showcase/calendar-showcase";
import { CardShowcase } from "@/components/showcase/card-showcase";
import { CarouselShowcase } from "@/components/showcase/carousel-showcase";
import { ChartShowcase } from "@/components/showcase/chart-showcase";
import { CheckboxShowcase } from "@/components/showcase/checkbox-showcase";
import { CollapsibleShowcase } from "@/components/showcase/collapsible-showcase";
import { ComboboxShowcase } from "@/components/showcase/combobox-showcase";
import { CommandShowcase } from "@/components/showcase/command-showcase";
import { ContextMenuShowcase } from "@/components/showcase/context-menu-showcase";
import { DataTableShowcase } from "@/components/showcase/data-table-showcase";
import { DatePickerShowcase } from "@/components/showcase/date-picker-showcase";
import { DialogShowcase } from "@/components/showcase/dialog-showcase";
import { DrawerShowcase } from "@/components/showcase/drawer-showcase";
import { DropdownMenuShowcase } from "@/components/showcase/dropdown-menu-showcase";
import { EmptyShowcase } from "@/components/showcase/empty-showcase";
import { FieldShowcase } from "@/components/showcase/field-showcase";
import { FormShowcase } from "@/components/showcase/form-showcase";
import { HoverCardShowcase } from "@/components/showcase/hover-card-showcase";
import { InputShowcase } from "@/components/showcase/input-showcase";
import { InputGroupShowcase } from "@/components/showcase/input-group-showcase";
import { InputOTPShowcase } from "@/components/showcase/input-otp-showcase";
import { ItemShowcase } from "@/components/showcase/item-showcase";
import { KbdShowcase } from "@/components/showcase/kbd-showcase";
import { LabelShowcase } from "@/components/showcase/label-showcase";
import { MenubarShowcase } from "@/components/showcase/menubar-showcase";
import { NativeSelectShowcase } from "@/components/showcase/native-select-showcase";
import { NavigationMenuShowcase } from "@/components/showcase/navigation-menu-showcase";
import { PaginationShowcase } from "@/components/showcase/pagination-showcase";
import { PopoverShowcase } from "@/components/showcase/popover-showcase";
import { ProgressShowcase } from "@/components/showcase/progress-showcase";
import { RadioGroupShowcase } from "@/components/showcase/radio-group-showcase";
import { ResizableShowcase } from "@/components/showcase/resizable-showcase";
import { ScrollAreaShowcase } from "@/components/showcase/scroll-area-showcase";
import { SelectShowcase } from "@/components/showcase/select-showcase";
import { SeparatorShowcase } from "@/components/showcase/separator-showcase";
import { SheetShowcase } from "@/components/showcase/sheet-showcase";
import { SidebarShowcase } from "@/components/showcase/sidebar-showcase";
import { SkeletonShowcase } from "@/components/showcase/skeleton-showcase";
import { SliderShowcase } from "@/components/showcase/slider-showcase";
import { SonnerShowcase } from "@/components/showcase/sonner-showcase";
import { SpinnerShowcase } from "@/components/showcase/spinner-showcase";
import { SwitchShowcase } from "@/components/showcase/switch-showcase";
import { TableShowcase } from "@/components/showcase/table-showcase";
import { TabsShowcase } from "@/components/showcase/tabs-showcase";
import { TextareaShowcase } from "@/components/showcase/textarea-showcase";
import { ToastShowcase } from "@/components/showcase/toast-showcase";
import { ToggleShowcase } from "@/components/showcase/toggle-showcase";
import { ToggleGroupShowcase } from "@/components/showcase/toggle-group-showcase";
import { TooltipShowcase } from "@/components/showcase/tooltip-showcase";
import { TypographyShowcase } from "@/components/showcase/typography-showcase";

export default function ShowcasePage() {
  return (
    <TooltipProvider>
      <div className="bg-background min-h-screen">
        {/* Header */}
        <div className="bg-muted/50 border-b py-8">
          <div className="mx-auto max-w-7xl px-8">
            <h1 className="text-foreground mb-2 text-4xl font-bold">
              shadcn/ui Components - Complete Showcase
            </h1>
            <p className="text-muted-foreground mb-4 text-lg">
              All {componentsList.length} components with variations (matching official
              documentation as of December 8, 2025)
            </p>
            <div className="flex flex-wrap gap-2">
              {componentsList.map((name) => (
                <a
                  key={name}
                  href={`#${name.toLowerCase().replace(/\s+/g, "-")}`}
                  className="bg-primary/10 hover:bg-primary/20 text-primary rounded-md px-2 py-1 text-xs transition-colors"
                >
                  {name}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl p-8">
          {/* 1-10 */}
          <AccordionShowcase />
          <AlertShowcase />
          <AlertDialogShowcase />
          <AspectRatioShowcase />
          <AvatarShowcase />
          <BadgeShowcase />
          <BreadcrumbShowcase />
          <ButtonShowcase />
          <ButtonGroupShowcase />
          <CalendarShowcase />

          {/* 11-20 */}
          <CardShowcase />
          <CarouselShowcase />
          <ChartShowcase />
          <CheckboxShowcase />
          <CollapsibleShowcase />
          <ComboboxShowcase />
          <CommandShowcase />
          <ContextMenuShowcase />
          <DataTableShowcase />
          <DatePickerShowcase />

          {/* 21-30 */}
          <DialogShowcase />
          <DrawerShowcase />
          <DropdownMenuShowcase />
          <EmptyShowcase />
          <FieldShowcase />
          <FormShowcase />
          <HoverCardShowcase />
          <InputShowcase />
          <InputGroupShowcase />
          <InputOTPShowcase />

          {/* 31-40 */}
          <ItemShowcase />
          <KbdShowcase />
          <LabelShowcase />
          <MenubarShowcase />
          <NativeSelectShowcase />
          <NavigationMenuShowcase />
          <PaginationShowcase />
          <PopoverShowcase />
          <ProgressShowcase />
          <RadioGroupShowcase />

          {/* 41-50 */}
          <ResizableShowcase />
          <ScrollAreaShowcase />
          <SelectShowcase />
          <SeparatorShowcase />
          <SheetShowcase />
          <SidebarShowcase />
          <SkeletonShowcase />
          <SliderShowcase />
          <SonnerShowcase />
          <SpinnerShowcase />

          {/* 51-59 */}
          <SwitchShowcase />
          <TableShowcase />
          <TabsShowcase />
          <TextareaShowcase />
          <ToastShowcase />
          <ToggleShowcase />
          <ToggleGroupShowcase />
          <TooltipShowcase />
          <TypographyShowcase />
        </div>

        <Toaster />
      </div>
    </TooltipProvider>
  );
}
