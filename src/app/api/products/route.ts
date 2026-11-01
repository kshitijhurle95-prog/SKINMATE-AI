import { NextRequest, NextResponse } from "next/server";
import { CURATED_PRODUCTS } from "@/lib/data/curated-products";
import { filterProducts } from "@/lib/recommendation/engine";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || undefined;
    const maxPriceINR = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined;
    const skinType = searchParams.get("skinType") || undefined;
    const concern = searchParams.get("concern") || undefined;

    const filtered = filterProducts(CURATED_PRODUCTS, {
      category,
      maxPriceINR,
      skinType,
      concern,
    });

    return NextResponse.json({
      success: true,
      data: filtered,
      total: filtered.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch products" },
      { status: 500 }
    );
  }
}
