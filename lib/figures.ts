// Names a project may store in projects.figure. Shared by the zod schema and
// the admin form, which can't import the React components in components/Figure.
export const FIGURE_NAMES = ["router", "dish", "cabinet", "terminal", "terrain", "format"] as const;

export type FigureName = (typeof FIGURE_NAMES)[number];
