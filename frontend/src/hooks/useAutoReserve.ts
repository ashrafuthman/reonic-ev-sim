import { useEffect, useRef } from "react";
import { reserve } from "../api";
import type { UseAutoReserveOptions } from "../type";
import { getArrivalProbabilityByHour, pickDemandKilometers, kilometersToKilowattHours, getCurrentBerlinHour, delay } from "../utils";


export function useAutoReserve({
  enabled = true,
  intervalMilliseconds = 900_000, // 15 minutes
  arrivalMultiplierPercent = 100,
  consumptionKilowattHoursPer100Kilometers = 18,
  randomNumberGenerator = Math.random,
  numberOfChargePoints = 20,
  onAttemptCallback,
}: UseAutoReserveOptions = {}) {
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;

    const attemptForCharger = async (chargerIndex: number, berlinHour: number) => {
      const p = getArrivalProbabilityByHour(berlinHour, arrivalMultiplierPercent);
      const arrives = randomNumberGenerator() < p;
      if (!arrives) { onAttemptCallback?.({ chargerIndex, triggered: false }); return; }

      const kilometers = pickDemandKilometers(randomNumberGenerator);
      if (kilometers <= 0) { onAttemptCallback?.({ chargerIndex, triggered: true, kilometers: 0, kilowattHours: 0, ok: true }); return; }

      const kilowattHours = Number(
        kilometersToKilowattHours(kilometers, consumptionKilowattHoursPer100Kilometers).toFixed(2)
      );

      try {
        const res = await reserve({ carName: `Car-${chargerIndex}-${Date.now() % 100000}`, kWhNeeded: kilowattHours });
        onAttemptCallback?.({
          chargerIndex, triggered: true, kilometers, kilowattHours, ok: true,
          chargerId: (res as any).chargerId, sessionId: (res as any).sessionId,
        });
      } catch (e: any) {
        onAttemptCallback?.({ chargerIndex, triggered: true, kilometers, kilowattHours, ok: false, error: e?.message ?? "reserve failed" });
      }
    };

    const scheduleNext = () => { timerRef.current = window.setTimeout(runTick, intervalMilliseconds); };

    const runTick = async () => {
      if (cancelled) return;
      const berlinHour = getCurrentBerlinHour();

      const tasks = Array.from({ length: numberOfChargePoints }, (_, idx) => (async () => {
        await delay(idx * 10);
        await attemptForCharger(idx, berlinHour);
      })());

      await Promise.allSettled(tasks);
      scheduleNext();
    };

    runTick(); // immediate
    return () => { cancelled = true; if (timerRef.current) window.clearTimeout(timerRef.current); };
  }, [
    enabled,
    intervalMilliseconds,
    arrivalMultiplierPercent,
    consumptionKilowattHoursPer100Kilometers,
    randomNumberGenerator,
    numberOfChargePoints,
    onAttemptCallback,
  ]);
}
