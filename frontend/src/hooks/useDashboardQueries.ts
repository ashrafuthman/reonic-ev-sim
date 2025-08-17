import { useQuery } from "@tanstack/react-query";
import { EMPTY_CHARGERS, REFRESH_MS } from "../consts";
import { type Stats, getStats } from "../api";
import { type Charger, getChargers } from "../api/getChargers";

export function useDashboardQueries() {
  const chargersQuery = useQuery<Charger[]>({
    queryKey: ["chargers"] as const,
    queryFn: ({ signal }) => getChargers(signal),
    refetchInterval: REFRESH_MS,
    refetchIntervalInBackground: true,
    placeholderData: EMPTY_CHARGERS,
    staleTime: REFRESH_MS,
  });

  const statsQuery = useQuery<Stats, Error, Stats & {
    totalRequestedStr: string;
    totalDeliveredStr: string;
    peakPct: number;
  }>({
    queryKey: ["stats"] as const,
    queryFn: ({ signal }) => getStats(signal),
    refetchInterval: REFRESH_MS,
    refetchIntervalInBackground: true,
    staleTime: REFRESH_MS,
    select: (s) => {
      const peakPct = Math.round(
        100 *
          (s.concurrencyFactor ??
            ((s.actualMaxPowerKW && s.theoreticalMaxPowerKW)
              ? s.actualMaxPowerKW / s.theoreticalMaxPowerKW
              : 0))
      );
      return {
        ...s,
        totalRequestedStr: s.totalEnergyRequested.toFixed(2),
        totalDeliveredStr: s.totalEnergyDelivered.toFixed(2),
        peakPct,
      };
    },
  });

  return { chargersQuery, statsQuery } as const;
}
