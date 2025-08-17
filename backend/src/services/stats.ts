import { Session } from "types/api";

export function computeStats(
  sessions: Session[],
  chargerCount: number,
  powerPerChargerKW: number,
  now = Date.now()
) {
  let totalRequested = 0;
  let totalDelivered = 0;
  let totalRemaining = 0;

  for (const s of sessions) {
    totalRequested += s.kWhNeeded;
    const dur = s.endTime - s.startTime;

    if (dur <= 0 || now >= s.endTime) {
      totalDelivered += s.kWhNeeded;
    } else if (now > s.startTime) {
      const elapsed = now - s.startTime;
      const delivered = s.kWhNeeded * (elapsed / dur);
      totalDelivered += delivered;
      totalRemaining += s.kWhNeeded - delivered;
    } else {
      totalRemaining += s.kWhNeeded;
    }
  }

  let peakInUse = sessions.length
    ? Math.max(
        ...sessions.map((pivot) =>
          sessions.filter(
            (o) => o.startTime < pivot.endTime && o.endTime > pivot.startTime
          ).length
        )
      )
    : 0;

  peakInUse = Math.min(peakInUse, chargerCount);

  const theoreticalMaxPowerKW = chargerCount * powerPerChargerKW;
  const actualMaxPowerKW = peakInUse * powerPerChargerKW;
  const concurrencyFactor = theoreticalMaxPowerKW
    ? Number((actualMaxPowerKW / theoreticalMaxPowerKW).toFixed(3))
    : 0;

  return {
    totalSessions: sessions.length,
    totalEnergyKWh: round2(totalDelivered),
    totalEnergyRequested: round2(totalRequested),
    totalEnergyDelivered: round2(totalDelivered),
    totalEnergyRemaining: round2(totalRemaining),
    deliveryProgressPercent: totalRequested ? Math.round((totalDelivered / totalRequested) * 100) : 0,
    peakInUse,
    theoreticalMaxPowerKW,
    actualMaxPowerKW,
    concurrencyFactor,
  };
}

const round2 = (n: number) => Math.round(n * 100) / 100;
