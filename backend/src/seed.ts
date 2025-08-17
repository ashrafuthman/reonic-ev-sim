// src/seed.ts

export interface Charger {
  id: number;
  busyUntil: number | null;
}

export interface Session {
  sessionId: number;
  chargerId: number;
  carName: string;
  kWhNeeded: number;
  startTime: number;
  endTime: number;
}

export function seedData(chargers: Charger[], sessions: Session[]) {
  const now = Date.now();

  for (let i = 1; i <= 5; i++) {
    const kWhNeeded = Math.floor(Math.random() * 20) + 5; // random 5–25 kWh
    const duration = (kWhNeeded / 11) * 60 * 60 * 1000; // charging time in ms

    const startTime = now - i * 60 * 60 * 1000; // each session starts earlier
    const endTime = startTime + duration;

    sessions.push({
      sessionId: sessions.length + 1,
      chargerId: i,
      carName: `Car-${i}`,
      kWhNeeded,
      startTime,
      endTime
    });

    if (i <= 3 && chargers[i - 1] !== undefined) {
      chargers[i - 1]!.busyUntil = now + duration; // mark as busy
    }
  }
}
