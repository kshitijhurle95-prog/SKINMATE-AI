"use client";

import React from "react";
import { Search, IndianRupee, Filter } from "lucide-react";
import { formatPriceINR } from "@/lib/utils";

interface BudgetFilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  maxBudget: number;
  onBudgetChange: (val: number) => void;
}

const CATEGORIES = [
  { id: "all", label: "All Categories" },
  { id: "cleanser", label: "Cleansers" },
  { id: "moisturiser", label: "Moisturisers" },
  { id: "sunscreen", label: "Sunscreens" },
  { id: "serum", label: "Serums" },
  { id: "treatment", label: "Treatments" },
];

const BUDGET_PRESETS = [
  { label: "Under ₹500", val: 500 },
  { label: "Under ₹1,000", val: 1000 },
  { label: "Under ₹1,500", val: 1500 },
  { label: "Under ₹3,000", val: 3000 },
];

export function BudgetFilterBar({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  maxBudget,
  onBudgetChange,
}: BudgetFilterBarProps) {
  return (
    <div className="rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 sm:p-6 shadow-card space-y-5">
      {/* Top Search & Budget Header */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by ingredient (e.g. Niacinamide, Salicylic), brand, or concern..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-11 w-full pl-10 pr-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-black text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-black transition-all"
          />
        </div>

        {/* Live Budget Ceiling Slider */}
        <div className="flex items-center gap-3 bg-slate-50 dark:bg-black p-2.5 rounded-2xl border border-slate-200/90 dark:border-zinc-800">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900 dark:text-white pl-1 whitespace-nowrap">
            <IndianRupee className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>Budget Cap:</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-bold ml-0.5">
              {formatPriceINR(maxBudget)}
            </span>
          </div>

          <input
            type="range"
            min="250"
            max="3000"
            step="50"
            value={maxBudget}
            onChange={(e) => onBudgetChange(Number(e.target.value))}
            className="w-32 sm:w-44 accent-emerald-600 h-1.5 bg-slate-200 dark:bg-zinc-700 rounded-lg cursor-pointer"
            aria-label="Filter products by budget ceiling"
          />
        </div>
      </div>

      {/* Preset Pills & Category Filters */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pt-2 border-t border-slate-200/80 dark:border-zinc-800">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  isSelected
                    ? "bg-emerald-600 dark:bg-emerald-500 text-white shadow-soft font-semibold"
                    : "bg-slate-100 dark:bg-black text-slate-700 dark:text-white border border-slate-200 dark:border-zinc-800 hover:border-emerald-500 hover:bg-slate-200/60 dark:hover:bg-zinc-800"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Quick Budget Presets */}
        <div className="flex items-center gap-1.5 self-stretch sm:self-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-[11px] text-slate-400 uppercase font-semibold mr-1 flex items-center gap-1">
            <Filter className="h-3 w-3" /> Presets:
          </span>
          {BUDGET_PRESETS.map((p) => {
            const isActive = maxBudget === p.val;
            return (
              <button
                key={p.val}
                onClick={() => onBudgetChange(p.val)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap border transition-all ${
                  isActive
                    ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-700 font-semibold"
                    : "border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-zinc-800"
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
