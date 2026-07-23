import "server-only";

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function verifyTurnstileToken(token: string | null, remoteIp: string): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  if (!secretKey) {
    if (process.env.NODE_ENV === "production") {
      // Never silently bypass bot protection in production, even if misconfigured.
      console.error("[turnstile] TURNSTILE_SECRET_KEY missing in production — rejecting.");
      return false;
    }
    console.warn("[turnstile] TURNSTILE_SECRET_KEY not set — auto-passing in dev only.");
    return true;
  }

  if (!token) return false;

  const response = await fetch(VERIFY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret: secretKey, response: token, remoteip: remoteIp }),
  });

  if (!response.ok) return false;
  const result = (await response.json()) as { success: boolean };
  return result.success === true;
}
