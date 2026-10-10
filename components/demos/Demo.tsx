import { MeterDiscrepancy } from "@/components/demos/MeterDiscrepancy";
import { WaterQuality } from "@/components/demos/WaterQuality";
import type { DemoName } from "@/lib/demos";

/** Renders a project's interactive demo by its stored name (projects.demo). */
export function Demo({ name }: { name: DemoName }) {
  switch (name) {
    case "water-quality":
      return <WaterQuality />;
    case "meter-discrepancy":
      return <MeterDiscrepancy />;
  }
}

/** Demos that can stand in for a cover image on a project card. */
export function DemoThumbnail({ name }: { name: DemoName }) {
  return name === "water-quality" ? <WaterQuality compact /> : null;
}
