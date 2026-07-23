import Link from "next/link";
import { getAdminUser } from "@/lib/auth";
import { LogoutButton } from "@/components/admin/LogoutButton";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getAdminUser();

  return (
    <div className="min-h-screen">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/admin" className="font-mono text-sm font-medium">
            admin<span className="text-accent">.</span>
          </Link>
          {user && (
            <div className="flex items-center gap-4 text-sm text-muted">
              <Link href="/admin" className="hover:text-foreground">
                Projects
              </Link>
              <Link href="/admin/ideas" className="hover:text-foreground">
                Ideas
              </Link>
              <Link href="/admin/content" className="hover:text-foreground">
                Content
              </Link>
              <LogoutButton />
            </div>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
    </div>
  );
}
