"use client";

import PeriodPicker, { Preset } from "@/components/period-picker";
import {
  addDays,
  addHours,
  roundToNearestHours,
  subDays,
  subHours,
} from "date-fns";
import { useState } from "react";
import { DateRange } from "react-day-picker";

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

export default function Home() {
  const presets = generatePresets();
  const [range, setRange] = useState<DateRange>({
    from: presets[0].start,
    to: presets[0].end,
  });

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <PeriodPicker
          initialValue={range}
          onSubmit={(range) => {
            if (range.from === undefined || range.to === undefined) return;
            setRange(range);
          }}
          presets={presets}
        />
      </main>
    </div>
  );
}
