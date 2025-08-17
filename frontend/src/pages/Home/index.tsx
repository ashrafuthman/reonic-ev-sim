import ParkingSlot from "../../components/ParkingSlot";
import { useDashboardQueries } from "../../hooks/useDashboardQueries";


export default function Home() {
  const { chargersQuery, statsQuery } = useDashboardQueries();
  const chargers = chargersQuery.data!;
  const stats = statsQuery.data;

  const totalRequested = stats ? stats.totalEnergyRequested.toFixed(2) : "0.00";
  const totalDelivered = stats ? stats.totalEnergyDelivered.toFixed(2) : "0.00";

  const peakPct = stats
    ? Math.round(
        100 *
          (stats.concurrencyFactor ??
            ((stats.actualMaxPowerKW && stats.theoreticalMaxPowerKW)
              ? stats.actualMaxPowerKW / stats.theoreticalMaxPowerKW
              : 0))
      )
    : 0;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-center mb-6">Parking Slots</h1>
        <div className="text-center mb-4">
          <p className="text-lg font-semibold">Total energy requested: {totalRequested} kWh</p>
          <p className="text-lg font-semibold">Total energy delivered: {totalDelivered} kWh</p>
          <p className="text-lg font-semibold">Actual max power: {stats?.actualMaxPowerKW ?? 0} kW</p>
          <p className="text-lg font-semibold">Theoretical max power: {stats?.theoreticalMaxPowerKW ?? 0} kW</p>
          <p className="text-lg font-semibold">Peak Usage: {peakPct}%</p>
        </div>
      </div>
      <div className="flex justify-center items-center w-full h-full px-5 py-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
          {chargers.map((slot) => (
            <ParkingSlot key={slot.id} slot={slot} />
          ))}
        </div>
      </div>
    </div>
  );
}
