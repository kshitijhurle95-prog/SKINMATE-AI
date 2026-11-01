"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { Sparkles, IndianRupee, Heart, Check, X, Shield, ArrowRight, ExternalLink } from "lucide-react";
import { BudgetFilterBar } from "@/components/marketplace/BudgetFilterBar";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { Button } from "@/components/ui/Button";
import { CURATED_PRODUCTS } from "@/lib/data/curated-products";
import { scoreProductRelevance, filterProducts, findAffordableAlternatives } from "@/lib/recommendation/engine";
import { getStoredProfile, getStoredCurrentAnalysis, getStoredRoutine, saveStoredRoutine } from "@/lib/store/local-store";
import { Product } from "@/types/product";
import { UserProfile } from "@/types/user";
import { SkinAnalysisResult } from "@/types/skin-analysis";
import { formatPriceINR } from "@/lib/utils";

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [maxBudget, setMaxBudget] = useState(1500);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [analysis, setAnalysis] = useState<SkinAnalysisResult | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [addSuccessMsg, setAddSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const p = getStoredProfile();
    setProfile(p);
    setMaxBudget(p.budgetMax || 1500);
    setAnalysis(getStoredCurrentAnalysis());
  }, []);

  // Filter and score products
  const scoredProducts = useMemo(() => {
    const detectedConcerns = analysis?.metrics?.filter((m) => m.score < 70).map((m) => m.type) || [];
    
    // First apply user category and search filters
    let list = CURATED_PRODUCTS;

    if (selectedCategory !== "all") {
      list = list.filter((p) => p.category === selectedCategory);
    }
    if (maxBudget) {
      list = list.filter((p) => p.priceINR <= maxBudget);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.keyActives.some((act) => act.toLowerCase().includes(q)) ||
          p.targetConcerns.some((c) => c.toLowerCase().includes(q))
      );
    }

    // Score candidates against profile & scan
    return list.map((product) => {
      const { score, reasons } = scoreProductRelevance(product, profile || {}, detectedConcerns);
      return {
        product,
        matchScore: score,
        matchReason: reasons[0],
      };
    }).sort((a, b) => b.matchScore - a.matchScore);
  }, [selectedCategory, maxBudget, searchQuery, profile, analysis]);

  const handleAddProductToRoutine = (product: Product) => {
    const routine = getStoredRoutine();
    const newStep = {
      id: `step-${Date.now()}`,
      order: routine.morningSteps.length + 1,
      name: `${product.brand} ${product.category}`,
      category: product.category,
      product,
      instructions: `Apply recommended dose of ${product.name} according to package directions.`,
    };

    if (product.category === "sunscreen") {
      routine.morningSteps.push(newStep);
    } else {
      routine.morningSteps.push(newStep);
    }

    routine.totalPriceINR += product.priceINR;
    saveStoredRoutine(routine);

    setAddSuccessMsg(`Added ${product.name} to your active routine!`);
    setTimeout(() => setAddSuccessMsg(null), 3000);
    setSelectedProduct(null);
  };

  const alternatives = selectedProduct
    ? findAffordableAlternatives(selectedProduct, CURATED_PRODUCTS)
    : [];

  return (
    <div className="max-w-[1480px] mx-auto px-6 sm:px-10 lg:px-14 py-10 sm:py-14 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border-subtle/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-wider font-semibold text-brand-sage-700 bg-brand-sage-50 px-2.5 py-0.5 rounded-md border border-brand-sage-200">
              Curated eCommerce Discovery
            </span>
            <span className="text-xs text-content-faint">
              INR Pricing • Indian & Global Brands
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-content-primary">
            Smart Skincare Marketplace
          </h1>
          <p className="text-xs sm:text-sm text-content-muted mt-1">
            Verified cosmetic formulations matched deterministically to your YouCam diagnostic metrics and budget ceiling.
          </p>
        </div>

        {addSuccessMsg && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <Check className="h-4 w-4" />
            <span>{addSuccessMsg}</span>
          </div>
        )}
      </div>

      {/* Filter Bar with Live Budget Slider */}
      <BudgetFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        maxBudget={maxBudget}
        onBudgetChange={setMaxBudget}
      />

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-content-muted">
        <span>
          Showing <strong className="text-content-primary">{scoredProducts.length}</strong> products matching your criteria
        </span>
        <span className="hidden sm:inline">Ranked by diagnostic compatibility & budget efficiency</span>
      </div>

      {/* Product Grid */}
      {scoredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {scoredProducts.map(({ product, matchScore, matchReason }) => (
            <ProductCard
              key={product.id}
              product={product}
              matchScore={matchScore}
              matchReason={matchReason}
              onSelect={(p) => setSelectedProduct(p)}
            />
          ))}
        </div>
      ) : (
        <div className="p-16 rounded-3xl border border-border-subtle bg-white text-center space-y-3">
          <p className="text-base font-semibold text-content-primary">
            No products match this specific budget ceiling or filter.
          </p>
          <p className="text-xs text-content-muted max-w-sm mx-auto">
            Try adjusting your budget slider to a higher limit or clearing the active search keyword.
          </p>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              setMaxBudget(2000);
              setSelectedCategory("all");
              setSearchQuery("");
            }}
          >
            Reset Filters
          </Button>
        </div>
      )}

      {/* --- PRODUCT DETAILS & INGREDIENT EDUCATION MODAL --- */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-border-subtle max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-border-subtle pb-4">
              <div className="flex items-center gap-3">
                <div className="relative h-16 w-16 rounded-2xl overflow-hidden border border-border-subtle bg-surface-subtle shrink-0">
                  <Image
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <span className="text-xs font-bold text-brand-sage-700 uppercase">
                    {selectedProduct.brand} • {selectedProduct.category}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-content-primary">
                    {selectedProduct.name}
                  </h3>
                  <p className="text-base font-extrabold text-content-primary">
                    {formatPriceINR(selectedProduct.priceINR)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-1.5 rounded-xl hover:bg-surface-subtle text-content-muted transition-colors"
                aria-label="Close product modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Description */}
            <div className="space-y-2 text-xs text-content-muted leading-relaxed">
              <span className="font-bold text-content-primary uppercase tracking-wider text-[11px]">
                Product Overview
              </span>
              <p>{selectedProduct.description}</p>
            </div>

            {/* Active Ingredients & Cosmetic Mechanisms */}
            <div className="space-y-2">
              <span className="font-bold text-content-primary uppercase tracking-wider text-[11px]">
                Key Cosmetic Actives
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedProduct.keyActives.map((act, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-surface-subtle border border-border-subtle/70 text-xs"
                  >
                    <p className="font-bold text-brand-sage-800">{act}</p>
                    <p className="text-content-muted text-[11px] mt-0.5">
                      Cosmetic mechanism: Targets surface texture and supports skin barrier balance.
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Formulation attributes */}
            <div className="flex flex-wrap gap-2 text-xs">
              {selectedProduct.fragranceFree && (
                <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-medium border border-emerald-200">
                  ✓ Artificial Fragrance-Free
                </span>
              )}
              {selectedProduct.nonComedogenic && (
                <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-medium border border-emerald-200">
                  ✓ Non-Comedogenic (Won't Clog Pores)
                </span>
              )}
              <span className="px-2.5 py-1 rounded-lg bg-surface-subtle text-content-muted font-medium border border-border-subtle">
                Suitable for: {selectedProduct.suitableSkinTypes.join(", ")}
              </span>
            </div>

            {/* Affordable Alternative Section */}
            {alternatives.length > 0 && (
              <div className="p-4 rounded-2xl bg-brand-sand-100/60 border border-border-subtle space-y-2">
                <span className="text-[11px] font-bold text-content-primary uppercase tracking-wider flex items-center gap-1.5">
                  <IndianRupee className="h-3.5 w-3.5 text-brand-sage-600" />
                  Budget Alternative Available
                </span>
                <p className="text-xs text-content-muted">
                  Looking to save? Consider <strong>{alternatives[0].name}</strong> at{" "}
                  <strong>{formatPriceINR(alternatives[0].priceINR)}</strong> (saves{" "}
                  {formatPriceINR(selectedProduct.priceINR - alternatives[0].priceINR)}).
                </p>
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-2 flex items-center justify-between gap-3 border-t border-border-subtle">
              <a
                href={selectedProduct.sourceBrandUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-content-muted hover:text-brand-sage-700 font-medium flex items-center gap-1"
              >
                <span>View on Brand Site</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>

              <div className="flex items-center gap-2">
                <Button
                  size="md"
                  variant="outline"
                  onClick={() => setSelectedProduct(null)}
                >
                  Close
                </Button>
                <Button
                  size="md"
                  variant="primary"
                  onClick={() => handleAddProductToRoutine(selectedProduct)}
                  className="gap-2 shadow-soft"
                >
                  <Check className="h-4 w-4" />
                  <span>Add to My Routine</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
