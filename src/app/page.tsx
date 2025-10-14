"use client";

import PeriodPicker, { Preset } from "@/components/period-picker";
import Timeline from "@/components/timeline";
import { roundToNearestHours, subDays, subHours } from "date-fns";
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
    <div className="pt:10 flex max-w-7xl flex-col items-center justify-center gap-20 p-5 md:mx-auto md:gap-56 md:p-5 md:pt-12">
      <header className="flex w-full items-start justify-between">
        <div className="flex items-center gap-0.5">
          <span className="h-6 w-1.5 rounded-xs bg-red-500"></span>
          <span className="h-6 w-1.5 rounded-xs bg-green-500"></span>
          <span className="h-6 w-1.5 rounded-xs bg-blue-500"></span>
        </div>
        <div className="text-light-1000 selection:bg-light-accent selection:text-light-200 dark:text-dark-1000 dark:selection:bg-dark-accent dark:selection:text-dark-200 md:w-h2container flex w-10/12 flex-col gap-1 text-right leading-tight">
          <h1 className="w-full text-right font-serif text-4xl leading-tight md:text-5xl">
            Crafting fine UI
          </h1>
          <div className="text-muted-foreground font-sans">
            Designed and built by{" "}
            <a
              href="https://vgarmes.github.io/"
              className="decorati decoration-muted-foreground/50 hover:decoration-muted-foreground underline underline-offset-4 transition-colors"
            >
              vgarmes
            </a>
          </div>
        </div>
      </header>
      <main className="w-full space-y-12">
        <div className="relative flex w-full flex-col items-start gap-12 font-sans md:flex-row md:gap-x-40">
          <div className="w-full space-y-3 md:w-[256px]">
            <h2 className="text-sm font-medium">Period Picker</h2>
            <p className="text-muted-foreground text-sm">
              User can either pick a preset from a dropdown or a custom period
              using the calendar or date and time inputs.
            </p>
          </div>
          <div className="border-light-border dark:border-dark-border flex h-[250px] w-full items-center justify-center rounded-lg border md:flex-1">
            <PeriodPicker
              value={range}
              onValueChange={(range) => {
                if (range.from === undefined || range.to === undefined) return;
                setRange(range);
              }}
              presets={presets}
            />
          </div>
        </div>

        <div className="flex w-full flex-col items-start gap-12 font-sans md:flex-row md:gap-x-40">
          <div className="w-full shrink-0 space-y-3 md:w-[256px]">
            <h2 className="text-sm font-medium">Timeline</h2>
            <p className="text-muted-foreground text-sm">
              User can either pick a preset from a dropdown or a custom period
              using the calendar or date and time inputs.
            </p>
          </div>

          <Timeline />
        </div>
      </main>
    </div>
  );
}
