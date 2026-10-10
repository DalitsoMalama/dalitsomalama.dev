import { z } from "zod";
import { DEMO_NAMES } from "@/lib/demos";
import { FIGURE_NAMES } from "@/lib/figures";

// Absolute URL (e.g. Supabase Storage) or a root-relative path to a file in
// /public, like "/projects/<slug>/cover.jpg".
const imageSrc = z
  .string()
  .trim()
  .max(500)
  .refine((v) => v.startsWith("/") || URL.canParse(v), "must be a URL or a path starting with /");

export const projectSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/, "lowercase letters, numbers, hyphens only"),
  title: z.string().trim().min(1).max(200),
  summary: z.string().trim().min(1).max(300),
  problem: z.string().trim().max(5000).nullable().optional(),
  solution: z.string().trim().max(5000).nullable().optional(),
  outcome: z.string().trim().max(5000).nullable().optional(),
  organization: z.string().trim().max(200).nullable().optional(),
  period: z.string().trim().max(100).nullable().optional(),
  note: z.string().trim().max(500).nullable().optional(),
  tech_stack: z.array(z.string().trim().min(1).max(40)).max(20),
  video_youtube_id: z.string().trim().max(20).nullable().optional(),
  cover_image_url: imageSrc.nullable().optional(),
  gallery_images: z.array(imageSrc).max(12),
  figure: z.enum(FIGURE_NAMES).nullable().optional(),
  demo: z.enum(DEMO_NAMES).nullable().optional(),
  featured: z.boolean(),
  published: z.boolean(),
  display_order: z.number().int(),
});
