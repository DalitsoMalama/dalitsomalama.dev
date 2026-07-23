import { notFound } from "next/navigation";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { getProjectByIdForAdmin } from "@/lib/data/projects";

export default async function AdminProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (id === "new") {
    return (
      <div>
        <h1 className="mb-6 text-xl font-medium">New project</h1>
        <ProjectForm project={null} />
      </div>
    );
  }

  const project = await getProjectByIdForAdmin(id);
  if (!project) notFound();

  return (
    <div>
      <h1 className="mb-6 text-xl font-medium">Edit project</h1>
      <ProjectForm project={project} />
    </div>
  );
}
