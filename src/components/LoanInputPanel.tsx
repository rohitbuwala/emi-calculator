"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { RefreshCw, IndianRupee, Percent, Clock } from "lucide-react";
import { formatCurrency, formatTenure, type EMIResult } from "@/lib/emi";

interface Props {
  principal: number;
  annualRate: number;
  tenureMonths: number;
  onPrincipalChange: (v: number) => void;
  onRateChange: (v: number) => void;
  onTenureChange: (v: number) => void;
  onReset: () => void;
  result: EMIResult;
}

interface SliderFieldProps {
  label: string;
  icon: React.ReactNode;
  value: number;
  min: number;
  max: number;
  step: number;
  displayValue: string;
  inputSuffix?: string;
  onChange: (v: number) => void;
  formatSliderValue: (v: number) => string;
  inputId: string;
  sliderId: string;
}

function SliderField({
  label,
  icon,
  value,
  min,
  max,
  step,
  displayValue,
  inputSuffix,
  onChange,
  formatSliderValue,
  inputId,
  sliderId,
}: SliderFieldProps) {
  const [inputVal, setInputVal] = useState(String(value));
  const [focused, setFocused] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setInputVal(raw);
    const num = parseFloat(raw);
    if (!isNaN(num) && num >= min && num <= max) {
      onChange(num);
    }
  };

  const handleInputBlur = () => {
    setFocused(false);
    setInputVal(String(value));
  };

  const percent = ((value - min) / (max - min)) * 100;
  const sliderStyle = { "--value": `${percent}%` } as React.CSSProperties;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-indigo-400">{icon}</span>
          <label htmlFor={inputId} className="text-sm font-medium text-slate-300">
            {label}
          </label>
        </div>
        <div className="flex items-center gap-1">
          <input
            id={inputId}
            type="number"
            value={focused ? inputVal : value}
            min={min}
            max={max}
            step={step}
            onChange={handleInputChange}
            onFocus={() => {
              setFocused(true);
              setInputVal(String(value));
            }}
            onBlur={handleInputBlur}
            className="number-input w-28 text-right px-3 py-1.5 text-sm font-semibold"
          />
          {inputSuffix && (
            <span className="text-xs text-slate-500 ml-1">{inputSuffix}</span>
          )}
        </div>
      </div>

      <input
        id={sliderId}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        style={sliderStyle}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="slider w-full mb-2"
      />

      <div className="flex justify-between text-xs text-slate-600">
        <span>{formatSliderValue(min)}</span>
        <span className="text-indigo-400 font-medium">{displayValue}</span>
        <span>{formatSliderValue(max)}</span>
      </div>
    </div>
  );
}

export default function LoanInputPanel({
  principal,
  annualRate,
  tenureMonths,
  onPrincipalChange,
  onRateChange,
  onTenureChange,
  onReset,
  result,
}: Props) {
  const [tenureMode, setTenureMode] = useState<"months" | "years">("years");

  const tenureDisplayMonths = tenureMonths;

  const handleTenureChange = (v: number) => {
    onTenureChange(tenureMode === "years" ? v * 12 : v);
  };

  const tenureValue = tenureMode === "years" ? tenureMonths / 12 : tenureMonths;

  return (
    <div className="glass-card p-6 h-full flex flex-col gap-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-100">Loan Details</h2>
        <button
          id="reset-btn"
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-indigo-300 hover:bg-indigo-900/30 transition-all duration-200 cursor-pointer"
        >
          <RefreshCw size={13} />
          Reset
        </button>
      </div>

      {/* Loan Amount */}
      <SliderField
        label="Loan Amount"
        icon={<IndianRupee size={15} />}
        value={principal}
        min={100000}
        max={50000000}
        step={50000}
        displayValue={formatCurrency(principal)}
        onChange={onPrincipalChange}
        formatSliderValue={(v) => v >= 100000 ? `₹${(v / 100000).toFixed(0)}L` : `₹${(v / 1000).toFixed(0)}K`}
        inputId="principal-input"
        sliderId="principal-slider"
      />

      {/* Interest Rate */}
      <SliderField
        label="Interest Rate (p.a.)"
        icon={<Percent size={15} />}
        value={annualRate}
        min={1}
        max={30}
        step={0.1}
        displayValue={`${annualRate.toFixed(1)}%`}
        inputSuffix="%"
        onChange={onRateChange}
        formatSliderValue={(v) => `${v}%`}
        inputId="rate-input"
        sliderId="rate-slider"
      />

      {/* Tenure */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-indigo-400"><Clock size={15} /></span>
            <label className="text-sm font-medium text-slate-300">Loan Tenure</label>
          </div>
          <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: "rgba(99,102,241,0.3)" }}>
            <button
              id="tenure-years-btn"
              onClick={() => setTenureMode("years")}
              className={`px-3 py-1 text-xs font-medium transition-colors cursor-pointer ${
                tenureMode === "years" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Years
            </button>
            <button
              id="tenure-months-btn"
              onClick={() => setTenureMode("months")}
              className={`px-3 py-1 text-xs font-medium transition-colors cursor-pointer ${
                tenureMode === "months" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Months
            </button>
          </div>
        </div>

        <input
          id="tenure-slider"
          type="range"
          min={tenureMode === "years" ? 1 : 12}
          max={tenureMode === "years" ? 30 : 360}
          step={tenureMode === "years" ? 1 : 1}
          value={tenureValue}
          style={{ "--value": `${((tenureValue - (tenureMode === "years" ? 1 : 12)) / ((tenureMode === "years" ? 30 : 360) - (tenureMode === "years" ? 1 : 12))) * 100}%` } as React.CSSProperties}
          onChange={(e) => handleTenureChange(parseFloat(e.target.value))}
          className="slider w-full mb-2"
        />
        <div className="flex justify-between text-xs text-slate-600">
          <span>{tenureMode === "years" ? "1 yr" : "12 mo"}</span>
          <span className="text-indigo-400 font-medium">{formatTenure(tenureDisplayMonths)}</span>
          <span>{tenureMode === "years" ? "30 yrs" : "360 mo"}</span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t mt-2 mb-4" style={{ borderColor: "rgba(99,102,241,0.15)" }} />

      {/* Quick Stats */}
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Quick Summary</p>
        <QuickStat label="Monthly EMI" value={formatCurrency(result.emi)} highlight />
        <QuickStat label="Total Interest" value={formatCurrency(result.totalInterest)} color="text-amber-400" />
        <QuickStat label="Total Amount" value={formatCurrency(result.totalPayment)} />
        <QuickStat label="Interest %" value={`${result.totalPayment > 0 ? ((result.totalInterest / result.totalPayment) * 100).toFixed(1) : 0}%`} />
      </div>
    </div>
  );
}

function QuickStat({ label, value, highlight, color }: { label: string; value: string; highlight?: boolean; color?: string }) {
  return (
    <div className="flex items-center justify-between py-2 px-3 rounded-lg" style={{ background: "rgba(255,255,255,0.03)" }}>
      <span className="text-xs text-slate-400">{label}</span>
      <span className={`text-sm font-semibold ${highlight ? "gradient-text" : color ?? "text-slate-200"}`}>
        {value}
      </span>
    </div>
  );
}
