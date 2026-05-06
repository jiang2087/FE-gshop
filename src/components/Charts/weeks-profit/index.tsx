"use client"

import { PeriodPicker } from "@/components/period-picker";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { getWeeksProfitData } from "../../../services/charts.services";
import { WeeksProfitChart } from "./chart";
import { getProfitPerDay } from "@/api/adminApi";

type PropsType = {
  timeFrame?: string;
  className?: string;
};
export function WeeksProfit({ className, timeFrame }: PropsType) {
  const [data, setData] = useState<{
    revenue: { x: string; y: number }[];
  }>({
    revenue: [],
  });

  useEffect(() => {
    const fetchWeekProfit = async () => {
      try {
        const res = await getProfitPerDay(timeFrame);

        setData({
          revenue: res,
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchWeekProfit();
  }, [timeFrame]);

  return (
    <div
      className={cn(
        "rounded-[10px] bg-white px-7.5 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
          Profit {timeFrame || "this week"}
        </h2>

        <PeriodPicker
          items={["this week", "last week"]}
          defaultValue={timeFrame || "this week"}
          sectionKey="weeks_profit"
        />
      </div>

      <WeeksProfitChart data={data} />
    </div>
  );
}
