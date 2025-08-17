import { BASE, fetchJson } from "./base";

export type DaySeriesRow = {
  timeLabel: string;
  totalPowerKilowatts: number;
  perChargerPowerKilowatts: number[];
};

export type DaySeriesResponse = {
  timezone: string;
  day: string;
  stepMinutes: number;
  perTick: DaySeriesRow[];
};

export async function getDaySeries(day?: string, signal?: AbortSignal) {
  const url = day ? `${BASE}/series/day?day=${encodeURIComponent(day)}` : `${BASE}/series/day`;
  return fetchJson<DaySeriesResponse>(url, { signal });
}

