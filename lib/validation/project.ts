import { z } from "zod";

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
  tech_stack: z.array(z.string().trim().min(1).max(40)).max(20),
  video_youtube_id: z.string().trim().max(20).nullable().optional(),
  cover_image_url: z.string().trim().url().nullable().optional(),
  featured: z.boolean(),
  published: z.boolean(),
  display_order: z.number().int(),
});
