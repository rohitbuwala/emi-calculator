"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Wallet, CreditCard } from "lucide-react";
import { formatCurrency, type EMIResult } from "@/lib/emi";

interface Props {
  result: EMIResult;
}

function AnimatedNumber({ value }: { value: number }) {
  const [displayed, setDisplayed] = useState(value);
  const prevRef = useRef(value);

  useEffect(() => {
    const start = prevRef.current;
    const end = value;
    const duration = 600;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setDisplayed(start + (end - start) * eased);
      if (progress < 1) requestAnimationFrame(animate);
      else prevRef.current = end;
    };

    requestAnimationFrame(animate);
  }, [value]);

  return <span>{formatCurrency(displayed)}</span>;
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  gradientClass: string;
  delay: number;
  id: string;
}

function StatCard({ title, value, icon, gradientClass, delay, id }: StatCardProps) {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      className="glass-card p-5 relative overflow-hidden group"
    >
      {/* Background glow */}
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${gradientClass}`}
        style={{ filter: "blur(40px)" }}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-500">{title}</span>
          <span className="text-slate-600 group-hover:text-slate-400 transition-colors">{icon}</span>
        </div>
        <div className="text-2xl font-bold text-slate-100">
          <AnimatedNumber value={value} />
        </div>
      </div>
    </motion.div>
  );
}

export default function ResultsSummary({ result }: Props) {
  const principalPercent = result.totalPayment > 0
    ? (result.principalAmount / result.totalPayment) * 100
    : 0;
  const interestPercent = 100 - principalPercent;

  return (
    <div className="space-y-4">
      {/* Main EMI Card */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        id="emi-card"
        className="glass-card p-6 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(6,182,212,0.1))", border: "1px solid rgba(99,102,241,0.4)" }}
      >
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #6366f1, transparent)", transform: "translate(30%, -30%)" }} />
        <div className="relative">
          <p className="text-sm text-slate-400 mb-1">Monthly EMI</p>
          <div className="text-4xl sm:text-5xl font-extrabold gradient-text mb-2 animate-pulse-glow" id="emi-value">
            <AnimatedNumber value={result.emi} />
          </div>
          <p className="text-xs text-slate-500">Equated Monthly Installment</p>
        </div>
      </motion.div>

      {/* 3 Stat Cards */}
      <div className="stat-grid-3 grid grid-cols-3 sm:grid-cols-3 gap-3">
        <StatCard
          id="principal-card"
          title="Principal"
          value={result.principalAmount}
          icon={<Wallet size={16} />}
          gradientClass="bg-indigo-600"
          delay={0.05}
        />
        <StatCard
          id="interest-card"
          title="Total Interest"
          value={result.totalInterest}
          icon={<TrendingUp size={16} />}
          gradientClass="bg-amber-500"
          delay={0.1}
        />
        <StatCard
          id="total-card"
          title="Total Payment"
          value={result.totalPayment}
          icon={<CreditCard size={16} />}
          gradientClass="bg-cyan-500"
          delay={0.15}
        />
      </div>

      {/* Progress Bar */}
      <div className="glass-card p-4">
        <div className="flex justify-between text-xs text-slate-400 mb-2">
          <span>Principal ({principalPercent.toFixed(1)}%)</span>
          <span>Interest ({interestPercent.toFixed(1)}%)</span>
        </div>
        <div className="h-3 rounded-full overflow-hidden flex" style={{ background: "rgba(99,102,241,0.1)" }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${principalPercent}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ background: "linear-gradient(90deg, #6366f1, #818cf8)" }}
            className="h-full rounded-l-full"
          />
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${interestPercent}%` }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            style={{ background: "linear-gradient(90deg, #f59e0b, #fbbf24)" }}
            className="h-full rounded-r-full"
          />
        </div>
        <div className="flex gap-4 mt-2">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ background: "#6366f1" }} />
            <span className="text-xs text-slate-500">Principal</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ background: "#f59e0b" }} />
            <span className="text-xs text-slate-500">Interest</span>
          </div>
        </div>
      </div>
    </div>
  );
}
