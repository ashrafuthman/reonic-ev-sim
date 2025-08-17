import { Router, Response } from "express";
import { chargers, sessions } from "../state";
import { toBerlinHHmm } from "../utils/time";
import type { ChargerOut, LiveSessionOut, Session } from "../types/api";

export const chargersRouter = Router();

chargersRouter.get("/", (_request, response: Response<ChargerOut[]>) => {
  const nowTimestamp = Date.now();

  const items: ChargerOut[] = chargers.map((charger) => {
    const isActive = Boolean(charger.busyUntil && charger.busyUntil > nowTimestamp);

    let currentSession: Session | undefined;
    if (isActive) {
      currentSession = sessions
        .filter(
          (s) =>
            s.chargerId === charger.id &&
            s.startTime <= nowTimestamp &&
            s.endTime > nowTimestamp
        )
        .sort((a, b) => b.startTime - a.startTime)[0];

      if (!currentSession) {
        charger.busyUntil = null;
        return {
          id: charger.id,
          busyUntil: null,
          isActive: false,
          session: null,
          warning: "Orphan busyUntil cleared",
        };
      }
    }

    if (!isActive) {
      return {
        id: charger.id,
        busyUntil: null,
        isActive: false,
        session: null,
      };
    }

    const totalDurationMs = currentSession!.endTime - currentSession!.startTime;
    const remainingMs = currentSession!.endTime - nowTimestamp;
    const percentageRemaining =
      totalDurationMs > 0
        ? Math.max(0, Math.round((remainingMs / totalDurationMs) * 100))
        : 0;

    const sessionOut: LiveSessionOut = {
      sessionId: currentSession!.sessionId,
      carName: currentSession!.carName,
      kWhNeeded: currentSession!.kWhNeeded,
      startTime: toBerlinHHmm(currentSession!.startTime) ?? "",
      endTime: toBerlinHHmm(currentSession!.endTime) ?? "",
      remainingMs,
      remainingMilliseconds: remainingMs, // optional alias
      remainingMinutes: Math.ceil(remainingMs / 60000),
      percentageRemaining,
      percentageComplete: 100 - percentageRemaining,
    };

    return {
      id: charger.id,
      busyUntil: toBerlinHHmm(currentSession!.endTime),
      isActive: true,
      session: sessionOut,
    };
  });

  response.json(items);
});
