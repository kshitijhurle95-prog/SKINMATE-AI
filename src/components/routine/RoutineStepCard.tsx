"use client";

import React, { useState } from "react";
import Image from "next/image";
import { CheckCircle2, Circle, ArrowRightLeft, Sparkles } from "lucide-react";
import { RoutineStep } from "@/types/routine";
import { formatPriceINR } from "@/lib/utils";

interface RoutineStepCardProps {
  step: RoutineStep;
  onSwapClick?: (step: RoutineStep) => void;
}

export function RoutineStepCard({ step, onSwapClick }: RoutineStepCardProps) {
  const [completed, setCompleted] = useState(false);

  return (
    <div
      className={`rounded-2xl border transition-all duration-200 p-5 ${
        completed
          ? "bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/40 shadow-soft"
          : "bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 shadow-card hover:border-emerald-400"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Step Marker & Order */}
        <div className="flex items-start gap-3.5">
          <button
            onClick={() => setCompleted(!completed)}
            className="mt-1 text-slate-500 hover:text-emerald-600 transition-colors"
            aria-label={completed ? "Mark step incomplete" : "Mark step completed"}
          >
            {completed ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-500 fill-emerald-100 dark:fill-emerald-950" />
            ) : (
              <Circle className="h-5 w-5 text-slate-300 dark:text-zinc-600 hover:text-emerald-500" />
            )}
          </button>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase tracking-wider font-semibold text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800/40">
                Step 0{step.order}
              </span>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 capitalize">
                {step.category}
              </span>
            </div>
            <h4
              className={`font-semibold text-base transition-colors ${
                completed ? "line-through text-slate-400 dark:text-slate-500" : "text-slate-900 dark:text-white"
              }`}
            >
              {step.name}
            </h4>
          </div>
        </div>

        {/* Swap Action Button */}
        {onSwapClick && (
          <button
            onClick={() => onSwapClick(step)}
            className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-white px-2.5 py-1 rounded-lg border border-slate-200 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
            title="Swap product"
          >
            <ArrowRightLeft className="h-3 w-3" />
            <span>Swap</span>
          </button>
        )}
      </div>

      {/* Embedded Product Card */}
      <div className="mt-4 p-3.5 rounded-xl bg-slate-50 dark:bg-black border border-slate-200/90 dark:border-zinc-800 flex items-center gap-3.5">
        <div className="relative h-14 w-14 rounded-lg overflow-hidden shrink-0 bg-white border border-slate-200 dark:border-zinc-800">
          <Image
            src={step.product.image}
            alt={step.product.name}
            fill
            sizes="56px"
            className="object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">{step.product.brand}</p>
          <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{step.product.name}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              {formatPriceINR(step.product.priceINR)}
            </span>
            <span className="text-[10px] text-slate-400">•</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {step.product.keyActives[0]}
            </span>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-3 text-xs text-content-muted leading-relaxed flex items-start gap-2">
        <Sparkles className="h-3.5 w-3.5 text-brand-sage-500 shrink-0 mt-0.5" />
        <p>{step.instructions}</p>
      </div>
    </div>
  );
}
