// ============================================================
// Aayurface — Supabase Client
// Configure with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
// ============================================================

import { createClient } from '@supabase/supabase-js';

const procEnv = (typeof globalThis !== 'undefined' && (globalThis as unknown as { process?: { env?: Record<string, string> } }).process?.env) || {};
const rawUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
  procEnv.VITE_SUPABASE_URL ||
  'https://placeholder.supabase.co';
// Strip any trailing slash or accidental /rest/v1 suffix so auth and rest endpoints resolve correctly
const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
const supabaseAnonKey = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
  procEnv.VITE_SUPABASE_ANON_KEY ||
  'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

export default supabase;
