# SKINMATE AI — Comprehensive Product & System Architecture

**Platform:** AI-Powered Personal Skincare Intelligence & Smart Shopping Platform  
**Target Hackathon:** YouCam API Skin AI & eCommerce VTO Hackathon (hosted by Perfect Corp on Devpost)  
**Stack:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Perfect Corp YouCam Skin AI REST API v2.0/v2.1, Supabase (PostgreSQL & Auth), Recharts, Lucide Icons.

---

## 1. High-Level Architectural Diagram

```mermaid
flowchart TD
    subgraph Client["Client Browser (React 19 / Next.js 15 App Router)"]
        UI_Home["Landing Page (/)"]
        UI_Onboarding["Onboarding Questionnaire (/onboarding)"]
        UI_Scan["Scan Studio & Camera (/scan)"]
        UI_Dash["Skin Diagnostic Dashboard (/dashboard)"]
        UI_Routine["Personalized Routine Manager (/routine)"]
        UI_Market["Smart Product Discovery (/products)"]
        UI_Detail["Product Deep Dive (/products/:id)"]
        UI_Prog["Longitudinal Progress Journal (/progress)"]
        UI_Chat["Agentic Skincare Assistant (Drawer / /assistant)"]
    end

    subgraph Server["Next.js Server-Side Engine & Edge Handlers"]
        API_Scan["/api/skin-analysis (Route Handler)"]
        API_Rec["/api/recommendations (Route Handler)"]
        API_Prod["/api/products (Route Handler)"]
        API_AI["/api/assistant (Route Handler)"]
    end

    subgraph RecommendationEngine["Deterministic Skincare Recommendation Engine"]
        Solver["Combinatorial 3-Step Routine Solver (Cost <= Budget)"]
        Scorer["Active Ingredient Matching & Concern Scoring"]
        ConflictGuard["Multi-Active Conflict Matrix (BHA, Retinol, Sunscreen)"]
        AlternativeFinder["Affordable Formulation Alternative Engine"]
    end

    subgraph ExternalServices["External Cloud APIs & Services"]
        YouCamAPI["Perfect Corp YouCam Skin AI v2.0 REST API (India / Global)"]
        YouCamS3["Perfect Corp AWS S3 Pre-Signed Storage"]
        GeminiAPI["Google Gemini 1.5 Pro / Groq Llama 3 LLM"]
        SupabaseDB["Supabase PostgreSQL & Row Level Security (RLS)"]
    end

    %% Flow connections
    UI_Scan -->|Base64 / Multipart Photo| API_Scan
    API_Scan -->|Step 1: POST /s2s/v2.0/file| YouCamAPI
    API_Scan -->|Step 2: Binary PUT Stream| YouCamS3
    API_Scan -->|Step 3: POST /s2s/v2.0/task/skin-analysis| YouCamAPI
    API_Scan -->|Step 4: GET Polling & Normalization| YouCamAPI

    API_Scan --> RecommendationEngine
    API_Rec --> RecommendationEngine
    RecommendationEngine --> UI_Dash
    RecommendationEngine --> UI_Routine

    UI_Market --> API_Prod
    UI_Detail --> API_Prod

    UI_Chat --> API_AI
    API_AI -->|Tool Calling / Grounded Retrieval| GeminiAPI
    API_AI --> RecommendationEngine

    Client -.->|Persist session & guest history| SupabaseDB
```

---

## 2. YouCam Skin AI Asynchronous Integration Pipeline

The platform communicates with Perfect Corp's YouCam Skin AI REST API (`https://yce-api-01.makeupar.com` for India or `https://yce-api-01.perfectcorp.com` for Global) via a secure server-side 4-step orchestration:

```mermaid
sequenceDiagram
    autonumber
    actor User as User / Judge
    participant App as Next.js Client
    participant Handler as /api/skin-analysis
    participant YouCamAPI as YouCam REST API
    participant S3 as YouCam AWS S3
    participant Engine as Recommendation Engine

    User->>App: Captures webcam photo or selects preset
    App->>Handler: POST /api/skin-analysis (image/jpeg buffer)
    Handler->>YouCamAPI: POST /s2s/v2.0/file (Register file payload)
    YouCamAPI-->>Handler: Returns file_id and pre-signed S3 PUT URL
    Handler->>S3: PUT binary image stream (Content-Type: image/jpeg)
    S3-->>Handler: 200 OK (Upload confirmed)
    Handler->>YouCamAPI: POST /s2s/v2.0/task/skin-analysis (src_file_id + 16 concern metrics)
    YouCamAPI-->>Handler: Returns task_id
    loop Asynchronous Polling (every 1.5s, max 30s)
        Handler->>YouCamAPI: GET /s2s/v2.0/task/skin-analysis/{task_id}
        YouCamAPI-->>Handler: task_status: "pending" | "running" | "success"
    end
    Handler->>Handler: Normalize 16 concerns, convert severity, extract heatmap masks
    Handler->>Engine: Feed detected concern scores to routine optimizer
    Handler-->>App: Returns typed SkinAnalysisResult
    App-->>User: Renders Radial Score, 16 Diagnostics, and Interactive Heatmap Overlay
```

### 16 Detectable Cosmetic Concern Metrics
1. `pore`: Visible pores and follicle congestion
2. `texture`: Epidermal smoothness and micro-relief
3. `acne`: Surface blemishes, comedones, and congestion
4. `oiliness`: Forehead and T-zone sebum shine balance
5. `moisture`: Superficial hydration and barrier water retention
6. `redness`: Visible facial redness and capillary flushing
7. `dark_circle_v2`: Infraorbital discoloration and dark circles
8. `wrinkle`: Fine superficial lines and elasticity
9. `spot`: Age spots, sun spots, and hyperpigmentation
10. `radiance`: Cosmetic skin luminosity and vitality
11. `eyebag`: Under-eye puffiness and fluid contour
12. `firmness`: Dermal bounce, tension, and structural firmness

---

## 3. Skincare Routine Combinatorial Optimizer

To avoid impractical recommendations that exceed user budgets, SKINMATE AI uses a **combinatorial dynamic knapsack solver**:

$$\text{Maximize } \sum_{i \in \{\text{cleanser, moisturiser, sunscreen}\}} \text{RelevanceScore}(p_i) \quad \text{subject to} \quad \sum_{i} \text{PriceINR}(p_i) \le \text{BudgetMax}$$

1. **Step 1: Candidate Pool Partitioning**  
   Curated catalog is partitioned by essential step categories (`cleanser`, `moisturiser`, `sunscreen`, `serum`).
2. **Step 2: Profile & Concern Scoring**  
   Each candidate is scored ($0 - 100$) based on suitability for skin type ($+35$), coverage of YouCam-detected priority concerns ($+18$ per match, up to $+45$), and price efficiency ($+20$).
3. **Step 3: Budget-Constrained Trio Generation**  
   The optimizer searches the top candidate combinations to find the highest total utility trio that strictly satisfies $\text{TotalCost} \le \text{BudgetMax}$.
4. **Step 4: Evening Targeted Add-On**  
   If $\text{BudgetRemaining} \ge \text{SerumCost}$, the highest-ranking treatment serum (e.g., Niacinamide, Vitamin C, or Retinol) is seamlessly sequenced into the evening routine.
5. **Step 5: Affordable Swapping**  
   If the user wishes to lower routine cost, `findAffordableAlternatives()` locates verified lower-cost alternatives in the same category without losing active ingredient compatibility.

---

## 4. Multi-Active Ingredient Conflict Matrix

SKINMATE AI guards user safety through an automated rule engine that inspects active ingredient collisions:

| Primary Active | Colliding Active | Severity | Clinical / Cosmetic Reason | Recommended Safe Alternative |
| :--- | :--- | :--- | :--- | :--- |
| **Exfoliating Acid (AHA/BHA)** | **Missing Sunscreen** | **High** | Accelerates epidermal turnover and increases UV sensitivity; unprotected exposure triggers dark spots. | Add broad-spectrum SPF 30+ or SPF 50 sunscreen to morning routine. |
| **Retinoid** | **Missing Sunscreen** | **High** | Retinoids degrade under UV light and heighten solar sensitivity. | Mandatory daily broad-spectrum morning sunscreen application. |
| **Salicylic Acid (BHA)** | **Retinoid (same step)** | **High** | Simultaneous application compromises stratum corneum barrier, risking peeling, flushing, and redness. | Alternate evenings: BHA on Mon/Wed/Fri, Retinoid on Tue/Thu/Sat. |
| **Pure Vitamin C (L-Ascorbic)** | **Direct AHA/BHA (same step)** | **Moderate** | Dual low pH formulas can overwhelm skin tolerance, causing tingling and barrier dehydration. | Apply Vitamin C in the morning for antioxidant defense; use acids at night. |
| **AHA (Glycolic/Lactic)** | **BHA (Salicylic Acid)** | **Moderate** | Layering multiple strong exfoliants increases transepidermal water loss. | Space out use or switch to a unified gentle multi-acid blend (e.g., LHA). |

---

## 5. Dual-Mode Hackathon Demonstration Architecture

To ensure hackathon judges are **never blocked** by network timeouts, quota exhaustion, or missing environment variables:

1. **Live Mode (`YOUCAM_MODE=live`):**  
   When a valid `YOUCAM_API_KEY` is present, the server executes the live 4-step REST pipeline against Perfect Corp's servers.
2. **High-Fidelity Demo Dataset Fallback (`YOUCAM_MODE=demo`):**  
   If no API key is configured or if the external API returns a quota or network error, the pipeline automatically falls back to an authentic YouCam analysis dataset (`VERIFIED_YOUCAM_DEMO_RESULT`).
3. **Transparent Evaluation Badging:**  
   When running in fallback mode, the UI displays a clean `"Demo Dataset Fallback"` badge explaining that the data is an authentic pre-recorded YouCam response, preserving full interactive functionality (heatmaps, routine generation, conflict checks, and assistant chat).

---

## 6. Cosmetic vs. Medical Safety Boundaries

SKINMATE AI strictly follows cosmetic regulatory standards:
- **Non-medical terminology:** Uses "identifies visible facial characteristics", "visible blemishes", "supports skin barrier", "addresses surface shine".
- **Forbidden terms:** Never uses "diagnoses acne", "cures dermatological disease", "prescribes medicine".
- **Disclaimer enforcement:** Displays clear cosmetic disclaimers on all diagnostic cards, routines, and footers.
