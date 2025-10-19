"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
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
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { DateRange } from "react-day-picker";
import { isAfter, isSameSecond } from "date-fns";
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";

function formatDate(date: Date | undefined) {
  if (!date) {
    return "";
  }
  return date.toLocaleDateString("en-US", {
    dateStyle: "medium",
  });
}

const rangeFormatter = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
});

function formatRange(startDate: Date, endDate: Date) {
  return rangeFormatter.formatRange(startDate, endDate);
}

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false;
  }
  return !isNaN(date.getTime());
}

function isValidTime(time: string): boolean {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
}

function formatTime(date: Date | undefined) {
  if (!date) {
    return "";
  }

  return date.toLocaleTimeString("en-US", {
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
  value: DateRange;
  onValueChange: (range: DateRange) => void;
  presets: Preset[];
}

interface FormValues {
  startValue: string;
  startTime: string;
  endValue: string;
  endTime: string;
}

type FormErrors = Record<keyof FormValues, string | null>;

type ParseDateTimesReturnValue =
  | {
      data: {
        startDate: Date;
        endDate: Date;
      };
      errors: undefined;
      success: true;
    }
  | {
      data: undefined;
      errors: {
        startValue: string | null;
        endValue: string | null;
        startTime: string | null;
        endTime: string | null;
      };
      success: false;
    };

function parseFormValues({
  startValue,
  startTime,
  endValue,
  endTime,
}: FormValues): ParseDateTimesReturnValue {
  const errors: FormErrors = {
    startValue: null,
    endValue: null,
    startTime: null,
    endTime: null,
  };

  if (!isValidDate(new Date(startValue))) {
    errors.startValue = "Invalid date format";
  }
  if (!isValidDate(new Date(endValue))) {
    errors.endValue = "Invalid date format";
  }
  if (!isValidTime(startTime)) {
    errors.startTime = "Invalid time format";
  }
  if (!isValidTime(endTime)) {
    errors.endTime = "Invalid time format";
  }

  if (
    isAfter(
      new Date(startValue).setTime(new Date(startTime).getTime()),
      new Date(endValue).setTime(new Date(endTime).getTime()),
    )
  ) {
    errors.endValue = "Invald date format";
  }

  const hasErrors = Object.values(errors).some((value) => value !== null);

  if (hasErrors) {
    return {
      data: undefined,
      errors,
      success: false,
    };
  }

  const startDate = new Date(`${startValue} ${startTime}`);
  const endDate = new Date(`${endValue} ${endTime}`);

  return {
    data: { startDate, endDate },
    errors: undefined,
    success: true,
  };
}

function isValidRange(
  range: DateRange | undefined,
): range is { from: Date; to: Date } {
  return range?.from !== undefined && range.to !== undefined;
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
  const [showError, setShowError] = React.useState<boolean>(false);

  const [formData, setFormData] = React.useState<FormValues>({
    startValue:
      defaultValue.from === undefined ? "" : formatDate(defaultValue.from),
    startTime:
      defaultValue.from === undefined ? "" : formatTime(defaultValue.from),
    endValue: defaultValue.to === undefined ? "" : formatDate(defaultValue.to),
    endTime: defaultValue.to === undefined ? "" : formatTime(defaultValue.to),
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
      <Button variant="outline" className="w-full" size="sm" type="submit">
        Apply ↵
      </Button>
    </form>
  );
};

const PeriodPicker: React.FC<Props> = ({ value, onValueChange, presets }) => {
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
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
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
        </PopoverTrigger>
        <PopoverContent
          className="w-[280px] divide-y overflow-hidden p-0"
          align="start"
        >
          <RangeCalendar
            value={value}
            onValueChange={(range) => {
              onValueChange(range);
              setOpen(false);
            }}
          />

          <InputPicker
            defaultValue={value}
            onApplyChanges={(range) => {
              onValueChange(range);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
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

export default PeriodPicker;
