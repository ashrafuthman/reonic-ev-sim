import { useQueryClient } from "@tanstack/react-query";
import { useAutoReserve } from "../../hooks/useAutoReserve";

export default function AutoReserveRunner() {
  const queryClient = useQueryClient();

  useAutoReserve({
    enabled: true,
    intervalMilliseconds: 900_000,
    arrivalMultiplierPercent: 100,
    numberOfChargePoints: 20,
    onAttemptCallback: (info) => {
      if (info.ok && (info.kilowattHours ?? 0) > 0) {
        queryClient.invalidateQueries({ queryKey: ["chargers"] });
        queryClient.invalidateQueries({ queryKey: ["stats"] });
      }
    },
  });

  return null;
}
