import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@/types/database";

const DEFAULT_SUPABASE_URL = "https://wggfeuojnsohhrfakgkz.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY = "sb_publishable_4XUH0dEdiR7ReXMmZwjeOQ_HSwSox10";

/**
 * Creates a Supabase client for client components.
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}
