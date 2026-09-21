-- ============================================================
-- AayurFace — Phase 08 User Consents & Onboarding Schema
-- Target Database: Supabase PostgreSQL (Project ikshvfkeumusnnufadiy)
-- ============================================================

-- ------------------------------------------------------------
-- 1. TABLE: user_consents
-- Server-side authoritative storage for privacy, camera, and educational disclaimers
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_consents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  consent_type TEXT NOT NULL,
  consent_version TEXT NOT NULL,
  granted BOOLEAN NOT NULL DEFAULT TRUE,
  granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT user_consents_user_type_key UNIQUE (user_id, consent_type)
);

-- ------------------------------------------------------------
-- 2. INDEXES
-- ------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_user_consents_user_id ON public.user_consents(user_id);
CREATE INDEX IF NOT EXISTS idx_user_consents_type ON public.user_consents(consent_type);

-- ------------------------------------------------------------
-- 3. TRIGGER: update_updated_at_column
-- ------------------------------------------------------------
DROP TRIGGER IF EXISTS update_user_consents_updated_at ON public.user_consents;
CREATE TRIGGER update_user_consents_updated_at
  BEFORE UPDATE ON public.user_consents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ------------------------------------------------------------
-- 4. ROW LEVEL SECURITY (RLS)
-- ------------------------------------------------------------
ALTER TABLE public.user_consents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own consents" ON public.user_consents;
CREATE POLICY "Users can view own consents" ON public.user_consents
  FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert own consents" ON public.user_consents;
CREATE POLICY "Users can insert own consents" ON public.user_consents
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own consents" ON public.user_consents;
CREATE POLICY "Users can update own consents" ON public.user_consents
  FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete own consents" ON public.user_consents;
CREATE POLICY "Users can delete own consents" ON public.user_consents
  FOR DELETE TO authenticated
  USING ((SELECT auth.uid()) = user_id);
