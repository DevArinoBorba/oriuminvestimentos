export const SUPABASE_COOKIE_NAME = "sb-oriuminvest-auth-token";

export const SUPABASE_URL =
  (typeof window === "undefined" && process.env.INTERNAL_SUPABASE_URL) ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "";

export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";

export const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "";

