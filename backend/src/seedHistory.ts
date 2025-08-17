// src/seedHistory.ts
import { DateTime } from "luxon";
import type { Charger, Session } from "./seed";

// ---- constants -------------------------------------------------------------
const INTERVAL_MINUTES = 15;
const POWER_PER_CHARGER_KILOWATTS = 11;
const CONSUMPTION_KWH_PER_100KM = 18;
const TIMEZONE = "Europe/Berlin";

// T1: arrival probability by hour (0..1) — per chargepoint
const ARRIVAL_PROBABILITY_BY_HOUR: number[] = [
  0.0094, 0.0094, 0.0094, 0.0094, 0.0094, 0.0094, 0.0094, 0.0094,
  0.0283, 0.0283, 0.0566, 0.0566, 0.0566, 0.0755, 0.0755, 0.0755,
  0.1038, 0.1038, 0.1038, 0.0472, 0.0472, 0.0472, 0.0094, 0.0094,
];

// T2: charging demand distribution (km)
const DEMAND_KM_DISTRIBUTION: Array<{ probability: number; kilometers: number }> = [
  { probability: 0.3431, kilometers: 0 },    // none (arrives but doesn't charge)
  { probability: 0.0490, kilometers: 5 },
  { probability: 0.0980, kilometers: 10 },
  { probability: 0.1176, kilometers: 20 },
  { probability: 0.0882, kilometers: 30 },
  { probability: 0.1176, kilometers: 50 },
  { probability: 0.1078, kilometers: 100 },
  { probability: 0.0490,  kilometers: 200 },
  { probability: 0.0294,  kilometers: 300 },
];

// ---- helpers ---------------------------------------------------------------
function getArrivalProbabilityForHour(hourZeroTo23: number): number {
  const index = Math.max(0, Math.min(23, Math.floor(hourZeroTo23)));
  return ARRIVAL_PROBABILITY_BY_HOUR[index] ?? 0;
}

function pickDemandKilometers(): number {
  const randomValue = Math.random();
  let cumulative = 0;
  for (const { probability, kilometers } of DEMAND_KM_DISTRIBUTION) {
    cumulative += probability;
    if (randomValue <= cumulative) return kilometers;
  }
  return DEMAND_KM_DISTRIBUTION[DEMAND_KM_DISTRIBUTION.length - 1]?.kilometers ?? 0;
}

function kilometersToKilowattHours(kilometers: number): number {
  return (kilometers / 100) * CONSUMPTION_KWH_PER_100KM;
}

// ---- main seeding function -------------------------------------------------
export function seedHistory(params: {
  chargers: Charger[];
  sessions: Session[];
  years?: number;         // default 3
  timezone?: string;      // default "Europe/Berlin"
}): void {
  const chargers = params.chargers;
  const sessions = params.sessions;
  const years = params.years ?? 3;
  const timezone = params.timezone ?? TIMEZONE;

  // Clear any previous state
  chargers.forEach((charger) => { charger.busyUntil = null; });
  sessions.splice(0, sessions.length);

  // Define the window: past `years` full years ending yesterday 23:59:59.999
  const nowBerlin = DateTime.now().setZone(timezone);
  const todayStart = nowBerlin.startOf("day");              // today 00:00
  const seedEnd = todayStart.minus({ milliseconds: 1 });    // yesterday 23:59:59.999
  const seedStart = todayStart.minus({ years });            // N years ago, today 00:00

  // Simulate in 15-minute ticks
  const totalIntervals =
    Math.floor(seedEnd.diff(seedStart, "minutes").minutes / INTERVAL_MINUTES);

  // Local shadow of charger availability while seeding
  const chargerAvailableAt: Map<number, number> = new Map(
    chargers.map((c) => [c.id, seedStart.toMillis()])
  );

  let nextSessionId = 1;

  for (let intervalIndex = 0; intervalIndex <= totalIntervals; intervalIndex++) {
    const intervalStart = seedStart.plus({ minutes: intervalIndex * INTERVAL_MINUTES });
    const intervalStartMillis = intervalStart.toMillis();
    const hourOfDay = Number(intervalStart.setZone(timezone).toFormat("H")); // 0..23
    const arrivalProbability = getArrivalProbabilityForHour(hourOfDay);

    // Try each charger independently
    for (const charger of chargers) {
      const availableAtMillis = chargerAvailableAt.get(charger.id)!;

      // Only consider arrivals if the charger is free by this tick
      if (availableAtMillis > intervalStartMillis) continue;

      // Bernoulli trial for arrival at this chargepoint in this interval
      const arrives = Math.random() < arrivalProbability;
      if (!arrives) continue;

      // If arrives, draw demand; 0 km means "no charging"
      const kilometers = pickDemandKilometers();
      if (kilometers <= 0) continue;

      const kilowattHours = kilometersToKilowattHours(kilometers);
      const chargingHours = kilowattHours / POWER_PER_CHARGER_KILOWATTS;
      const chargingDurationMillis = chargingHours * 60 * 60 * 1000;

      const sessionStartMillis = intervalStartMillis;
      const sessionEndMillis = sessionStartMillis + chargingDurationMillis;

      sessions.push({
        sessionId: nextSessionId++,
        chargerId: charger.id,
        carName: `SeedCar-${charger.id}-${sessionStartMillis}`,
        kWhNeeded: Number(kilowattHours.toFixed(2)),
        startTime: sessionStartMillis,
        endTime: sessionEndMillis,
      });

      // Mark charger as busy until end
      chargerAvailableAt.set(charger.id, sessionEndMillis);
    }
  }

  // After historical seeding, all chargers are free "now"
  chargers.forEach((charger) => { charger.busyUntil = null; });

  // Optional log
  // console.log(`[seedHistory] Seeded ${sessions.length} sessions from ${seedStart.toISO()} to ${seedEnd.toISO()} (${years} years)`);
}
