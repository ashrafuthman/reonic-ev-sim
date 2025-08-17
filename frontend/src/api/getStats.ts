import { BASE, fetchJson } from "./base";

export type Stats = {
  totalSessions: number;
  totalEnergyRequested: number;
  totalEnergyDelivered: number;
  totalEnergyRemaining: number;
  deliveryProgressPercent: number;
  theoreticalMaxPowerKW: number;
  actualMaxPowerKW: number;
  concurrencyFactor: number;
  totalEnergyKWh: number;
  peakInUse: number;
};

export async function getStats(signal?: AbortSignal) {
  return fetchJson<Stats>(`${BASE}/stats`, { signal });
}
