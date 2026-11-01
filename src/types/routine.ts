import { Product } from "./product";

export interface RoutineStep {
  id: string;
  order: number;
  name: string; // e.g. "Step 1: Gentle Cleansing"
  category: "cleanser" | "toner" | "serum" | "moisturiser" | "sunscreen" | "treatment";
  product: Product;
  instructions: string;
  isCompleted?: boolean;
}

export interface IngredientConflict {
  severity: "high" | "moderate" | "info";
  ingredientA: string;
  ingredientB: string;
  reason: string;
  safeAlternative: string;
}

export interface SkincareRoutine {
  id: string;
  userId?: string;
  name: string;
  morningSteps: RoutineStep[];
  eveningSteps: RoutineStep[];
  totalPriceINR: number;
  budgetLimitINR: number;
  conflicts: IngredientConflict[];
  updatedAt: string;
}
