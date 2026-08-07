-- ============================================================
-- Aayurface — Supabase PostgreSQL Schema
-- Run this in Supabase SQL Editor to set up the database
-- ============================================================

-- ============================================================
-- TABLES
-- ============================================================

-- User profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  skin_type TEXT CHECK (skin_type IN ('oily', 'dry', 'combination', 'normal', 'sensitive')),
  dosha TEXT CHECK (dosha IN ('vata', 'pitta', 'kapha')),
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Skin scan results
CREATE TABLE IF NOT EXISTS scan_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  summary TEXT NOT NULL,
  skin_types TEXT[] NOT NULL,
  causes JSONB NOT NULL,
  remedies JSONB NOT NULL,
  prevention_tips JSONB NOT NULL,
  severity TEXT CHECK (severity IN ('mild', 'moderate', 'high')) DEFAULT 'mild',
  raw_analysis JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ayurvedic remedies catalog
CREATE TABLE IF NOT EXISTS remedies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  ingredients JSONB NOT NULL,
  preparation_steps JSONB NOT NULL,
  application_steps JSONB NOT NULL,
  frequency TEXT NOT NULL,
  ayurvedic_insight TEXT,
  skin_concerns TEXT[] NOT NULL,
  skin_types TEXT[] NOT NULL,
  image_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User's saved/bookmarked remedies
CREATE TABLE IF NOT EXISTS saved_remedies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  remedy_id UUID REFERENCES remedies(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, remedy_id)
);

-- Chat sessions
CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  scan_context_id UUID REFERENCES scan_results(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_message_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat messages within sessions
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  role TEXT CHECK (role IN ('user', 'assistant')) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily Ayurvedic tips
CREATE TABLE IF NOT EXISTS daily_tips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  category TEXT,
  display_order INTEGER,
  display_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_scan_results_user_id ON scan_results(user_id);
CREATE INDEX IF NOT EXISTS idx_scan_results_created_at ON scan_results(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_saved_remedies_user_id ON saved_remedies(user_id);
CREATE INDEX IF NOT EXISTS idx_remedies_skin_concerns ON remedies USING GIN (skin_concerns);
CREATE INDEX IF NOT EXISTS idx_remedies_skin_types ON remedies USING GIN (skin_types);
CREATE INDEX IF NOT EXISTS idx_daily_tips_display_date ON daily_tips(display_date);

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto-create profile on user sign-up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'User'),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Get today's daily tip
CREATE OR REPLACE FUNCTION get_todays_tip()
RETURNS SETOF daily_tips AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM daily_tips
  WHERE display_date = CURRENT_DATE AND is_active = TRUE
  LIMIT 1;
  
  IF NOT FOUND THEN
    RETURN QUERY
    SELECT * FROM daily_tips
    WHERE is_active = TRUE
    ORDER BY display_order ASC NULLS LAST, created_at ASC
    LIMIT 1;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE scan_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_remedies ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE remedies ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_tips ENABLE ROW LEVEL SECURITY;

-- Profiles: users can only access their own
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Scan results: users can only access their own
CREATE POLICY "Users can view own scans" ON scan_results
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own scans" ON scan_results
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own scans" ON scan_results
  FOR DELETE USING (auth.uid() = user_id);

-- Saved remedies: users manage their own
CREATE POLICY "Users can manage own saved remedies" ON saved_remedies
  FOR ALL USING (auth.uid() = user_id);

-- Chat sessions: users manage their own
CREATE POLICY "Users can manage own chat sessions" ON chat_sessions
  FOR ALL USING (auth.uid() = user_id);

-- Chat messages: users manage their own
CREATE POLICY "Users can manage own chat messages" ON chat_messages
  FOR ALL USING (auth.uid() = user_id);

-- Remedies: public read access
CREATE POLICY "Public can read remedies" ON remedies
  FOR SELECT USING (TRUE);

-- Daily tips: public read access (active only)
CREATE POLICY "Public can read daily tips" ON daily_tips
  FOR SELECT USING (is_active = TRUE);
