import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@/types/database";

const DEFAULT_SUPABASE_URL = "https://wggfeuojnsohhrfakgkz.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndnZ2ZldW9qbnNvaGhyZmFrZ2t6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg4MTMyOTAsImV4cCI6MjEwNDM4OTI5MH0.8jY3yxX2cVvTNidxUT1GaojSNViErdhqH8PIQ39LTas";

/**
 * Creates a Supabase client for client components.
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}
