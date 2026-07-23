"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TurnstileWidget } from "@/components/TurnstileWidget";

export function IdeaForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitterName, setSubmitterName] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage(null);

    try {
      const res = await fetch("/api/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          submitterName: submitterName.trim() || null,
          turnstileToken: token,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Submission failed");
      }

      setStatus("success");
      setTimeout(() => router.push("/ideas"), 1500);
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (status === "success") {
    return (
      <p className="rounded-lg border border-accent/40 bg-accent/10 p-6 text-accent">
        Thanks — your idea is in the queue for review. Taking you to the feed…
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="title" className="text-sm font-medium">
          Title
        </label>
        <input
          id="title"
          required
          maxLength={120}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus-visible:border-accent"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          required
          maxLength={2000}
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus-visible:border-accent"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="submitterName" className="text-sm font-medium">
          Your name <span className="text-muted">(optional — leave blank to stay anonymous)</span>
        </label>
        <input
          id="submitterName"
          maxLength={80}
          value={submitterName}
          onChange={(e) => setSubmitterName(e.target.value)}
          className="rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus-visible:border-accent"
        />
      </div>

      <TurnstileWidget onVerify={setToken} />

      {errorMessage && <p className="text-sm text-danger">{errorMessage}</p>}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-fit rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {status === "submitting" ? "Submitting…" : "Submit idea"}
      </button>
    </form>
  );
}
