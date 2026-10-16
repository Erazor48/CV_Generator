# CV Generator

A browser-based CV editor: fill in your details on the left, see the A4 CV update live on the right, then print it to PDF. Everything runs client-side; CVs are stored in your browser's `localStorage`.

## Features

- Editor tabs for personal info, experience, education, skills, projects and style.
- Live A4 preview in portrait or landscape.
- Four built-in color themes (`dark-portfolio`, `professional-navy`, `minimal`, `classic-burgundy`).
- Several CVs ("projects") with auto-save, rename, duplicate and delete.
- Bullet points in descriptions: lines starting with `- `.
- Export and import of a CV as a JSON file.
- Print to PDF from a self-contained page (styles inlined) so the PDF matches the preview.

## Run locally

Requirements: [Bun](https://bun.sh) (or Node.js 20+).

```bash
bun install
bun run dev
```

Open <http://localhost:3000>; it redirects to `/cv-generator`.

Other scripts: `bun run build`, `bun run start`, `bun run lint`.

### Required local data files

The default CV data is personal and listed in `.gitignore`, but the code imports it. After cloning, create these two files or the build fails:

`src/data/cv-default.ts`

```ts
import { CVData } from "@/types/cv";

export const defaultCV: CVData = {
  name: "Your Name",
  title: "Your title",
  availability: "",
  intro: "",
  contact: { email: "", phone: "", location: "" },
  skills: [],
  languages: [],
  experiences: [],
  education: [],
  themeId: "professional-navy",
  orientation: "portrait",
  sectionTitles: {
    contact: "Contact",
    skills: "Skills",
    languages: "Languages",
    experiences: "Experience",
    education: "Education",
  },
};
```

`src/data/cv-ai-research.ts` (a template offered by the "create from template" button)

```ts
import { CVData } from "@/types/cv";
import { defaultCV } from "./cv-default";

export const aiResearchCV: CVData = { ...defaultCV };
```

## Stack

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Radix UI primitives, lucide-react.

## Project layout

```
src/app/cv-generator   page: editor + preview
src/components/cv      CV preview (sidebar, main column)
src/components/cv-editor   editor forms and CV project panel
src/data/themes.ts     color themes
src/hooks              useCV, useCVProjects (state + localStorage)
src/lib/cv-export.ts   print to PDF, JSON save/load
```
