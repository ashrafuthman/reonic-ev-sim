export type Session = {
  sessionId: number;
  chargerId: number;
  carName: string;
  kWhNeeded: number;
  startTime: number;
  endTime: number;
  percentageLeft?: number;
};

import { BASE, fetchJson } from "./base";

export async function getSessions(active?: boolean): Promise<Session[]> {
  const url = active ? `${BASE}/sessions?active=true` : `${BASE}/sessions`;
  return fetchJson<Session[]>(url);
}