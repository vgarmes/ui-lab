"use client";

import * as React from "react";
import { CalendarIcon, ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";
import { DateRange } from "react-day-picker";
import { setDate, subHours } from "date-fns";

function formatDate(date: Date | undefined) {
  if (!date) {
    return "";
  }
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false;
  }
  return !isNaN(date.getTime());
}

function formatTime(date: Date | undefined) {
  if (!date) {
    return "";
  }

  return date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
}

export function PeriodPicker() {
  const [open, setOpen] = React.useState(false);
  const [dateRange, setDateRange] = React.useState<DateRange>(() => {
    const now = new Date();
    return {
      from: subHours(now, 12),
      to: new Date(),
    };
  });

  const [startValue, setStartValue] = React.useState(
    formatDate(dateRange.from)
  );

  const [startTime, setStartTime] = React.useState(formatTime(dateRange.to));

  const [endValue, setEndValue] = React.useState(formatDate(dateRange.from));

  const [endTime, setEndTime] = React.useState(formatTime(dateRange.to));

  return (
    <div className="inline-flex rounded-md shadow-xs rtl:space-x-reverse">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            className="rounded-none border-r-0 shadow-none rounded-s-md focus-visible:z-10"
            variant="outline"
          >
            <CalendarIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[280px] overflow-hidden p-0 divide-y"
          align="start"
        >
          <Calendar
            mode="range"
            selected={dateRange}
            captionLayout="dropdown"
            onSelect={(range) => {
              if (range === undefined) return;
              if (dateRange.to !== undefined) {
                setDateRange({ from: range.to, to: undefined });
              } else {
                setDateRange(range);
              }
            }}
            className="w-full"
          />
          <div className="py-2.5 px-3 space-y-2">
            <div className="flex flex-col">
              <span className="text-muted-foreground text-xs mb-1 ">Start</span>
              <div className="flex items-center gap-2">
                <Input
                  id="date"
                  value={startValue}
                  placeholder="June 01, 2025"
                  className="bg-background"
                  onChange={(e) => {
                    const date = new Date(e.target.value);
                    setStartValue(e.target.value);
                    if (isValidDate(date)) {
                      setDateRange({ ...dateRange, from: date });
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      setOpen(true);
                    }
                  }}
                />
                <Input
                  type="time"
                  id="time-picker"
                  value={startTime}
                  onChange={(e) => {
                    setStartTime(e.target.value);
                  }}
                  className="bg-background w-24 shrink-0 appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-muted-foreground text-xs mb-1 ">End</span>
              <div className="flex items-center gap-2">
                <Input
                  id="date"
                  value={endValue}
                  placeholder="June 01, 2025"
                  className="bg-background"
                  onChange={(e) => {
                    const date = new Date(e.target.value);
                    setEndValue(e.target.value);
                    if (isValidDate(date)) {
                      setDateRange({ ...dateRange, from: date });
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      setOpen(true);
                    }
                  }}
                />
                <Input
                  type="time"
                  id="time-picker"
                  value={startTime}
                  onChange={(e) => {
                    setEndTime(e.target.value);
                  }}
                  className="bg-background w-24 shrink-0 appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                />
              </div>
            </div>
            <Button variant="outline" className="w-full" size="sm">
              Apply ↵
            </Button>
          </div>
        </PopoverContent>
      </Popover>
      <Select>
        <SelectTrigger className="w-[180px] rounded-none shadow-none rounded-e-md focus-visible:z-10">
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="apple">Last hour</SelectItem>
            <SelectItem value="banana">Last 6 hours</SelectItem>
            <SelectItem value="blueberry">Last 24 hours</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectItem value="grapes">Last 3 days</SelectItem>
            <SelectItem value="pineapple">Last 7 days</SelectItem>
            <SelectItem value="grapes">Last 30 days</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
