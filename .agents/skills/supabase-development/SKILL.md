---
name: supabase-development
description: >-
  Provides database architecture, SQL schema designs, Supabase Auth integration, Row Level Security (RLS)
  policies, and server/client configuration for Supabase and PostgreSQL. Use when creating database tables,
  writing SQL migrations, configuring RLS access controls, setting up Supabase clients in Next.js, or querying user data.
---

# Supabase & PostgreSQL Architecture Standards

This skill governs database modeling, authentication boundaries, Row Level Security (RLS) policies, and data access pipelines using Supabase with Next.js.

---

## 1. Database Schema Design for SKINMATE AI

The database models user identity, skincare profiles, YouCam analysis records, curated products, routines, and progress journals.

```sql
-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. USER PROFILES (Linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  skin_type_reported TEXT CHECK (skin_type_reported IN ('oily', 'dry', 'combination', 'normal', 'sensitive', 'unknown')),
  concerns TEXT[] DEFAULT '{}',
  ingredient_preferences TEXT[] DEFAULT '{}',
  ingredient_restrictions TEXT[] DEFAULT '{}',
  budget_min NUMERIC(10, 2) DEFAULT 0,
  budget_max NUMERIC(10, 2) DEFAULT 2000,
  experience_level TEXT CHECK (experience_level IN ('beginner', 'intermediate', 'experienced')) DEFAULT 'beginner',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PRODUCTS (Curated skincare catalog)
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_name TEXT NOT NULL,
  brand TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('cleanser', 'toner', 'serum', 'moisturiser', 'sunscreen', 'treatment', 'mask')),
  description TEXT,
  price_inr NUMERIC(10, 2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  key_ingredients TEXT[] DEFAULT '{}',
  all_ingredients TEXT,
  product_image TEXT,
  suitable_skin_types TEXT[] DEFAULT '{}',
  target_concerns TEXT[] DEFAULT '{}',
  source_brand_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. SKIN ANALYSES (YouCam result history)
CREATE TABLE IF NOT EXISTS public.skin_analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  youcam_task_id TEXT,
  overall_skin_score INT,
  concerns_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  raw_api_response JSONB,
  overlay_masks JSONB DEFAULT '{}'::jsonb,
  analysis_status TEXT CHECK (analysis_status IN ('processing', 'success', 'error')) DEFAULT 'processing',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ROUTINES (Morning & Evening plans)
CREATE TABLE IF NOT EXISTS public.routines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  routine_name TEXT NOT NULL,
  time_of_day TEXT CHECK (time_of_day IN ('morning', 'evening', 'both')) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ROUTINE ITEMS (Individual steps)
CREATE TABLE IF NOT EXISTS public.routine_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  routine_id UUID REFERENCES public.routines(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  step_order INT NOT NULL,
  step_name TEXT NOT NULL,
  instructions TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. PROGRESS NOTES (Skincare Journal)
CREATE TABLE IF NOT EXISTS public.progress_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  analysis_id UUID REFERENCES public.skin_analyses(id) ON DELETE SET NULL,
  note_content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 2. Row Level Security (RLS) - Mandatory Multi-Tenant Isolation

Enable RLS on **every single table** to ensure users cannot view or mutate other users' sensitive personal records or facial scan data.

```sql
-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skin_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routine_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- User Profiles: Users can only select/update their own profile
CREATE POLICY "Users can view own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Skin Analyses: Users can only access their own scans
CREATE POLICY "Users view own analyses"
  ON public.skin_analyses FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Products Catalog: Publicly readable for active items
CREATE POLICY "Public read active products"
  ON public.products FOR SELECT
  USING (is_active = TRUE);

-- Routines & Items: User owned
CREATE POLICY "Users manage own routines"
  ON public.routines FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage own routine items"
  ON public.routine_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.routines
      WHERE routines.id = routine_items.routine_id
      AND routines.user_id = auth.uid()
    )
  );

-- Progress Notes: User owned
CREATE POLICY "Users manage own notes"
  ON public.progress_notes FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

---

## 3. Next.js App Router Client & Server Factories (`@supabase/ssr`)

Separate browser client instances from server-side authenticated route handler clients:

### Browser Client (`src/lib/supabase/client.ts`):
```typescript
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

### Server Route Handler Client (`src/lib/supabase/server.ts`):
```typescript
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
          }
        },
      },
    }
  );
}
```

---

## 4. Verification & Testing Checklist

- [ ] Is RLS enabled and tested on every private table?
- [ ] Are sensitive API service keys kept on the server and never prefixed with `NEXT_PUBLIC_`?
- [ ] Do foreign keys include `ON DELETE CASCADE` or `ON DELETE SET NULL` to preserve integrity?
- [ ] Are database indexes added to `user_id` and `created_at` for performant historical queries?
