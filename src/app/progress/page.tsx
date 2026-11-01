"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { TrendingUp, Calendar, BookOpen, Plus, Sparkles, AlertCircle, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getStoredAnalysisHistory, getStoredJournalNotes, addJournalNote } from "@/lib/store/local-store";
import { SkinAnalysisResult } from "@/types/skin-analysis";
import { JournalNote } from "@/types/user";

export default function ProgressPage() {
  const [history, setHistory] = useState<SkinAnalysisResult[]>([]);
  const [notes, setNotes] = useState<JournalNote[]>([]);
  const [newNoteContent, setNewNoteContent] = useState("");
  const [newNoteTag, setNewNoteTag] = useState("Routine Update");

  useEffect(() => {
    setHistory(getStoredAnalysisHistory());
    setNotes(getStoredJournalNotes());
  }, []);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;

    const added = addJournalNote(newNoteContent, [newNoteTag]);
    setNotes((prev) => [added, ...prev]);
    setNewNoteContent("");
  };

  const latestScan = history[0];
  const previousScan = history.length > 1 ? history[1] : null;

  return (
    <div className="max-w-[1480px] mx-auto px-6 sm:px-10 lg:px-14 py-10 sm:py-14 space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border-subtle/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-wider font-semibold text-brand-sage-700 bg-brand-sage-50 px-2.5 py-0.5 rounded-md border border-brand-sage-200">
              Longitudinal Tracking
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-content-primary">
            Skin Journey & Historical Journal
          </h1>
          <p className="text-xs sm:text-sm text-content-muted mt-1">
            Compare diagnostic metrics over time and document your skincare routine observations.
          </p>
        </div>

        <Link href="/scan">
          <Button size="md" variant="primary" className="gap-2 shadow-soft">
            <Sparkles className="h-4 w-4" />
            <span>New Progress Scan</span>
          </Button>
        </Link>
      </div>

      {/* --- SIDE-BY-SIDE SCAN COMPARISON --- */}
      {latestScan && previousScan && (
        <div className="rounded-3xl border border-border-subtle bg-white p-6 sm:p-8 shadow-card space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-brand-sage-50 flex items-center justify-center text-brand-sage-600">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-content-primary">
                  Diagnostic Comparison: Current vs. Baseline
                </h3>
                <p className="text-xs text-content-muted">
                  Scans taken on {new Date(previousScan.createdAt).toLocaleDateString()} vs{" "}
                  {new Date(latestScan.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-content-muted">Score Delta:</span>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 ${
                  latestScan.overallScore >= previousScan.overallScore
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-amber-50 text-amber-700"
                }`}
              >
                {latestScan.overallScore >= previousScan.overallScore ? (
                  <ArrowUpRight className="h-3.5 w-3.5" />
                ) : (
                  <ArrowDownRight className="h-3.5 w-3.5" />
                )}
                <span>
                  {latestScan.overallScore - previousScan.overallScore > 0 ? "+" : ""}
                  {latestScan.overallScore - previousScan.overallScore} pts
                </span>
              </span>
            </div>
          </div>

          {/* Metric Deltas Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {latestScan.metrics.slice(0, 4).map((m) => {
              const prev = previousScan.metrics.find((x) => x.type === m.type);
              const delta = prev ? m.score - prev.score : 0;
              return (
                <div
                  key={m.type}
                  className="p-4 rounded-2xl bg-surface-subtle/70 border border-border-subtle/80 space-y-2"
                >
                  <p className="text-xs font-semibold text-content-primary truncate">
                    {m.displayName}
                  </p>
                  <div className="flex items-baseline justify-between">
                    <span className="text-xl font-bold text-content-primary">{m.score}</span>
                    <span
                      className={`text-xs font-bold ${
                        delta >= 0 ? "text-emerald-600" : "text-brand-terracotta-600"
                      }`}
                    >
                      {delta >= 0 ? `+${delta}` : delta}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-border-subtle rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-sage-500 rounded-full"
                      style={{ width: `${m.score}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Environmental Variance Note */}
          <div className="p-4 rounded-2xl bg-surface-subtle/40 border border-border-subtle/60 text-xs text-content-faint leading-relaxed flex items-start gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-content-muted mt-0.5" />
            <span>
              <strong>Scientific Note on Progress Tracking: </strong>
              Observable differences in computer vision scores reflect surface image clarity and visible characteristics. Lighting, camera angles, seasonal weather, and sleep can naturally shift daily metric values and should not be viewed as clinical proof of product efficacy.
            </span>
          </div>
        </div>
      )}

      {/* --- SKINCARE OBSERVATION JOURNAL --- */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left: Add Journal Note Form (5 Cols) */}
        <div className="md:col-span-5 rounded-3xl border border-border-subtle bg-white p-6 shadow-card space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-brand-sage-500" />
            <h3 className="font-bold text-base text-content-primary">Log Skincare Note</h3>
          </div>

          <form onSubmit={handleAddNote} className="space-y-4">
            <div>
              <label htmlFor="note-tag" className="text-xs font-semibold text-content-muted uppercase tracking-wider block mb-1">
                Category Tag
              </label>
              <select
                id="note-tag"
                value={newNoteTag}
                onChange={(e) => setNewNoteTag(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-border-subtle bg-surface-subtle text-xs text-content-primary focus:ring-1 focus:ring-brand-sage-500"
              >
                <option value="Routine Update">Routine Update</option>
                <option value="Product Trial">Product Trial</option>
                <option value="Milestone">Milestone</option>
                <option value="Lifestyle / Stress">Lifestyle / Stress</option>
              </select>
            </div>

            <div>
              <label htmlFor="note-content" className="text-xs font-semibold text-content-muted uppercase tracking-wider block mb-1">
                Observation or Experience
              </label>
              <textarea
                id="note-content"
                rows={4}
                placeholder="e.g. Started using Niacinamide serum tonight. Noticed less midday shine on my forehead after 3 days..."
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                className="w-full p-3 rounded-xl border border-border-subtle bg-surface-subtle/50 text-xs text-content-primary placeholder:text-content-faint focus:ring-1 focus:ring-brand-sage-500"
              />
            </div>

            <Button
              type="submit"
              size="md"
              variant="primary"
              disabled={!newNoteContent.trim()}
              className="w-full gap-2"
            >
              <Plus className="h-4 w-4" />
              <span>Save Entry</span>
            </Button>
          </form>
        </div>

        {/* Right: Notes History (7 Cols) */}
        <div className="md:col-span-7 space-y-4">
          <h3 className="font-bold text-base text-content-primary">
            Skincare Observations ({notes.length})
          </h3>

          <div className="space-y-3">
            {notes.map((note) => (
              <div
                key={note.id}
                className="p-5 rounded-2xl border border-border-subtle bg-white shadow-card space-y-2 hover:border-brand-sage-200 transition-colors"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    {note.tags.map((t, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-brand-sage-50 text-brand-sage-700 border border-brand-sage-200"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <span className="text-content-faint">
                    {new Date(note.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-content-primary leading-relaxed whitespace-pre-line">
                  {note.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
