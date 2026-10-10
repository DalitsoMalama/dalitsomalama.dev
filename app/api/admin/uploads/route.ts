import { NextResponse } from "next/server";
import { requireAdminUser, UnauthorizedError } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const BUCKET = "project-images";
const MAX_BYTES = 5 * 1024 * 1024;
const TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

/**
 * Admin-only image upload for project covers and galleries. Stores the file in
 * the public `project-images` bucket under the project's slug and returns its
 * public URL for the form to save. Needs a real Supabase project, like every
 * other write path.
 */
export async function POST(request: Request) {
  try {
    await requireAdminUser();
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    throw err;
  }

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file received" }, { status: 400 });
  }
  const ext = TYPES[file.type];
  if (!ext) {
    return NextResponse.json({ error: "Use a JPEG, PNG or WebP image" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Images must be 5 MB or smaller" }, { status: 400 });
  }

  const rawSlug = String(form?.get("slug") ?? "");
  const folder = /^[a-z0-9-]{1,100}$/.test(rawSlug) ? rawSlug : "unsorted";
  const path = `${folder}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type,
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl }, { status: 201 });
}
