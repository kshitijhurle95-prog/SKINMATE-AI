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
          ? "bg-brand-sage-50/40 border-brand-sage-300 shadow-soft"
          : "bg-white border-border-subtle shadow-card hover:border-brand-sage-200"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Step Marker & Order */}
        <div className="flex items-start gap-3.5">
          <button
            onClick={() => setCompleted(!completed)}
            className="mt-1 text-content-muted hover:text-brand-sage-600 transition-colors"
            aria-label={completed ? "Mark step incomplete" : "Mark step completed"}
          >
            {completed ? (
              <CheckCircle2 className="h-5 w-5 text-brand-sage-500 fill-brand-sage-100" />
            ) : (
              <Circle className="h-5 w-5 text-border-subtle hover:text-brand-sage-500" />
            )}
          </button>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase tracking-wider font-semibold text-brand-sage-700 bg-brand-sage-50 px-2 py-0.5 rounded-md border border-brand-sage-200">
                Step 0{step.order}
              </span>
              <span className="text-xs font-medium text-content-faint capitalize">
                {step.category}
              </span>
            </div>
            <h4
              className={`font-semibold text-base transition-colors ${
                completed ? "line-through text-content-muted" : "text-content-primary"
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
            className="inline-flex items-center gap-1 text-xs font-medium text-content-muted hover:text-brand-sage-700 px-2.5 py-1 rounded-lg border border-border-subtle hover:bg-surface-subtle transition-colors"
            title="Swap product"
          >
            <ArrowRightLeft className="h-3 w-3" />
            <span>Swap</span>
          </button>
        )}
      </div>

      {/* Embedded Product Card */}
      <div className="mt-4 p-3.5 rounded-xl bg-surface-subtle/80 border border-border-subtle/80 flex items-center gap-3.5">
        <div className="relative h-14 w-14 rounded-lg overflow-hidden shrink-0 bg-white border border-border-subtle">
          <Image
            src={step.product.image}
            alt={step.product.name}
            fill
            sizes="56px"
            className="object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-brand-sage-700">{step.product.brand}</p>
          <p className="text-sm font-semibold text-content-primary truncate">{step.product.name}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs font-bold text-content-primary">
              {formatPriceINR(step.product.priceINR)}
            </span>
            <span className="text-[10px] text-content-faint">•</span>
            <span className="text-[11px] text-content-muted truncate">
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
