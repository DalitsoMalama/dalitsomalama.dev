import "server-only";
import crypto from "node:crypto";
import { createServiceRoleClient, isSupabaseConfigured } from "@/lib/supabase/server";

const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_PER_WINDOW = 5;

function hashIp(ip: string): string {
  const salt = process.env.SESSION_HASH_SALT ?? "dev-only-insecure-salt";
  return crypto.createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

/**
 * Checks whether an IP is under the submission limit and, if so, records this
 * attempt. Backed by Postgres (not in-memory) because Vercel serverless
 * function instances don't share memory between invocations.
 */
export async function checkAndRecordRateLimit(ip: string): Promise<{ allowed: boolean }> {
  const ipHash = hashIp(ip);

  if (!isSupabaseConfigured()) {
    // Local dev without a Supabase project: don't block, but don't pretend to enforce it either.
    console.warn("[rateLimit] Supabase not configured — rate limiting is a no-op in dev.");
    return { allowed: true };
  }

  const supabase = createServiceRoleClient();
  const since = new Date(Date.now() - WINDOW_MS).toISOString();

  const { count, error: countError } = await supabase
    .from("idea_rate_limit")
    .select("*", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("created_at", since);

  if (countError) throw countError;

  if ((count ?? 0) >= MAX_PER_WINDOW) {
    return { allowed: false };
  }

  const { error: insertError } = await supabase.from("idea_rate_limit").insert({ ip_hash: ipHash });
  if (insertError) throw insertError;

  return { allowed: true };
}
