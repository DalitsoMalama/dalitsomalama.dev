import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminUser, UnauthorizedError } from "@/lib/auth";
import { updateSiteContent } from "@/lib/data/content";

const bodySchema = z.object({
  key: z.enum(["manifesto", "about", "cv_entries"]),
  value: z.unknown(),
});

export async function POST(request: Request) {
  try {
    await requireAdminUser();
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    throw err;
  }

  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid content payload" }, { status: 400 });
  }

  await updateSiteContent(parsed.data.key, parsed.data.value);
  return NextResponse.json({ ok: true });
}
