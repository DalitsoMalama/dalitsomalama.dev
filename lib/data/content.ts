import "server-only";
import { createServerSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/server";
import {
  fixtureAbout,
  fixtureCertifications,
  fixtureCvEntries,
  fixtureEducation,
  fixtureManifesto,
  fixtureProfile,
  fixtureSkills,
} from "@/lib/data/fixtures";
import type {
  Certification,
  CvEntry,
  EducationEntry,
  Profile,
  SiteContent,
  SkillGroup,
} from "@/lib/types";

async function getContentValue<K extends keyof SiteContent>(
  key: K,
  fallback: SiteContent[K],
): Promise<SiteContent[K]> {
  if (!isSupabaseConfigured()) return fallback;

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("site_content")
    .select("value")
    .eq("key", key)
    .maybeSingle();

  if (error) throw error;
  return (data?.value as SiteContent[K] | undefined) ?? fallback;
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

export async function getProfile(): Promise<Profile> {
  // Merged over the fixture so a profile saved before a field existed
  // (tagline, availability) still renders instead of crashing the hero.
  return { ...fixtureProfile, ...(await getContentValue("profile", fixtureProfile)) };
}

export async function getSkills(): Promise<SkillGroup[]> {
  return getContentValue("skills", fixtureSkills);
}

export async function getEducation(): Promise<EducationEntry[]> {
  return getContentValue("education", fixtureEducation);
}

export async function getCertifications(): Promise<Certification[]> {
  return getContentValue("certifications", fixtureCertifications);
}

export async function updateSiteContent(key: keyof SiteContent, value: unknown): Promise<void> {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from("site_content")
    .upsert({ key, value, updated_at: new Date().toISOString() });
  if (error) throw error;
}
