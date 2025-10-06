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
import { format, isSameDay, isSameSecond, setDate, subHours } from "date-fns";
import { cn } from "@/lib/utils";

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

export interface Preset {
  period: string;
  start: Date;
  end: Date;
  text: string;
}

interface Props {
  initialValue: DateRange;
  onSubmit: (range: DateRange) => void;
  presets: Preset[];
}

function isValidRange(
  range: DateRange | undefined
): range is { from: Date; to: Date } {
  return range?.from !== undefined && range.to !== undefined;
}

const PeriodPicker: React.FC<Props> = ({ initialValue, onSubmit, presets }) => {
  const [open, setOpen] = React.useState(false);

  const [value, setValue] = React.useState<DateRange>(initialValue);

  const selectedPreset = presets.find(
    (preset) =>
      initialValue.from !== undefined &&
      isSameSecond(preset.start, initialValue.from) &&
      initialValue.to !== undefined &&
      isSameSecond(preset.end, initialValue.to)
  );

  const isPreset = selectedPreset !== undefined;

  return (
    <div
      className="inline-flex rounded-md shadow-xs rtl:space-x-reverse w-auto"
      style={{ "--width": "164px" }}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            data-active={!isPreset && isValidRange(value)}
            className={cn(
              "transition-none justify-center rounded-none border-r-0 shadow-none rounded-s-md focus-visible:z-10 w-9 has-[>svg]:px-0 py-0",
              "data-[active=true]:px-3 data-[active=true]:py-2 data-[active=true]:w-(--width) data-[active=true]:justify-start data-[active=true]:*:data-[slot=range-value]:inline-block"
            )}
            variant="outline"
          >
            <CalendarIcon />

            <span data-slot="range-value" className="truncate hidden">
              {isValidRange(value) &&
                `${format(value.from, "MMM d")} - ${format(
                  value.to,
                  "MMM dd"
                )}`}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[280px] overflow-hidden p-0 divide-y"
          align="start"
        >
          <Calendar
            autoFocus
            mode="range"
            selected={value}
            onSelect={(range) => {
              if (range === undefined) return;
              if (value?.to === undefined) {
                setValue(range);
                if (isValidRange(range)) {
                  onSubmit(range);
                  setOpen(false);
                }
              } else {
                // new selection
                const isEndChange =
                  range.to !== undefined && !isSameDay(value.to, range.to);
                setValue({
                  from: isEndChange ? range.to : range.from,
                  to: undefined,
                });
              }
            }}
            className="w-full"
          />
          {/* <div className="py-2.5 px-3 space-y-2">
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
          </div> */}
        </PopoverContent>
      </Popover>
      <Select
        defaultValue={selectedPreset?.period}
        onValueChange={(newPeriod) => {
          const newRange = presets.find(
            (preset) => preset.period === newPeriod
          );
          if (newRange === undefined) return;
          onSubmit({ from: newRange.start, to: newRange.end });
        }}
      >
        <SelectTrigger
          data-active={isPreset}
          className={cn(
            "w-9 p-0 justify-center rounded-none shadow-none rounded-e-md focus-visible:z-10",
            "data-[active=true]:w-(--width) data-[active=true]:px-3 data-[active=true]:py-2 data-[active=true]:justify-between",
            "*:data-[slot=select-value]:hidden data-[active=true]:*:data-[slot=select-value]:flex"
          )}
        >
          <SelectValue placeholder="Select a period" />
        </SelectTrigger>
        <SelectContent align="end">
          <SelectGroup>
            {presets.map((preset) => (
              <SelectItem
                key={preset.period}
                value={preset.period}
                onSelect={() => {
                  console.log("selected");
                  onSubmit({ from: preset.start, to: preset.end });
                }}
              >
                {preset.text}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default PeriodPicker;
