"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, Scan, Calendar, ShoppingBag, TrendingUp, MessageSquare, Shield, ArrowRight, Layers } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SkinScoreRadial } from "@/components/dashboard/SkinScoreRadial";
import { ConcernCard } from "@/components/dashboard/ConcernCard";
import { MaskOverlayViewer } from "@/components/scan/MaskOverlayViewer";
import { getStoredProfile, getStoredCurrentAnalysis } from "@/lib/store/local-store";
import { SkinAnalysisResult } from "@/types/skin-analysis";
import { UserProfile } from "@/types/user";

export default function DashboardPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [analysis, setAnalysis] = useState<SkinAnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<"metrics" | "masks">("metrics");

  useEffect(() => {
    setProfile(getStoredProfile());
    setAnalysis(getStoredCurrentAnalysis());
  }, []);

  if (!analysis || !profile) {
    return (
      <div className="max-w-[1480px] mx-auto px-6 sm:px-10 py-24 text-center">
        <div className="h-12 w-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-base text-slate-600 font-medium">Loading your skincare space...</p>
      </div>
    );
  }

  // Identify priority concerns (score < 70)
  const priorityConcerns = analysis.metrics.filter((m) => m.score < 70);

  return (
    <div className="max-w-[1480px] mx-auto px-6 sm:px-10 lg:px-14 py-10 sm:py-14 space-y-12">
      {/* --- DASHBOARD HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border-subtle/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-wider font-semibold text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800/40">
              Personal Skin Intelligence
            </span>
            {analysis.isDemoData && (
              <span className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800/40">
                Verified Dataset
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-content-primary">
            Welcome back, {profile.displayName || "Friend"}
          </h1>
          <p className="text-xs sm:text-sm text-content-muted mt-1">
            Here is your diagnostic summary evaluated via YouCam Skin AI. Your custom routine and shopping shortlist are synchronized.
          </p>
        </div>

        {/* Quick Scan CTA */}
        <div className="flex items-center gap-3">
          <Link href="/scan">
            <Button size="md" variant="primary" className="gap-2 shadow-soft">
              <Scan className="h-4 w-4" />
              <span>Take New Scan</span>
            </Button>
          </Link>
          <Link href="/routine">
            <Button size="md" variant="outline" className="gap-2">
              <Calendar className="h-4 w-4 text-brand-sage-600" />
              <span>View Routine</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* --- TOP GRID: OVERALL SCORE & MASK VIEWER --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Overall Health Score Card (5 Cols) */}
        <div className="lg:col-span-5 h-full">
          <SkinScoreRadial
            score={analysis.overallScore}
            skinType={analysis.skinTypeAssessed}
            analysisDate={analysis.createdAt}
            isDemoData={analysis.isDemoData}
          />
        </div>

        {/* Mask Overlay Heatmap Viewer (7 Cols) */}
        <div className="lg:col-span-7">
          <MaskOverlayViewer
            baseImageUrl={analysis.imageUrl}
            metrics={analysis.metrics}
          />
        </div>
      </div>

      {/* --- QUICK ACTION PILLS --- */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Personalized Routine", href: "/routine", icon: Calendar, desc: "AM & PM Regimens" },
          { label: "Budget Marketplace", href: "/products", icon: ShoppingBag, desc: `Under ₹${profile.budgetMax}` },
          { label: "Journey Progress", href: "/progress", icon: TrendingUp, desc: "Scan Comparisons" },
          { label: "Skincare Assistant", href: "/assistant", icon: MessageSquare, desc: "Ask Any Question" },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <Link
              key={idx}
              href={item.href}
              className="rounded-2xl border border-border-subtle bg-white p-4 shadow-card hover:border-brand-sage-400 hover:shadow-soft transition-all duration-200 group flex items-center gap-3.5"
            >
              <div className="h-10 w-10 rounded-xl bg-brand-sage-50 border border-brand-sage-200 flex items-center justify-center text-brand-sage-600 group-hover:scale-110 transition-transform shrink-0">
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-content-primary truncate">{item.label}</p>
                <p className="text-[11px] text-content-muted truncate">{item.desc}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* --- PERSONALISED INSIGHTS SUMMARY --- */}
      <div className="rounded-3xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/60 p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Personalised Diagnostic Insights
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          <div className="p-4 rounded-2xl bg-white dark:bg-black border border-slate-200/80 dark:border-zinc-800 space-y-1.5 shadow-soft">
            <span className="font-bold text-slate-900 dark:text-white">Key Focus Areas:</span>
            {priorityConcerns.length > 0 ? (
              <p>
                Your analysis indicates that{" "}
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {priorityConcerns.map((p) => p.displayName).join(" and ")}
                </span>{" "}
                are the primary visible characteristics to balance. Consider non-comedogenic hydration and mild exfoliants.
              </p>
            ) : (
              <p>Your visible metrics are well-balanced! Maintain your current gentle cleansing and daily UV defense regimen.</p>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-black border border-slate-200/80 dark:border-zinc-800 space-y-1.5 shadow-soft">
            <span className="font-bold text-slate-900 dark:text-white">Budget-Conscious Recommendation:</span>
            <p>
              Based on your stated budget of <span className="font-semibold text-slate-900 dark:text-white">₹{profile.budgetMax}</span>, our recommendation engine has solved for a 3-step routine prioritizing active barrier support without unnecessary product layering.
            </p>
          </div>
        </div>
      </div>

      {/* --- 16-CONCERN DETAILED BREAKDOWN --- */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-content-primary">
              All Analyzed Skin Concern Metrics
            </h2>
            <p className="text-xs text-content-muted mt-0.5">
              Comprehensive individual metrics returned by the YouCam Skin AI computer vision pipeline.
            </p>
          </div>
          <span className="text-xs font-semibold text-brand-sage-700 bg-brand-sage-50 px-3 py-1 rounded-full border border-brand-sage-200 self-start sm:self-auto">
            {analysis.metrics.length} Metrics Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {analysis.metrics.map((metric) => (
            <ConcernCard key={metric.type} metric={metric} />
          ))}
        </div>
      </div>

      {/* --- NEXT STEPS BANNER --- */}
      <div className="rounded-3xl bg-surface p-7 border border-border-subtle shadow-card flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-base font-bold text-content-primary">
            Ready to Build Your Regimen?
          </h3>
          <p className="text-xs text-content-muted max-w-md">
            Turn these diagnostic scores into a morning and evening routine with automatic ingredient safety verification.
          </p>
        </div>
        <Link href="/routine">
          <Button size="md" variant="primary" className="gap-2 shadow-soft">
            <span>Explore Your Routine</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
