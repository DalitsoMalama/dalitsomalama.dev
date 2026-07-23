"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Project } from "@/lib/types";

type FormState = {
  slug: string;
  title: string;
  summary: string;
  problem: string;
  solution: string;
  outcome: string;
  techStack: string;
  videoYoutubeId: string;
  coverImageUrl: string;
  featured: boolean;
  published: boolean;
  displayOrder: number;
};

function toFormState(project: Project | null): FormState {
  return {
    slug: project?.slug ?? "",
    title: project?.title ?? "",
    summary: project?.summary ?? "",
    problem: project?.problem ?? "",
    solution: project?.solution ?? "",
    outcome: project?.outcome ?? "",
    techStack: project?.tech_stack.join(", ") ?? "",
    videoYoutubeId: project?.video_youtube_id ?? "",
    coverImageUrl: project?.cover_image_url ?? "",
    featured: project?.featured ?? false,
    published: project?.published ?? false,
    displayOrder: project?.display_order ?? 0,
  };
}

export function ProjectForm({ project }: { project: Project | null }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(() => toFormState(project));
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isNew = project === null;

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const payload = {
      slug: form.slug,
      title: form.title,
      summary: form.summary,
      problem: form.problem || null,
      solution: form.solution || null,
      outcome: form.outcome || null,
      tech_stack: form.techStack
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      video_youtube_id: form.videoYoutubeId || null,
      cover_image_url: form.coverImageUrl || null,
      featured: form.featured,
      published: form.published,
      display_order: Number(form.displayOrder),
    };

    try {
      const res = await fetch(isNew ? "/api/admin/projects" : `/api/admin/projects/${project.id}`, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(typeof body.error === "string" ? body.error : "Save failed");
      }

      if (isNew) {
        const { id } = (await res.json()) as { id: string };
        router.push(`/admin/projects/${id}`);
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-2xl flex-col gap-5">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Title">
          <input
            required
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Slug">
          <input
            required
            value={form.slug}
            onChange={(e) => update("slug", e.target.value)}
            className={`${inputClass} font-mono`}
          />
        </Field>
      </div>

      <Field label="Summary (one line, shown on cards)">
        <input
          required
          maxLength={300}
          value={form.summary}
          onChange={(e) => update("summary", e.target.value)}
          className={inputClass}
        />
      </Field>

      <Field label="Problem">
        <textarea rows={4} value={form.problem} onChange={(e) => update("problem", e.target.value)} className={inputClass} />
      </Field>
      <Field label="Solution">
        <textarea rows={4} value={form.solution} onChange={(e) => update("solution", e.target.value)} className={inputClass} />
      </Field>
      <Field label="Outcome / impact">
        <textarea rows={3} value={form.outcome} onChange={(e) => update("outcome", e.target.value)} className={inputClass} />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Tech stack (comma-separated)">
          <input value={form.techStack} onChange={(e) => update("techStack", e.target.value)} className={inputClass} />
        </Field>
        <Field label="YouTube video ID (unlisted)">
          <input value={form.videoYoutubeId} onChange={(e) => update("videoYoutubeId", e.target.value)} className={inputClass} />
        </Field>
      </div>

      <Field label="Cover image URL (optional)">
        <input value={form.coverImageUrl} onChange={(e) => update("coverImageUrl", e.target.value)} className={inputClass} />
      </Field>

      <div className="flex flex-wrap items-center gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => update("published", e.target.checked)}
          />
          Published
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => update("featured", e.target.checked)}
          />
          Featured (max 3 shown on home)
        </label>
        <label className="flex items-center gap-2 text-sm">
          Display order
          <input
            type="number"
            value={form.displayOrder}
            onChange={(e) => update("displayOrder", Number(e.target.value))}
            className={`${inputClass} w-20`}
          />
        </label>
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-fit rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground hover:opacity-90 disabled:opacity-60"
      >
        {isSubmitting ? "Saving…" : isNew ? "Create project" : "Save changes"}
      </button>
    </form>
  );
}

const inputClass =
  "rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus-visible:border-accent w-full";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm font-medium">
      {label}
      {children}
    </label>
  );
}
