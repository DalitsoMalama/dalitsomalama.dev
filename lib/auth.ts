import "server-only";
import { createServerSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/server";

/** Returns the authenticated admin user, or null. There is only ever one real user. */
export async function getAdminUser() {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export class UnauthorizedError extends Error {
  constructor() {
    super("Unauthorized");
  }
}

/** Throws UnauthorizedError if there's no valid admin session — call at the top of every admin API route. */
export async function requireAdminUser() {
  const user = await getAdminUser();
  if (!user) throw new UnauthorizedError();
  return user;
}
