-- SKINMATE AI Database Initialization Migration
-- Multi-Tenant Architecture with Strict Row Level Security (RLS)

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. User Profiles Table (1-to-1 with auth.users)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  skin_type_reported TEXT CHECK (skin_type_reported IN ('oily', 'dry', 'combination', 'normal', 'sensitive', 'unknown')) DEFAULT 'unknown',
  concerns TEXT[] DEFAULT '{}',
  ingredient_preferences TEXT[] DEFAULT '{}',
  ingredient_restrictions TEXT[] DEFAULT '{}',
  budget_min NUMERIC(10, 2) DEFAULT 500,
  budget_max NUMERIC(10, 2) DEFAULT 1500,
  experience_level TEXT CHECK (experience_level IN ('beginner', 'intermediate', 'experienced')) DEFAULT 'beginner',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Products Catalog Table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_name TEXT NOT NULL,
  brand TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('cleanser', 'toner', 'serum', 'moisturiser', 'sunscreen', 'treatment')),
  price_inr NUMERIC(10, 2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  rating NUMERIC(2, 1) DEFAULT 4.5,
  reviews_count INT DEFAULT 0,
  image_url TEXT,
  description TEXT,
  key_actives TEXT[] DEFAULT '{}',
  all_ingredients TEXT,
  suitable_skin_types TEXT[] DEFAULT '{}',
  target_concerns TEXT[] DEFAULT '{}',
  fragrance_free BOOLEAN DEFAULT TRUE,
  non_comedogenic BOOLEAN DEFAULT TRUE,
  source_brand_url TEXT,
  is_demo_catalog BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Skin Analyses Table (YouCam Result History)
CREATE TABLE IF NOT EXISTS public.skin_analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  youcam_task_id TEXT,
  overall_score INT NOT NULL,
  skin_type_assessed TEXT NOT NULL,
  metrics JSONB NOT NULL DEFAULT '[]'::jsonb,
  active_masks JSONB DEFAULT '[]'::jsonb,
  is_demo_data BOOLEAN DEFAULT FALSE,
  image_url TEXT,
  disclaimer TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Skincare Routines Table
CREATE TABLE IF NOT EXISTS public.routines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  routine_name TEXT NOT NULL,
  total_price_inr NUMERIC(10, 2) NOT NULL,
  budget_limit_inr NUMERIC(10, 2) NOT NULL,
  morning_steps JSONB NOT NULL DEFAULT '[]'::jsonb,
  evening_steps JSONB NOT NULL DEFAULT '[]'::jsonb,
  conflicts JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Progress Notes / Skincare Journal Table
CREATE TABLE IF NOT EXISTS public.progress_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  analysis_id UUID REFERENCES public.skin_analyses(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Chat History Table (Optional persistent AI assistant conversations)
CREATE TABLE IF NOT EXISTS public.chat_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('user', 'assistant', 'system')) NOT NULL,
  content TEXT NOT NULL,
  tool_invoked TEXT,
  action_card JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skin_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;

-- User Profiles: Users can only select/insert/update their own profile
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Products: Curated catalog is readable by all authenticated and guest users
CREATE POLICY "Public read products" ON public.products
  FOR SELECT USING (TRUE);

-- Skin Analyses: Users can only access their own scans
CREATE POLICY "Users manage own skin analyses" ON public.skin_analyses
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Routines: Users manage own routines
CREATE POLICY "Users manage own routines" ON public.routines
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Progress Notes: Users manage own notes
CREATE POLICY "Users manage own progress notes" ON public.progress_notes
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Chat History: Users manage own messages
CREATE POLICY "Users manage own chat history" ON public.chat_history
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
