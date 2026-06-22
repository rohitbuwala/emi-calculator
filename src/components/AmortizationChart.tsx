"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { type EMIResult, getYearlyChartData, formatCurrency } from "@/lib/emi";

interface Props {
  result: EMIResult;
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card px-4 py-3 text-sm min-w-[160px]">
        <p className="font-semibold text-slate-300 mb-2">Year {label}</p>
        {payload.map((entry) => (
          <div key={entry.name} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-sm" style={{ background: entry.color }} />
              <span className="text-xs text-slate-400">{entry.name}</span>
            </div>
            <span className="text-xs font-semibold text-slate-200">{formatCurrency(entry.value)}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function AmortizationChart({ result }: Props) {
  const data = getYearlyChartData(result.amortizationSchedule);

  if (data.length === 0) {
    return (
      <div className="glass-card p-5 flex items-center justify-center h-[260px]">
        <p className="text-slate-500 text-sm">Enter loan details to see chart</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-5">
      <h3 className="text-sm font-semibold text-slate-300 mb-4">Yearly Breakdown</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} barSize={14} barGap={2}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(99,102,241,0.1)"
            vertical={false}
          />
          <XAxis
            dataKey="year"
            tick={{ fill: "#64748b", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            label={{ value: "Year", position: "insideBottom", fill: "#475569", fontSize: 11, dy: 6 }}
          />
          <YAxis
            tick={{ fill: "#64748b", fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => {
              if (v >= 100000) return `${(v / 100000).toFixed(0)}L`;
              if (v >= 1000) return `${(v / 1000).toFixed(0)}K`;
              return String(v);
            }}
            width={38}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(99,102,241,0.05)" }} />
          <Bar
            dataKey="principal"
            name="Principal"
            stackId="a"
            fill="#6366f1"
            radius={[0, 0, 0, 0]}
          />
          <Bar
            dataKey="interest"
            name="Interest"
            stackId="a"
            fill="#f59e0b"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex gap-4 mt-3">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm" style={{ background: "#6366f1" }} />
          <span className="text-xs text-slate-400">Principal</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm" style={{ background: "#f59e0b" }} />
          <span className="text-xs text-slate-400">Interest</span>
        </div>
      </div>
    </div>
  );
}
