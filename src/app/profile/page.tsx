"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Shield, Trash2, Check, ArrowRight, Heart, LogOut, AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getStoredProfile, saveStoredProfile, getSavedProductIds, toggleSaveProduct, DEFAULT_PROFILE } from "@/lib/store/local-store";
import { CURATED_PRODUCTS } from "@/lib/data/curated-products";
import { UserProfile } from "@/types/user";
import { Product } from "@/types/product";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [isSavedNotice, setIsSavedNotice] = useState(false);
  const [purgeNotice, setPurgeNotice] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    setProfile(getStoredProfile());
    setSavedIds(getSavedProductIds());
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredProfile(profile);
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 3000);
  };

  const handlePurgeData = () => {
    if (confirm("Are you sure you want to purge all local scan records, routines, and reset your account? This action cannot be undone.")) {
      localStorage.clear();
      setPurgeNotice(true);
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  };

  const handleConfirmLogout = () => {
    // Clear user session from store and redirect to login
    saveStoredProfile({
      ...DEFAULT_PROFILE,
      id: "guest-user",
      displayName: "Guest User",
    });
    setShowLogoutModal(false);
    router.push("/login");
  };

  const savedProducts: Product[] = CURATED_PRODUCTS.filter((p: Product) => savedIds.includes(p.id));

  return (
    <div className="max-w-5xl mx-auto px-6 sm:px-10 py-12 space-y-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border-subtle">
        <div className="flex items-center gap-3.5">
          <div className="h-12 w-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-soft">
            <User className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Profile & Preferences
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage your personal skincare criteria, budget limits, and saved wishlist.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isSavedNotice && (
            <div className="p-2.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-1.5 animate-in fade-in">
              <Check className="h-4 w-4" />
              <span>Preferences Updated!</span>
            </div>
          )}

          {/* Logout Button */}
          <button
            type="button"
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-2 px-4.5 py-2 rounded-full border border-red-200 dark:border-red-900/60 bg-red-50/70 dark:bg-red-950/40 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/60 text-xs font-semibold transition-all shadow-2xs"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Preferences Form */}
      <form onSubmit={handleSaveProfile} className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-card space-y-6">
        <h3 className="font-bold text-base text-slate-900 dark:text-white">
          Skincare Profile & Budget
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-1">
              Display Name
            </label>
            <input
              type="text"
              value={profile.displayName}
              onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
              className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-1">
              Self-Reported Skin Type
            </label>
            <select
              value={profile.skinTypeReported}
              onChange={(e) => setProfile({ ...profile, skinTypeReported: e.target.value as any })}
              className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 capitalize"
            >
              <option value="oily">Oily</option>
              <option value="dry">Dry</option>
              <option value="combination">Combination</option>
              <option value="normal">Normal</option>
              <option value="sensitive">Sensitive</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-1">
              Maximum Routine Budget (INR)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-bold">
                ₹
              </span>
              <input
                type="number"
                min={300}
                max={10000}
                step={50}
                value={profile.budgetMax}
                onChange={(e) => setProfile({ ...profile, budgetMax: Number(e.target.value) })}
                className="w-full h-11 pl-8 pr-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-1">
              Experience Level
            </label>
            <select
              value={profile.experienceLevel}
              onChange={(e) => setProfile({ ...profile, experienceLevel: e.target.value as any })}
              className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 capitalize"
            >
              <option value="beginner">Beginner (3 Steps)</option>
              <option value="intermediate">Intermediate (4-5 Steps)</option>
              <option value="advanced">Advanced (Multi-Layer)</option>
            </select>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <Button type="submit" variant="primary" size="md" className="gap-2 rounded-full px-6 shadow-sm">
            <span>Save Preferences</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </form>

      {/* Wishlist Section */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-card space-y-4">
        <div className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-500 fill-red-500" />
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            Saved Skincare Wishlist ({savedProducts.length})
          </h3>
        </div>

        {savedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
            {savedProducts.map((p: Product) => (
              <div
                key={p.id}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase truncate block">
                    {p.brand}
                  </span>
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{p.name}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold mt-0.5">₹{p.priceINR}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    toggleSaveProduct(p.id);
                    setSavedIds(getSavedProductIds());
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-white dark:hover:bg-slate-700 transition-colors"
                  title="Remove from wishlist"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500">
            No saved products yet. Tap the heart icon on any card in the Marketplace to save items here!
          </p>
        )}
      </div>

      {/* Privacy & Account Reset */}
      <div className="rounded-3xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20 p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
          <Shield className="h-5 w-5" />
          <h3 className="font-bold text-base">Privacy & Biometric Purge Controls</h3>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          SKINMATE AI maintains an ephemeral data model. We do not sell personal observations or store raw uncompressed photographs permanently. You can clear all cached scan history and reset your profile at any time.
        </p>

        {purgeNotice ? (
          <div className="p-3 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-semibold">
            All local scan and profile data successfully purged. Reloading...
          </div>
        ) : (
          <Button
            type="button"
            size="sm"
            variant="danger"
            onClick={handlePurgeData}
            className="gap-2 rounded-full px-5"
          >
            <Trash2 className="h-4 w-4" />
            <span>Purge All My Scan Records</span>
          </Button>
        )}
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-950/80 text-red-600 flex items-center justify-center shrink-0">
                  <LogOut className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-tight">
                    Confirm Sign Out
                  </h3>
                  <p className="text-xs text-slate-500">SKINMATE AI Session</p>
                </div>
              </div>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Are you sure you want to sign out of your SKINMATE account? You will be redirected to the login screen.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="px-5 py-2.5 rounded-full border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                className="px-6 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold text-xs shadow-sm flex items-center gap-2 transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Yes, Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
