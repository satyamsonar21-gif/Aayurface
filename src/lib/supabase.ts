// ============================================================
// Aayurface — Supabase Client
// Configure with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
// ============================================================

import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL || '';
// Strip any trailing slash or accidental /rest/v1 suffix so auth and rest endpoints resolve correctly
const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

export default supabase;
