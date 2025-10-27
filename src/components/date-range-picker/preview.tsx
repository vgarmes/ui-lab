"use client";

import { roundToNearestHours, subDays, subHours } from "date-fns";
import { Preset } from "./types";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import DateRangePicker from ".";
import Preview from "../preview";

function generatePresets(): Preset[] {
  const endDate = roundToNearestHours(new Date());

  return [
    {
      text: "Last 24 Hours",
      period: "24h",
      start: subHours(endDate, 24),
      end: endDate,
    },
    {
      text: "Last 7 days",
      period: "7d",
      start: subDays(endDate, 7),
      end: endDate,
    },
    {
      text: "Last 30 days",
      period: "30d",
      start: subDays(endDate, 30),
      end: endDate,
    },
  ];
}

function DateRangePickerPreview() {
  const presets = generatePresets();
  const [range, setRange] = useState<DateRange>({
    from: presets[0].start,
    to: presets[0].end,
  });

  return (
    <Preview>
      <DateRangePicker
        value={range}
        onValueChange={(range) => {
          if (range.from === undefined || range.to === undefined) return;
          setRange(range);
        }}
        presets={presets}
      />
    </Preview>
  );
}

export default DateRangePickerPreview;
