import Link from "next/link";
import { ContactLinks } from "@/components/ContactLinks";
import { ContactActions } from "@/components/ContactActions";
import { getProfile } from "@/lib/data/content";

export async function Footer() {
  const profile = await getProfile();

  return (
    <footer className="relative mt-16 overflow-hidden border-t border-border">
      <div className="mx-auto max-w-6xl px-6 pb-10 pt-24">
        <p className="eyebrow">Get in touch</p>
        <h2 className="display mt-6 max-w-4xl text-[clamp(2.5rem,7vw,5.5rem)]">
          Let&apos;s build something <em>people actually use.</em>
        </h2>
        <div className="mt-10">
          <ContactActions profile={profile} />
          <Link
            href="/ideas/submit"
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
          >
            or send a process to automate →
          </Link>
        </div>

        <div className="mt-24 flex flex-col gap-4 border-t border-border pt-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {profile.name} · {profile.location}
          </p>
          <ContactLinks profile={profile} />
        </div>
      </div>

      {/* oversized wordmark, cropped by the footer's bottom edge */}
      <p
        aria-hidden
        className="display pointer-events-none -mb-[0.22em] select-none whitespace-nowrap text-center text-[14.5vw] leading-none text-foreground/[0.04]"
      >
        dalitsomalama
      </p>
    </footer>
  );
}
