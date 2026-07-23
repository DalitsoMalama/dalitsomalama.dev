"use client";

import { useState } from "react";
import type { CvEntry } from "@/lib/types";

export function ContentEditor({
  manifesto: initialManifesto,
  about: initialAbout,
  cvEntries: initialCvEntries,
}: {
  manifesto: string;
  about: string;
  cvEntries: CvEntry[];
}) {
  return (
    <div className="flex flex-col gap-10">
      <TextField contentKey="manifesto" label="Home page manifesto" initialValue={initialManifesto} />
      <TextField contentKey="about" label="About page bio" initialValue={initialAbout} />
      <JsonField contentKey="cv_entries" label="CV timeline entries (JSON array)" initialValue={initialCvEntries} />
    </div>
  );
}

function useSaveState() {
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function save(key: string, value: unknown) {
    setStatus("saving");
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      });
      if (!res.ok) throw new Error();
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setStatus("error");
    }
  }

  return { status, save };
}

function TextField({
  contentKey,
  label,
  initialValue,
}: {
  contentKey: string;
  label: string;
  initialValue: string;
}) {
  const [value, setValue] = useState(initialValue);
  const { status, save } = useSaveState();

  return (
    <section>
      <label className="text-sm font-medium">{label}</label>
      <textarea
        rows={4}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="mt-1.5 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus-visible:border-accent"
      />
      <SaveBar status={status} onSave={() => save(contentKey, value)} />
    </section>
  );
}

function JsonField({
  contentKey,
  label,
  initialValue,
}: {
  contentKey: string;
  label: string;
  initialValue: unknown;
}) {
  const [raw, setRaw] = useState(JSON.stringify(initialValue, null, 2));
  const [jsonError, setJsonError] = useState<string | null>(null);
  const { status, save } = useSaveState();

  function handleSave() {
    try {
      const parsed = JSON.parse(raw);
      setJsonError(null);
      save(contentKey, parsed);
    } catch {
      setJsonError("Invalid JSON — fix formatting before saving.");
    }
  }

  return (
    <section>
      <label className="text-sm font-medium">{label}</label>
      <textarea
        rows={12}
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        className="mt-1.5 w-full rounded-md border border-border bg-surface px-3 py-2 font-mono text-xs outline-none focus-visible:border-accent"
      />
      {jsonError && <p className="mt-1 text-xs text-danger">{jsonError}</p>}
      <SaveBar status={status} onSave={handleSave} />
    </section>
  );
}

function SaveBar({
  status,
  onSave,
}: {
  status: "idle" | "saving" | "saved" | "error";
  onSave: () => void;
}) {
  return (
    <div className="mt-2 flex items-center gap-3">
      <button
        type="button"
        onClick={onSave}
        disabled={status === "saving"}
        className="rounded-md bg-accent px-4 py-1.5 text-xs font-medium text-accent-foreground hover:opacity-90 disabled:opacity-60"
      >
        {status === "saving" ? "Saving…" : "Save"}
      </button>
      {status === "saved" && <span className="text-xs text-accent">Saved</span>}
      {status === "error" && <span className="text-xs text-danger">Save failed</span>}
    </div>
  );
}
