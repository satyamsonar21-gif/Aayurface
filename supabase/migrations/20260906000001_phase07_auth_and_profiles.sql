-- ============================================================
-- AayurFace — Phase 07 Revised Migration: Auth & Profiles Foundation
-- Target Database: Supabase PostgreSQL (Project ikshvfkeumusnnufadiy)
-- 
-- Scope: Strictly auth.users integration, profiles identity,
--        hardened triggers, and tight RLS policies.
-- Excludes: Unrelated domain tables (scan_results, remedies, chat, tips)
-- Idempotency: All statements safely re-runnable (IF NOT EXISTS / DROP ... IF EXISTS)
-- ============================================================

-- 1. PROFILES TABLE (Strictly extends auth.users)
-- Note: Email is intentionally omitted to avoid duplication with auth.users.email,
-- which is the authoritative source of truth for user authentication and credentials.
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  skin_type TEXT CHECK (skin_type IN ('oily', 'dry', 'combination', 'normal', 'sensitive')),
  dosha TEXT CHECK (dosha IN ('vata', 'pitta', 'kapha')),
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. HARDENED TRIGGER FUNCTION: AUTOMATIC PROFILE CREATION
-- SECURITY DEFINER runs with creator privileges to insert into public.profiles
-- SET search_path = '' mitigates search-path hijacking attacks
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    NEW.id,
    -- Extract full_name or name from auth user_metadata; default to empty string
    -- Explicit onboarding flow completes the profile rather than inventing fake data
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Revoke direct execution grants from untrusted API roles (anon and authenticated)
-- Trigger caller (supabase_auth_admin / postgres) retains internal execution rights
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated;

-- 3. BIND TRIGGER TO auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. HARDENED TIMESTAMP UPDATE FUNCTION
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon, authenticated;

-- 5. BIND TRIGGER TO profiles
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 6. ENABLE ROW LEVEL SECURITY
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 7. RLS POLICIES FOR profiles
-- Uses (select auth.uid()) for optimal subquery caching per Postgres best practices
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = id)
  WITH CHECK ((SELECT auth.uid()) = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) = id);

-- Note: No DELETE policy is defined. Profile erasure is executed exclusively
-- via CASCADE when the authenticated user is deleted from auth.users.
