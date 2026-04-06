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

export interface SectionTitles {
  contact: string;
  skills: string;
  languages: string;
  experiences: string;
  education: string;
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
  themeId: string;
  orientation: CVOrientation;
  sectionTitles: SectionTitles;
}
