import "server-only";
import { createServerSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { fixtureProjects } from "@/lib/data/fixtures";
import type { Project } from "@/lib/types";

export async function getPublishedProjects(): Promise<Project[]> {
  if (!isSupabaseConfigured()) {
    return [...fixtureProjects]
      .filter((p) => p.published)
      .sort((a, b) => a.display_order - b.display_order);
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("published", true)
    .order("display_order", { ascending: true });

  if (error) throw error;
  return data as Project[];
}

export async function getFeaturedProjects(limit = 3): Promise<Project[]> {
  const published = await getPublishedProjects();
  return published.filter((p) => p.featured).slice(0, limit);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  if (!isSupabaseConfigured()) {
    return fixtureProjects.find((p) => p.slug === slug && p.published) ?? null;
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error) throw error;
  return data as Project | null;
}

/** Admin-only: every project regardless of published state. Requires a real Supabase project. */
export async function getAllProjectsForAdmin(): Promise<Project[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) throw error;
  return data as Project[];
}

export async function getProjectByIdForAdmin(id: string): Promise<Project | null> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data as Project | null;
}
