export type SelfReportedSkinType =
  | "oily"
  | "dry"
  | "combination"
  | "normal"
  | "sensitive"
  | "unknown";

export type ExperienceLevel = "beginner" | "intermediate" | "experienced";

export interface UserProfile {
  id: string;
  email?: string;
  displayName: string;
  skinTypeReported: SelfReportedSkinType;
  concerns: string[];
  budgetMin: number;
  budgetMax: number;
  ingredientPreferences: string[];
  ingredientRestrictions: string[];
  experienceLevel: ExperienceLevel;
  createdAt: string;
  updatedAt: string;
}

export interface JournalNote {
  id: string;
  userId?: string;
  analysisId?: string;
  date: string;
  content: string;
  tags: string[];
}
