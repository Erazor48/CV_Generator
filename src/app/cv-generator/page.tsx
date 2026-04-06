"use client";

import { useCVProjects } from "@/hooks/useCVProjects";
import { CVPreview } from "@/components/cv/CVPreview";
import { CVEditor } from "@/components/cv-editor/CVEditor";
import { ProjectPanel } from "@/components/cv-editor/ProjectPanel";
import { getThemeById } from "@/data/themes";

export default function CVGeneratorPage() {
  const store = useCVProjects();
  const { cv, projects, activeId, activeProject, hydrated } = store;
  const theme = getThemeById(cv.themeId);
  const scale = cv.orientation === "portrait" ? 0.72 : 0.58;

  // Don't render until localStorage is loaded — prevents SSR/CSR hydration mismatch
  if (!hydrated) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#070f18]">
        <span className="text-slate-600 text-sm">Chargement…</span>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#070f18]">

      {/* ── Projects panel ── */}
      <div className="w-[180px] shrink-0 h-full">
        <ProjectPanel
          projects={projects}
          activeId={activeId}
          onSwitch={store.switchProject}
          onCreate={() => store.createProject()}
          onDuplicate={store.duplicateProject}
          onRename={store.renameProject}
          onDelete={store.deleteProject}
        />
      </div>

      {/* ── Editor panel ── */}
      <div className="w-[360px] shrink-0 h-full overflow-hidden flex flex-col">
        <CVEditor
          cv={cv}
          updateField={store.updateField}
          updateContact={store.updateContact}
          setPhoto={store.setPhoto}
          addExperience={store.addExperience}
          updateExperience={store.updateExperience}
          removeExperience={store.removeExperience}
          reorderExperiences={store.reorderExperiences}
          addEducation={store.addEducation}
          updateEducation={store.updateEducation}
          removeEducation={store.removeEducation}
          reorderEducation={store.reorderEducation}
          addSkill={store.addSkill}
          updateSkill={store.updateSkill}
          removeSkill={store.removeSkill}
          addLanguage={store.addLanguage}
          updateLanguage={store.updateLanguage}
          removeLanguage={store.removeLanguage}
          setTheme={store.setTheme}
          setOrientation={store.setOrientation}
          updateSectionTitle={store.updateSectionTitle}
          setSectionTitles={store.setSectionTitles}
          loadCV={store.loadCV}
          resetCV={store.resetCV}
          projectName={activeProject.name}
        />
      </div>

      {/* ── Preview panel ── */}
      <div className="flex-1 h-full overflow-auto flex items-start justify-center p-8 bg-[#070f18]">
        <div style={{ transform: `scale(${scale})`, transformOrigin: "top center" }}>
          <CVPreview cv={cv} theme={theme} />
        </div>
      </div>

    </div>
  );
}
