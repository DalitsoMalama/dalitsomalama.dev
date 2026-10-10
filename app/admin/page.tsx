import Link from "next/link";
import { getAdminUser } from "@/lib/auth";
import { LoginForm } from "@/components/admin/LoginForm";
import { getAllProjectsForAdmin } from "@/lib/data/projects";
import { getAllIdeasForAdmin } from "@/lib/data/ideas";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export default async function AdminPage() {
  const user = await getAdminUser();

  if (!user) {
    return (
      <div className="flex flex-col items-center gap-6 py-16">
        <div className="text-center">
          <h1 className="text-xl font-medium">Admin sign in</h1>
          {!isSupabaseConfigured() && (
            <p className="mt-2 max-w-sm text-sm text-muted">
              Supabase isn&apos;t configured yet — set NEXT_PUBLIC_SUPABASE_URL and
              NEXT_PUBLIC_SUPABASE_ANON_KEY (or …_PUBLISHABLE_KEY) in .env.local to enable admin sign-in.
            </p>
          )}
        </div>
        {isSupabaseConfigured() && <LoginForm />}
      </div>
    );
  }

  const [projects, ideas] = await Promise.all([getAllProjectsForAdmin(), getAllIdeasForAdmin()]);
  const pendingCount = ideas.filter((idea) => !idea.approved && idea.status !== "declined").length;

  return (
    <div className="flex flex-col gap-10">
      <section>
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-medium">Projects</h1>
          <Link
            href="/admin/projects/new"
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90"
          >
            New project
          </Link>
        </div>
        <div className="mt-4 overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-surface text-left text-muted">
              <tr>
                <th className="px-4 py-2 font-medium">Title</th>
                <th className="px-4 py-2 font-medium">Slug</th>
                <th className="px-4 py-2 font-medium">Published</th>
                <th className="px-4 py-2 font-medium">Featured</th>
                <th className="px-4 py-2 font-medium">Order</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} className="border-t border-border">
                  <td className="px-4 py-2">
                    <Link href={`/admin/projects/${project.id}`} className="hover:text-accent">
                      {project.title}
                    </Link>
                  </td>
                  <td className="px-4 py-2 font-mono text-xs text-muted">{project.slug}</td>
                  <td className="px-4 py-2">{project.published ? "Yes" : "No"}</td>
                  <td className="px-4 py-2">{project.featured ? "Yes" : "No"}</td>
                  <td className="px-4 py-2">{project.display_order}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {projects.length === 0 && (
            <p className="p-4 text-sm text-muted">No projects yet — create the first one.</p>
          )}
        </div>
      </section>

      <section>
        <Link
          href="/admin/ideas"
          className="flex items-center justify-between rounded-lg border border-border p-5 hover:border-accent/50"
        >
          <div>
            <h2 className="font-medium">Ideas moderation queue</h2>
            <p className="text-sm text-muted">Review, approve, decline, and set status.</p>
          </div>
          <span className="rounded-full bg-surface-hover px-3 py-1 text-sm font-medium">
            {pendingCount} pending
          </span>
        </Link>
      </section>
    </div>
  );
}
