// Interactive simulations a project may embed, by the name stored in
// projects.demo. Shared by the zod schema and the admin form; the components
// live in components/demos.
export const DEMO_NAMES = ["water-quality", "meter-discrepancy"] as const;

export type DemoName = (typeof DEMO_NAMES)[number];

export function isDemoName(value: string | null | undefined): value is DemoName {
  return (DEMO_NAMES as readonly string[]).includes(value ?? "");
}
