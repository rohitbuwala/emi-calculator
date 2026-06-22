"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { type AmortizationEntry, formatCurrency } from "@/lib/emi";

interface Props {
  schedule: AmortizationEntry[];
}

const PAGE_SIZE = 12;

export default function AmortizationTable({ schedule }: Props) {
  const [page, setPage] = useState(0);
  const [viewMode, setViewMode] = useState<"monthly" | "yearly">("monthly");

  if (schedule.length === 0) {
    return (
      <div className="glass-card p-8 text-center">
        <p className="text-slate-500">Enter loan details to see amortization schedule</p>
      </div>
    );
  }

  // Build yearly summary
  const yearlyData = (() => {
    const grouped: Array<{
      year: number;
      totalEMI: number;
      totalPrincipal: number;
      totalInterest: number;
      closingBalance: number;
    }> = [];

    for (let i = 0; i < schedule.length; i += 12) {
      const chunk = schedule.slice(i, i + 12);
      grouped.push({
        year: Math.floor(i / 12) + 1,
        totalEMI: chunk.reduce((s, e) => s + e.emi, 0),
        totalPrincipal: chunk.reduce((s, e) => s + e.principal, 0),
        totalInterest: chunk.reduce((s, e) => s + e.interest, 0),
        closingBalance: chunk[chunk.length - 1].balance,
      });
    }
    return grouped;
  })();

  const isMonthly = viewMode === "monthly";
  const totalPages = isMonthly ? Math.ceil(schedule.length / PAGE_SIZE) : Math.ceil(yearlyData.length / PAGE_SIZE);
  const startIndex = page * PAGE_SIZE;

  const currentData = isMonthly
    ? schedule.slice(startIndex, startIndex + PAGE_SIZE)
    : yearlyData.slice(startIndex, startIndex + PAGE_SIZE);

  const handleViewChange = (mode: "monthly" | "yearly") => {
    setViewMode(mode);
    setPage(0);
  };

  return (
    <div className="glass-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: "rgba(99,102,241,0.15)" }}>
        <h3 className="text-sm font-semibold text-slate-300">Amortization Schedule</h3>
        <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: "rgba(99,102,241,0.3)" }}>
          <button
            id="monthly-view-btn"
            onClick={() => handleViewChange("monthly")}
            className={`px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
              isMonthly ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Monthly
          </button>
          <button
            id="yearly-view-btn"
            onClick={() => handleViewChange("yearly")}
            className={`px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
              !isMonthly ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Yearly
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="emi-table w-full text-sm">
          <thead>
            <tr>
              {isMonthly ? (
                <>
                  <th className="px-5 py-3 text-left">Month</th>
                  <th className="px-5 py-3 text-right">EMI</th>
                  <th className="px-5 py-3 text-right">Principal</th>
                  <th className="px-5 py-3 text-right">Interest</th>
                  <th className="px-5 py-3 text-right">Balance</th>
                </>
              ) : (
                <>
                  <th className="px-5 py-3 text-left">Year</th>
                  <th className="px-5 py-3 text-right">Total EMI</th>
                  <th className="px-5 py-3 text-right">Principal</th>
                  <th className="px-5 py-3 text-right">Interest</th>
                  <th className="px-5 py-3 text-right">Balance</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {isMonthly
              ? (currentData as AmortizationEntry[]).map((row, idx) => (
                  <motion.tr
                    key={row.month}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.02 }}
                    className="border-t"
                    style={{ borderColor: "rgba(99,102,241,0.07)" }}
                  >
                    <td className="px-5 py-3 text-slate-400">{row.month}</td>
                    <td className="px-5 py-3 text-right text-slate-300 font-medium">
                      {formatCurrency(row.emi)}
                    </td>
                    <td className="px-5 py-3 text-right text-indigo-400">
                      {formatCurrency(row.principal)}
                    </td>
                    <td className="px-5 py-3 text-right text-amber-400">
                      {formatCurrency(row.interest)}
                    </td>
                    <td className="px-5 py-3 text-right text-slate-400">
                      {formatCurrency(row.balance)}
                    </td>
                  </motion.tr>
                ))
              : (currentData as typeof yearlyData).map((row, idx) => (
                  <motion.tr
                    key={row.year}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.03 }}
                    className="border-t"
                    style={{ borderColor: "rgba(99,102,241,0.07)" }}
                  >
                    <td className="px-5 py-3 text-slate-400">Year {row.year}</td>
                    <td className="px-5 py-3 text-right text-slate-300 font-medium">
                      {formatCurrency(row.totalEMI)}
                    </td>
                    <td className="px-5 py-3 text-right text-indigo-400">
                      {formatCurrency(row.totalPrincipal)}
                    </td>
                    <td className="px-5 py-3 text-right text-amber-400">
                      {formatCurrency(row.totalInterest)}
                    </td>
                    <td className="px-5 py-3 text-right text-slate-400">
                      {formatCurrency(row.closingBalance)}
                    </td>
                  </motion.tr>
                ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3 border-t" style={{ borderColor: "rgba(99,102,241,0.15)" }}>
          <span className="text-xs text-slate-500">
            {isMonthly
              ? `Month ${startIndex + 1}–${Math.min(startIndex + PAGE_SIZE, schedule.length)} of ${schedule.length}`
              : `Year ${startIndex + 1}–${Math.min(startIndex + PAGE_SIZE, yearlyData.length)} of ${yearlyData.length}`}
          </span>
          <div className="flex gap-1">
            <button
              id="prev-page-btn"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              const pageNum = totalPages <= 7 ? i : (page < 4 ? i : page - 3 + i);
              if (pageNum >= totalPages) return null;
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    page === pageNum
                      ? "bg-indigo-600 text-white"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                  }`}
                >
                  {pageNum + 1}
                </button>
              );
            })}
            <button
              id="next-page-btn"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
