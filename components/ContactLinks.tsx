import type { Profile } from "@/lib/types";

export function ContactLinks({ profile, className = "" }: { profile: Profile; className?: string }) {
  const links = [
    { href: `mailto:${profile.email}`, label: profile.email },
    profile.linkedin_url && { href: profile.linkedin_url, label: "LinkedIn" },
    profile.github_url && { href: profile.github_url, label: "GitHub" },
  ].filter((link): link is { href: string; label: string } => Boolean(link));

  return (
    <ul className={`flex flex-wrap gap-x-5 gap-y-2 ${className}`}>
      {links.map((link) => (
        <li key={link.href}>
          <a
            href={link.href}
            {...(link.href.startsWith("http") && { target: "_blank", rel: "noopener noreferrer" })}
            className="underline decoration-border underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
