import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://rrmmhfuyojecgwzpivhc.supabase.co"; // Hardcoded URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseAnonKey) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
