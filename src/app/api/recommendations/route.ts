import { NextRequest, NextResponse } from "next/server";
import { CURATED_PRODUCTS } from "@/lib/data/curated-products";
import { generatePersonalizedRoutine } from "@/lib/recommendation/engine";
import { UserProfile } from "@/types/user";
import { SkinAnalysisResult } from "@/types/skin-analysis";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const profile: UserProfile = body.profile || {
      id: "guest-user",
      displayName: "Guest",
      skinTypeReported: "combination",
      concerns: ["pore", "oiliness"],
      budgetMin: 500,
      budgetMax: 1500,
      ingredientPreferences: [],
      ingredientRestrictions: [],
      experienceLevel: "beginner",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const analysis: SkinAnalysisResult | undefined = body.analysis;
    const customBudget: number | undefined = body.customBudget;

    const routine = generatePersonalizedRoutine(
      CURATED_PRODUCTS,
      profile,
      analysis,
      customBudget
    );

    return NextResponse.json({
      success: true,
      data: routine,
    });
  } catch (error: any) {
    console.error("[API /api/recommendations] Error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to generate recommendations" },
      { status: 500 }
    );
  }
}
