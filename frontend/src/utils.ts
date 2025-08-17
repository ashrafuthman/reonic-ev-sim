import { ARRIVAL_PROB_BY_HOUR, CHARGING_DEMANDS } from "./consts";

export function getCurrentBerlinHour(): number {
  const hh = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    hour12: false,
    timeZone: "Europe/Berlin",
  }).format(new Date());
  return Number(hh);
}

export const delay = (milliseconds: number) =>
  new Promise<void>(resolve => setTimeout(resolve, milliseconds));

export function getArrivalProbabilityByHour(hourZeroToTwentyThree: number, arrivalMultiplierPercent = 100): number {
  const hour = Math.max(0, Math.min(23, Math.floor(hourZeroToTwentyThree)));
  const base = ARRIVAL_PROB_BY_HOUR[hour];
  const factor = Math.max(0.2, Math.min(2, arrivalMultiplierPercent / 100)); // clamp 20..200%
  return Math.min(1, base * factor);
}

export function pickDemandKilometers(randomNumberGenerator = Math.random): number {
  const roll = randomNumberGenerator();
  let cumulative = 0;
  for (const { probability, kmRange } of CHARGING_DEMANDS) {
    cumulative += probability;
    if (roll <= cumulative) return kmRange;
  }
  return CHARGING_DEMANDS[CHARGING_DEMANDS.length - 1].kmRange;
}

export function kilometersToKilowattHours(kilometers: number, consumptionKilowattHoursPer100Kilometers = 18): number {
  return (kilometers / 100) * consumptionKilowattHoursPer100Kilometers;
}

