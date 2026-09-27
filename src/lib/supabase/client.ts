import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@/types/database";

/**
 * Creates a Supabase client for client components.
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes("your-project-id")) {
    // Return null or log warning if Supabase credentials are not yet configured
    console.warn(
      "AfriGuide: Supabase environment variables NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY are not set. Using local fallback data."
    );
  }

  return createBrowserClient<Database>(
    supabaseUrl || "https://placeholder.supabase.co",
    supabaseAnonKey || "placeholder-anon-key"
  );
}
