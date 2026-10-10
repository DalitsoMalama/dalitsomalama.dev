"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ThemeToggle } from "@/components/ThemeToggle";

const links = [
  { href: "/", label: "Home" },
  { href: "/systems", label: "Systems Lab" },
  { href: "/playground", label: "Playground" },
  { href: "/ideas", label: "Ideas" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/about", label: "About" },
];

const isActive = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

export function Nav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The pill sits under the hovered link, else under the current page's link.
  const pill = hovered ?? links.find((link) => isActive(pathname, link.href))?.href ?? null;

  return (
    <header
      className={`sticky top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled || menuOpen
          ? "border-b border-border bg-background/75 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <nav aria-label="Primary" className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="group font-mono text-sm font-medium tracking-tight">
          dalitsomalama
          <span className="inline-block text-accent transition-transform duration-300 group-hover:-translate-y-0.5">.</span>
          dev
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          <ul className="hidden items-center text-sm sm:flex" onMouseLeave={() => setHovered(null)}>
            {links.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <li key={link.href} className="relative">
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    onMouseEnter={() => setHovered(link.href)}
                    className={`relative z-10 block rounded-full px-3.5 py-1.5 transition-colors ${
                      active || hovered === link.href ? "text-foreground" : "text-muted"
                    }`}
                  >
                    {link.label}
                  </Link>
                  {pill === link.href && (
                    <motion.span
                      layoutId="nav-pill"
                      aria-hidden
                      className="absolute inset-0 rounded-full bg-surface-hover"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                </li>
              );
            })}
          </ul>

          <ThemeToggle />

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="flex h-8 w-8 items-center justify-center text-foreground sm:hidden"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-5 w-5">
              <path
                strokeLinecap="round"
                d={menuOpen ? "M6 6l12 12M18 6L6 18" : "M4 8h16M4 16h16"}
                className="transition-all duration-300"
              />
            </svg>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.ul
            id="mobile-nav-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden px-6 sm:hidden"
          >
            {links.map((link, index) => (
              <motion.li
                key={link.href}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 + index * 0.05 }}
                className="border-t border-border first:border-t-0"
              >
                <Link
                  href={link.href}
                  aria-current={isActive(pathname, link.href) ? "page" : undefined}
                  className="display flex items-center justify-between py-4 text-3xl aria-[current=page]:text-accent"
                >
                  {link.label}
                  <span aria-hidden className="text-base text-muted">→</span>
                </Link>
              </motion.li>
            ))}
            <li className="h-4" />
          </motion.ul>
        )}
      </AnimatePresence>
    </header>
  );
}
