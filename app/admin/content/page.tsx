import { ContentEditor } from "@/components/admin/ContentEditor";
import { getAboutText, getCvEntries, getManifesto } from "@/lib/data/content";

export default async function AdminContentPage() {
  const [manifesto, about, cvEntries] = await Promise.all([
    getManifesto(),
    getAboutText(),
    getCvEntries(),
  ]);

  return (
    <div>
      <h1 className="text-xl font-medium">Site content</h1>
      <p className="mt-1 text-sm text-muted">
        Edits here go live on the next page revalidation — no redeploy needed.
      </p>
      <div className="mt-6">
        <ContentEditor manifesto={manifesto} about={about} cvEntries={cvEntries} />
      </div>
    </div>
  );
}
