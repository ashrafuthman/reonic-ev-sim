import type { Charger } from "./api/getChargers";
import type { ChargingDemandEntry } from "./type";

export const ARRIVAL_PROB_BY_HOUR: number[] = [
  0.0094, // 00:00–01:00
  0.0094, // 01:00–02:00
  0.0094, // 02:00–03:00
  0.0094, // 03:00–04:00
  0.0094, // 04:00–05:00
  0.0094, // 05:00–06:00
  0.0094, // 06:00–07:00
  0.0094, // 07:00–08:00
  0.0283, // 08:00–09:00
  0.0283, // 09:00–10:00
  0.0566, // 10:00–11:00
  0.0566, // 11:00–12:00
  0.0566, // 12:00–13:00
  0.0755, // 13:00–14:00
  0.0755, // 14:00–15:00
  0.0755, // 15:00–16:00
  0.1038, // 16:00–17:00
  0.1038, // 17:00–18:00
  0.1038, // 18:00–19:00
  0.0472, // 19:00–20:00
  0.0472, // 20:00–21:00
  0.0472, // 21:00–22:00
  0.0094, // 22:00–23:00
  0.0094, // 23:00–24:00
];


export const CHARGING_DEMANDS: ChargingDemandEntry[] = [
  { probability: 0.3431, kmRange: 0 },    // None
  { probability: 0.0490, kmRange: 5 },    // 5 km
  { probability: 0.0980, kmRange: 10 },   // 10 km
  { probability: 0.1176, kmRange: 20 },   // 20 km
  { probability: 0.0882, kmRange: 30 },   // 30 km
  { probability: 0.1176, kmRange: 50 },   // 50 km
  { probability: 0.1078, kmRange: 100 },  // 100 km
  { probability: 0.0490, kmRange: 200 },  // 200 km
  { probability: 0.0294, kmRange: 300 },  // 300 km
];

export const REFRESH_MS = 2_000;
export const CHARGER_COUNT = 20;

export const EMPTY_CHARGERS: Charger[] = Array.from({ length: CHARGER_COUNT }, (_, i) => ({
  id: i + 1,
  busyUntil: null,
  isActive: false,
  session: null,
}));