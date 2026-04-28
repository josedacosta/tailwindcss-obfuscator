"use client";

import * as React from "react";
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Section, SubSection } from "./helpers";
import { formatDateLong, isValidDate } from "./data";

export function DatePickerShowcase() {
  const [dobOpen, setDobOpen] = React.useState(false);
  const [dobDate, setDobDate] = React.useState<Date | undefined>(undefined);
  const [subscriptionDate, setSubscriptionDate] = React.useState<Date | undefined>(
    new Date("2025-06-01")
  );
  const [subscriptionMonth, setSubscriptionMonth] = React.useState<Date | undefined>(
    new Date("2025-06-01")
  );
  const [subscriptionValue, setSubscriptionValue] = React.useState("June 01, 2025");
  const [subscriptionOpen, setSubscriptionOpen] = React.useState(false);
  const [dateTimeOpen, setDateTimeOpen] = React.useState(false);
  const [dateTimeDate, setDateTimeDate] = React.useState<Date | undefined>(undefined);

  return (
    <Section
      title="20. Date Picker"
      id="date-picker"
      docUrl="https://ui.shadcn.com/docs/components/date-picker"
    >
      <SubSection title="Date Picker">
        <div className="flex flex-col gap-3">
          <Label htmlFor="date-picker-basic" className="px-1">
            Date of birth
          </Label>
          <Popover open={dobOpen} onOpenChange={setDobOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="date-picker-basic"
                className="w-48 justify-between font-normal"
              >
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
      <SubSection title="Picker with Input">
        <div className="flex flex-col gap-3">
          <Label htmlFor="subscription-date" className="px-1">
            Subscription Date
          </Label>
          <div className="relative flex gap-2">
            <Input
              id="subscription-date"
              value={subscriptionValue}
              placeholder="June 01, 2025"
              className="bg-background pr-10"
              onChange={(e) => {
                const date = new Date(e.target.value);
                setSubscriptionValue(e.target.value);
                if (isValidDate(date)) {
                  setSubscriptionDate(date);
                  setSubscriptionMonth(date);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setSubscriptionOpen(true);
                }
              }}
            />
            <Popover open={subscriptionOpen} onOpenChange={setSubscriptionOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="absolute right-2 top-1/2 size-6 -translate-y-1/2"
                >
                  <CalendarIcon className="size-3.5" />
                  <span className="sr-only">Select date</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto overflow-hidden p-0"
                align="end"
                alignOffset={-8}
                sideOffset={10}
              >
                <Calendar
                  mode="single"
                  selected={subscriptionDate}
                  captionLayout="dropdown"
                  month={subscriptionMonth}
                  onMonthChange={setSubscriptionMonth}
                  onSelect={(date) => {
                    setSubscriptionDate(date);
                    setSubscriptionValue(formatDateLong(date));
                    setSubscriptionOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </SubSection>
      <SubSection title="Date and Time Picker">
        <div className="flex gap-4">
          <div className="flex flex-col gap-3">
            <Label htmlFor="datetime-picker" className="px-1">
              Date
            </Label>
            <Popover open={dateTimeOpen} onOpenChange={setDateTimeOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="datetime-picker"
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
            <Label htmlFor="time-picker" className="px-1">
              Time
            </Label>
            <Input
              type="time"
              id="time-picker"
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
