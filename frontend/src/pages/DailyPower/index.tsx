import TotalKWLine from "../../components/charts/TotalKWLine";

export default function DailyPower() {
  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Daily Power</h1>
      <TotalKWLine />
    </div>
  );
}
