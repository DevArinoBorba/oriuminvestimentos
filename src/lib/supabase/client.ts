import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_COOKIE_NAME } from "./constants";
import type { Database } from "@/types/database";

export function createClient() {
  return createBrowserClient<Database>(
    SUPABASE_URL || "https://unconfigured.supabase.co",
    SUPABASE_ANON_KEY || "unconfigured-anon-key",
    {
      cookieOptions: {
        name: SUPABASE_COOKIE_NAME,
      },
    }
  );
}
