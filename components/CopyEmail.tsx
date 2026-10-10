"use client";

import { useState } from "react";
import { mailtoHref } from "@/lib/contact";

/**
 * The email address with two ways to use it: copy it, or open the visitor's
 * mail app with the address already in the To: field.
 */
export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setFailed(false);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard blocked (insecure context, permissions): the address is still selectable.
      setFailed(true);
    }
  }

  return (
    // Wraps on narrow phones: the buttons drop under the address instead of overflowing.
    <div className="inline-flex max-w-full flex-wrap items-center gap-1 rounded-3xl border border-border bg-surface/70 p-1 backdrop-blur sm:rounded-full">
      <span className="min-w-0 select-all break-all px-4 py-1.5 font-mono text-sm">{email}</span>
      <button
        type="button"
        onClick={copy}
        className="rounded-full px-4 py-2 text-xs font-medium text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
      >
        <span aria-live="polite">{copied ? "Copied ✓" : failed ? "Select & copy" : "Copy"}</span>
      </button>
      <a
        href={mailtoHref(email)}
        className="rounded-full bg-foreground px-4 py-2 text-xs font-medium text-background transition-transform hover:scale-[1.03] active:scale-95"
      >
        Email me
      </a>
    </div>
  );
}
