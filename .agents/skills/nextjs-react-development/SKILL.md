---
name: nextjs-react-development
description: >-
  Provides best practices, architecture guidelines, and code patterns for building full-stack Next.js
  App Router and React applications. Use when structuring pages, creating React Server and Client Components,
  defining API Route Handlers, optimizing data fetching, handling state management, or structuring application code.
---

# Next.js App Router & React Development Standards

This skill provides full-stack engineering standards for Next.js (App Router) and React. It guarantees strict separation between server and client execution boundaries, optimized data rendering pipelines, and clean code organization.

---

## 1. App Router Architecture & Directory Conventions

Adopt a feature-driven, scalable directory structure inside `src/` (or root):

```text
src/
├── app/                      # App Router root
│   ├── (auth)/               # Route group: login, register, onboarding
│   ├── (dashboard)/          # Route group: dashboard, routine, progress, marketplace
│   ├── api/                  # Server-side Route Handlers
│   │   ├── skin-analysis/    # YouCam integration endpoints
│   │   ├── assistant/        # AI conversational agent endpoints
│   │   ├── products/         # Catalog query & filter endpoints
│   │   └── routines/         # Routine generation & storage endpoints
│   ├── layout.tsx            # Root layout (fonts, providers, metadata)
│   ├── page.tsx              # Public landing page
│   ├── loading.tsx           # Global fallback skeleton
│   └── error.tsx             # Global error boundary
├── components/               # Reusable UI components
│   ├── ui/                   # Primitives (button, card, dialog, input, badge)
│   ├── scan/                 # Camera capture, image uploader, mask overlay
│   ├── dashboard/            # Metric cards, skin score radial, concern bars
│   ├── marketplace/          # Product cards, budget slider, filter drawer
│   └── assistant/            # Chat drawer, message bubble, action chips
├── lib/                      # Core libraries & utilities
│   ├── youcam/               # YouCam API client, poller, response normalizer
│   ├── ai/                   # Gemini/Groq SDK clients, tool definitions, prompts
│   ├── recommendation/       # Deterministic matching & budget engine
│   └── supabase/             # Client & server Supabase factory helpers
└── types/                    # Shared TypeScript interfaces & Zod schemas
```

---

## 2. Server vs. Client Component Boundaries

Next.js App Router defaults all components in `app/` to **React Server Components (RSC)**.

### Guidelines:
* **Server Components (Default):**
  * Use for initial page data fetching, SEO metadata, reading server environment variables, and rendering static or server-rendered layouts.
  * Direct database queries or internal services belong in Server Components or Route Handlers.
* **Client Components (`"use client"`):**
  * Push client boundaries as far down the component tree as possible.
  * Mark components as `"use client"` **only** when they need:
    * Browser APIs (`navigator.mediaDevices.getUserMedia` for camera, `File`, `localStorage`).
    * Interactive React hooks (`useState`, `useEffect`, `useCallback`, `useTransition`).
    * Event listeners (`onClick`, `onChange`, `onSubmit`).
    * Framer Motion client animations.

### Composition Pattern:
Pass Server Components as `children` into Client Components to keep the data payload lightweight:
```tsx
// Client Component wrapper:
"use client";
export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState("overview");
  return <div className="shell">{children}</div>;
}
```

---

## 3. Next.js API Route Handlers (`route.ts`)

API routes execute securely on the server (Node.js runtime). Never leak API secrets to the client.

### Standard Route Handler Template:
```typescript
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const RequestSchema = z.object({
  budgetMax: z.number().positive(),
  concerns: z.array(z.string()).min(1),
});

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();
    const parsed = RequestSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request payload", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // Execute backend logic...
    const data = { status: "success", timestamp: new Date().toISOString() };
    return NextResponse.json({ data }, { status: 200 });
  } catch (error: any) {
    console.error("[API_ERROR]:", error);
    return NextResponse.json(
      { error: "Internal server processing failure", message: error.message },
      { status: 500 }
    );
  }
}
```

---

## 4. State Management Strategy

* **Server State (Async data):** Handle via Route Handlers, React Server Components, or React Query / SWR for client-side polling (such as polling YouCam task progress).
* **Client UI State:** 
  * Use localized `useState` for simple toggles, open/closed modal states.
  * Use lightweight stores like **Zustand** for cross-component shared state (e.g. current routine cart, active skin scan draft, user budget slider filter).

---

## 5. Performance & Optimization Rules

1. **Image Optimization:** Always use `next/image` with explicit `width`, `height`, or `fill` with `sizes` for product catalog images and skin preview captures.
2. **Dynamic Imports:** Lazy load heavy client libraries (e.g., canvas mask visualizers, Recharts charting components) using `next/dynamic` with `ssr: false`:
   ```tsx
   import dynamic from "next/dynamic";
   const SkinMetricsChart = dynamic(() => import("@/components/dashboard/SkinMetricsChart"), {
     ssr: false,
     loading: () => <div className="h-64 animate-pulse bg-subtle rounded-xl" />
   });
   ```
3. **Graceful Error Recovery:** Provide `error.tsx` at route segment boundaries with a reset button to prevent a single component failure from crashing the entire application.
