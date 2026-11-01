import { describe, it } from "node:test";
import assert from "node:assert";
import { checkRoutineConflicts } from "@/lib/recommendation/conflict-checker";
import { RoutineStep } from "@/types/routine";
import { CURATED_PRODUCTS } from "@/lib/data/curated-products";

describe("Skincare Safety Conflict Checker", () => {
  const cleanserSalicylic = CURATED_PRODUCTS.find((p) => p.id === "prod-cl-01")!;
  const serumRetinol = CURATED_PRODUCTS.find((p) => p.id === "prod-sr-04")!;
  const moisturizer = CURATED_PRODUCTS.find((p) => p.id === "prod-ms-01")!;
  const sunscreen = CURATED_PRODUCTS.find((p) => p.id === "prod-sc-01")!;

  it("should flag Missing Sunscreen when exfoliating acid is in routine without morning SPF", () => {
    const morningSteps: RoutineStep[] = [
      {
        id: "step-1",
        order: 1,
        name: "Morning Cleansing",
        category: "cleanser",
        product: cleanserSalicylic, // 2% Salicylic Acid
        instructions: "Lather on wet face",
        isCompleted: false,
      },
      {
        id: "step-2",
        order: 2,
        name: "Morning Hydration",
        category: "moisturiser",
        product: moisturizer,
        instructions: "Apply evenly",
        isCompleted: false,
      },
    ];

    const eveningSteps: RoutineStep[] = [];

    const conflicts = checkRoutineConflicts(morningSteps, eveningSteps);
    assert.strictEqual(conflicts.length > 0, true);
    const hasSpfWarning = conflicts.some(
      (c) => c.ingredientB === "Missing Sunscreen" && c.severity === "high"
    );
    assert.strictEqual(hasSpfWarning, true);
  });

  it("should NOT flag Missing Sunscreen if morning routine includes an SPF sunscreen", () => {
    const morningSteps: RoutineStep[] = [
      {
        id: "step-1",
        order: 1,
        name: "Morning Cleansing",
        category: "cleanser",
        product: cleanserSalicylic,
        instructions: "Lather gently",
        isCompleted: false,
      },
      {
        id: "step-2",
        order: 2,
        name: "Morning Sunscreen",
        category: "sunscreen",
        product: sunscreen,
        instructions: "Apply generously",
        isCompleted: false,
      },
    ];

    const conflicts = checkRoutineConflicts(morningSteps, []);
    const hasSpfWarning = conflicts.some((c) => c.ingredientB === "Missing Sunscreen");
    assert.strictEqual(hasSpfWarning, false);
  });

  it("should flag conflict when Salicylic Acid and Retinol are used in the same evening routine", () => {
    const eveningSteps: RoutineStep[] = [
      {
        id: "step-1",
        order: 1,
        name: "Evening Cleansing",
        category: "cleanser",
        product: cleanserSalicylic, // Salicylic Acid
        instructions: "Wash face",
        isCompleted: false,
      },
      {
        id: "step-2",
        order: 2,
        name: "Evening Treatment",
        category: "serum",
        product: serumRetinol, // 0.3% Retinol
        instructions: "Apply 2 drops",
        isCompleted: false,
      },
    ];

    // Give morning an SPF so only the evening collision fires
    const morningSteps: RoutineStep[] = [
      {
        id: "m-1",
        order: 1,
        name: "Morning Sunscreen",
        category: "sunscreen",
        product: sunscreen,
        instructions: "Apply SPF",
        isCompleted: false,
      },
    ];

    const conflicts = checkRoutineConflicts(morningSteps, eveningSteps);
    const hasBhaRetinolConflict = conflicts.some(
      (c) =>
        c.ingredientA.includes("Salicylic") &&
        c.ingredientB.includes("Retinoid") &&
        c.severity === "high"
    );
    assert.strictEqual(hasBhaRetinolConflict, true);
  });
});
