"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Check, ArrowRight, ArrowLeft, ShieldCheck, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getStoredProfile, saveStoredProfile } from "@/lib/store/local-store";
import { UserProfile, SelfReportedSkinType, ExperienceLevel } from "@/types/user";

const SKIN_TYPES: { id: SelfReportedSkinType; label: string; desc: string }[] = [
  { id: "oily", label: "Oily", desc: "Persistent shine across T-zone and cheeks, prone to visible pores." },
  { id: "combination", label: "Combination", desc: "Oily T-zone (forehead, nose) with normal or dry cheeks." },
  { id: "dry", label: "Dry", desc: "Feels tight after cleansing, dull or flaky surface texture." },
  { id: "normal", label: "Normal", desc: "Well-balanced hydration and oil with few active blemishes." },
  { id: "sensitive", label: "Sensitive", desc: "Easily flushed, reactive to fragrance, stings with strong actives." },
  { id: "unknown", label: "Not Sure", desc: "I'd like the YouCam facial analysis to help assess my profile." },
];

const CONCERN_OPTIONS = [
  { id: "pore", label: "Visible Pores" },
  { id: "oiliness", label: "Excess Oil & Shine" },
  { id: "acne", label: "Active Blemishes" },
  { id: "moisture", label: "Dryness / Dehydration" },
  { id: "redness", label: "Sensitivity & Redness" },
  { id: "texture", label: "Rough Skin Texture" },
  { id: "dark_circle_v2", label: "Under-Eye Circles" },
  { id: "spot", label: "Sun Spots / Hyperpigmentation" },
  { id: "wrinkle", label: "Fine Lines & Elasticity" },
];

const BUDGET_TIERS = [
  { val: 500, label: "Under ₹500", desc: "Ultra-affordable essential cleansers & moisturisers" },
  { val: 1000, label: "Under ₹1,000", desc: "High-value basic 3-step routine (Cleanser + Cream + SPF)" },
  { val: 1500, label: "Under ₹1,500", desc: "Complete 3-step routine with premium sunscreens (Recommended)" },
  { val: 3000, label: "Under ₹3,000", desc: "Full 4-step regimen including specialized active serums" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<UserProfile>(() => getStoredProfile());

  const handleToggleConcern = (id: string) => {
    setProfile((prev) => {
      const exists = prev.concerns.includes(id);
      return {
        ...prev,
        concerns: exists
          ? prev.concerns.filter((c) => c !== id)
          : [...prev.concerns, id],
      };
    });
  };

  const handleFinish = () => {
    saveStoredProfile(profile);
    router.push("/scan");
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 sm:py-16">
      {/* Progress Bar */}
      <div className="space-y-2 mb-8">
        <div className="flex items-center justify-between text-xs font-semibold text-content-muted">
          <span>STEP {step} OF 4</span>
          <span>{step === 1 ? "Skin Type" : step === 2 ? "Concerns" : step === 3 ? "Budget Cap" : "Preferences"}</span>
        </div>
        <div className="h-1.5 w-full bg-surface-subtle rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-sage-500 rounded-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      <div className="rounded-3xl border border-border-subtle bg-white p-6 sm:p-10 shadow-card">
        {/* STEP 1: SKIN TYPE */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-sage-700 bg-brand-sage-50 px-2.5 py-0.5 rounded-md border border-brand-sage-200">
                Self-Reported Baseline
              </span>
              <h2 className="text-2xl font-bold text-content-primary mt-2">
                How would you describe your skin?
              </h2>
              <p className="text-xs text-content-muted mt-1">
                This helps customize your routine recommendations. (Our YouCam AI scan will also assess your skin attributes).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SKIN_TYPES.map((t) => {
                const isSelected = profile.skinTypeReported === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setProfile({ ...profile, skinTypeReported: t.id })}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? "bg-brand-sage-50/60 border-brand-sage-500 shadow-soft"
                        : "border-border-subtle hover:border-brand-sage-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm text-content-primary">{t.label}</span>
                      {isSelected && <Check className="h-4 w-4 text-brand-sage-600" />}
                    </div>
                    <p className="text-xs text-content-muted leading-relaxed">{t.desc}</p>
                  </button>
                );
              })}
            </div>

            <div className="pt-4 flex justify-end">
              <Button size="lg" variant="primary" onClick={() => setStep(2)} className="gap-2">
                <span>Continue to Concerns</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: CONCERNS */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-sage-700 bg-brand-sage-50 px-2.5 py-0.5 rounded-md border border-brand-sage-200">
                Priorities
              </span>
              <h2 className="text-2xl font-bold text-content-primary mt-2">
                What are your main skincare goals?
              </h2>
              <p className="text-xs text-content-muted mt-1">
                Select all that apply. We will match active ingredients specifically to these areas.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {CONCERN_OPTIONS.map((c) => {
                const isSelected = profile.concerns.includes(c.id);
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleToggleConcern(c.id)}
                    className={`p-3.5 rounded-xl border text-left text-xs font-semibold transition-all flex items-center justify-between ${
                      isSelected
                        ? "bg-brand-sage-50 border-brand-sage-500 text-brand-sage-800 shadow-soft"
                        : "border-border-subtle bg-white text-content-primary hover:border-brand-sage-300"
                    }`}
                  >
                    <span>{c.label}</span>
                    {isSelected && <Check className="h-3.5 w-3.5 text-brand-sage-600 shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>

            <div className="pt-4 flex items-center justify-between">
              <Button size="md" variant="ghost" onClick={() => setStep(1)} className="gap-1.5">
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
              <Button size="lg" variant="primary" onClick={() => setStep(3)} className="gap-2">
                <span>Set Budget Limit</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: BUDGET */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-sage-700 bg-brand-sage-50 px-2.5 py-0.5 rounded-md border border-brand-sage-200">
                Budget-Aware Commerce
              </span>
              <h2 className="text-2xl font-bold text-content-primary mt-2">
                What is your total skincare routine budget?
              </h2>
              <p className="text-xs text-content-muted mt-1">
                Our recommendation engine uses combinatorial math to build a complete routine without exceeding this limit.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {BUDGET_TIERS.map((tier) => {
                const isSelected = profile.budgetMax === tier.val;
                return (
                  <button
                    key={tier.val}
                    type="button"
                    onClick={() => setProfile({ ...profile, budgetMax: tier.val })}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? "bg-brand-sage-50/70 border-brand-sage-500 shadow-soft"
                        : "border-border-subtle bg-white hover:border-brand-sage-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-content-primary flex items-center gap-1">
                        <IndianRupee className="h-3.5 w-3.5 text-brand-sage-600" />
                        {tier.label}
                      </span>
                      {isSelected && <Check className="h-4 w-4 text-brand-sage-600" />}
                    </div>
                    <p className="text-xs text-content-muted leading-relaxed">{tier.desc}</p>
                  </button>
                );
              })}
            </div>

            {/* Custom Input */}
            <div className="p-4 rounded-xl bg-surface-subtle border border-border-subtle/80 flex items-center justify-between">
              <label htmlFor="custom-budget" className="text-xs font-semibold text-content-primary">
                Custom Budget Ceiling (INR):
              </label>
              <div className="flex items-center gap-1.5 w-32">
                <span className="text-sm font-bold text-content-primary">₹</span>
                <input
                  id="custom-budget"
                  type="number"
                  min="300"
                  max="10000"
                  step="50"
                  value={profile.budgetMax}
                  onChange={(e) => setProfile({ ...profile, budgetMax: Number(e.target.value) })}
                  className="w-full h-9 rounded-lg border border-border-subtle px-2 text-sm font-bold text-content-primary text-right focus:ring-1 focus:ring-brand-sage-500"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <Button size="md" variant="ghost" onClick={() => setStep(2)} className="gap-1.5">
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
              <Button size="lg" variant="primary" onClick={() => setStep(4)} className="gap-2">
                <span>Final Preferences</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 4: PREFERENCES & FINISH */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-sage-700 bg-brand-sage-50 px-2.5 py-0.5 rounded-md border border-brand-sage-200">
                Ingredients & Preferences
              </span>
              <h2 className="text-2xl font-bold text-content-primary mt-2">
                Any ingredient restrictions?
              </h2>
              <p className="text-xs text-content-muted mt-1">
                We will automatically disqualify products containing ingredients you wish to avoid.
              </p>
            </div>

            {/* Common restriction toggles */}
            <div className="space-y-2">
              {["Artificial Fragrance", "Essential Oils", "Alcohol", "Parabens"].map((ing) => {
                const isExcluded = profile.ingredientRestrictions.includes(ing);
                return (
                  <button
                    key={ing}
                    type="button"
                    onClick={() => {
                      setProfile((prev) => ({
                        ...prev,
                        ingredientRestrictions: isExcluded
                          ? prev.ingredientRestrictions.filter((x) => x !== ing)
                          : [...prev.ingredientRestrictions, ing],
                      }));
                    }}
                    className={`w-full p-3 rounded-xl border text-left text-xs font-medium flex items-center justify-between transition-colors ${
                      isExcluded
                        ? "bg-brand-terracotta-50 border-brand-terracotta-200 text-brand-terracotta-700"
                        : "bg-surface-subtle/50 border-border-subtle text-content-primary hover:bg-surface-subtle"
                    }`}
                  >
                    <span>Avoid {ing}</span>
                    {isExcluded && <span className="font-bold text-[11px]">Excluded</span>}
                  </button>
                );
              })}
            </div>

            {/* Experience level */}
            <div className="pt-2">
              <label className="text-xs font-bold text-content-primary uppercase tracking-wider block mb-2">
                Your Skincare Experience Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["beginner", "intermediate", "experienced"] as ExperienceLevel[]).map((exp) => (
                  <button
                    key={exp}
                    type="button"
                    onClick={() => setProfile({ ...profile, experienceLevel: exp })}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold capitalize transition-all ${
                      profile.experienceLevel === exp
                        ? "bg-brand-sage-500 text-white shadow-soft"
                        : "border-border-subtle text-content-muted hover:bg-surface-subtle"
                    }`}
                  >
                    {exp}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <Button size="md" variant="ghost" onClick={() => setStep(3)} className="gap-1.5">
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
              <Button size="lg" variant="primary" onClick={handleFinish} className="gap-2 shadow-lg">
                <Sparkles className="h-4 w-4" />
                <span>Save Profile & Start Scan</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
