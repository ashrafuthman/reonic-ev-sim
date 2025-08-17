export type Session = {
  sessionId: number;
  chargerId: number;
  carName: string;
  kWhNeeded: number;
  startTime: number;
  endTime: number; 
};

export type Charger = {
  id: number;
  busyUntil: number | null;
};

export type LiveSessionOut = {
  sessionId: number;
  carName: string;
  kWhNeeded: number;
  startTime: string;
  endTime: string; 
  remainingMs: number;
  remainingMilliseconds?: number;
  remainingMinutes: number;
  percentageRemaining: number;
  percentageComplete: number;
};

export type ChargerOut = {
  id: number;
  busyUntil: string | null;
  isActive: boolean;
  session: LiveSessionOut | null;
  warning?: string;
};

export type ReserveRequest = { carName: string; kWhNeeded: number };
export type ReserveResponse = {
  message: string;
  chargerId: number;
  sessionId: number;
  endTime?: string;
};

export type DaySeriesRow = {
  timeLabel: string;
  totalPowerKilowatts: number;
  perChargerPowerKilowatts: number[];
};

export type DaySeriesResponse = {
  timezone: string;
  day: string;
  stepMinutes: number;
  perTick: DaySeriesRow[];
};


export type StatsResponse = {
  totalSessions: number;
  totalEnergyRequested: number;
  totalEnergyDelivered: number;
  totalEnergyRemaining: number;
  deliveryProgressPercent: number;
  theoreticalMaxPowerKW: number;
  actualMaxPowerKW: number;
  concurrencyFactor: number;
  totalEnergyKWh: number;
  peakInUse: number;
};