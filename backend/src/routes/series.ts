import { Router, Response } from "express";
import { chargers, sessions } from "../state";
import { formatBerlinTime, berlinDayStart } from "../utils/time";
import { overlaps } from "../utils/session";
import { INTERVAL_MINUTES, POWER_PER_CHARGER_KW, TIMEZONE } from "../config";
import { DaySeriesResponse, DaySeriesRow } from "types/api";

export const seriesRouter = Router();

seriesRouter.get(
  "/day",
  (request, response: Response<DaySeriesResponse>) => {
    const dayParam = typeof request.query.day === "string" ? request.query.day : undefined;
    const dayStart = berlinDayStart(dayParam);

    const intervalsPerDay = (24 * 60) / INTERVAL_MINUTES;
    const rows: DaySeriesRow[] = [];

    for (let intervalIndex = 0; intervalIndex < intervalsPerDay; intervalIndex++) {
      const sliceStartMs = dayStart.plus({ minutes: intervalIndex * INTERVAL_MINUTES }).toMillis();
      const sliceEndMs   = dayStart.plus({ minutes: (intervalIndex + 1) * INTERVAL_MINUTES }).toMillis();

      const perChargerPower = chargers.map((charger) => {
        const isActiveThisSlice = sessions.some(
          (session) => session.chargerId === charger.id && overlaps(session, sliceStartMs, sliceEndMs)
        );
        return isActiveThisSlice ? POWER_PER_CHARGER_KW : 0;
      });

      const totalPower = perChargerPower.reduce((sum: number, value) => sum + value, 0);

      rows.push({
        timeLabel: formatBerlinTime(sliceStartMs),
        totalPowerKilowatts: totalPower,
        perChargerPowerKilowatts: perChargerPower,
      });
    }

    response.json({
      timezone: TIMEZONE,
      day: dayStart.toFormat("yyyy-MM-dd"),
      stepMinutes: INTERVAL_MINUTES,
      perTick: rows,
    });
  }
);
