# SKINMATE AI — API Integration Guide & Technical Reference

This guide details all external and internal APIs integrated into **SKINMATE AI**, including the official **Perfect Corp YouCam Skin AI REST API**, the **Conversational AI Agent (Gemini/Groq)**, and the **Supabase Backend Data Store**.

---

## 1. Selected Primary API: Perfect Corp YouCam Skin AI API (v2.0 / v2.1)

### Overview & Hackathon Fit
For this project, we selected the **YouCam Skin AI REST API (v2.0/v2.1)** as the primary facial intelligence engine.
- **Provider:** Perfect Corp
- **Developer Portal:** [https://developer.perfectcorp.com](https://developer.perfectcorp.com)
- **API Console & Playground:** [https://yce-api-01.makeupar.com/console](https://yce-api-01.makeupar.com/console)
- **Devpost Hackathon Page:** [https://youcam-api-skin-ai-ecommerce.devpost.com](https://youcam-api-skin-ai-ecommerce.devpost.com)
- **Resources & Documentation:** [https://youcam-api-skin-ai-ecommerce.devpost.com/resources](https://youcam-api-skin-ai-ecommerce.devpost.com/resources)

### Regional Base Endpoints
- **India Regional Endpoint (Recommended for hackathon):**  
  `https://yce-api-01.makeupar.com`
- **Global US Endpoint:**  
  `https://yce-api-01.perfectcorp.com`

---

## 2. YouCam Skin AI REST Call Lifecycle (4-Phase Architecture)

The integration in `src/lib/youcam/client.ts` implements the complete asynchronous 4-phase sequence required by Perfect Corp:

```
[Client Photo] 
    │
    ▼
1. POST /s2s/v2.0/file 
   (Bearer <API_KEY>)
   ├── Payload: { files: [{ content_type: "image/jpeg", file_name: "scan.jpg", file_size: <bytes> }] }
   └── Returns: { file_id: "...", requests: [{ url: "https://...s3.amazonaws.com/..." }] }
    │
    ▼
2. Binary PUT to Pre-Signed AWS S3 URL
   ├── Headers: { "Content-Type": "image/jpeg", "Content-Length": "<bytes>" }
   └── Body: Raw Uint8Array image stream
    │
    ▼
3. POST /s2s/v2.0/task/skin-analysis
   (Bearer <API_KEY>)
   ├── Payload: {
   │     src_file_id: "<file_id>",
   │     dst_actions: ["wrinkle", "pore", "texture", "acne", "spot", "redness", "moisture", "dark_circle_v2", "radiance", "oiliness", "eyebag", "firmness"],
   │     miniserver_args: { enable_mask_overlay: true, enable_dark_background_hd_pore: true },
   │     format: "json"
   │   }
   └── Returns: { data: { task_id: "task-abc-123" } }
    │
    ▼
4. GET /s2s/v2.0/task/skin-analysis/{task_id} (Polling)
   ├── Poll interval: 1.5 seconds (max 20 retries / 30 seconds)
   └── Completion: task_status === "success"
       ├── ui_score (0-100 normalized score per concern)
       ├── raw_score (clinical measurement value)
       └── mask_urls (transparent PNG heatmap overlays for visual inspection)
```

### Cost & Billing Guardrails
- Hackathon participants receive **1,000 free analysis units**.
- Units are **only deducted upon successful task completion** (`task_status === "success"`).
- Failed tasks or file uploads consume zero credits.

---

## 3. Other Required & Integrated APIs

### A. Conversational AI Agent (Google Gemini / Groq)
- **Role:** Agentic skincare shopping assistant with function/tool calling.
- **Provider:** Google Gemini (`gemini-1.5-flash` / `gemini-1.5-pro`) or Groq Cloud (`llama-3.3-70b-versatile`).
- **Endpoint:**
  - Google Gemini: `https://generativelanguage.googleapis.com/v1beta`
  - Groq: `https://api.groq.com/openai/v1`
- **Tool Calling Capabilities:**
  - `get_product_recommendation`: Searches curated catalogue for products matching concern, category, or budget.
  - `check_ingredient_conflict`: Analyzes routine pairs for BHA + Retinol collisions or missing morning sunscreen.
  - `get_skin_analysis_summary`: Retrieves user's latest YouCam diagnostics to contextualize advice.
  - `update_user_routine`: Allows assistant to add or swap products directly in user routine.
- **Direct Portal Link:** [https://aistudio.google.com](https://aistudio.google.com) / [https://console.groq.com](https://console.groq.com)

### B. Supabase (Database & Authentication)
- **Role:** PostgreSQL database with Row Level Security (RLS) for user accounts, routine versions, and longitudinal skin scan history.
- **Provider:** Supabase
- **Features Used:**
  - Supabase Auth (Email/Password & Anonymous Guest sessions)
  - PostgreSQL schema (`supabase/migrations/20261031_init_schema.sql`)
  - Storage bucket for user skin journal entries
- **Direct Portal Link:** [https://supabase.com/dashboard](https://supabase.com/dashboard)

### C. Native HTML5 WebRTC MediaDevices API
- **Role:** Client-side camera streaming and instant frame capture.
- **Specifications:** `navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: { ideal: 1280 } } })`.
- **Privacy:** Processed purely in browser memory on HTML5 Canvas; images are never persisted without user consent.

---

## 4. Dual-Mode Demo Fallback Architecture

To ensure judges evaluating the project have a **100% reliable experience** without needing an active API key or risking quota errors:

| Mode | Trigger Condition | Behavior |
| :--- | :--- | :--- |
| **Live YouCam Pipeline** | `YOUCAM_API_KEY` present in environment and valid. | Executes real 4-step REST requests against `https://yce-api-01.makeupar.com`. |
| **High-Fidelity Demo Fallback** | `YOUCAM_API_KEY` omitted or quota/network error encountered. | Automatically serves `VERIFIED_YOUCAM_DEMO_RESULT` (authentic YouCam analysis response with 11 concern metrics, scores, and heatmap mask URLs). |

In demo fallback mode, a subtle badge appears in the UI (`Demo Dataset Fallback`) so the evaluation remains completely transparent while allowing all interactive features to function.

---

## 5. Direct Official API Reference Links

1. **Perfect Corp Developer Console:**  
   [https://developer.perfectcorp.com](https://developer.perfectcorp.com)
2. **YouCam API Documentation & OpenAPI Explorer:**  
   [https://yce-api-01.makeupar.com/console](https://yce-api-01.makeupar.com/console)
3. **Devpost Hackathon Resource Center:**  
   [https://youcam-api-skin-ai-ecommerce.devpost.com/resources](https://youcam-api-skin-ai-ecommerce.devpost.com/resources)
4. **Google AI Studio API Key Manager:**  
   [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
5. **Supabase Cloud Console:**  
   [https://supabase.com/dashboard](https://supabase.com/dashboard)
