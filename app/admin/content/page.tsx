import { ContentEditor } from "@/components/admin/ContentEditor";
import {
  getAboutText,
  getCertifications,
  getCvEntries,
  getEducation,
  getManifesto,
  getProfile,
  getSkills,
} from "@/lib/data/content";

export default async function AdminContentPage() {
  const [manifesto, about, cvEntries, profile, skills, education, certifications] =
    await Promise.all([
      getManifesto(),
      getAboutText(),
      getCvEntries(),
      getProfile(),
      getSkills(),
      getEducation(),
      getCertifications(),
    ]);

  return (
    <div>
      <h1 className="text-xl font-medium">Site content</h1>
      <p className="mt-1 text-sm text-muted">
        Edits here go live on the next page revalidation — no redeploy needed.
      </p>
      <div className="mt-6">
        <ContentEditor
          content={{ manifesto, about, cv_entries: cvEntries, profile, skills, education, certifications }}
        />
      </div>
    </div>
  );
}
