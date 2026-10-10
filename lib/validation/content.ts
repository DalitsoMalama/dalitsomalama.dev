import { z } from "zod";

// Per-key shape checks for site_content. Every public page renders these
// values directly, so a malformed save from the admin JSON editor would
// otherwise break the page instead of being rejected.
const nullableText = z.string().trim().max(500).nullable();

export const contentSchemas = {
  manifesto: z.string().trim().min(1).max(2000),
  about: z.string().trim().min(1).max(10000),
  cv_entries: z.array(
    z.object({
      role: z.string().trim().min(1).max(200),
      organization: z.string().trim().min(1).max(200),
      start_date: z.string().regex(/^\d{4}-\d{2}$/, "YYYY-MM"),
      end_date: z.string().regex(/^\d{4}-\d{2}$/, "YYYY-MM").nullable(),
      summary: z.string().trim().max(2000),
      highlights: z.array(z.string().trim().min(1).max(500)),
    }),
  ),
  profile: z.object({
    name: z.string().trim().min(1).max(200),
    headline: z.string().trim().min(1).max(200),
    tagline: z.string().trim().min(1).max(160),
    availability: z.string().trim().max(60).nullable(),
    location: z.string().trim().max(200),
    email: z.string().trim().email(),
    phones: z.array(z.string().trim().regex(/^\+?[\d\s()-]{7,20}$/, "a phone number like +260 761 809 955")).max(4),
    whatsapp: z.string().trim().regex(/^\+?[\d\s()-]{7,20}$/, "a phone number like +260 761 809 955").nullable(),
    linkedin_url: z.string().trim().url().nullable(),
    github_url: z.string().trim().url().nullable(),
    highlights: z
      .array(
        z.object({
          value: z.string().trim().min(1).max(40),
          label: z.string().trim().min(1).max(200),
        }),
      )
      .max(6),
  }),
  skills: z.array(
    z.object({
      group: z.string().trim().min(1).max(100),
      items: z.array(z.string().trim().min(1).max(100)),
    }),
  ),
  education: z.array(
    z.object({
      qualification: z.string().trim().min(1).max(200),
      institution: z.string().trim().min(1).max(200),
      year: nullableText,
      note: nullableText,
    }),
  ),
  certifications: z.array(
    z.object({
      name: z.string().trim().min(1).max(200),
      issuer: z.string().trim().min(1).max(200),
      year: nullableText,
    }),
  ),
} as const;

export type ContentKey = keyof typeof contentSchemas;

export const contentKeys = Object.keys(contentSchemas) as [ContentKey, ...ContentKey[]];
