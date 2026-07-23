import { AdminIdeaRow } from "@/components/admin/AdminIdeaRow";
import { getAllIdeasForAdmin } from "@/lib/data/ideas";

export default async function AdminIdeasPage() {
  const ideas = await getAllIdeasForAdmin();

  return (
    <div>
      <h1 className="text-xl font-medium">Ideas moderation</h1>
      <ul className="mt-6 flex flex-col gap-3">
        {ideas.map((idea) => (
          <AdminIdeaRow key={idea.id} idea={idea} />
        ))}
      </ul>
      {ideas.length === 0 && <p className="mt-6 text-muted">No submissions yet.</p>}
    </div>
  );
}
