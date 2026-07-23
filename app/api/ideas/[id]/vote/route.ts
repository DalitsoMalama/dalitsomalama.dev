import { NextResponse } from "next/server";
import { z } from "zod";
import { voteForIdea } from "@/lib/data/ideas";
import { getOrCreateSessionFingerprint } from "@/lib/sessionFingerprint";

const paramsSchema = z.object({ id: z.string().uuid() });

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const parsed = paramsSchema.safeParse(await params);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid idea id" }, { status: 400 });
  }

  const fingerprint = await getOrCreateSessionFingerprint();
  const status = await voteForIdea(parsed.data.id, fingerprint);

  return NextResponse.json({ status });
}
