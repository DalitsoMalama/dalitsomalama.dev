import Link from "next/link";

const links = [
  { href: "/systems", label: "Systems Lab" },
  { href: "/ideas", label: "Ideas" },
  { href: "/cv", label: "CV" },
  { href: "/about", label: "About" },
];

export function Nav() {
  return (
    <header className="border-b border-border">
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5"
      >
        <Link href="/" className="font-mono text-sm font-medium tracking-tight">
          epy<span className="text-accent">.</span>dev
        </Link>
        <ul className="flex items-center gap-6 text-sm text-muted">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="transition-colors hover:text-foreground">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
