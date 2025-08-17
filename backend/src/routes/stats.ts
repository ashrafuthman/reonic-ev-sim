import { Router, Response } from "express";
import { chargers, sessions } from "../state";
import { POWER_PER_CHARGER_KW } from "../config";
import { computeStats } from "../services/stats";
import type { StatsResponse } from "../types/api";

export const statsRouter = Router();

statsRouter.get("/", (_req, res: Response<StatsResponse>) => {
  const now = Date.now();
  const stats = computeStats(sessions, chargers.length, POWER_PER_CHARGER_KW, now);

  res.json({
      ...stats,
  });
});
