import { createClient } from '@supabase/supabase-js';

// Use environment variables for both URL and key in production
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://rrmmhfuyojecgwzpivhc.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseAnonKey) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

if (!supabaseUrl) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_URL");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
