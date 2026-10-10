"use client";

import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { ProjectCard } from "@/components/ProjectCard";
import { shortOrganization } from "@/lib/format";
import type { Project } from "@/lib/types";

const ALL = "All";

/** The Systems Lab grid, filterable by organisation; cards glide to their new places. */
export function SystemsGrid({ projects }: { projects: Project[] }) {
  const reduce = useReducedMotion();
  const [filter, setFilter] = useState(ALL);
  // Grouped by short name, so "Copperbelt University" and its Directorate of ICT share one chip.
  const orgOf = (p: Project) => (p.organization ? shortOrganization(p.organization) : null);
  const orgs = [ALL, ...new Set(projects.map(orgOf).filter((o): o is string => Boolean(o)))];
  const shown = filter === ALL ? projects : projects.filter((p) => orgOf(p) === filter);

  return (
    <LayoutGroup>
      <div role="group" aria-label="Filter by organisation" className="flex flex-wrap gap-2">
        {orgs.map((org) => {
          const count = org === ALL ? projects.length : projects.filter((p) => orgOf(p) === org).length;
          const active = filter === org;
          return (
            <button
              key={org}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(org)}
              className={`relative isolate rounded-full border px-4 py-1.5 text-sm transition-colors ${
                active ? "border-transparent text-background" : "border-border text-muted hover:text-foreground"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="systems-filter"
                  aria-hidden
                  className="absolute inset-0 -z-10 rounded-full bg-foreground"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              {org} <span className="ml-1 font-mono text-xs opacity-60">{count}</span>
            </button>
          );
        })}
      </div>

      <motion.ul layout={!reduce} className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {shown.map((project, index) => (
            <motion.li
              key={project.id}
              layout={!reduce}
              initial={reduce ? false : { opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? undefined : { opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.5, delay: Math.min(index, 6) * 0.04, ease: [0.22, 1, 0.36, 1] }}
              className="min-w-0"
            >
              <ProjectCard project={project} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </LayoutGroup>
  );
}
