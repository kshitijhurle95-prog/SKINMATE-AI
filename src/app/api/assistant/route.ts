import { NextRequest, NextResponse } from "next/server";
import { processAssistantMessage } from "@/lib/ai/assistant";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, history = [], context = {} } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { success: false, error: "Missing 'message' string in request body" },
        { status: 400 }
      );
    }

    const assistantResponse = await processAssistantMessage(message, history, context);

    return NextResponse.json({
      success: true,
      data: assistantResponse,
    });
  } catch (error: any) {
    console.error("[API /api/assistant] Error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to process assistant turn" },
      { status: 500 }
    );
  }
}
