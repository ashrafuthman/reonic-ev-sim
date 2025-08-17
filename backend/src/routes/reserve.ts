import { Router, Request, Response } from "express";
import { chargers, sessions } from "../state";
import { toBerlinHHmm } from "../utils/time";
import { POWER_PER_CHARGER_KW } from "../config";
import { ReserveResponse, ReserveRequest } from "types/api";

export const reserveRouter = Router();

reserveRouter.post(
  "/",
  (
    request: Request<{}, ReserveResponse | { message: string }, ReserveRequest>,
    response: Response<ReserveResponse | { message: string }>
  ) => {
    const { carName, kWhNeeded } = request.body ?? {};

    if (
      typeof carName !== "string" ||
      carName.trim().length === 0 ||
      typeof kWhNeeded !== "number" ||
      !Number.isFinite(kWhNeeded) ||
      kWhNeeded <= 0 ||
      kWhNeeded > 500
    ) {
      return response.status(400).json({ message: "Invalid body: { carName: string, kWhNeeded: number > 0 }" });
    }

    const now = Date.now();
    const free = chargers.find(ch => !ch.busyUntil || ch.busyUntil <= now);
    if (!free) {
      return response.status(400).json({ message: "No chargers available" });
    }

    const chargeTimeMs = (kWhNeeded / POWER_PER_CHARGER_KW) * 60 * 60 * 1000;
    free.busyUntil = now + chargeTimeMs;

    const sessionId = sessions.length + 1;
    sessions.push({
      sessionId,
      chargerId: free.id,
      carName: carName.trim(),
      kWhNeeded,
      startTime: now,
      endTime: free.busyUntil,
    });

    response.json({
      message: "Charger reserved",
      chargerId: free.id,
      sessionId,
      endTime: toBerlinHHmm(free.busyUntil) ?? undefined,
    });
  }
);
