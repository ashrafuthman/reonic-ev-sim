import { BASE, fetchJson } from "./base";

export type ReserveRequest = { carName: string; kWhNeeded: number };

export type ReserveResponse = {
  message: string;
  chargerId: number;
  sessionId: number;
  endTime?: string;
};

export async function reserve(body: ReserveRequest): Promise<ReserveResponse> {
  return fetchJson<ReserveResponse>(`${BASE}/reserve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
