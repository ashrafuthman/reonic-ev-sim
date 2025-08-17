import { useQuery } from "@tanstack/react-query";
import { type DaySeriesResponse, getDaySeries } from "../api";
import type { DaySeriesLineResult } from "../type";

const FIFTEEN_MIN_MS = 900_000;

export function useDaySeriesLine(day?: string) {
  return useQuery<DaySeriesResponse, Error, DaySeriesLineResult>({
    queryKey: ["series", "day", day ?? "today"] as const,
    queryFn: ({ signal }) => getDaySeries(day, signal),
    select: (resp) => ({
      line: resp.perTick.map((r) => ({
        timeLabel: r.timeLabel,
        totalKW: r.totalPowerKilowatts,
      })),
      meta: { day: resp.day, timezone: resp.timezone, stepMinutes: resp.stepMinutes },
    }),
    refetchInterval: FIFTEEN_MIN_MS,
    refetchIntervalInBackground: true,
    staleTime: FIFTEEN_MIN_MS,
    placeholderData: (prev) => prev,
  });
}
