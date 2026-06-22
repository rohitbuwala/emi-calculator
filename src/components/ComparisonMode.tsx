"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, TrendingDown } from "lucide-react";
import { calculateEMI, formatCurrency, formatTenure, type LoanScenario } from "@/lib/emi";

interface Props {
  defaultPrincipal: number;
  defaultRate: number;
  defaultTenure: number;
}

const SCENARIO_COLORS = ["#6366f1", "#06b6d4", "#10b981", "#f59e0b", "#ec4899"];

let nextId = 3;

export default function ComparisonMode({ defaultPrincipal, defaultRate, defaultTenure }: Props) {
  const [scenarios, setScenarios] = useState<LoanScenario[]>([
    {
      id: "1",
      label: "Scenario A",
      principal: defaultPrincipal,
      annualRate: defaultRate,
      tenureMonths: defaultTenure,
      color: SCENARIO_COLORS[0],
    },
    {
      id: "2",
      label: "Scenario B",
      principal: defaultPrincipal,
      annualRate: defaultRate + 1,
      tenureMonths: defaultTenure,
      color: SCENARIO_COLORS[1],
    },
  ]);

  const addScenario = () => {
    if (scenarios.length >= 5) return;
    setScenarios((prev) => [
      ...prev,
      {
        id: String(nextId++),
        label: `Scenario ${String.fromCharCode(65 + prev.length)}`,
        principal: defaultPrincipal,
        annualRate: defaultRate,
        tenureMonths: defaultTenure,
        color: SCENARIO_COLORS[prev.length],
      },
    ]);
  };

  const removeScenario = (id: string) => {
    if (scenarios.length <= 1) return;
    setScenarios((prev) => prev.filter((s) => s.id !== id));
  };

  const updateScenario = (id: string, field: keyof LoanScenario, value: string | number) => {
    setScenarios((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const results = scenarios.map((s) => ({
    scenario: s,
    result: calculateEMI(s.principal, s.annualRate, s.tenureMonths),
  }));

  // Find best (lowest EMI)
  const minEMI = Math.min(...results.map((r) => r.result.emi));
  const minInterest = Math.min(...results.map((r) => r.result.totalInterest));

  return (
    <div className="flex flex-col gap-5">
      {/* Scenario Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {scenarios.map((scenario, idx) => {
            const result = results.find((r) => r.scenario.id === scenario.id)?.result;

            return (
              <motion.div
                key={scenario.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25 }}
                className="glass-card p-5"
                style={{ borderColor: `${scenario.color}40` }}
              >
                {/* Card Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: scenario.color }} />
                    <input
                      value={scenario.label}
                      onChange={(e) => updateScenario(scenario.id, "label", e.target.value)}
                      className="text-sm font-semibold text-slate-200 bg-transparent border-b border-transparent hover:border-slate-600 focus:border-indigo-500 focus:outline-none transition-colors"
                    />
                  </div>
                  {scenarios.length > 1 && (
                    <button
                      onClick={() => removeScenario(scenario.id)}
                      className="text-slate-600 hover:text-red-400 transition-colors cursor-pointer p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>

                {/* Inputs */}
                <div className="space-y-3">
                  <CompareInput
                    label="Principal (₹)"
                    value={scenario.principal}
                    min={100000}
                    max={50000000}
                    step={50000}
                    onChange={(v) => updateScenario(scenario.id, "principal", v)}
                    id={`compare-principal-${scenario.id}`}
                  />
                  <CompareInput
                    label="Rate (%)"
                    value={scenario.annualRate}
                    min={1}
                    max={30}
                    step={0.1}
                    onChange={(v) => updateScenario(scenario.id, "annualRate", v)}
                    id={`compare-rate-${scenario.id}`}
                  />
                  <CompareInput
                    label="Tenure (months)"
                    value={scenario.tenureMonths}
                    min={12}
                    max={360}
                    step={12}
                    onChange={(v) => updateScenario(scenario.id, "tenureMonths", v)}
                    id={`compare-tenure-${scenario.id}`}
                  />
                </div>

                {/* Result */}
                {result && (
                  <div className="mt-4 pt-4 border-t" style={{ borderColor: "rgba(99,102,241,0.1)" }}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-500">Monthly EMI</span>
                      {result.emi === minEMI && (
                        <span className="text-xs px-1.5 py-0.5 rounded-full text-emerald-300 font-medium"
                          style={{ background: "rgba(16, 185, 129, 0.15)" }}>
                          Best EMI
                        </span>
                      )}
                    </div>
                    <div className="text-2xl font-bold" style={{ color: scenario.color }}>
                      {formatCurrency(result.emi)}
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div>
                        <p className="text-xs text-slate-500">Total Interest</p>
                        <p className="text-sm font-medium text-amber-400">{formatCurrency(result.totalInterest)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Total Payment</p>
                        <p className="text-sm font-medium text-slate-300">{formatCurrency(result.totalPayment)}</p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Add Scenario */}
        {scenarios.length < 5 && (
          <motion.button
            id="add-scenario-btn"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={addScenario}
            className="glass-card p-5 flex flex-col items-center justify-center gap-3 text-slate-500 hover:text-indigo-400 hover:border-indigo-500/40 transition-all duration-300 cursor-pointer min-h-[200px]"
            style={{ border: "1px dashed rgba(99,102,241,0.3)" }}
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(99,102,241,0.1)" }}>
              <Plus size={20} />
            </div>
            <span className="text-sm font-medium">Add Scenario</span>
          </motion.button>
        )}
      </div>

      {/* Comparison Summary Table */}
      {results.length > 1 && (
        <div className="glass-card overflow-hidden">
          <div className="px-5 py-4 border-b" style={{ borderColor: "rgba(99,102,241,0.15)" }}>
            <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
              <TrendingDown size={16} className="text-indigo-400" />
              Side-by-Side Comparison
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Metric</th>
                  {results.map((r) => (
                    <th key={r.scenario.id} className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider" style={{ color: r.scenario.color }}>
                      {r.scenario.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { label: "Monthly EMI", key: "emi" as const, best: "min" },
                  { label: "Total Interest", key: "totalInterest" as const, best: "min" },
                  { label: "Total Payment", key: "totalPayment" as const, best: "min" },
                ].map((metric) => {
                  const values = results.map((r) => r.result[metric.key]);
                  const bestVal = metric.best === "min" ? Math.min(...values) : Math.max(...values);

                  return (
                    <tr key={metric.label} className="border-t" style={{ borderColor: "rgba(99,102,241,0.07)" }}>
                      <td className="px-5 py-3 text-slate-400">{metric.label}</td>
                      {results.map((r) => {
                        const val = r.result[metric.key];
                        const isBest = val === bestVal;
                        return (
                          <td key={r.scenario.id} className="px-5 py-3 text-right">
                            <span className={`font-medium ${isBest ? "text-emerald-400" : "text-slate-300"}`}>
                              {formatCurrency(val)}
                            </span>
                            {isBest && <span className="ml-1.5 text-xs text-emerald-500">✓</span>}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
                <tr className="border-t" style={{ borderColor: "rgba(99,102,241,0.07)" }}>
                  <td className="px-5 py-3 text-slate-400">Tenure</td>
                  {results.map((r) => (
                    <td key={r.scenario.id} className="px-5 py-3 text-right text-slate-300 font-medium">
                      {formatTenure(r.scenario.tenureMonths)}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function CompareInput({
  label,
  value,
  min,
  max,
  step,
  onChange,
  id,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  id: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <label htmlFor={id} className="text-xs text-slate-500 w-32 flex-shrink-0">{label}</label>
      <input
        id={id}
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => {
          const v = parseFloat(e.target.value);
          if (!isNaN(v) && v >= min && v <= max) onChange(v);
        }}
        className="number-input flex-1 px-3 py-1.5 text-sm text-right font-medium"
      />
    </div>
  );
}
