export type SessionCategory =
  | "Development"
  | "Design"
  | "Data"
  | "Soft Skills"
  | "Leadership"
  | "AI & ML"
  | "Cloud & DevOps"
  | "Cybersecurity"
  | "Software Engineering"
  | "UI design"
  | "Uncategorized"
  | "Web Dev";

export interface Session {
  id: string;
  title: string;
  category: SessionCategory;
  date: string;
  time?: string;
  location: string;
  spotsLeft: number;
  imageUrl: string;
}

export interface CategoryHighlight {
  category: SessionCategory;
  count: number;
}