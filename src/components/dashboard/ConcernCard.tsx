import React from "react";
import { NormalizedSkinMetric } from "@/types/skin-analysis";
import { getScoreGrade } from "@/lib/utils";

export function ConcernCard({ metric }: { metric: NormalizedSkinMetric }) {
  const grade = getScoreGrade(metric.score);

  return (
    <div className="rounded-2xl border border-border-subtle bg-white p-5 shadow-card hover:border-brand-sage-200 transition-all duration-200 flex flex-col justify-between space-y-4">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <h4 className="font-semibold text-sm text-content-primary">
            {metric.displayName}
          </h4>
          <span
            className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${grade.bgClass} ${grade.colorClass}`}
          >
            {grade.label}
          </span>
        </div>
        <p className="text-xs text-content-muted leading-relaxed line-clamp-2">
          {metric.summary}
        </p>
      </div>

      {/* Score Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-content-muted">Health Index</span>
          <span className="font-semibold text-content-primary">{metric.score}/100</span>
        </div>
        <div className="h-2 w-full bg-surface-subtle rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${metric.score}%`,
              backgroundColor:
                metric.score >= 80 ? "#3B5E4F" : metric.score >= 65 ? "#8B9B79" : metric.score >= 50 ? "#D97706" : "#C86D51",
            }}
          />
        </div>
      </div>

      {/* Practical Guidance Callout */}
      <div className="pt-3 border-t border-border-subtle/60 text-xs text-content-muted leading-relaxed">
        <span className="font-medium text-brand-sage-700">Next Step: </span>
        {metric.cosmeticAdvice}
      </div>
    </div>
  );
}
