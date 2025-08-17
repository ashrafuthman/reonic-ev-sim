import { memo } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from "recharts";
import { useDaySeriesLine } from "../../../hooks/useDaySeries";

function TotalKWLineInner({ day }: { day?: string }) {
  const { data } = useDaySeriesLine(day);
  if (!data) return <div className="text-sm text-gray-500">Loading day series…</div>;

  const { line } = data;

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="flex items-baseline justify-between">
        <h2 className="text-lg font-semibold">Site Power (kW)</h2>
        <div className="text-xs text-gray-500">15-min steps</div>
      </div>

      <div className="mt-3 h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={line}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timeLabel" />
            <YAxis allowDecimals />
            <Tooltip />
            <Line type="monotone" dataKey="totalKW" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default memo(TotalKWLineInner);
