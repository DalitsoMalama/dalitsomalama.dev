import { NextResponse } from "next/server";
import { z } from "zod";
import { submitIdea } from "@/lib/data/ideas";
import { checkAndRecordRateLimit, getClientIp } from "@/lib/rateLimit";
import { verifyTurnstileToken } from "@/lib/turnstile";

const payloadSchema = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().min(1).max(2000),
  submitterName: z.string().trim().max(80).nullable().optional(),
  turnstileToken: z.string().nullable(),
});

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = payloadSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
  }

  const ip = getClientIp(request);

  const turnstileOk = await verifyTurnstileToken(parsed.data.turnstileToken, ip);
  if (!turnstileOk) {
    return NextResponse.json({ error: "Bot verification failed" }, { status: 403 });
  }

  const { allowed } = await checkAndRecordRateLimit(ip);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many submissions — try again later" },
      { status: 429 },
    );
  }

  await submitIdea({
    title: parsed.data.title,
    description: parsed.data.description,
    submitterName: parsed.data.submitterName || null,
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
