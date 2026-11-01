---
name: typescript-best-practices
description: >-
  Provides type-safety conventions, schema validation patterns, interface designs, and generic
  constructs for robust TypeScript development. Use when creating types, defining Zod validation
  schemas, designing API contracts, handling complex data structures, or enforcing strict type checking.
---

# TypeScript Architecture & Strict Type-Safety

This skill guides the construction of dependable, type-safe full-stack code. It enforces zero-tolerance for implicit `any`, emphasizes compile-time safety paired with runtime schema validation (Zod), and establishes clean architectural types.

---

## 1. Core Principles

1. **Strict by Default:** `strict: true`, `noImplicitAny: true`, `strictNullChecks: true`, and `exactOptionalPropertyTypes: true` in `tsconfig.json`.
2. **Runtime Validation at Boundaries:** TypeScript types only exist at compile time. Any data crossing external boundaries (HTTP requests, URL params, database rows, third-party API outputs) must be validated with **Zod** at runtime.
3. **Single Source of Truth:** Derive TypeScript types directly from Zod schemas using `z.infer<typeof Schema>` to keep validation rules and static types synchronized.
4. **Discriminated Unions for State:** Represent asynchronous operations and API state using tagged unions to prevent impossible states.

---

## 2. API Response Contract Envelope

Standardize all internal API responses across the application:

```typescript
export type ApiResponse<T> =
  | {
      success: true;
      data: T;
      message?: string;
      meta?: {
        timestamp: string;
        requestId?: string;
      };
    }
  | {
      success: false;
      error: {
        code: string;
        message: string;
        details?: Record<string, unknown>;
      };
    };
```

---

## 3. Discriminated Unions for UI & Async Flows

Model asynchronous task states (e.g. YouCam analysis polling) using discriminated unions:

```typescript
export type TaskState<T> =
  | { status: "idle" }
  | { status: "uploading"; progress: number }
  | { status: "processing"; taskId: string; elapsedMs: number }
  | { status: "success"; data: T; completedAt: string }
  | { status: "error"; error: string; retryable: boolean };
```

In React components, TypeScript pattern-matching ensures every state is handled cleanly:
```tsx
function TaskView({ state }: { state: TaskState<SkinAnalysisResult> }) {
  switch (state.status) {
    case "idle":
      return <UploadDropzone />;
    case "uploading":
      return <ProgressBar percent={state.progress} />;
    case "processing":
      return <AnalysisSpinner taskId={state.taskId} />;
    case "success":
      return <SkinDashboard data={state.data} />;
    case "error":
      return <ErrorMessage message={state.error} retry={state.retryable} />;
  }
}
```

---

## 4. Zod Schema Pattern & Type Inference

Define data models using Zod and infer static types:

```typescript
import { z } from "zod";

export const UserProfileSchema = z.object({
  id: z.string().uuid(),
  displayName: z.string().min(2).max(50),
  skinTypeReported: z.enum(["oily", "dry", "combination", "normal", "sensitive", "unknown"]),
  concerns: z.array(z.string()).default([]),
  budgetMin: z.number().nonnegative().default(0),
  budgetMax: z.number().positive().default(2000),
  ingredientRestrictions: z.array(z.string()).default([]),
  experienceLevel: z.enum(["beginner", "intermediate", "experienced"]).default("beginner"),
  createdAt: z.string().datetime(),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;
export type UserProfileInput = z.infer<typeof UserProfileSchema.omit({ id: true, createdAt: true })>;
```

---

## 5. Environment Variable Validation

Validate server-side and client-side environment variables at boot time:

```typescript
// src/lib/env.ts
import { z } from "zod";

const serverEnvSchema = z.object({
  YOUCAM_API_KEY: z.string().min(1, "YouCam API key is required"),
  YOUCAM_API_BASE_URL: z.string().url().default("https://yce-api-01.makeupar.com"),
  GEMINI_API_KEY: z.string().optional(),
  GROQ_API_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
});

export const env = serverEnvSchema.parse({
  YOUCAM_API_KEY: process.env.YOUCAM_API_KEY,
  YOUCAM_API_BASE_URL: process.env.YOUCAM_API_BASE_URL,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  GROQ_API_KEY: process.env.GROQ_API_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
});
```

---

## 6. Type-Safety Rules & Avoidance Checklist

- [ ] Never use `any`. If a type is truly dynamic, use `unknown` and narrow with type guards or Zod.
- [ ] Avoid non-null assertions (`!`) unless guaranteed by an immediately preceding check.
- [ ] Explicitly type function return signatures for all exported functions and API route handlers.
- [ ] Use `readonly` arrays for static constants or lookup tables (`as const`).
