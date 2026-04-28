"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Section, SubSection } from "./helpers";

export function CalendarShowcase() {
  const [mounted, setMounted] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [dateRange, setDateRange] = React.useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: new Date(),
    to: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });
  const [calendarDropdown, setCalendarDropdown] = React.useState<
    "dropdown" | "dropdown-months" | "dropdown-years"
  >("dropdown");
  const [calendarDropdownDate, setCalendarDropdownDate] = React.useState<Date | undefined>(
    new Date(2025, 5, 12)
  );
  const [dobOpen, setDobOpen] = React.useState(false);
  const [dobDate, setDobDate] = React.useState<Date | undefined>(undefined);
  const [dateTimeOpen, setDateTimeOpen] = React.useState(false);
  const [dateTimeDate, setDateTimeDate] = React.useState<Date | undefined>(undefined);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Section
      title="10. Calendar"
      id="calendar"
      docUrl="https://ui.shadcn.com/docs/components/calendar"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <SubSection title="Single Selection">
          {mounted && (
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          )}
        </SubSection>
        <SubSection title="Range Selection">
          {mounted && (
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={(range) =>
                setDateRange(range as { from: Date | undefined; to: Date | undefined })
              }
              numberOfMonths={2}
              className="rounded-md border"
            />
          )}
        </SubSection>
      </div>
      <SubSection title="Month and Year Selector">
        <div className="flex max-w-xs flex-col gap-4">
          {mounted && (
            <Calendar
              mode="single"
              defaultMonth={calendarDropdownDate}
              selected={calendarDropdownDate}
              onSelect={setCalendarDropdownDate}
              captionLayout={calendarDropdown}
              className="rounded-lg border shadow-sm"
            />
          )}
          <div className="flex flex-col gap-3">
            <Label htmlFor="dropdown-select" className="px-1">
              Dropdown
            </Label>
            <Select
              value={calendarDropdown}
              onValueChange={(value) =>
                setCalendarDropdown(value as "dropdown" | "dropdown-months" | "dropdown-years")
              }
            >
              <SelectTrigger id="dropdown-select" className="w-full">
                <SelectValue placeholder="Dropdown" />
              </SelectTrigger>
              <SelectContent align="center">
                <SelectItem value="dropdown">Month and Year</SelectItem>
                <SelectItem value="dropdown-months">Month Only</SelectItem>
                <SelectItem value="dropdown-years">Year Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </SubSection>
      <SubSection title="Date of Birth Picker">
        <div className="flex flex-col gap-3">
          <Label htmlFor="dob-date" className="px-1">
            Date of birth
          </Label>
          <Popover open={dobOpen} onOpenChange={setDobOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" id="dob-date" className="w-48 justify-between font-normal">
                {dobDate ? dobDate.toLocaleDateString() : "Select date"}
                <ChevronDown />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
              <Calendar
                mode="single"
                selected={dobDate}
                captionLayout="dropdown"
                onSelect={(date) => {
                  setDobDate(date);
                  setDobOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
      </SubSection>
      <SubSection title="Date and Time Picker">
        <div className="flex gap-4">
          <div className="flex flex-col gap-3">
            <Label htmlFor="datetime-date" className="px-1">
              Date
            </Label>
            <Popover open={dateTimeOpen} onOpenChange={setDateTimeOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="datetime-date"
                  className="w-32 justify-between font-normal"
                >
                  {dateTimeDate ? dateTimeDate.toLocaleDateString() : "Select date"}
                  <ChevronDown />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateTimeDate}
                  captionLayout="dropdown"
                  onSelect={(date) => {
                    setDateTimeDate(date);
                    setDateTimeOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor="datetime-time" className="px-1">
              Time
            </Label>
            <Input
              type="time"
              id="datetime-time"
              step="1"
              defaultValue="10:30:00"
              className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            />
          </div>
        </div>
      </SubSection>
    </Section>
  );
}
