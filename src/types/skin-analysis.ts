export type ConcernType =
  | "pore"
  | "texture"
  | "acne"
  | "wrinkle"
  | "spot"
  | "redness"
  | "moisture"
  | "dark_circle_v2"
  | "radiance"
  | "oiliness"
  | "eyebag"
  | "firmness";

export interface NormalizedSkinMetric {
  type: ConcernType;
  displayName: string;
  score: number; // 0 - 100 scale (higher is healthier/clearer)
  rawScore?: number;
  severity: "optimal" | "mild" | "moderate" | "high";
  maskUrl?: string;
  summary: string;
  cosmeticAdvice: string;
}

export interface SkinAnalysisResult {
  id: string;
  userId?: string;
  createdAt: string;
  overallScore: number;
  skinTypeAssessed: "oily" | "dry" | "combination" | "normal";
  metrics: NormalizedSkinMetric[];
  imageUrl?: string;
  isDemoData: boolean;
  activeMasksAvailable: string[];
  disclaimer: string;
}

export interface YouCamRawOutputItem {
  type: string;
  ui_score: number;
  raw_score?: number;
  mask_urls?: string[];
}

export interface YouCamTaskStatusResponse {
  status: number;
  data: {
    task_status: "running" | "success" | "error";
    results?: {
      output?: YouCamRawOutputItem[];
    };
    error?: string;
  };
}
