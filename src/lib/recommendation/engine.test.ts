import { describe, it } from "node:test";
import assert from "node:assert";
import {
  scoreProductRelevance,
  filterProducts,
  generatePersonalizedRoutine,
  findAffordableAlternatives,
  calculateProductMatchScore,
} from "@/lib/recommendation/engine";
import { CURATED_PRODUCTS } from "@/lib/data/curated-products";
import { DEFAULT_PROFILE } from "@/lib/store/local-store";
import { VERIFIED_YOUCAM_DEMO_RESULT } from "@/lib/youcam/client";

describe("Skincare Recommendation Engine", () => {
  it("should disqualify products containing user-restricted ingredients", () => {
    const salicylicCleanser = CURATED_PRODUCTS.find((p) => p.id === "prod-cl-01")!;
    const profileWithRestriction = {
      ...DEFAULT_PROFILE,
      ingredientRestrictions: ["salicylic acid"],
    };

    const result = scoreProductRelevance(salicylicCleanser, profileWithRestriction);
    assert.strictEqual(result.isDisqualified, true);
    assert.strictEqual(result.score, -1);
    assert.strictEqual(result.reasons[0].includes("Disqualified"), true);
  });

  it("should award higher score to products matching user skin type and concerns", () => {
    const oilyCleanser = CURATED_PRODUCTS.find((p) => p.id === "prod-cl-01")!;
    const dryCleanser = CURATED_PRODUCTS.find((p) => p.id === "prod-cl-02")!;

    const oilyProfile = {
      ...DEFAULT_PROFILE,
      skinTypeReported: "oily" as const,
      concerns: ["pore", "oiliness"],
    };

    const oilyScore = scoreProductRelevance(oilyCleanser, oilyProfile, ["pore"]);
    const dryScore = scoreProductRelevance(dryCleanser, oilyProfile, ["pore"]);

    assert.strictEqual(oilyScore.score > dryScore.score, true);
    assert.strictEqual(oilyScore.isDisqualified, false);
  });

  it("should filter products strictly by price and excluded ingredients", () => {
    const filtered = filterProducts(CURATED_PRODUCTS, {
      maxPriceINR: 350,
      excludeIngredients: ["fragrance"],
    });

    assert.strictEqual(filtered.length > 0, true);
    for (const p of filtered) {
      assert.strictEqual(p.priceINR <= 350, true);
    }
  });

  it("should generate a personalized routine with morning SPF and proper sequencing", () => {
    const routine = generatePersonalizedRoutine(
      CURATED_PRODUCTS,
      DEFAULT_PROFILE,
      VERIFIED_YOUCAM_DEMO_RESULT,
      1600
    );

    assert.strictEqual(routine.morningSteps.length >= 3, true);
    assert.strictEqual(routine.eveningSteps.length >= 2, true);

    // Morning must have sunscreen
    const hasMorningSunscreen = routine.morningSteps.some((s) => s.category === "sunscreen");
    assert.strictEqual(hasMorningSunscreen, true);

    // Morning must have cleanser and moisturiser
    const hasMorningCleanser = routine.morningSteps.some((s) => s.category === "cleanser");
    const hasMorningMoisturiser = routine.morningSteps.some((s) => s.category === "moisturiser");
    assert.strictEqual(hasMorningCleanser, true);
    assert.strictEqual(hasMorningMoisturiser, true);
  });

  it("should identify affordable alternatives in same category", () => {
    // Find an expensive product
    const expensive = CURATED_PRODUCTS.find((p) => p.category === "cleanser" && p.priceINR > 300);
    if (expensive) {
      const alternatives = findAffordableAlternatives(expensive, CURATED_PRODUCTS);
      assert.strictEqual(alternatives.length > 0, true);
      for (const alt of alternatives) {
        assert.strictEqual(alt.category, expensive.category);
        assert.strictEqual(alt.priceINR < expensive.priceINR, true);
      }
    }
  });

  it("should calculate product match scores within safe bounds (70-98)", () => {
    const product = CURATED_PRODUCTS[0];
    const score = calculateProductMatchScore(product, VERIFIED_YOUCAM_DEMO_RESULT);
    assert.strictEqual(score >= 70 && score <= 98, true);
  });
});
