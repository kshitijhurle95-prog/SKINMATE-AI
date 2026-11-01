"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Star, Heart, Check, Sparkles } from "lucide-react";
import { Product } from "@/types/product";
import { formatPriceINR } from "@/lib/utils";
import { toggleSaveProduct, getSavedProductIds } from "@/lib/store/local-store";

interface ProductCardProps {
  product: Product;
  matchScore?: number;
  matchReason?: string;
  onSelect?: (product: Product) => void;
}

export function ProductCard({
  product,
  matchScore,
  matchReason,
  onSelect,
}: ProductCardProps) {
  const [isSaved, setIsSaved] = useState(() =>
    getSavedProductIds().includes(product.id)
  );

  const handleToggleHeart = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newState = toggleSaveProduct(product.id);
    setIsSaved(newState);
  };

  return (
    <div
      onClick={() => onSelect && onSelect(product)}
      className="group relative rounded-2xl border border-border-subtle bg-white p-4 shadow-card hover:shadow-hover hover:border-brand-sage-300 transition-all duration-300 flex flex-col justify-between cursor-pointer"
    >
      <div>
        {/* Top Image Container */}
        <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-surface-subtle mb-3.5">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 300px"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Category Tag */}
          <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider bg-white/90 backdrop-blur-sm text-content-primary shadow-soft">
            {product.category}
          </span>

          {/* Heart Save Button */}
          <button
            onClick={handleToggleHeart}
            aria-label={isSaved ? "Remove from saved products" : "Save product"}
            className="absolute top-2.5 right-2.5 h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-content-muted hover:text-brand-terracotta-500 shadow-soft transition-colors"
          >
            <Heart
              className={`h-4 w-4 ${
                isSaved ? "fill-brand-terracotta-500 text-brand-terracotta-500" : ""
              }`}
            />
          </button>

          {/* Match Score Badge */}
          {matchScore && matchScore > 0 && (
            <div className="absolute bottom-2.5 left-2.5 bg-brand-sage-500 text-white text-[11px] font-semibold px-2 py-0.5 rounded-lg shadow-soft flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              <span>{matchScore}% Match</span>
            </div>
          )}
        </div>

        {/* Content Info */}
        <div className="space-y-1">
          <p className="text-xs font-semibold text-brand-sage-700 tracking-wide">
            {product.brand}
          </p>
          <h4 className="font-semibold text-sm text-content-primary line-clamp-1 group-hover:text-brand-sage-700 transition-colors">
            {product.name}
          </h4>

          {/* Ratings */}
          <div className="flex items-center gap-1.5 pt-0.5 text-xs text-content-muted">
            <div className="flex items-center text-amber-500">
              <Star className="h-3.5 w-3.5 fill-current" />
              <span className="font-bold ml-1 text-content-primary">{product.rating}</span>
            </div>
            <span className="text-content-faint">({product.reviewsCount})</span>
          </div>

          {/* Key Actives Pills */}
          <div className="flex flex-wrap gap-1 pt-2">
            {product.keyActives.slice(0, 2).map((act, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-md bg-surface-subtle text-[10px] font-medium text-content-muted"
              >
                {act}
              </span>
            ))}
          </div>

          {/* Match Reason Text */}
          {matchReason && (
            <p className="text-[11px] text-brand-sage-700 font-medium pt-1 line-clamp-2">
              ✓ {matchReason}
            </p>
          )}
        </div>
      </div>

      {/* Bottom Footer Price & Action */}
      <div className="pt-4 mt-3 border-t border-border-subtle/70 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-content-faint uppercase font-medium">Price</span>
          <p className="text-base font-bold text-content-primary">
            {formatPriceINR(product.priceINR)}
          </p>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onSelect) onSelect(product);
          }}
          className="px-3 py-1.5 rounded-xl bg-surface-subtle hover:bg-brand-sage-50 text-content-primary hover:text-brand-sage-700 text-xs font-semibold border border-border-subtle transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  );
}
