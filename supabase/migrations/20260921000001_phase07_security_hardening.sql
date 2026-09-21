-- ============================================================
-- AayurFace — Phase 07 Security Hardening Migration
-- Target Database: Supabase PostgreSQL (Project ikshvfkeumusnnufadiy)
--
-- Addresses Supabase Security Advisor findings:
-- 1. function_search_path_mutable (handle_new_user, get_todays_tip, update_updated_at_column)
-- 2. anon_security_definer_function_executable (handle_new_user, rls_auto_enable)
-- 3. authenticated_security_definer_function_executable (handle_new_user, rls_auto_enable)
-- 4. Enforces explicit WITH CHECK constraints on all user-owned UPDATE policies
-- ============================================================

-- ------------------------------------------------------------
-- 1. HARDEN handle_new_user() & REPAIR PROFILES EMAIL CONSTRAINT
-- ------------------------------------------------------------
-- Ensure email column is not strictly blocking if omitted
ALTER TABLE public.profiles ALTER COLUMN email DROP NOT NULL;

-- Ensure SECURITY DEFINER with locked empty search_path
-- Fully qualify public.profiles and include NEW.email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    NEW.email
  )
  ON CONFLICT (id) DO UPDATE
  SET full_name = EXCLUDED.full_name,
      email = COALESCE(EXCLUDED.email, public.profiles.email);
  RETURN NEW;
END;
$$;

-- Revoke execute privileges from PUBLIC, anon, and authenticated
-- Trigger caller (postgres / supabase_auth_admin) maintains trigger execution rights
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated;


-- ------------------------------------------------------------
-- 2. HARDEN rls_auto_enable()
-- ------------------------------------------------------------
-- Revoke client execution grants to remove /rpc/rls_auto_enable from Data API
-- Internal event trigger caller maintains execution rights
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public' AND p.proname = 'rls_auto_enable'
  ) THEN
    EXECUTE 'REVOKE ALL ON FUNCTION public.rls_auto_enable() FROM PUBLIC;';
    EXECUTE 'REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM anon, authenticated;';
  END IF;
END $$;


-- ------------------------------------------------------------
-- 3. HARDEN get_todays_tip()
-- ------------------------------------------------------------
-- Keep SECURITY INVOKER, lock search_path = '', fully qualify table reference
CREATE OR REPLACE FUNCTION public.get_todays_tip()
RETURNS SETOF public.daily_tips
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM public.daily_tips
  WHERE display_date = CURRENT_DATE AND is_active = TRUE
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN QUERY
    SELECT * FROM public.daily_tips
    WHERE is_active = TRUE
    ORDER BY display_order ASC NULLS LAST, created_at ASC
    LIMIT 1;
  END IF;
END;
$$;

-- Intentionally accessible to clients for daily tip display
GRANT EXECUTE ON FUNCTION public.get_todays_tip() TO anon, authenticated;


-- ------------------------------------------------------------
-- 4. HARDEN update_updated_at_column()
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Revoke unnecessary client execution grants
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon, authenticated;


-- ------------------------------------------------------------
-- 5. HARDEN UPDATE POLICIES WITH EXPLICIT WITH CHECK
-- ------------------------------------------------------------

-- profiles
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = id)
  WITH CHECK ((SELECT auth.uid()) = id);

-- scan_results
DROP POLICY IF EXISTS "Users can update own scans" ON public.scan_results;
CREATE POLICY "Users can update own scans" ON public.scan_results
  FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

-- saved_remedies
DROP POLICY IF EXISTS "Users can update own saved remedies" ON public.saved_remedies;
CREATE POLICY "Users can update own saved remedies" ON public.saved_remedies
  FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

-- chat_sessions
DROP POLICY IF EXISTS "Users can update own chat sessions" ON public.chat_sessions;
CREATE POLICY "Users can update own chat sessions" ON public.chat_sessions
  FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

-- chat_messages
DROP POLICY IF EXISTS "Users can update own chat messages" ON public.chat_messages;
CREATE POLICY "Users can update own chat messages" ON public.chat_messages
  FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);
