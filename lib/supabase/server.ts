import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { isSupabaseConfigured } from "./client";
import { supabasePublicKey, supabaseSecretKey, supabaseUrl } from "./env";

export { isSupabaseConfigured };

/** Session-aware client for Server Components / Route Handlers — respects RLS as the current user. */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(
    supabaseUrl!,
    supabasePublicKey!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // setAll called from a Server Component — safe to ignore when
            // proxy.ts is also refreshing the session.
          }
        },
      },
    },
  );
}

/**
 * Anonymous, cookie-free client for public reads (published projects, site
 * content, approved ideas). It never touches request cookies, so it works in
 * generateStaticParams and lets public pages prerender with ISR; RLS still
 * limits it to what any visitor may see. Use the session client for anything
 * that depends on who is signed in.
 */
export function createPublicSupabaseClient() {
  return createSupabaseClient(supabaseUrl!, supabasePublicKey!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

/**
 * Bypasses RLS entirely — server-only, never imported into client code.
 * Used for admin writes (after session verification) and rate-limit bookkeeping.
 */
export function createServiceRoleClient() {
  const secretKey = supabaseSecretKey();
  if (!secretKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_SECRET_KEY) is not set");
  }
  return createSupabaseClient(
    supabaseUrl!,
    secretKey,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
