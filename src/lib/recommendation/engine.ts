import { Product, ProductMatchExplanation } from "@/types/product";
import { UserProfile } from "@/types/user";
import { NormalizedSkinMetric, SkinAnalysisResult } from "@/types/skin-analysis";
import { SkincareRoutine, RoutineStep } from "@/types/routine";
import { checkRoutineConflicts } from "./conflict-checker";

export function scoreProductRelevance(
  product: Product,
  profile: Partial<UserProfile>,
  detectedConcerns: string[] = []
): { score: number; reasons: string[]; isDisqualified: boolean } {
  // Check ingredient exclusions
  if (profile.ingredientRestrictions && profile.ingredientRestrictions.length > 0) {
    const hasRestricted = profile.ingredientRestrictions.some((restricted) => {
      const lower = restricted.toLowerCase().trim();
      return product.keyActives.some((act) => act.toLowerCase().includes(lower));
    });
    if (hasRestricted) {
      return { score: -1, reasons: ["Disqualified: Contains user-restricted ingredient"], isDisqualified: true };
    }
  }

  const reasons: string[] = [];
  let skinTypeScore = 20;

  if (profile.skinTypeReported && profile.skinTypeReported !== "unknown") {
    if (product.suitableSkinTypes.includes(profile.skinTypeReported as any)) {
      skinTypeScore = 35;
      reasons.push(`Formulated for ${profile.skinTypeReported} skin types`);
    } else {
      skinTypeScore = 10;
    }
  }

  // Concern matching (from both self-reported & YouCam detected concerns)
  const allUserConcerns = Array.from(
    new Set([...(profile.concerns || []), ...detectedConcerns])
  );

  let concernMatches = 0;
  product.targetConcerns.forEach((c) => {
    if (allUserConcerns.includes(c)) {
      concernMatches++;
      reasons.push(`Addresses visible ${c.replace("_", " ")} characteristics`);
    }
  });

  const concernScore = Math.min(45, concernMatches * 18);

  // Price efficiency (up to 20 points)
  const budgetMax = profile.budgetMax || 2000;
  const priceFraction = product.priceINR / (budgetMax * 0.45); // Expecting step to cost ~40-45% of total budget
  const budgetScore = Math.max(0, Math.min(20, Math.round(20 * (1 - Math.min(1, priceFraction * 0.5)))));

  if (product.priceINR <= 400) {
    reasons.push(`Budget-friendly at ₹${product.priceINR}`);
  }

  const totalScore = Math.min(100, skinTypeScore + concernScore + budgetScore);
  return { score: totalScore, reasons, isDisqualified: false };
}

export function filterProducts(
  catalog: Product[],
  options: {
    category?: string;
    maxPriceINR?: number;
    skinType?: string;
    concern?: string;
    excludeIngredients?: string[];
  }
): Product[] {
  return catalog.filter((p) => {
    if (options.category && options.category !== "all" && p.category !== options.category) {
      return false;
    }
    if (options.maxPriceINR && p.priceINR > options.maxPriceINR) {
      return false;
    }
    if (options.skinType && options.skinType !== "all" && options.skinType !== "unknown") {
      if (!p.suitableSkinTypes.includes(options.skinType as any)) {
        return false;
      }
    }
    if (options.concern && options.concern !== "all") {
      if (!p.targetConcerns.includes(options.concern)) {
        return false;
      }
    }
    if (options.excludeIngredients && options.excludeIngredients.length > 0) {
      const hasExcluded = options.excludeIngredients.some((ex) =>
        p.keyActives.some((act) => act.toLowerCase().includes(ex.toLowerCase()))
      );
      if (hasExcluded) return false;
    }
    return true;
  });
}

export function generatePersonalizedRoutine(
  catalog: Product[],
  profile: UserProfile,
  analysis?: SkinAnalysisResult,
  customBudget?: number
): SkincareRoutine {
  const budgetMax = customBudget || profile.budgetMax || 1500;
  
  // Extract high-priority concerns from analysis (scores under 70 indicate areas needing attention)
  const detectedPriorityConcerns: string[] = [];
  if (analysis && analysis.metrics) {
    analysis.metrics.forEach((m) => {
      if (m.score < 70) {
        detectedPriorityConcerns.push(m.type);
      }
    });
  }

  // 1. Separate candidates by essential categories
  const cleansers = catalog.filter((p) => p.category === "cleanser");
  const moisturisers = catalog.filter((p) => p.category === "moisturiser");
  const sunscreens = catalog.filter((p) => p.category === "sunscreen");
  const serums = catalog.filter((p) => p.category === "serum" || p.category === "treatment");

  // Rank each pool
  const rank = (pool: Product[]) =>
    pool
      .map((p) => ({ product: p, ...scoreProductRelevance(p, profile, detectedPriorityConcerns) }))
      .filter((item) => !item.isDisqualified)
      .sort((a, b) => b.score - a.score);

  const rankedCleansers = rank(cleansers);
  const rankedMoisturisers = rank(moisturisers);
  const rankedSunscreens = rank(sunscreens);
  const rankedSerums = rank(serums);

  // 2. Combinatorial Optimization for 3-Step Routine within budget
  let bestTrio: { c: Product; m: Product; s: Product } | null = null;
  let highestScore = -1;

  for (const c of rankedCleansers.slice(0, 3)) {
    for (const m of rankedMoisturisers.slice(0, 3)) {
      for (const s of rankedSunscreens.slice(0, 3)) {
        const cost = c.product.priceINR + m.product.priceINR + s.product.priceINR;
        if (cost <= budgetMax) {
          const comboScore = c.score + m.score + s.score;
          if (comboScore > highestScore) {
            highestScore = comboScore;
            bestTrio = { c: c.product, m: m.product, s: s.product };
          }
        }
      }
    }
  }

  // Fallback if top combos exceed budget: pick cheapest valid items in each category
  if (!bestTrio) {
    const cheapestC = [...rankedCleansers].sort((a, b) => a.product.priceINR - b.product.priceINR)[0]?.product || cleansers[0];
    const cheapestM = [...rankedMoisturisers].sort((a, b) => a.product.priceINR - b.product.priceINR)[0]?.product || moisturisers[0];
    const cheapestS = [...rankedSunscreens].sort((a, b) => a.product.priceINR - b.product.priceINR)[0]?.product || sunscreens[0];
    bestTrio = { c: cheapestC, m: cheapestM, s: cheapestS };
  }

  // 3. Assemble Morning Steps
  const morningSteps: RoutineStep[] = [
    {
      id: "step-am-1",
      order: 1,
      name: "Gentle Cleanser",
      category: "cleanser",
      product: bestTrio.c,
      instructions: "Apply coin-sized amount to damp face. Massage gently for 45-60 seconds, then rinse with lukewarm water.",
    },
    {
      id: "step-am-2",
      order: 2,
      name: "Barrier Moisturiser",
      category: "moisturiser",
      product: bestTrio.m,
      instructions: "Smooth evenly over face and neck while skin is slightly damp to lock in surface hydration.",
    },
    {
      id: "step-am-3",
      order: 3,
      name: "Broad Spectrum Sunscreen",
      category: "sunscreen",
      product: bestTrio.s,
      instructions: "Apply two finger-lengths generously 15 minutes before stepping out. Essential for barrier defense.",
    },
  ];

  // 4. Assemble Evening Steps (Cleanser + Optional Treatment + Moisturiser)
  const eveningSteps: RoutineStep[] = [
    {
      id: "step-pm-1",
      order: 1,
      name: "Evening Purifying Cleanser",
      category: "cleanser",
      product: bestTrio.c,
      instructions: "Wash away daily surface pollutants, sebum, and sunscreen residue thoroughly.",
    },
  ];

  let currentTotalCost = bestTrio.c.priceINR + bestTrio.m.priceINR + bestTrio.s.priceINR;

  // If budget remaining and user has prominent concerns, add a targeted serum to evening
  const budgetRemaining = budgetMax - currentTotalCost;
  const bestSerumCandidate = rankedSerums[0];

  if (bestSerumCandidate && bestSerumCandidate.product.priceINR <= budgetRemaining) {
    eveningSteps.push({
      id: "step-pm-2",
      order: 2,
      name: "Targeted Care Serum",
      category: bestSerumCandidate.product.category,
      product: bestSerumCandidate.product,
      instructions: "Dispense 2-3 drops onto clean skin. Press gently into areas of visible concern until absorbed.",
    });
    currentTotalCost += bestSerumCandidate.product.priceINR;
  }

  eveningSteps.push({
    id: `step-pm-${eveningSteps.length + 1}`,
    order: eveningSteps.length + 1,
    name: "Night Hydrating Moisturiser",
    category: "moisturiser",
    product: bestTrio.m,
    instructions: "Apply to support overnight skin recovery and prevent transepidermal water loss.",
  });

  const conflicts = checkRoutineConflicts(morningSteps, eveningSteps);

  return {
    id: `routine-${Date.now()}`,
    userId: profile.id,
    name: `${profile.skinTypeReported ? profile.skinTypeReported.toUpperCase() : "PERSONAL"} Essential Regimen`,
    morningSteps,
    eveningSteps,
    totalPriceINR: currentTotalCost,
    budgetLimitINR: budgetMax,
    conflicts,
    updatedAt: new Date().toISOString(),
  };
}

export function calculateProductMatchScore(
  product: Product,
  analysis?: SkinAnalysisResult | null
): number {
  if (!analysis || !analysis.metrics || analysis.metrics.length === 0) {
    return Math.round(75 + product.rating * 4);
  }

  // Find user's top concerns from analysis (scores under 75)
  const priorityConcerns = analysis.metrics
    .filter((m) => m.score < 75)
    .map((m) => m.type);

  let matchPoints = 0;
  product.targetConcerns.forEach((c) => {
    if (priorityConcerns.includes(c as any)) {
      matchPoints += 25;
    }
  });

  const baseScore = 65;
  const ratingBonus = Math.round(product.rating * 3);
  const rawScore = baseScore + matchPoints + ratingBonus;
  return Math.min(98, Math.max(70, rawScore));
}

export function findAffordableAlternatives(
  currentProduct: Product,
  catalog: Product[]
): Product[] {
  return catalog
    .filter(
      (p) =>
        p.id !== currentProduct.id &&
        p.category === currentProduct.category &&
        p.priceINR < currentProduct.priceINR
    )
    .sort((a, b) => a.priceINR - b.priceINR);
}
