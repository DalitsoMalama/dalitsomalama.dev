import {
  Cabinet,
  Dish,
  Format,
  Router,
  Terminal,
  Terrain,
} from "@lucasmarkes/hairline/react";
import { FIGURE_NAMES, type FigureName } from "@/lib/figures";

// The hairline figures a project may use as its cover, by the name stored in
// projects.figure. The package's entry is a client module, so a Server
// Component can render these directly. Keep in step with lib/figures.ts.
const figures = {
  router: Router,
  dish: Dish,
  cabinet: Cabinet,
  terminal: Terminal,
  terrain: Terrain,
  format: Format,
} satisfies Record<FigureName, unknown>;

export function Figure({
  name,
  label,
  className,
  play,
}: {
  name: FigureName;
  label?: string;
  className?: string;
  play?: boolean;
}) {
  const Component = figures[name];
  return <Component label={label} className={className} play={play} />;
}

export function isFigureName(value: string | null | undefined): value is FigureName {
  return (FIGURE_NAMES as readonly string[]).includes(value ?? "");
}
