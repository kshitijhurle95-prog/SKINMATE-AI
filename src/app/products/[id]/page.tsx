"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Heart,
  Star,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Check,
  AlertCircle,
  Tag,
  Clock,
  Layers,
} from "lucide-react";
import { CURATED_PRODUCTS } from "@/lib/data/curated-products";
import { Product } from "@/types/product";
import { formatPriceINR } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import {
  getSavedProductIds,
  toggleSaveProduct,
  getStoredCurrentAnalysis,
} from "@/lib/store/local-store";
import { calculateProductMatchScore } from "@/lib/recommendation/engine";
import { SkinAnalysisResult } from "@/types/skin-analysis";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [analysis, setAnalysis] = useState<SkinAnalysisResult | null>(null);
  const [matchScore, setMatchScore] = useState<number>(85);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!productId) return;
    const found = CURATED_PRODUCTS.find((p) => p.id === productId);
    if (found) {
      setProduct(found);
    }

    const savedIds = getSavedProductIds();
    setIsSaved(savedIds.includes(productId));

    const currentAnalysis = getStoredCurrentAnalysis();
    setAnalysis(currentAnalysis);

    if (found && currentAnalysis) {
      const score = calculateProductMatchScore(found, currentAnalysis);
      setMatchScore(score);
    }
  }, [productId]);

  const handleToggleSave = () => {
    if (!product) return;
    const status = toggleSaveProduct(product.id);
    setIsSaved(status);
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-serif font-bold text-slate-800 mb-2">Product Not Found</h2>
        <p className="text-sm text-slate-600 mb-6">
          The requested skincare product could not be located in our curated catalog.
        </p>
        <Link href="/products">
          <Button variant="primary">Back to Marketplace</Button>
        </Link>
      </div>
    );
  }

  // Find related products in same category
  const related = CURATED_PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 3);

  return (
    <div className="min-h-screen bg-sand-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-forest-700 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Discovery</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="px-3 py-1 text-xs rounded-lg border border-sand-300 bg-white hover:bg-sand-100 text-slate-700 transition"
            >
              {copied ? "Link Copied!" : "Share Product"}
            </button>
          </div>
        </div>

        {/* Main Product Showcase Card */}
        <div className="bg-white rounded-2xl border border-sand-200 overflow-hidden shadow-xs grid grid-cols-1 md:grid-cols-12 gap-8 p-6 sm:p-8 mb-10">
          {/* Product Image Column */}
          <div className="md:col-span-5 flex flex-col items-center">
            <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-sand-100 border border-sand-200">
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover"
                priority
              />
              <button
                onClick={handleToggleSave}
                aria-label="Save to favorites"
                className="absolute top-3 right-3 p-2.5 rounded-full bg-white/90 backdrop-blur-xs text-slate-600 hover:text-terracotta-500 shadow-sm transition cursor-pointer"
              >
                <Heart
                  className={`w-5 h-5 ${isSaved ? "fill-terracotta-500 text-terracotta-500" : ""}`}
                />
              </button>
              <div className="absolute bottom-3 left-3">
                <Badge variant="terracotta" className="text-xs shadow-xs">
                  {matchScore}% Skin Match
                </Badge>
              </div>
            </div>

            {/* Price & Rating Bar */}
            <div className="w-full mt-4 flex items-center justify-between px-2">
              <div>
                <span className="text-xs text-slate-500 block">Retail Price</span>
                <span className="font-serif font-bold text-2xl text-slate-900">
                  {formatPriceINR(product.priceINR)}
                </span>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-amber-500 justify-end">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="text-sm font-bold text-slate-800">{product.rating}</span>
                </div>
                <span className="text-xs text-slate-500">
                  {product.reviewsCount} verified reviews
                </span>
              </div>
            </div>
          </div>

          {/* Product Metadata & Action Column */}
          <div className="md:col-span-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="sand" className="uppercase tracking-wider text-[10px]">
                  {product.brand}
                </Badge>
                <Badge variant="sage" className="capitalize text-[10px]">
                  {product.category}
                </Badge>
                {product.fragranceFree && (
                  <Badge variant="sand" className="text-[10px]">
                    Fragrance-Free
                  </Badge>
                )}
                {product.nonComedogenic && (
                  <Badge variant="sand" className="text-[10px]">
                    Non-Comedogenic
                  </Badge>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 leading-tight mb-3">
                {product.name}
              </h1>

              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Key Actives Section */}
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-forest-600" />
                  Key Active Ingredients
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.keyActives.map((active, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-md bg-forest-50 border border-forest-200 text-forest-800 text-xs font-medium"
                    >
                      {active}
                    </span>
                  ))}
                </div>
              </div>

              {/* Target Concerns */}
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-terracotta-500" />
                  Addresses Visible Concerns
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.targetConcerns.map((concern, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-md bg-sand-100 border border-sand-300 text-slate-700 text-xs capitalize"
                    >
                      {concern}
                    </span>
                  ))}
                </div>
              </div>

              {/* Suitable Skin Types */}
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-slate-500" />
                  Ideal Skin Profile
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {product.suitableSkinTypes.map((type, i) => (
                    <Badge key={i} variant="sand" className="capitalize text-xs">
                      {type} skin
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-6 border-t border-sand-200 flex flex-col sm:flex-row gap-3">
              <a
                href={product.sourceBrandUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button variant="primary" className="w-full inline-flex items-center justify-center gap-2 py-2.5">
                  <span>Visit Brand / Retailer</span>
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </a>
              <Button
                variant={isSaved ? "secondary" : "outline"}
                onClick={handleToggleSave}
                className="inline-flex items-center justify-center gap-2 py-2.5"
              >
                <Heart className={`w-4 h-4 ${isSaved ? "fill-terracotta-500 text-terracotta-500" : ""}`} />
                <span>{isSaved ? "Saved to Favorites" : "Save to Favorites"}</span>
              </Button>
            </div>
          </div>
        </div>

        {/* YouCam Diagnostics Alignment Box */}
        <div className="bg-forest-50/70 border border-forest-200/80 rounded-2xl p-6 mb-10">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-forest-600 text-cream-50 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-forest-900 mb-1">
                YouCam AI Match Diagnostic: {matchScore}% Alignment
              </h3>
              <p className="text-xs text-forest-800 leading-relaxed mb-3">
                Based on your latest skin scan, this formula aligns with your skin profile by supplying active ingredients targeting your priority areas without triggering known sensitivity flags.
              </p>
              <div className="flex items-center gap-4 text-xs font-medium text-forest-700">
                <span className="flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-forest-600" />
                  Targeted active delivery
                </span>
                <span className="flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-forest-600" />
                  Free of user-restricted ingredients
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Options in This Category */}
        {related.length > 0 && (
          <div>
            <h2 className="text-xl font-serif font-bold text-slate-800 mb-4">
              Similar Formulations in {product.category}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((item) => (
                <Link key={item.id} href={`/products/${item.id}`} className="group">
                  <Card className="h-full p-4 hover:border-forest-300 transition hover:shadow-xs">
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-sand-100 mb-3">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="(max-width: 640px) 100vw, 300px"
                        className="object-cover group-hover:scale-105 transition duration-300"
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider block">
                      {item.brand}
                    </span>
                    <h4 className="text-sm font-semibold text-slate-800 line-clamp-1 group-hover:text-forest-700">
                      {item.name}
                    </h4>
                    <span className="text-sm font-serif font-bold text-slate-900 mt-2 block">
                      {formatPriceINR(item.priceINR)}
                    </span>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
