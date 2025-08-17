import { BASE, fetchJson } from "./base";

export type LiveSession = {
  sessionId: number;
  carName: string;
  kWhNeeded: number;
  startTime: string;
  endTime: string;
  remainingMs: number;
  remainingMilliseconds?: number;
  remainingMinutes: number;
  percentageRemaining: number;
  percentageComplete: number;
};

export type Charger = {
  id: number;
  busyUntil: string | null;
  isActive: boolean;
  session: LiveSession | null;
  warning?: string;
};

export async function getChargers(signal?: AbortSignal) {
  return fetchJson<Charger[]>(`${BASE}/chargers`, { signal });
}
