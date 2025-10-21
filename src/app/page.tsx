"use client";

import DateRangePicker from "@/components/date-range-picker";
import { Preset } from "@/components/date-range-picker/types";
import Preview from "@/components/preview";
import { roundToNearestHours, subDays, subHours } from "date-fns";
import { useState } from "react";
import type { DateRange } from "react-day-picker";

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
    <div className="flex max-w-7xl flex-col items-center justify-center gap-20">
      <header className="flex h-16 w-full items-center gap-4">
        <div className="flex items-center gap-0.5">
          <span className="h-2.5 w-1 rounded-xs bg-red-500"></span>
          <span className="h-2.5 w-1 rounded-xs bg-green-500"></span>
          <span className="h-2.5 w-1 rounded-xs bg-blue-500"></span>
        </div>

        <h1 className="text-muted-foreground mb-0.5 grow font-serif text-lg leading-none">
          mestre<span className="text-foreground">crafts</span>
        </h1>
        <a href="https://github.com/vgarmes/ui-lab/">
          <svg
            role="img"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className="size-4"
          >
            <title>GitHub</title>
            <path
              fill="currentColor"
              d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
            />
          </svg>
        </a>
      </header>
      <main className="w-full space-y-12">
        <div className="relative flex w-full flex-col items-start font-sans">
          <div className="w-full space-y-3">
            <h2 className="text-sm font-medium">Date Range Picker</h2>
            <p className="text-muted-foreground text-sm">
              A date range picker component with presets and custom date range
              selection inspired by Vercel.
            </p>
          </div>
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
        </div>
      </main>
    </div>
  );
}
