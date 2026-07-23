export type Project = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  problem: string | null;
  solution: string | null;
  outcome: string | null;
  tech_stack: string[];
  video_youtube_id: string | null;
  cover_image_url: string | null;
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

export type SiteContent = {
  manifesto: string;
  about: string;
  cv_entries: CvEntry[];
};
