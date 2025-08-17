import { Session } from "types/api";

export const overlaps = (s: Session, startMs: number, endMs: number) =>
  s.startTime < endMs && s.endTime > startMs;
