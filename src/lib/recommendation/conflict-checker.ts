import { RoutineStep, IngredientConflict } from "@/types/routine";

export function checkRoutineConflicts(
  morningSteps: RoutineStep[],
  eveningSteps: RoutineStep[]
): IngredientConflict[] {
  const conflicts: IngredientConflict[] = [];

  const allActiveStringsMorning = morningSteps.flatMap((s) =>
    s.product.keyActives.map((a) => a.toLowerCase())
  );
  const allActiveStringsEvening = eveningSteps.flatMap((s) =>
    s.product.keyActives.map((a) => a.toLowerCase())
  );

  const hasSunscreen = morningSteps.some((s) => s.category === "sunscreen");
  const usesExfoliatingAcid = [...allActiveStringsMorning, ...allActiveStringsEvening].some(
    (a) => a.includes("salicylic") || a.includes("glycolic") || a.includes("lactic") || a.includes("lha")
  );
  const usesRetinoid = [...allActiveStringsMorning, ...allActiveStringsEvening].some(
    (a) => a.includes("retinol") || a.includes("retinoid")
  );

  // Rule 1: Exfoliating Acids or Retinoids without Morning Sunscreen
  if ((usesExfoliatingAcid || usesRetinoid) && !hasSunscreen) {
    conflicts.push({
      severity: "high",
      ingredientA: usesExfoliatingAcid ? "Exfoliating Acids" : "Retinoid",
      ingredientB: "Missing Sunscreen",
      reason:
        "Using active exfoliants or retinoids accelerates skin surface turnover and increases UV sensitivity. Without daily broad-spectrum SPF, your skin is vulnerable to hyperpigmentation and barrier stress.",
      safeAlternative: "Add a broad-spectrum SPF 30+ or SPF 50 sunscreen to your morning routine.",
    });
  }

  // Rule 2: Salicylic Acid + Retinol in the same Evening routine
  const eveningHasBHA = allActiveStringsEvening.some((a) => a.includes("salicylic"));
  const eveningHasRetinoid = allActiveStringsEvening.some(
    (a) => a.includes("retinol") || a.includes("retinoid")
  );

  if (eveningHasBHA && eveningHasRetinoid) {
    conflicts.push({
      severity: "high",
      ingredientA: "Salicylic Acid (BHA)",
      ingredientB: "Retinoid",
      reason:
        "Layering BHA with Retinoids simultaneously can compromise the stratum corneum (outer skin barrier), triggering redness, peeling, and irritation.",
      safeAlternative:
        "Alternate evenings: apply Salicylic Acid on Monday/Wednesday/Friday, and Retinoid on Tuesday/Thursday/Saturday.",
    });
  }

  // Rule 3: High strength Vitamin C + Retinol in same evening
  const eveningHasVitC = allActiveStringsEvening.some(
    (a) => a.includes("vitamin c") || a.includes("ascorbic")
  );
  if (eveningHasVitC && eveningHasRetinoid) {
    conflicts.push({
      severity: "moderate",
      ingredientA: "Vitamin C",
      ingredientB: "Retinoid",
      reason:
        "Vitamin C functions best at a lower pH, while Retinoids prefer a neutral pH. Using both together at night can reduce efficacy and cause tingling.",
      safeAlternative: "Move Vitamin C to your morning routine to provide daytime free-radical defense.",
    });
  }

  return conflicts;
}
