import { createClient, SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://dsmtdkqkxzbjmaltunut.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzbXRka3FreHpiam1hbHR1bnV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwNTgxMDcsImV4cCI6MjA4ODYzNDEwN30.pByNsQ2_okeG9sLfpC799AOxWrXaaM81mwmMXkTWTsY";

let _supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    _supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return _supabase;
}

// Alias for client components
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
