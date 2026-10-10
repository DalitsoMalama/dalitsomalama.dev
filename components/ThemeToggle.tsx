"use client";

import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "theme";
const CHANGE_EVENT = "themechange";
const darkQuery = "(prefers-color-scheme: dark)";

/** Runs in <head> before paint so a saved choice never flashes the other theme. */
export const themeInitScript = `try{var t=localStorage.getItem("${STORAGE_KEY}");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

function getTheme(): Theme {
  const chosen = document.documentElement.dataset.theme;
  if (chosen === "light" || chosen === "dark") return chosen;
  return matchMedia(darkQuery).matches ? "dark" : "light";
}

function subscribe(onChange: () => void) {
  const media = matchMedia(darkQuery);
  media.addEventListener("change", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    media.removeEventListener("change", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

export function ThemeToggle() {
  // null on the server and during hydration: the theme is only known in the browser.
  const theme = useSyncExternalStore<Theme | null>(subscribe, getTheme, () => null);

  function toggle() {
    const next: Theme = getTheme() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Private mode or blocked storage: the choice still applies to this page view.
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }

  const label = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme ? label : "Toggle colour theme"}
      title={theme ? label : undefined}
      className="flex h-8 w-8 items-center justify-center rounded-md text-muted transition-colors hover:text-foreground"
    >
      {theme === "dark" ? (
        // Sun: shown in dark mode, switches to light.
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-[18px] w-[18px]" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path strokeLinecap="round" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      ) : theme === "light" ? (
        // Moon: shown in light mode, switches to dark.
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-[18px] w-[18px]" aria-hidden="true">
          <path strokeLinejoin="round" d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z" />
        </svg>
      ) : (
        <span className="h-[18px] w-[18px]" />
      )}
    </button>
  );
}
