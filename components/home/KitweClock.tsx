"use client";

import { useSyncExternalStore } from "react";

const TIME_ZONE = "Africa/Lusaka";
const format = new Intl.DateTimeFormat("en-GB", {
  timeZone: TIME_ZONE,
  hour: "2-digit",
  minute: "2-digit",
});

function subscribe(onChange: () => void) {
  const id = setInterval(onChange, 15_000);
  return () => clearInterval(id);
}

/** "Kitwe, Zambia · 14:32 CAT", live; renders without the time on the server. */
export function KitweClock({ location }: { location: string }) {
  const time = useSyncExternalStore(subscribe, () => format.format(new Date()), () => null);

  return (
    <span className="eyebrow inline-flex items-center gap-2 normal-case tracking-[0.08em]">
      {location}
      {time && (
        <>
          <span aria-hidden>·</span>
          <time className="tabular-nums text-foreground/80">{time} CAT</time>
        </>
      )}
    </span>
  );
}
