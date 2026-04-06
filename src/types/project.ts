import { CVData } from "./cv";

export interface CVProject {
  id: string;
  /** User-given name, e.g. "CV Stage Aivancity 2026" */
  name: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  data: CVData;
}
