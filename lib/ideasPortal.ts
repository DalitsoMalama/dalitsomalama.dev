import { supabasePublicKey, supabaseUrl } from "@/lib/supabase/env";

/**
 * Whether the public ideas portal can accept submissions and votes.
 *
 * Production needs both a database (Supabase) and bot protection (Turnstile):
 * without them every submission would fail, so the form closes politely
 * instead. In development the server bypasses Turnstile and the form stays
 * open so it can be exercised. Uses only NEXT_PUBLIC_* values, so client and
 * server agree.
 */
export function ideasPortalOpen(): boolean {
  if (process.env.NODE_ENV !== "production") return true;
  return Boolean(
    supabaseUrl && supabasePublicKey && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
  );
}
