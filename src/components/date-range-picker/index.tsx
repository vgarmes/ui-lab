"use client";

import * as React from "react";
import { CalendarIcon, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRange } from "react-day-picker";
import { isSameSecond } from "date-fns";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import type { FormValues, Preset } from "./types";
import {
  formatDate,
  formatRange,
  formatTime,
  isValidRange,
  parseFormValues,
} from "./helpers";
import {
  ResponsivePopover,
  ResponsivePopoverContent,
  ResponsivePopoverTrigger,
} from "@/components/ui/responsive-popover";

interface Props {
  value: DateRange;
  onValueChange: (range: DateRange) => void;
  presets: Preset[];
}

// This is a separate component to make sure all local state is reset when popover opens
const RangeCalendar: React.FC<{
  value: DateRange;
  onValueChange: (range: DateRange) => void;
}> = ({ value, onValueChange }) => {
  const [selectedRange, setSelectedRange] = React.useState<DateRange>(value);
  const isFirstSelection = React.useRef(true);
  return (
    <Calendar
      autoFocus
      mode="range"
      selected={selectedRange}
      onSelect={(range) => {
        if (range === undefined) return;
        if (isFirstSelection.current) {
          isFirstSelection.current = false;
          setSelectedRange({ from: range?.to, to: undefined });
        } else {
          setSelectedRange(range);
          if (isValidRange(range)) {
            onValueChange(range);
          }
        }
      }}
      className="w-full"
    />
  );
};

const InputPicker: React.FC<{
  defaultValue: DateRange;
  onApplyChanges: (range: DateRange) => void;
}> = ({ defaultValue, onApplyChanges }) => {
  const selectRef = React.useRef<HTMLSelectElement>(null);
  const [showError, setShowError] = React.useState<boolean>(false);

  const [formData, setFormData] = React.useState<FormValues>({
    startValue:
      defaultValue.from === undefined ? "" : formatDate(defaultValue.from),
    startTime:
      defaultValue.from === undefined ? "" : formatTime(defaultValue.from),
    endValue: defaultValue.to === undefined ? "" : formatDate(defaultValue.to),
    endTime: defaultValue.to === undefined ? "" : formatTime(defaultValue.to),
    timeZone: "UTC",
  });

  const { data, errors, success } = parseFormValues(formData);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!success) {
      setShowError(true);
      return;
    }

    onApplyChanges({
      from: data.startDate,
      to: data.endDate,
    });
  };

  const handlePartialChange = (values: Partial<FormValues>) => {
    setFormData({ ...formData, ...values });
  };

  const handleTimezoneChange = (newTimezone: string) => {
    setFormData({
      startValue: formatDate(data?.startDate, newTimezone),
      startTime: formatTime(data?.startDate, newTimezone),
      endValue: formatDate(data?.endDate, newTimezone),
      endTime: formatTime(data?.endDate, newTimezone),
      timeZone: newTimezone,
    });
  };

  const options = React.useMemo(() => {
    const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    return [
      { label: "UTC", value: "UTC" },
      { label: `Local (${localTimezone})`, value: localTimezone },
    ];
  }, []);

  const width = React.useMemo(() => {
    const labelLength =
      options.find((option) => option.value === formData.timeZone)?.label
        .length ?? 0;
    // 6px per character is assumed
    return labelLength <= 3 ? "54px" : `${8 + 6 * labelLength + 18}px`;
  }, [formData.timeZone, options]);

  return (
    <form className="space-y-2 px-3 py-2.5" onSubmit={onSubmit}>
      <div className="flex flex-col">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground mb-1 text-xs">Start</span>
          {showError &&
            (errors?.startValue !== undefined ||
              errors?.startTime !== undefined) && (
              <span className="text-destructive text-xs">
                {errors.startValue ?? errors.startTime}
              </span>
            )}
        </div>
        <div className="flex items-center gap-2">
          <Input
            id="date"
            value={formData.startValue}
            placeholder="June 01, 2025"
            className="bg-background"
            onChange={(e) => {
              handlePartialChange({ startValue: e.target.value });
            }}
            aria-invalid={showError && !!errors?.startValue}
          />
          <Input
            type="text"
            id="time-picker"
            value={formData.startTime}
            onChange={(e) => {
              handlePartialChange({ startTime: e.target.value });
            }}
            className="bg-background w-24 shrink-0 appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            aria-invalid={showError && !!errors?.startTime}
          />
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground mb-1 text-xs">End</span>
          {showError &&
            (errors?.endValue !== undefined ||
              errors?.endTime !== undefined) && (
              <span className="text-destructive text-xs">
                {errors?.endValue ?? errors?.endTime}
              </span>
            )}
        </div>
        <div className="flex items-center gap-2">
          <Input
            id="date"
            value={formData.endValue}
            placeholder="June 01, 2025"
            className="bg-background"
            onChange={(e) => {
              handlePartialChange({ endValue: e.target.value });
            }}
            aria-invalid={showError && !!errors?.endValue}
          />
          <Input
            type="text"
            id="time-picker"
            value={formData.endTime}
            onChange={(e) => {
              handlePartialChange({ endTime: e.target.value });
            }}
            className="bg-background w-24 shrink-0 appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            aria-invalid={showError && !!errors?.endTime}
          />
        </div>
      </div>
      <Button variant="outline" className="mb-1 w-full" size="sm" type="submit">
        Apply ↵
      </Button>
      <div className="flex justify-center pl-4">
        <div className="group relative flex items-center [--themed-border:transparent]">
          <select
            ref={selectRef}
            className={cn(
              "text-muted-foreground h-6 cursor-pointer appearance-none truncate rounded pr-[22px] pl-1.5 text-xs transition-all outline-none",
              "shadow-[0_0_0_1px_var(--themed-border,_var(--ds-gray-alpha-400))] hover:[--themed-border:var(--ds-gray-alpha-500)] focus:shadow-(--ds-focus-border)",
            )}
            style={{
              width,
            }}
            value={formData.timeZone}
            onChange={(e) => {
              handleTimezoneChange(e.target.value);
            }}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <span className="transition-color text-muted-foreground group-hover:text-foreground pointer-events-none absolute right-[5px] inline-flex">
            <ChevronDown className="size-4" />
          </span>
        </div>
      </div>
    </form>
  );
};

const DateRangePicker: React.FC<Props> = ({
  value,
  onValueChange,
  presets,
}) => {
  const [open, setOpen] = React.useState(false);

  const selectedPreset = presets.find(
    (preset) =>
      value.from !== undefined &&
      isSameSecond(preset.start, value.from) &&
      value.to !== undefined &&
      isSameSecond(preset.end, value.to),
  );

  const isPreset = selectedPreset !== undefined;

  return (
    <div className="inline-flex w-auto rounded-md shadow-xs [--width:164px] rtl:space-x-reverse">
      <ResponsivePopover open={open} onOpenChange={setOpen}>
        <ResponsivePopoverTrigger asChild>
          <Button
            data-active={!isPreset && isValidRange(value)}
            className={cn(
              "w-9 justify-center rounded-none rounded-s-md border-r-0 py-0 shadow-none transition-none focus-visible:z-10 has-[>svg]:px-0",
              "data-[active=true]:w-(--width) data-[active=true]:justify-start data-[active=true]:px-3 data-[active=true]:py-2 data-[active=true]:*:data-[slot=range-value]:inline-block",
            )}
            variant="outline"
          >
            <CalendarIcon />

            <span data-slot="range-value" className="hidden truncate">
              {isValidRange(value) && formatRange(value.from, value.to)}
            </span>
          </Button>
        </ResponsivePopoverTrigger>
        <ResponsivePopoverContent
          align="start"
          title="Select date range"
          className="group p-0 sm:w-[280px]"
        >
          <div className="block h-full overflow-y-auto p-3 sm:p-0">
            <div className="flex flex-col group-data-[side=bottom]:flex-col-reverse">
              <InputPicker
                defaultValue={value}
                onApplyChanges={(range) => {
                  onValueChange(range);
                  setOpen(false);
                }}
              />
              <div className="bg-border h-[1px] w-full" />
              <RangeCalendar
                value={value}
                onValueChange={(range) => {
                  onValueChange(range);
                  setOpen(false);
                }}
              />
            </div>
          </div>
        </ResponsivePopoverContent>
      </ResponsivePopover>
      <Select
        value={selectedPreset?.period ?? ""}
        onValueChange={(newPeriod) => {
          const newRange = presets.find(
            (preset) => preset.period === newPeriod,
          );
          if (newRange === undefined) return;
          onValueChange({ from: newRange.start, to: newRange.end });
        }}
      >
        <SelectTrigger
          data-active={isPreset}
          className={cn(
            "w-9 justify-center rounded-none rounded-e-md p-0 shadow-none focus-visible:z-10",
            "data-[active=true]:w-(--width) data-[active=true]:justify-between data-[active=true]:px-3 data-[active=true]:py-2",
            "*:data-[slot=select-value]:hidden data-[active=true]:*:data-[slot=select-value]:flex",
          )}
        >
          <SelectValue placeholder="Select a period" />
        </SelectTrigger>
        <SelectContent align="end">
          <SelectGroup>
            {presets.map((preset) => (
              <SelectItem key={preset.period} value={preset.period}>
                {preset.text}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default DateRangePicker;
