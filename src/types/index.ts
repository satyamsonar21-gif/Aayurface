// ============================================================
// Aayurface — TypeScript Interfaces
// ============================================================

export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  skin_type: SkinType | null;
  dosha: Dosha | null;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export type SkinType = 'oily' | 'dry' | 'combination' | 'normal' | 'sensitive';
export type Dosha = 'vata' | 'pitta' | 'kapha';
export type Severity = 'mild' | 'moderate' | 'high';

export interface ScanResult {
  id: string;
  user_id: string;
  image_url: string;
  summary: string;
  skin_types: string[];
  causes: ScanCause[];
  remedies: ScanRemedy[];
  prevention_tips: PreventionTip[];
  severity: Severity;
  raw_analysis: Record<string, unknown> | null;
  created_at: string;
}

export interface Assessment {
  id: string;
  userId: string;
  capturedImage: string;
  createdAt: string;
  isDemo?: boolean;
  summary: string;
  skinTypes: string[];
  doshaTendency: {
    primary: string;
    description: string;
  };
  causes: ScanCause[];
  remedies: ScanRemedy[];
  preventionTips: PreventionTip[];
}

export interface ScanCause {
  icon: string;
  text: string;
}

export interface ScanRemedy {
  name: string;
  ingredient: string;
  what_to_use: string;
  how_to_apply: string[];
  how_often: string;
}

export interface PreventionTip {
  icon: string;
  text: string;
}

export interface Remedy {
  id: string;
  name: string;
  slug: string;
  description: string;
  ingredients: RemedyIngredient[];
  preparation_steps: string[];
  application_steps: string[];
  frequency: string;
  ayurvedic_insight: string | null;
  skin_concerns: string[];
  skin_types: string[];
  image_url: string | null;
  is_featured: boolean;
  created_at: string;
}

export interface RemedyIngredient {
  name: string;
  amount: string;
}

export interface SavedRemedy {
  id: string;
  user_id: string;
  remedy_id: string;
  created_at: string;
}

export interface ChatSession {
  id: string;
  user_id: string;
  scan_context_id: string | null;
  created_at: string;
  last_message_at: string;
}

export interface ChatMessage {
  id: string;
  session_id?: string;
  user_id?: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface DailyTip {
  id: string;
  content: string;
  category: string | null;
  display_order: number | null;
  display_date: string | null;
  is_active: boolean;
  created_at: string;
}

export interface UserProfile extends User {
  scan_count: number;
  days_tracked: number;
  saved_remedy_count: number;
}

// Auth types
export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

// Scan status
export type ScanStatus = 'idle' | 'capturing' | 'uploading' | 'analyzing' | 'saving' | 'complete' | 'error';

// Skin concern filter options
export const SKIN_CONCERNS = [
  'All', 'Acne', 'Dryness', 'Oiliness', 'Dark Spots', 'Pigmentation', 'Redness', 'Uneven Tone'
] as const;

export const SKIN_TYPE_OPTIONS: { value: SkinType; label: string; emoji: string; description: string }[] = [
  { value: 'oily', label: 'Oily', emoji: '💧', description: 'Shiny, enlarged pores' },
  { value: 'dry', label: 'Dry', emoji: '🏜️', description: 'Tight, flaky skin' },
  { value: 'combination', label: 'Combination', emoji: '🌓', description: 'Oily T-zone, dry cheeks' },
  { value: 'normal', label: 'Normal', emoji: '✨', description: 'Balanced, smooth skin' },
  { value: 'sensitive', label: 'Sensitive', emoji: '🌸', description: 'Easily irritated' },
];

export const DOSHA_OPTIONS: { value: Dosha; label: string; emoji: string; description: string }[] = [
  { value: 'vata', label: 'Vata', emoji: '🍃', description: 'Dry, thin, cool skin — needs nourishing oils' },
  { value: 'pitta', label: 'Pitta', emoji: '🔥', description: 'Warm, sensitive, redness-prone — needs cooling care' },
  { value: 'kapha', label: 'Kapha', emoji: '🌊', description: 'Oily, thick, smooth — needs detoxifying cleanse' },
];
