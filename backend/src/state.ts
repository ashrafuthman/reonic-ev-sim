import { Charger, Session } from "types/api";
import { CHARGER_COUNT } from "./config";

export const chargers: Charger[] = Array.from({ length: CHARGER_COUNT }, (_, i) => ({
  id: i + 1,
  busyUntil: null,
}));

export const sessions: Session[] = [];

export function startBusyCleanup(everyMs = 30_000) {
  setInterval(() => {
    const now = Date.now();
    chargers.forEach((c) => {
      if (c.busyUntil && c.busyUntil <= now) c.busyUntil = null;
    });
  }, everyMs);
}
