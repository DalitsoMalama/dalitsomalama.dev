import { NextResponse } from "next/server";
import { z } from "zod";
import { voteForIdea } from "@/lib/data/ideas";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { getOrCreateSessionFingerprint } from "@/lib/sessionFingerprint";

const paramsSchema = z.object({ id: z.string().uuid() });

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Voting isn't open yet" }, { status: 503 });
  }

  const parsed = paramsSchema.safeParse(await params);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid idea id" }, { status: 400 });
  }

  const fingerprint = await getOrCreateSessionFingerprint();
  const status = await voteForIdea(parsed.data.id, fingerprint);

  return NextResponse.json({ status });
}
