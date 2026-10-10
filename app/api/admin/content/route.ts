import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminUser, UnauthorizedError } from "@/lib/auth";
import { updateSiteContent } from "@/lib/data/content";
import { contentKeys, contentSchemas } from "@/lib/validation/content";

const bodySchema = z.object({
  key: z.enum(contentKeys),
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

  const value = contentSchemas[parsed.data.key].safeParse(parsed.data.value);
  if (!value.success) {
    return NextResponse.json({ error: value.error.flatten() }, { status: 400 });
  }

  await updateSiteContent(parsed.data.key, value.data);
  return NextResponse.json({ ok: true });
}
