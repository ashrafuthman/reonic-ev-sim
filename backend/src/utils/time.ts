import { DateTime } from "luxon";
import { TIMEZONE } from "../config";

export const toBerlinHHmm = (ms: number | null) =>
  ms ? DateTime.fromMillis(Math.round(ms)).setZone(TIMEZONE).toFormat("HH:mm") : null;

export const formatBerlinTime = (ms: number) =>
  DateTime.fromMillis(ms).setZone(TIMEZONE).toFormat("HH:mm");

export const berlinDayStart = (iso?: string) =>
  iso
    ? DateTime.fromISO(iso, { zone: TIMEZONE }).startOf("day")
    : DateTime.now().setZone(TIMEZONE).startOf("day");
