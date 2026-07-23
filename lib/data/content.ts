import "server-only";
import { createServerSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { fixtureAbout, fixtureCvEntries, fixtureManifesto } from "@/lib/data/fixtures";
import type { CvEntry } from "@/lib/types";

async function getContentValue<T>(key: string, fallback: T): Promise<T> {
  if (!isSupabaseConfigured()) return fallback;

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("site_content")
    .select("value")
    .eq("key", key)
    .maybeSingle();

  if (error) throw error;
  return (data?.value as T | undefined) ?? fallback;
}

export async function getManifesto(): Promise<string> {
  return getContentValue("manifesto", fixtureManifesto);
}

export async function getAboutText(): Promise<string> {
  return getContentValue("about", fixtureAbout);
}

export async function getCvEntries(): Promise<CvEntry[]> {
  return getContentValue("cv_entries", fixtureCvEntries);
}

export async function updateSiteContent(key: string, value: unknown): Promise<void> {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from("site_content")
    .upsert({ key, value, updated_at: new Date().toISOString() });
  if (error) throw error;
}
