"use client";

import { UserProfile, JournalNote } from "@/types/user";
import { SkinAnalysisResult } from "@/types/skin-analysis";
import { SkincareRoutine } from "@/types/routine";
import { Product } from "@/types/product";
import { VERIFIED_YOUCAM_DEMO_RESULT } from "@/lib/youcam/client";
import { CURATED_PRODUCTS } from "@/lib/data/curated-products";
import { generatePersonalizedRoutine } from "@/lib/recommendation/engine";

const STORAGE_KEYS = {
  PROFILE: "skinmate_user_profile",
  CURRENT_ANALYSIS: "skinmate_current_analysis",
  ANALYSIS_HISTORY: "skinmate_analysis_history",
  ROUTINE: "skinmate_current_routine",
  SAVED_PRODUCTS: "skinmate_saved_product_ids",
  JOURNAL: "skinmate_journal_notes",
};

export const DEFAULT_PROFILE: UserProfile = {
  id: "guest-user",
  displayName: "Aanya",
  skinTypeReported: "combination",
  concerns: ["pore", "oiliness", "texture"],
  budgetMin: 500,
  budgetMax: 1500,
  ingredientPreferences: ["Niacinamide", "Hyaluronic Acid"],
  ingredientRestrictions: [],
  experienceLevel: "beginner",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export function getStoredProfile(): UserProfile {
  if (typeof window === "undefined") return DEFAULT_PROFILE;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!raw) {
      saveStoredProfile(DEFAULT_PROFILE);
      return DEFAULT_PROFILE;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveStoredProfile(profile: UserProfile): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (err) {
    console.error("Failed to save profile:", err);
  }
}

export function getStoredCurrentAnalysis(): SkinAnalysisResult {
  if (typeof window === "undefined") return VERIFIED_YOUCAM_DEMO_RESULT;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_ANALYSIS);
    if (!raw) {
      saveStoredCurrentAnalysis(VERIFIED_YOUCAM_DEMO_RESULT);
      return VERIFIED_YOUCAM_DEMO_RESULT;
    }
    return JSON.parse(raw);
  } catch {
    return VERIFIED_YOUCAM_DEMO_RESULT;
  }
}

export function saveStoredCurrentAnalysis(analysis: SkinAnalysisResult): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_ANALYSIS, JSON.stringify(analysis));
    // Also push to history
    const history = getStoredAnalysisHistory();
    const updated = [analysis, ...history.filter((h) => h.id !== analysis.id)].slice(0, 10);
    localStorage.setItem(STORAGE_KEYS.ANALYSIS_HISTORY, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to save analysis:", err);
  }
}

export function getStoredAnalysisHistory(): SkinAnalysisResult[] {
  if (typeof window === "undefined") return [VERIFIED_YOUCAM_DEMO_RESULT];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ANALYSIS_HISTORY);
    if (!raw) {
      // Provide initial historical comparisons for hackathon demonstration
      const baseline: SkinAnalysisResult = {
        ...VERIFIED_YOUCAM_DEMO_RESULT,
        id: "demo-scan-baseline",
        createdAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(), // 4 weeks ago
        overallScore: 69,
        metrics: VERIFIED_YOUCAM_DEMO_RESULT.metrics.map((m) => ({
          ...m,
          score: Math.max(45, m.score - 7),
        })),
      };
      const initial = [VERIFIED_YOUCAM_DEMO_RESULT, baseline];
      localStorage.setItem(STORAGE_KEYS.ANALYSIS_HISTORY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return [VERIFIED_YOUCAM_DEMO_RESULT];
  }
}

export function getStoredRoutine(): SkincareRoutine {
  const profile = getStoredProfile();
  const analysis = getStoredCurrentAnalysis();

  if (typeof window === "undefined") {
    return generatePersonalizedRoutine(CURATED_PRODUCTS, profile, analysis);
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ROUTINE);
    if (!raw) {
      const generated = generatePersonalizedRoutine(CURATED_PRODUCTS, profile, analysis);
      saveStoredRoutine(generated);
      return generated;
    }
    return JSON.parse(raw);
  } catch {
    return generatePersonalizedRoutine(CURATED_PRODUCTS, profile, analysis);
  }
}

export function saveStoredRoutine(routine: SkincareRoutine): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.ROUTINE, JSON.stringify(routine));
  } catch (err) {
    console.error("Failed to save routine:", err);
  }
}

export function getSavedProductIds(): string[] {
  if (typeof window === "undefined") return ["prod-cl-01", "prod-ms-01", "prod-sc-01"];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SAVED_PRODUCTS);
    if (!raw) return ["prod-cl-01", "prod-ms-01", "prod-sc-01"];
    return JSON.parse(raw);
  } catch {
    return ["prod-cl-01", "prod-ms-01", "prod-sc-01"];
  }
}

export function toggleSaveProduct(productId: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const current = getSavedProductIds();
    let updated: string[];
    let isSaved: boolean;
    if (current.includes(productId)) {
      updated = current.filter((id) => id !== productId);
      isSaved = false;
    } else {
      updated = [...current, productId];
      isSaved = true;
    }
    localStorage.setItem(STORAGE_KEYS.SAVED_PRODUCTS, JSON.stringify(updated));
    return isSaved;
  } catch {
    return false;
  }
}

export function getStoredJournalNotes(): JournalNote[] {
  const initialDemoNotes: JournalNote[] = [
    {
      id: "note-1",
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      content: "Switched to Minimalist Salicylic Acid Cleanser. Skin feels refreshed with significantly less midday shine on my forehead.",
      tags: ["Cleanser", "Sebum Control"],
    },
    {
      id: "note-2",
      date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      content: "Completed second YouCam scan! Hydration score improved from 55 to 62 after regular use of barrier moisturiser.",
      tags: ["Milestone", "Hydration"],
    },
  ];

  if (typeof window === "undefined") return initialDemoNotes;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.JOURNAL);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.JOURNAL, JSON.stringify(initialDemoNotes));
      return initialDemoNotes;
    }
    return JSON.parse(raw);
  } catch {
    return initialDemoNotes;
  }
}

export function addJournalNote(content: string, tags: string[] = []): JournalNote {
  const newNote: JournalNote = {
    id: `note-${Date.now()}`,
    date: new Date().toISOString(),
    content,
    tags,
  };
  if (typeof window !== "undefined") {
    try {
      const current = getStoredJournalNotes();
      const updated = [newNote, ...current];
      localStorage.setItem(STORAGE_KEYS.JOURNAL, JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to add journal note:", err);
    }
  }
  return newNote;
}
