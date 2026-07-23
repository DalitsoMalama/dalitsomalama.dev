import "server-only";
import { createServerSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { fixtureIdeas } from "@/lib/data/fixtures";
import type { Idea, IdeaStatus } from "@/lib/types";

export type IdeaSort = "votes" | "recent";

export async function getApprovedIdeas(sort: IdeaSort = "votes"): Promise<Idea[]> {
  if (!isSupabaseConfigured()) {
    const ideas = fixtureIdeas.filter((i) => i.approved);
    return sortIdeas(ideas, sort);
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("ideas")
    .select("*")
    .eq("approved", true)
    .neq("status", "declined")
    .order(sort === "votes" ? "vote_count" : "created_at", { ascending: false });

  if (error) throw error;
  return data as Idea[];
}

function sortIdeas(ideas: Idea[], sort: IdeaSort): Idea[] {
  const copy = [...ideas];
  if (sort === "votes") {
    copy.sort((a, b) => b.vote_count - a.vote_count);
  } else {
    copy.sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
  }
  return copy;
}

export async function submitIdea(input: {
  title: string;
  description: string;
  submitterName: string | null;
}): Promise<void> {
  // Anon key, constrained by RLS (public insert only) — service role is reserved
  // for admin-authenticated code and rate-limit bookkeeping (see ARCHITECTURE §9).
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("ideas").insert({
    title: input.title,
    description: input.description,
    submitter_name: input.submitterName,
    approved: false,
    status: "submitted",
  });
  if (error) throw error;
}

export async function voteForIdea(ideaId: string, sessionFingerprint: string): Promise<"ok" | "already_voted"> {
  const supabase = await createServerSupabaseClient();
  const { error: insertError } = await supabase
    .from("idea_votes")
    .insert({ idea_id: ideaId, session_fingerprint: sessionFingerprint });

  if (insertError) {
    // unique_violation = already voted this session
    if (insertError.code === "23505") return "already_voted";
    throw insertError;
  }

  const { error: rpcError } = await supabase.rpc("increment_vote_count", { p_idea_id: ideaId });
  if (rpcError) throw rpcError;

  return "ok";
}

/** Admin-only: pending + all ideas regardless of approval, for the moderation queue. */
export async function getAllIdeasForAdmin(): Promise<Idea[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("ideas")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Idea[];
}

export async function moderateIdea(
  id: string,
  update: { approved?: boolean; status?: IdeaStatus },
): Promise<void> {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("ideas").update(update).eq("id", id);
  if (error) throw error;
}
