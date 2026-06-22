"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { type EMIResult, formatCurrency } from "@/lib/emi";

interface Props {
  result: EMIResult;
}

const COLORS = {
  principal: "#6366f1",
  interest: "#f59e0b",
};

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number }> }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card px-4 py-3 text-sm">
        <p className="font-semibold text-slate-200">{payload[0].name}</p>
        <p className="text-indigo-300">{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

const CustomLegend = ({ payload }: { payload?: Array<{ value: string; color: string }> }) => (
  <div className="flex flex-col gap-2 mt-2">
    {payload?.map((entry) => (
      <div key={entry.value} className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm" style={{ background: entry.color }} />
          <span className="text-xs text-slate-400">{entry.value}</span>
        </div>
      </div>
    ))}
  </div>
);

export default function PieBreakdown({ result }: Props) {
  const data = [
    { name: "Principal", value: result.principalAmount },
    { name: "Total Interest", value: result.totalInterest },
  ];

  const interestRate = result.totalPayment > 0
    ? ((result.totalInterest / result.totalPayment) * 100).toFixed(1)
    : "0.0";

  return (
    <div className="glass-card p-5">
      <h3 className="text-sm font-semibold text-slate-300 mb-4">Payment Breakdown</h3>
      <div className="relative">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
              animationDuration={800}
              animationEasing="ease-out"
            >
              {data.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={index === 0 ? COLORS.principal : COLORS.interest}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xs text-slate-500">Interest</span>
          <span className="text-xl font-bold gradient-text">{interestRate}%</span>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-2 mt-2">
        {data.map((entry, i) => (
          <div key={entry.name} className="flex items-center justify-between py-1.5 px-3 rounded-lg" style={{ background: "rgba(255,255,255,0.03)" }}>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ background: i === 0 ? COLORS.principal : COLORS.interest }} />
              <span className="text-xs text-slate-400">{entry.name}</span>
            </div>
            <span className="text-xs font-semibold text-slate-200">{formatCurrency(entry.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
