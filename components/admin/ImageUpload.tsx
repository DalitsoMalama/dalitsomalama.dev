"use client";

import Image from "next/image";
import { useRef, useState } from "react";

async function uploadImage(file: File, slug: string): Promise<string> {
  const body = new FormData();
  body.append("file", file);
  body.append("slug", slug);
  const res = await fetch("/api/admin/uploads", { method: "POST", body });
  const json = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
  if (!res.ok || !json.url) throw new Error(json.error ?? "Upload failed");
  return json.url;
}

/** A button that picks one or more images, uploads them to Supabase Storage, and hands back their URLs. */
export function UploadButton({
  slug,
  multiple = false,
  onUploaded,
  label = "Upload",
}: {
  slug: string;
  multiple?: boolean;
  onUploaded: (urls: string[]) => void;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    setError(null);
    const urls: string[] = [];
    try {
      for (const [i, file] of [...files].entries()) {
        setStatus(files.length > 1 ? `Uploading ${i + 1} of ${files.length}…` : "Uploading…");
        urls.push(await uploadImage(file, slug));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setStatus(null);
      if (urls.length) onUploaded(urls);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple={multiple}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <button
        type="button"
        disabled={status !== null}
        onClick={() => inputRef.current?.click()}
        className="whitespace-nowrap rounded-md border border-border px-3 py-2 text-sm font-medium transition-colors hover:border-accent/60 disabled:opacity-60"
      >
        {status ?? label}
      </button>
      {error && <span className="text-xs font-normal text-danger">{error}</span>}
    </div>
  );
}

/** A small preview of an image URL with a remove button. */
export function Thumb({ src, onRemove }: { src: string; onRemove: () => void }) {
  return (
    <div className="group relative aspect-video w-40 overflow-hidden rounded-md border border-border bg-surface-hover">
      {/* unoptimized: previews come from arbitrary URLs the admin typed or just uploaded */}
      <Image src={src} alt="" fill unoptimized sizes="160px" className="object-cover" />
      <button
        type="button"
        onClick={onRemove}
        aria-label="Remove image"
        className="absolute right-1 top-1 rounded-full bg-background/90 px-2 text-xs text-foreground opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
      >
        ✕
      </button>
    </div>
  );
}
