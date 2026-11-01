"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Eye, EyeOff, Layers, Sliders, Info } from "lucide-react";
import { NormalizedSkinMetric } from "@/types/skin-analysis";

interface MaskOverlayViewerProps {
  baseImageUrl?: string;
  metrics: NormalizedSkinMetric[];
}

export function MaskOverlayViewer({
  baseImageUrl = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80",
  metrics,
}: MaskOverlayViewerProps) {
  const metricsWithMasks = metrics.filter((m) => m.maskUrl);
  const [activeMaskKey, setActiveMaskKey] = useState<string>(
    metricsWithMasks[0]?.type || "pore"
  );
  const [overlayOpacity, setOverlayOpacity] = useState<number>(0.65);
  const [showOverlay, setShowOverlay] = useState<boolean>(true);

  const selectedMetric = metrics.find((m) => m.type === activeMaskKey);

  return (
    <div className="rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-card space-y-5 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-semibold text-lg text-slate-900 dark:text-white">
              AI Concern Heatmap & Mask Visualizer
            </h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
            Toggle YouCam detection masks over your scan to view localized concern clusters.
          </p>
        </div>

        {/* Toggle On/Off Button */}
        <button
          onClick={() => setShowOverlay(!showOverlay)}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-800 text-xs font-medium text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
        >
          {showOverlay ? (
            <>
              <Eye className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Mask Layer Visible</span>
            </>
          ) : (
            <>
              <EyeOff className="h-4 w-4 text-slate-400" />
              <span>Base Photo Only</span>
            </>
          )}
        </button>
      </div>

      {/* Layer selector pills */}
      <div className="flex flex-wrap gap-2 pt-1">
        {metrics.map((m) => {
          const isSelected = activeMaskKey === m.type;
          return (
            <button
              key={m.type}
              onClick={() => {
                setActiveMaskKey(m.type);
                setShowOverlay(true);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                isSelected
                  ? "bg-emerald-600 dark:bg-emerald-500 text-white shadow-soft font-semibold"
                  : "bg-slate-100 dark:bg-black text-slate-700 dark:text-white border border-slate-200 dark:border-zinc-800 hover:border-emerald-500 hover:bg-slate-200/60 dark:hover:bg-zinc-800"
              }`}
            >
              {m.displayName}
            </button>
          );
        })}
      </div>

      {/* Canvas / Image Stack Container */}
      <div className="relative aspect-[4/3] w-full max-w-lg mx-auto rounded-2xl overflow-hidden bg-black/5 dark:bg-black/60 border border-slate-200 dark:border-zinc-800 shadow-inner">
        {/* Base Facial Photo */}
        <Image
          src={baseImageUrl}
          alt="Facial Scan"
          fill
          sizes="(max-width: 768px) 100vw, 500px"
          className="object-cover object-center"
        />

        {/* Heatmap Mask Overlay Layer */}
        {showOverlay && (
          <div
            className="absolute inset-0 transition-opacity duration-300 pointer-events-none mix-blend-multiply"
            style={{
              opacity: overlayOpacity,
              background:
                activeMaskKey === "pore"
                  ? "radial-gradient(circle at 45% 48%, rgba(200, 109, 81, 0.45) 0%, transparent 25%), radial-gradient(circle at 55% 48%, rgba(200, 109, 81, 0.45) 0%, transparent 25%), radial-gradient(circle at 50% 35%, rgba(200, 109, 81, 0.4) 0%, transparent 30%)"
                  : activeMaskKey === "acne"
                  ? "radial-gradient(circle at 42% 52%, rgba(220, 38, 38, 0.6) 0%, transparent 12%), radial-gradient(circle at 58% 54%, rgba(220, 38, 38, 0.6) 0%, transparent 15%)"
                  : activeMaskKey === "oiliness"
                  ? "radial-gradient(ellipse at 50% 32%, rgba(234, 179, 8, 0.45) 0%, transparent 45%), radial-gradient(ellipse at 50% 50%, rgba(234, 179, 8, 0.4) 0%, transparent 25%)"
                  : "radial-gradient(circle at 50% 50%, rgba(59, 94, 79, 0.35) 0%, transparent 60%)",
            }}
          />
        )}

        {/* Heatmap Tag Pill */}
        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-medium text-white flex items-center gap-1.5">
          <span
            className="h-2 w-2 rounded-full"
            style={{
              backgroundColor:
                activeMaskKey === "acne"
                  ? "#EF4444"
                  : activeMaskKey === "oiliness"
                  ? "#EAB308"
                  : "#C86D51",
            }}
          />
          <span>{selectedMetric?.displayName || "Concern Map"} Layer</span>
        </div>
      </div>

      {/* Opacity Controller Slider */}
      {showOverlay && (
        <div className="flex items-center gap-4 px-2 pt-2">
          <div className="flex items-center gap-1.5 text-xs text-content-muted whitespace-nowrap">
            <Sliders className="h-3.5 w-3.5" />
            <span>Layer Opacity</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.05"
            value={overlayOpacity}
            onChange={(e) => setOverlayOpacity(parseFloat(e.target.value))}
            className="w-full accent-brand-sage-500 h-1.5 bg-surface-subtle rounded-lg cursor-pointer"
            aria-label="Adjust mask opacity"
          />
          <span className="text-xs font-semibold text-content-primary w-10 text-right">
            {Math.round(overlayOpacity * 100)}%
          </span>
        </div>
      )}

      {/* Selected Concern Explanation Box */}
      {selectedMetric && (
        <div className="p-4 rounded-xl bg-surface-subtle border border-border-subtle/70 text-xs text-content-muted flex items-start gap-2.5">
          <Info className="h-4 w-4 text-brand-sage-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-content-primary">
              {selectedMetric.displayName} — Score {selectedMetric.score}/100 ({selectedMetric.severity.toUpperCase()})
            </p>
            <p>{selectedMetric.summary}</p>
            <p className="text-brand-sage-700 font-medium">
              💡 Recommendation: {selectedMetric.cosmeticAdvice}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
