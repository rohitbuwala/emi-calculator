"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, TrendingUp, BarChart3, ArrowRightLeft, Info } from "lucide-react";
import LoanInputPanel from "@/components/LoanInputPanel";
import ResultsSummary from "@/components/ResultsSummary";
import AmortizationChart from "@/components/AmortizationChart";
import AmortizationTable from "@/components/AmortizationTable";
import ComparisonMode from "@/components/ComparisonMode";
import PieBreakdown from "@/components/PieBreakdown";
import { calculateEMI, type EMIResult } from "@/lib/emi";

type Tab = "overview" | "schedule" | "compare";

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "overview", label: "Overview", icon: <Calculator size={16} /> },
  { id: "schedule", label: "Schedule", icon: <BarChart3 size={16} /> },
  { id: "compare", label: "Compare", icon: <ArrowRightLeft size={16} /> },
];

const defaultValues = {
  principal: 2000000,
  annualRate: 8.5,
  tenureMonths: 240,
};

export default function HomePage() {
  const [principal, setPrincipal] = useState(defaultValues.principal);
  const [annualRate, setAnnualRate] = useState(defaultValues.annualRate);
  const [tenureMonths, setTenureMonths] = useState(defaultValues.tenureMonths);
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const result: EMIResult = calculateEMI(principal, annualRate, tenureMonths);

  const handleReset = useCallback(() => {
    setPrincipal(defaultValues.principal);
    setAnnualRate(defaultValues.annualRate);
    setTenureMonths(defaultValues.tenureMonths);
  }, []);

  return (
    <main className="min-h-screen py-6 sm:py-8 px-3 sm:px-4">
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
          style={{ background: "rgba(99, 102, 241, 0.15)", border: "1px solid rgba(99, 102, 241, 0.3)" }}>
          <TrendingUp size={14} className="text-indigo-400" />
          <span className="text-xs font-medium text-indigo-300 uppercase tracking-widest">Smart Loan Planner</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-3 gradient-text">
          EMI Calculator
        </h1>
        <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base px-2">
          Plan your loans with precision. Get instant EMI breakdowns, visual amortization
          schedules, and multi-scenario comparisons.
        </p>
      </motion.div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 xl:grid-cols-[380px_1fr] gap-6">
          {/* Left Panel — Input */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <LoanInputPanel
              principal={principal}
              annualRate={annualRate}
              tenureMonths={tenureMonths}
              onPrincipalChange={setPrincipal}
              onRateChange={setAnnualRate}
              onTenureChange={setTenureMonths}
              onReset={handleReset}
              result={result}
            />
          </motion.div>

          {/* Right Panel — Results */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col gap-5"
          >
            {/* Summary Cards */}
            <ResultsSummary result={result} />

            {/* Tab Navigation */}
            <div className="glass-card p-1 flex gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  id={`tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer ${
                    activeTab === tab.id
                      ? "tab-active shadow-lg"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                {activeTab === "overview" && (
                  <div className="flex flex-col gap-5">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                      <PieBreakdown result={result} />
                      <AmortizationChart result={result} />
                    </div>
                    {/* Info tip */}
                    <div className="glass-card p-4 flex items-start gap-3">
                      <Info size={16} className="text-indigo-400 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-slate-400 leading-relaxed">
                        <span className="text-indigo-300 font-medium">Pro tip:</span> Use the{" "}
                        <span className="text-slate-300">Compare</span> tab to analyze multiple loan
                        options side by side — great for comparing banks with different interest rates.
                      </p>
                    </div>
                  </div>
                )}
                {activeTab === "schedule" && (
                  <AmortizationTable schedule={result.amortizationSchedule} />
                )}
                {activeTab === "compare" && (
                  <ComparisonMode
                    defaultPrincipal={principal}
                    defaultRate={annualRate}
                    defaultTenure={tenureMonths}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 border-t" style={{ borderColor: "rgba(99,102,241,0.12)" }}>
        {/* Digital Heroes CTA */}
        <div className="flex justify-center pt-10 pb-6">
          <a
            id="digital-heroes-btn"
            href="https://digitalheroesco.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold text-sm text-white transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-transparent"
            style={{
              background: "linear-gradient(135deg, #6366f1, #06b6d4)",
              boxShadow: "0 0 24px rgba(99,102,241,0.45), 0 4px 16px rgba(0,0,0,0.3)",
            }}
          >
            <span className="text-lg">🦸</span>
            Built for Digital Heroes
            <svg
              className="w-4 h-4 opacity-70 group-hover:translate-x-0.5 transition-transform"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>

        {/* Divider + Info */}
        <div className="text-center pb-8 space-y-1.5">
          <p className="text-xs text-slate-500">
            All calculations are indicative. Actual EMI may vary based on bank policies.
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-slate-600">
            <span>EMI Calculator</span>
            <span className="text-slate-700">•</span>
            <span>Built with Next.js 16 &amp; TypeScript</span>
          </div>
          <div className="pt-2 flex flex-col items-center gap-1">
            <p className="text-sm font-medium text-slate-300">
              Developed by Rohit Buwala
            </p>

            <a
              href="mailto:rohitbuwala821@gmail.com"
              className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              rohitbuwala821@gmail.com
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
