export type ChargingDemandEntry = {
  probability: number;
  kmRange: number;
};

export interface AutoReserveAttemptInfo {
  chargerIndex: number;
  triggered: boolean;
  kilometers?: number;
  kilowattHours?: number;
  ok?: boolean;
  error?: string;
  chargerId?: number;
  sessionId?: number;
}

export interface UseAutoReserveOptions {
  enabled?: boolean;
  intervalMilliseconds?: number;                     // default 900_000 (15 min)
  arrivalMultiplierPercent?: number;                 // 20..200, default 100
  consumptionKilowattHoursPer100Kilometers?: number; // default 18
  randomNumberGenerator?: () => number;              // default Math.random
  numberOfChargePoints?: number;                     // default 20
  onAttemptCallback?: (info: AutoReserveAttemptInfo) => void;
}

export type LinePoint = { timeLabel: string; totalKW: number };

export type DaySeriesLineResult = {
  line: LinePoint[];
  meta: { day: string; timezone: string; stepMinutes: number };
};
