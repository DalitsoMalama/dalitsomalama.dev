import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminUser, UnauthorizedError } from "@/lib/auth";
import { moderateIdea } from "@/lib/data/ideas";

const bodySchema = z.object({
  approved: z.boolean().optional(),
  status: z.enum(["submitted", "under_review", "in_the_lab", "shipped", "declined"]).optional(),
});

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdminUser();
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    throw err;
  }

  const { id } = await params;
  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success || (!("approved" in parsed.data) && !("status" in parsed.data))) {
    return NextResponse.json({ error: "Invalid moderation payload" }, { status: 400 });
  }

  await moderateIdea(id, parsed.data);
  return NextResponse.json({ ok: true });
}
