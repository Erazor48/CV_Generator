export interface ContactInfo {
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
}

export interface Skill {
  id: string;
  label: string;
  category?: string;
}

export interface ExtraItem {
  id: string;
  label: string;
  sublabel?: string;
}

export interface ExtraSection {
  id: string;
  title: string;
  items: ExtraItem[];
}

export interface Language {
  id: string;
  name: string;
  level: string;
}

export interface ExperienceItem {
  id: string;
  period: string;
  title: string;
  company: string;
  location: string;
  /** Lines starting with "- " will be rendered as bullet points in the preview */
  description?: string;
}

export interface EducationItem {
  id: string;
  period: string;
  degree: string;
  institution: string;
  location: string;
  /** Lines starting with "- " will be rendered as bullet points in the preview */
  description?: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  period?: string;
  url?: string;
  /** Lines starting with "- " will be rendered as bullet points in the preview */
  description?: string;
}

export interface SectionTitles {
  contact: string;
  skills: string;
  languages: string;
  experiences: string;
  education: string;
  projects?: string;
}

export type CVOrientation = "portrait" | "landscape";

export interface CVData {
  name: string;
  title: string;
  availability: string;
  photo?: string;
  intro: string;
  contact: ContactInfo;
  skills: Skill[];
  languages: Language[];
  experiences: ExperienceItem[];
  education: EducationItem[];
  projects?: ProjectItem[];
  extras?: ExtraSection[];
  themeId: string;
  orientation: CVOrientation;
  sectionTitles: SectionTitles;
}
