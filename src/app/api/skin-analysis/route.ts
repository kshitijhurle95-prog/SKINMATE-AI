import { NextRequest, NextResponse } from "next/server";
import { analyzeSkinPhoto } from "@/lib/youcam/client";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let buffer: Buffer | null = null;
    let fileName = "selfie.jpg";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("image") as File | null;
      if (!file) {
        return NextResponse.json(
          { success: false, error: "No image file provided" },
          { status: 400 }
        );
      }
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json(
          { success: false, error: "Image file exceeds 10MB limit" },
          { status: 400 }
        );
      }
      const arrayBuffer = await file.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
      fileName = file.name || "selfie.jpg";
    } else {
      const body = await req.json();
      if (!body.imageBase64) {
        return NextResponse.json(
          { success: false, error: "Missing imageBase64 in request body" },
          { status: 400 }
        );
      }
      const base64Data = body.imageBase64.replace(/^data:image\/\w+;base64,/, "");
      buffer = Buffer.from(base64Data, "base64");
      if (body.fileName) fileName = body.fileName;
    }

    if (!buffer || buffer.length === 0) {
      return NextResponse.json(
        { success: false, error: "Empty image payload" },
        { status: 400 }
      );
    }

    // Execute YouCam Skin AI pipeline (live or fallback)
    const analysis = await analyzeSkinPhoto(buffer, fileName);

    return NextResponse.json({
      success: true,
      data: analysis,
    });
  } catch (error: any) {
    console.error("[API /api/skin-analysis] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to process skin analysis",
      },
      { status: 500 }
    );
  }
}
