"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          theme?: string;
          callback: (token: string) => void;
          "error-callback"?: () => void;
          "expired-callback"?: () => void;
        },
      ) => string;
    };
  }
}

export function TurnstileWidget({ onVerify }: { onVerify: (token: string | null) => void }) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const containerRef = useRef<HTMLDivElement>(null);
  const onVerifyRef = useRef(onVerify);
  const rendered = useRef(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    onVerifyRef.current = onVerify;
  });

  useEffect(() => {
    if (!scriptLoaded || !siteKey || !containerRef.current || rendered.current) return;
    if (!window.turnstile) return;

    rendered.current = true;
    window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      theme: "dark",
      callback: (token) => onVerifyRef.current(token),
      "error-callback": () => onVerifyRef.current(null),
      "expired-callback": () => onVerifyRef.current(null),
    });
  }, [scriptLoaded, siteKey]);

  if (!siteKey) {
    return (
      <p className="rounded-md border border-dashed border-border p-3 text-xs text-muted">
        Turnstile isn&apos;t configured yet (missing NEXT_PUBLIC_TURNSTILE_SITE_KEY) — the server
        falls back to a dev-only bypass. Set real Turnstile keys before deploying.
      </p>
    );
  }

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        async
        defer
        onLoad={() => setScriptLoaded(true)}
      />
      <div ref={containerRef} />
    </>
  );
}
