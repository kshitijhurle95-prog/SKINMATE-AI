export type ProductCategory =
  | "cleanser"
  | "toner"
  | "serum"
  | "moisturiser"
  | "sunscreen"
  | "treatment";

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  priceINR: number;
  rating: number;
  reviewsCount: number;
  image: string;
  description: string;
  keyActives: string[]; // e.g. ["2% Salicylic Acid", "0.5% LHA"]
  allIngredients?: string;
  suitableSkinTypes: ("oily" | "dry" | "combination" | "normal" | "sensitive")[];
  targetConcerns: string[]; // e.g. ["acne", "pore", "oiliness", "texture"]
  fragranceFree: boolean;
  nonComedogenic: boolean;
  sourceBrandUrl: string;
  isDemoCatalog?: boolean;
}

export interface ProductMatchExplanation {
  product: Product;
  relevanceScore: number; // 0 - 100
  matchReasons: string[];
  safetyWarnings?: string[];
  budgetImpact: string;
}
