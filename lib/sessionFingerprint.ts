import "server-only";
import crypto from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "sid";
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

/**
 * Returns a hashed, non-identifying fingerprint for the current browser
 * session, creating the underlying cookie if it doesn't exist yet. Must be
 * called from a Route Handler or Server Action (cookie writes aren't allowed
 * from Server Components).
 */
export async function getOrCreateSessionFingerprint(): Promise<string> {
  const cookieStore = await cookies();
  let sid = cookieStore.get(COOKIE_NAME)?.value;

  if (!sid) {
    sid = crypto.randomUUID();
    cookieStore.set(COOKIE_NAME, sid, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: ONE_YEAR_SECONDS,
      path: "/",
    });
  }

  const salt = process.env.SESSION_HASH_SALT ?? "dev-only-insecure-salt";
  return crypto.createHash("sha256").update(`${salt}:${sid}`).digest("hex");
}
