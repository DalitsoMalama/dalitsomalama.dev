export type Project = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  problem: string | null;
  solution: string | null;
  outcome: string | null;
  organization: string | null;
  period: string | null;
  note: string | null;
  tech_stack: string[];
  video_youtube_id: string | null;
  cover_image_url: string | null;
  gallery_images: string[];
  /** A hairline figure (lib/figures.ts) shown when there is no cover image. */
  figure: string | null;
  /** An interactive simulation (lib/demos.ts) shown on the case study and in the playground. */
  demo: string | null;
  featured: boolean;
  published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
};

export type IdeaStatus =
  | "submitted"
  | "under_review"
  | "in_the_lab"
  | "shipped"
  | "declined";

export type Idea = {
  id: string;
  title: string;
  description: string;
  submitter_name: string | null;
  status: IdeaStatus;
  vote_count: number;
  approved: boolean;
  created_at: string;
};

export type CvEntry = {
  role: string;
  organization: string;
  start_date: string;
  end_date: string | null;
  summary: string;
  highlights: string[];
};

export type ProfileHighlight = {
  value: string;
  label: string;
};

export type Profile = {
  name: string;
  headline: string;
  /** Home page headline. Words wrapped in *asterisks* get the italic serif accent. */
  tagline: string;
  /** Short status pill on the home page, e.g. "Open to new roles"; null hides it. */
  availability: string | null;
  location: string;
  email: string;
  /** Display-formatted phone numbers, e.g. "+260 761 809 955"; each becomes a tel: link. */
  phones: string[];
  /** The number that takes WhatsApp messages, display-formatted; null hides the button. */
  whatsapp: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  highlights: ProfileHighlight[];
};

export type SkillGroup = {
  group: string;
  items: string[];
};

export type EducationEntry = {
  qualification: string;
  institution: string;
  year: string | null;
  note: string | null;
};

export type Certification = {
  name: string;
  issuer: string;
  year: string | null;
};

export type SiteContent = {
  manifesto: string;
  about: string;
  cv_entries: CvEntry[];
  profile: Profile;
  skills: SkillGroup[];
  education: EducationEntry[];
  certifications: Certification[];
};
