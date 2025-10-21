import type { FormValues } from "./types";
import type { DateRange } from "react-day-picker";

export function formatDate(date: Date | undefined, timeZone = "UTC") {
  if (!date) {
    return "";
  }
  return date.toLocaleDateString("en-US", {
    timeZone,
    dateStyle: "medium",
  });
}

const rangeFormatter = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
});

export function formatRange(startDate: Date, endDate: Date) {
  return rangeFormatter.formatRange(startDate, endDate);
}

export function isValidDate(date: Date | undefined) {
  if (!date) {
    return false;
  }
  return !isNaN(date.getTime());
}

export function isValidTime(time: string): boolean {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
}

export function isValidRange(
  range: DateRange | undefined,
): range is { from: Date; to: Date } {
  return range?.from !== undefined && range.to !== undefined;
}

export function formatTime(date: Date | undefined, timeZone = "UTC") {
  if (!date) {
    return "";
  }

  return date.toLocaleTimeString("en-US", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
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

export function parseFormValues({
  startValue,
  startTime,
  endValue,
  endTime,
  timeZone,
}: FormValues): ParseDateTimesReturnValue {
  const errors: FormErrors = {
    startValue: null,
    endValue: null,
    startTime: null,
    endTime: null,
    timeZone: null,
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

  const hasErrors = Object.values(errors).some((value) => value !== null);

  if (hasErrors) {
    return {
      data: undefined,
      errors,
      success: false,
    };
  }

  const startDate = new Date(
    `${startValue} ${startTime}${timeZone === "UTC" ? " UTC" : ""}`,
  );

  const endDate = new Date(
    `${endValue} ${endTime}${timeZone === "UTC" ? " UTC" : ""}`,
  );

  if (startDate.getTime() > endDate.getTime()) {
    return {
      data: undefined,
      errors: { ...errors, endValue: "Invalid date range" },
      success: false,
    };
  }

  return {
    data: { startDate, endDate },
    errors: undefined,
    success: true,
  };
}
