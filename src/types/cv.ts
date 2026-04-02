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
  level: string; // e.g. "Native", "B1", "A2"
}

export interface ExperienceItem {
  id: string;
  period: string;       // e.g. "Jan 2025 - Apr 2025"
  title: string;        // e.g. "Clinical Project"
  company: string;      // e.g. "Aivancity"
  location: string;     // e.g. "Cachan (94), France"
  description?: string; // paragraph text
  bullets?: string[];   // bullet points (optional)
}

export interface EducationItem {
  id: string;
  period: string;
  degree: string;
  institution: string;
  location: string;
  description?: string;
}

export interface CVData {
  // Header
  name: string;
  title: string;        // e.g. "Artificial Intelligence Internship"
  availability: string; // e.g. "3-4 months → May to August (2026)"
  photo?: string;       // base64 or URL

  // Intro blurb
  intro: string;

  // Sidebar
  contact: ContactInfo;
  skills: Skill[];
  languages: Language[];

  // Main content
  experiences: ExperienceItem[];
  education: EducationItem[];
}
