"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sun, Moon, Sparkles, IndianRupee, ArrowRight, ShieldCheck, RefreshCw, Check, ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { RoutineStepCard } from "@/components/routine/RoutineStepCard";
import { ConflictAlert } from "@/components/routine/ConflictAlert";
import { getStoredRoutine, saveStoredRoutine, getStoredProfile } from "@/lib/store/local-store";
import { CURATED_PRODUCTS } from "@/lib/data/curated-products";
import { findAffordableAlternatives } from "@/lib/recommendation/engine";
import { checkRoutineConflicts } from "@/lib/recommendation/conflict-checker";
import { SkincareRoutine, RoutineStep } from "@/types/routine";
import { Product } from "@/types/product";
import { formatPriceINR } from "@/lib/utils";

export default function RoutinePage() {
  const [routine, setRoutine] = useState<SkincareRoutine | null>(null);
  const [activeTab, setActiveTab] = useState<"morning" | "evening">("morning");
  const [swapModalStep, setSwapModalStep] = useState<RoutineStep | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setRoutine(getStoredRoutine());
  }, []);

  if (!routine) {
    return (
      <div className="max-w-[1480px] mx-auto px-6 sm:px-10 py-24 text-center">
        <div className="h-12 w-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-base text-slate-600 font-medium">Formulating your personalized routine...</p>
      </div>
    );
  }

  const budgetSavings = routine.budgetLimitINR - routine.totalPriceINR;

  const handleSwapProduct = (stepToReplace: RoutineStep, newProduct: Product) => {
    if (!routine) return;

    const updateSteps = (steps: RoutineStep[]) =>
      steps.map((s) => (s.id === stepToReplace.id ? { ...s, product: newProduct } : s));

    const newMorning = updateSteps(routine.morningSteps);
    const newEvening = updateSteps(routine.eveningSteps);

    // Recalculate unique total products cost
    const uniqueProducts = Array.from(
      new Set([...newMorning.map((s) => s.product), ...newEvening.map((s) => s.product)])
    );
    const newTotal = uniqueProducts.reduce((acc, p) => acc + p.priceINR, 0);

    const newConflicts = checkRoutineConflicts(newMorning, newEvening);

    const updatedRoutine: SkincareRoutine = {
      ...routine,
      morningSteps: newMorning,
      eveningSteps: newEvening,
      totalPriceINR: newTotal,
      conflicts: newConflicts,
      updatedAt: new Date().toISOString(),
    };

    setRoutine(updatedRoutine);
    saveStoredRoutine(updatedRoutine);
    setSwapModalStep(null);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleManualSave = () => {
    if (routine) {
      saveStoredRoutine(routine);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const swapCandidates = swapModalStep
    ? CURATED_PRODUCTS.filter((p) => p.category === swapModalStep.category && p.id !== swapModalStep.product.id)
    : [];

  return (
    <div className="max-w-[1480px] mx-auto px-6 sm:px-10 lg:px-14 py-10 sm:py-14 space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border-subtle/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-wider font-semibold text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800/40">
              Personalized Regimen
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Updated {new Date(routine.updatedAt).toLocaleDateString()}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {routine.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
            Minimal, effective skincare structured around your diagnostic skin analysis and budget ceiling.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            size="md"
            variant="primary"
            onClick={handleManualSave}
            className="gap-2 shadow-soft"
          >
            {saveSuccess ? <Check className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
            <span>{saveSuccess ? "Routine Saved!" : "Save Routine"}</span>
          </Button>
        </div>
      </div>

      {/* --- BUDGET OPTIMIZER CALLOUT BAR --- */}
      <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-black flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold">
            ₹
          </div>
          <div>
            <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">
              Combinatorial Total Cost
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-slate-900 dark:text-white">
                {formatPriceINR(routine.totalPriceINR)}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                / {formatPriceINR(routine.budgetLimitINR)} Budget
              </span>
            </div>
          </div>
        </div>

        {budgetSavings >= 0 ? (
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-400 text-xs font-semibold">
            ✨ {formatPriceINR(budgetSavings)} within your budget cap!
          </div>
        ) : (
          <div className="px-3.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/40 text-amber-800 dark:text-amber-400 text-xs font-semibold">
            ⚠️ {formatPriceINR(Math.abs(budgetSavings))} above budget. Swap a product below to save.
          </div>
        )}
      </div>

      {/* --- ACTIVE INGREDIENT CONFLICT GUARD ALERT --- */}
      <ConflictAlert conflicts={routine.conflicts} />

      {/* --- TIME OF DAY TABS --- */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 p-1 rounded-2xl bg-slate-100 dark:bg-black border border-slate-200 dark:border-zinc-800">
          <button
            onClick={() => setActiveTab("morning")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === "morning"
                ? "bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-soft font-bold"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Sun className="h-4 w-4 text-amber-500" />
            <span>Morning Regimen ({routine.morningSteps.length} Steps)</span>
          </button>

          <button
            onClick={() => setActiveTab("evening")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === "evening"
                ? "bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-soft font-bold"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Moon className="h-4 w-4 text-blue-500" />
            <span>Evening Regimen ({routine.eveningSteps.length} Steps)</span>
          </button>
        </div>

        <span className="text-xs text-content-muted hidden sm:inline-block">
          Tap checkbox to log step completion
        </span>
      </div>

      {/* --- STEPS LIST --- */}
      <div className="space-y-4">
        {activeTab === "morning" ? (
          routine.morningSteps.map((step) => (
            <RoutineStepCard
              key={step.id}
              step={step}
              onSwapClick={(s) => setSwapModalStep(s)}
            />
          ))
        ) : (
          routine.eveningSteps.map((step) => (
            <RoutineStepCard
              key={step.id}
              step={step}
              onSwapClick={(s) => setSwapModalStep(s)}
            />
          ))
        )}
      </div>

      {/* --- PRODUCT SWAP MODAL --- */}
      {swapModalStep && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-border-subtle max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <div>
                <h3 className="font-bold text-base text-content-primary">
                  Swap {swapModalStep.category.toUpperCase()} Step
                </h3>
                <p className="text-xs text-content-muted">
                  Currently: {swapModalStep.product.name} ({formatPriceINR(swapModalStep.product.priceINR)})
                </p>
              </div>
              <button
                onClick={() => setSwapModalStep(null)}
                className="p-1 rounded-lg hover:bg-surface-subtle text-content-muted"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {swapCandidates.map((alt) => {
                const priceDiff = alt.priceINR - swapModalStep.product.priceINR;
                return (
                  <div
                    key={alt.id}
                    className="p-3.5 rounded-2xl border border-border-subtle hover:border-brand-sage-400 bg-surface-subtle/50 flex items-center justify-between gap-3"
                  >
                    <div>
                      <span className="text-[10px] font-bold text-brand-sage-700 uppercase">
                        {alt.brand}
                      </span>
                      <p className="text-xs font-semibold text-content-primary">{alt.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-bold text-content-primary">
                          {formatPriceINR(alt.priceINR)}
                        </span>
                        {priceDiff < 0 && (
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                            Saves {formatPriceINR(Math.abs(priceDiff))}
                          </span>
                        )}
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleSwapProduct(swapModalStep, alt)}
                      className="text-xs h-8 shrink-0"
                    >
                      Select
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* --- FOOTER RECOMMENDATIONS LINK --- */}
      <div className="p-6 rounded-3xl bg-surface-subtle border border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="text-sm font-bold text-content-primary">
            Looking for more skincare alternatives?
          </h4>
          <p className="text-xs text-content-muted">
            Explore our curated catalog with ingredient breakdowns and dynamic price filtering.
          </p>
        </div>
        <Link href="/products">
          <Button size="md" variant="outline" className="gap-2">
            <span>Browse Catalog</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
