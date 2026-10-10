import { CopyEmail } from "@/components/CopyEmail";
import { telHref, whatsappHref } from "@/lib/contact";
import type { Profile } from "@/lib/types";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.22 8.22 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.8-.23-.08-.39-.12-.56.12-.16.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48a.92.92 0 0 0-.66.31c-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.16-.48-.29Z" />
    </svg>
  );
}

/** Every way to reach Dalitso, as buttons: email (copy or open), WhatsApp, and tap-to-call numbers. */
export function ContactActions({ profile }: { profile: Profile }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <CopyEmail email={profile.email} />
        {profile.whatsapp && (
          <a
            href={whatsappHref(profile.whatsapp)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-medium text-[#06210f] transition-transform hover:scale-[1.03] active:scale-95"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Chat on WhatsApp
          </a>
        )}
      </div>
      {profile.phones.length > 0 && (
        <ul className="flex flex-wrap items-center gap-2" aria-label="Phone numbers">
          {profile.phones.map((phone) => (
            <li key={phone}>
              <a
                href={telHref(phone)}
                className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 font-mono text-sm transition-colors hover:border-accent/60 hover:text-accent"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden className="h-3.5 w-3.5">
                  <path
                    strokeLinejoin="round"
                    d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"
                  />
                </svg>
                {phone}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
