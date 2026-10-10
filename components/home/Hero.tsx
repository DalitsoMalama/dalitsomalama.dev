"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FlowField } from "@/components/FlowField";
import { KitweClock } from "@/components/home/KitweClock";
import { Magnetic } from "@/components/Magnetic";
import type { Profile } from "@/lib/types";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Splits the tagline into words; words inside *asterisks* are the serif accent. */
function parseTagline(tagline: string): { text: string; em: boolean }[] {
  return tagline
    .split(/(\*[^*]+\*)/)
    .filter(Boolean)
    .flatMap((part) => {
      const em = part.startsWith("*") && part.endsWith("*");
      return (em ? part.slice(1, -1) : part)
        .split(/\s+/)
        .filter(Boolean)
        .map((text) => ({ text, em }));
    });
}

export function Hero({ profile, manifesto }: { profile: Profile; manifesto: string }) {
  const reduce = useReducedMotion();
  const HEADLINE = parseTagline(profile.tagline);

  const word = (i: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: "0.45em", filter: "blur(10px)" },
          animate: { opacity: 1, y: "0em", filter: "blur(0px)" },
          transition: { duration: 0.9, delay: 0.15 + i * 0.06, ease: EASE },
        };
  const fade = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 12 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, delay, ease: EASE },
        };

  return (
    <section className="relative isolate overflow-hidden">
      <FlowField className="absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_75%_70%_at_60%_45%,black_30%,transparent_80%)]" />

      <div className="mx-auto flex min-h-[calc(100svh-4rem)] max-w-6xl flex-col justify-center px-6 py-20">
        <motion.div {...fade(0)} className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {profile.availability && (
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-3 py-1 text-xs backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              {profile.availability}
            </span>
          )}
          <KitweClock location={profile.location} />
        </motion.div>

        <h1 className="display mt-8 max-w-5xl text-[clamp(2.75rem,8vw,6.75rem)]">
          <span className="sr-only">{HEADLINE.map((w) => w.text).join(" ")}</span>
          <span aria-hidden>
            {HEADLINE.map((w, i) => (
              <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                <motion.span {...word(i)} className={`inline-block ${w.em ? "serif-accent text-accent" : ""}`}>
                  {w.text}
                </motion.span>
                {i < HEADLINE.length - 1 && " "}
              </span>
            ))}
          </span>
        </h1>

        <motion.p {...fade(0.75)} className="mt-8 max-w-xl text-pretty text-lg leading-relaxed text-muted">
          {manifesto}
        </motion.p>

        <motion.div {...fade(0.9)} className="mt-10 flex flex-wrap items-center gap-4">
          <Magnetic>
            <Link
              href="/systems"
              className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-transform active:scale-95"
            >
              See the systems
              <span aria-hidden className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          </Magnetic>
          <Magnetic>
            <Link
              href="/ideas"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-6 py-3 text-sm font-medium backdrop-blur transition-colors hover:border-accent/60"
            >
              Send me a process to automate
            </Link>
          </Magnetic>
        </motion.div>

        <motion.div {...fade(1.2)} className="mt-auto hidden pt-16 sm:block">
          <a href="#impact" className="eyebrow inline-flex items-center gap-3 hover:text-foreground">
            <span className="relative h-8 w-px overflow-hidden bg-border">
              <span className="absolute inset-x-0 top-0 h-3 animate-[scrollcue_1.8s_ease-in-out_infinite] bg-accent" />
            </span>
            Scroll — {profile.name}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
