import { NextResponse } from "next/server";
import { requireAdminUser, UnauthorizedError } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { projectSchema } from "@/lib/validation/project";

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
  const parsed = projectSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("projects")
    .insert(parsed.data)
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ id: data.id }, { status: 201 });
}
