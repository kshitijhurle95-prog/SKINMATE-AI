import React from "react";
import { AlertTriangle, ShieldCheck } from "lucide-react";
import { IngredientConflict } from "@/types/routine";

export function ConflictAlert({ conflicts }: { conflicts: IngredientConflict[] }) {
  if (!conflicts || conflicts.length === 0) {
    return (
      <div className="p-4 rounded-2xl bg-brand-sage-50/60 border border-brand-sage-200/80 flex items-start gap-3 text-xs text-brand-sage-800">
        <ShieldCheck className="h-5 w-5 text-brand-sage-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-brand-sage-900">Barrier Synergy Verified: </span>
          All selected active ingredients are cosmically compatible. No harmful ingredient clashes detected across your morning and evening steps.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {conflicts.map((conflict, idx) => (
        <div
          key={idx}
          className={`p-4 rounded-2xl border flex items-start gap-3 text-xs leading-relaxed ${
            conflict.severity === "high"
              ? "bg-brand-terracotta-50 border-brand-terracotta-200 text-brand-terracotta-900"
              : "bg-amber-50 border-amber-200 text-amber-900"
          }`}
        >
          <AlertTriangle
            className={`h-5 w-5 shrink-0 mt-0.5 ${
              conflict.severity === "high" ? "text-brand-terracotta-600" : "text-amber-600"
            }`}
          />
          <div className="space-y-1">
            <p className="font-semibold">
              Safety Caution: {conflict.ingredientA} + {conflict.ingredientB}
            </p>
            <p>{conflict.reason}</p>
            <p className="font-medium underline decoration-dashed">
              Recommendation: {conflict.safeAlternative}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
