import { CURATED_PRODUCTS } from "@/lib/data/curated-products";
import { filterProducts, findAffordableAlternatives } from "@/lib/recommendation/engine";
import { ChatMessage, ActionCardData } from "@/types/assistant";
import { Product } from "@/types/product";
import { UserProfile } from "@/types/user";
import { SkinAnalysisResult } from "@/types/skin-analysis";

export interface AssistantContext {
  userProfile?: UserProfile;
  latestAnalysis?: SkinAnalysisResult;
  currentRoutineProducts?: Product[];
}

async function callGroqLLM(
  userQuery: string,
  history: ChatMessage[],
  context: AssistantContext
): Promise<string | null> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;

  const model = process.env.GROQ_MODEL || "openai/gpt-oss-120b";
  const userProfile = context.userProfile;
  const analysis = context.latestAnalysis;

  const systemPrompt = `You are SKINMATE AI, an intelligent, empathetic, friendly, and scientifically grounded skincare advisor paired with the YouCam Skin AI diagnostics platform.

User Profile:
- Name: ${userProfile?.displayName || "Skincare Explorer"}
- Skin Type: ${userProfile?.skinTypeReported || analysis?.skinTypeAssessed || "combination"}
- Stated Concerns: ${(userProfile?.concerns || []).join(", ") || "pores, texture, oiliness"}
- Budget Limit: ₹${userProfile?.budgetMax || 1500}
- Ingredient Restrictions: ${(userProfile?.ingredientRestrictions || []).join(", ") || "none"}

Latest YouCam Skin AI Diagnostics:
- Overall Score: ${analysis?.overallScore || 78}/100
- Priority areas detected: ${analysis?.metrics?.filter((m) => m.score < 75).map((m) => `${m.displayName} (${m.score}/100)`).join(", ") || "Visible Pores, Sebum Balance"}

Curated Skincare Catalog:
${CURATED_PRODUCTS.map((p) => `- ${p.name} (${p.brand}, ${p.category}): ₹${p.priceINR}. Actives: ${p.keyActives.join(", ")}. Targets: ${p.targetConcerns.join(", ")}`).join("\n")}

CRITICAL FORMATTING RULES:
1. NEVER output markdown tables (DO NOT use pipes '|' or '---'). Markdown tables look broken and ugly in this chat interface.
2. Format your response like a normal, friendly chat message with expressive emojis (🌿, ☀️, 🌙, 💧, ✨, 🧴, 🛡️, 💡, 🏷️).
3. If recommending a routine, format it with clear emojis and numbered steps:
   ☀️ Morning Routine:
   1. 🧴 [Step name]: **[Product Name]** (₹Price) — [Short 1-sentence reason why it works]
   2. 💧 [Step name]: **[Product Name]** (₹Price) — [Short explanation]
   3. 🛡️ Sunscreen: **[Product Name]** (₹Price) — [Short explanation]

   🌙 Evening Routine:
   1. 🧴 [Step name]: **[Product Name]** (₹Price) — [Short explanation]
   2. ✨ [Step name]: **[Product Name]** (₹Price) — [Short explanation]

   💡 Total Cost: **₹XYZ** (Leaves ₹ABC under your budget!)
4. Keep paragraphs short and engaging. Always mention prices in Indian Rupees (₹).
5. Always follow strict cosmetic non-medical standards (e.g. "addresses visible blemishes", "balances surface sebum", "supports skin barrier"). Never use medical terms like "cures acne" or "treats medical diseases".`;

  try {
    const formattedHistory = history.slice(-6).map((msg) => ({
      role: msg.role === "assistant" ? "assistant" : "user",
      content: msg.content,
    }));

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          ...formattedHistory,
          { role: "user", content: userQuery },
        ],
        temperature: 0.6,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      console.warn("[Groq LLM] HTTP Error:", response.status, await response.text());
      return null;
    }

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content || null;
    return rawContent ? convertTablesToChat(rawContent) : null;
  } catch (err: any) {
    console.warn("[Groq LLM] Fetch failed:", err.message);
    return null;
  }
}

function convertTablesToChat(text: string): string {
  if (!text.includes("|")) return text;
  const lines = text.split("\n");
  const result: string[] = [];
  let inTable = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      const cells = trimmed
        .split("|")
        .map((c) => c.trim())
        .filter((c) => c.length > 0);
      if (cells.every((c) => /^[-:]+$/.test(c))) {
        inTable = true;
        continue;
      }
      if (!inTable) {
        inTable = true;
        continue;
      }
      if (cells.length >= 2) {
        result.push(`• 🧴 **${cells[0]}**: ${cells[1]} ${cells[2] ? `— ${cells[2]}` : ""}`);
      } else {
        result.push(`• ${cells.join(" — ")}`);
      }
    } else {
      inTable = false;
      result.push(line);
    }
  }
  return result.join("\n");
}

export async function processAssistantMessage(
  userQuery: string,
  history: ChatMessage[],
  context: AssistantContext
): Promise<ChatMessage> {
  const queryLower = userQuery.toLowerCase();
  const timestamp = new Date().toISOString();
  const id = `msg-${Date.now()}`;

  // 1. TOOL: Compare Products
  if (queryLower.includes("compare") || (queryLower.includes("vs") && queryLower.includes("product"))) {
    const matchedProducts = CURATED_PRODUCTS.filter((p) =>
      queryLower.includes(p.brand.toLowerCase()) ||
      queryLower.includes(p.name.toLowerCase().split(" ")[0]) ||
      queryLower.includes(p.category.toLowerCase())
    ).slice(0, 2);

    const productsToCompare = matchedProducts.length >= 2 ? matchedProducts : CURATED_PRODUCTS.slice(0, 2);

    const card: ActionCardData = {
      type: "product_compare",
      title: `Comparison: ${productsToCompare[0].name} vs ${productsToCompare[1].name}`,
      description: "Side-by-side comparison of active ingredients, target concerns, and INR prices.",
      comparedProducts: productsToCompare,
    };

    const groqText = await callGroqLLM(userQuery, history, context);

    return {
      id,
      role: "assistant",
      createdAt: timestamp,
      toolInvoked: "compare_products",
      content: groqText || `I've compared **${productsToCompare[0].name}** (₹${productsToCompare[0].priceINR}) with **${productsToCompare[1].name}** (₹${productsToCompare[1].priceINR}). Both address visible skin concerns effectively, but notice the difference in active concentrations and textures below.`,
      actionCard: card,
    };
  }

  // 2. TOOL: Replace with Cheaper Option / Affordable Alternative
  if (
    queryLower.includes("cheaper") ||
    queryLower.includes("affordable") ||
    queryLower.includes("replace") ||
    queryLower.includes("less expensive") ||
    queryLower.includes("save money")
  ) {
    const expensiveProduct =
      CURATED_PRODUCTS.find((p) => queryLower.includes(p.category)) ||
      CURATED_PRODUCTS.find((p) => p.category === "moisturiser" && p.priceINR > 350) ||
      CURATED_PRODUCTS[4];

    const alternatives = findAffordableAlternatives(expensiveProduct, CURATED_PRODUCTS);
    const bestAlt = alternatives[0] || CURATED_PRODUCTS[0];
    const savings = Math.max(0, expensiveProduct.priceINR - bestAlt.priceINR);

    const card: ActionCardData = {
      type: "budget_delta",
      title: `Affordable Swap: ${bestAlt.name}`,
      description: `Replacing ${expensiveProduct.name} (₹${expensiveProduct.priceINR}) with ${bestAlt.name} (₹${bestAlt.priceINR}) saves you ₹${savings} while maintaining cosmetic efficacy.`,
      priceDifferenceINR: -savings,
      newTotalINR: bestAlt.priceINR,
    };

    const groqText = await callGroqLLM(userQuery, history, context);

    return {
      id,
      role: "assistant",
      createdAt: timestamp,
      toolInvoked: "find_affordable_alternatives",
      content: groqText || `I found a great budget alternative! Replacing **${expensiveProduct.name}** with **${bestAlt.name}** saves you **₹${savings}**. It delivers similar barrier-supporting benefits with **${bestAlt.keyActives.join(", ")}**. Would you like to update your routine?`,
      actionCard: card,
    };
  }

  // 3. TOOL: Build Routine Under Budget
  const budgetMatch = queryLower.match(/(?:under|below|budget of|within)\s*(?:₹|rs\.?|inr)?\s*(\d+)/i);
  if (queryLower.includes("routine") || budgetMatch) {
    const budgetAmount = budgetMatch ? parseInt(budgetMatch[1], 10) : context.userProfile?.budgetMax || 1500;
    
    const cleansers = CURATED_PRODUCTS.filter((p) => p.category === "cleanser").sort((a, b) => a.priceINR - b.priceINR);
    const moisturisers = CURATED_PRODUCTS.filter((p) => p.category === "moisturiser").sort((a, b) => a.priceINR - b.priceINR);
    const sunscreens = CURATED_PRODUCTS.filter((p) => p.category === "sunscreen").sort((a, b) => a.priceINR - b.priceINR);

    const c = cleansers[0];
    const m = moisturisers[0];
    const s = sunscreens[0];
    const total = c.priceINR + m.priceINR + s.priceINR;
    const remaining = budgetAmount - total;

    const card: ActionCardData = {
      type: "routine_proposal",
      title: `Personalized 3-Step Routine (₹${total})`,
      description: `Cleanser: ${c.name} (₹${c.priceINR}) + Moisturiser: ${m.name} (₹${m.priceINR}) + Sunscreen: ${s.name} (₹${s.priceINR}). Leaves ₹${remaining} remaining in your budget.`,
      newTotalINR: total,
    };

    const groqText = await callGroqLLM(userQuery, history, context);

    return {
      id,
      role: "assistant",
      createdAt: timestamp,
      toolInvoked: "calculate_budget_routine",
      content: groqText || `I've calculated an optimal 3-step essential routine for **₹${total}**, which is **₹${remaining >= 0 ? `${remaining} under` : `${Math.abs(remaining)} over`}** your ₹${budgetAmount} budget!\n\n1. **${c.name}** (₹${c.priceINR})\n2. **${m.name}** (₹${m.priceINR})\n3. **${s.name}** (₹${s.priceINR})\n\nClick **Approve & Save** below to update your saved routine.`,
      actionCard: card,
    };
  }

  // 4. Try Live Groq LLM for general queries
  const liveGroqResponse = await callGroqLLM(userQuery, history, context);
  if (liveGroqResponse) {
    return {
      id,
      role: "assistant",
      createdAt: timestamp,
      content: liveGroqResponse,
    };
  }

  // 5. Fallback deterministic explanations
  if (queryLower.includes("analysis") || queryLower.includes("skin score") || queryLower.includes("pores") || queryLower.includes("result")) {
    const score = context.latestAnalysis?.overallScore || 78;
    const skinType = context.latestAnalysis?.skinTypeAssessed || "combination";

    return {
      id,
      role: "assistant",
      createdAt: timestamp,
      toolInvoked: "get_latest_skin_analysis",
      content: `Based on your latest YouCam Skin AI analysis, your overall skin score is **${score}/100** with **${skinType}** characteristics. \n\nYour primary areas for cosmetic attention are:\n- **Sebum & Shine Balance** (Score: 58/100) — indicates areas with higher surface oiliness in the T-zone.\n- **Visible Pores** (Score: 68/100) — can be balanced using gentle BHA cleansers or Niacinamide.\n\nYour skin shows excellent barrier resilience with a **Sensitivity Score of 88/100**!`,
    };
  }

  return {
    id,
    role: "assistant",
    createdAt: timestamp,
    content: `I'm here to guide your skincare and shopping journey. You can ask me to:\n- **"Build a routine under ₹1,200"**\n- **"Find a cheaper moisturizer"**\n- **"Explain my skin analysis results"**\n- **"Compare Minimalist and Cetaphil cleansers"**\n- **"What does Niacinamide do?"**\n\nHow can I help you care better today?`,
  };
}
