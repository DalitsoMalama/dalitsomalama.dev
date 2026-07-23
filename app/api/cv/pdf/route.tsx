import { renderToBuffer } from "@react-pdf/renderer";
import { CvDocument } from "@/components/CvDocument";
import { getCvEntries } from "@/lib/data/content";

export const runtime = "nodejs";

export async function GET() {
  const entries = await getCvEntries();
  const buffer = await renderToBuffer(<CvDocument entries={entries} />);

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="epy-cv.pdf"',
      "Cache-Control": "public, max-age=300",
    },
  });
}
