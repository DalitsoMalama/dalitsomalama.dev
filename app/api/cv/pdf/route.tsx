import { renderToBuffer } from "@react-pdf/renderer";
import { CvDocument } from "@/components/CvDocument";
import {
  getCertifications,
  getCvEntries,
  getEducation,
  getProfile,
  getSkills,
} from "@/lib/data/content";

export const runtime = "nodejs";

export async function GET() {
  const [profile, entries, skills, education, certifications] = await Promise.all([
    getProfile(),
    getCvEntries(),
    getSkills(),
    getEducation(),
    getCertifications(),
  ]);
  const buffer = await renderToBuffer(
    <CvDocument
      profile={profile}
      entries={entries}
      skills={skills}
      education={education}
      certifications={certifications}
    />,
  );
  const filename = `${profile.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-cv.pdf`;

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "public, max-age=300",
    },
  });
}
