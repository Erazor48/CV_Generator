"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { CVData, CVOrientation, ExperienceItem, EducationItem, Language, SectionTitles } from "@/types/cv";
import { CVProject } from "@/types/project";
import { defaultCV } from "@/data/cv-default";

// ── localStorage helpers ───────────────────────────────────────────────────

const STORAGE_KEY = "cv-generator-projects";
const ACTIVE_KEY  = "cv-generator-active-id";

function loadFromStorage(): CVProject[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CVProject[];
  } catch {
    return [];
  }
}

function saveToStorage(projects: CVProject[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch {
    console.warn("[useCVProjects] localStorage write failed (quota?)");
  }
}

function loadActiveId(): string | null {
  try { return localStorage.getItem(ACTIVE_KEY); }
  catch { return null; }
}

function saveActiveId(id: string) {
  try { localStorage.setItem(ACTIVE_KEY, id); }
  catch {}
}

// ── Initial state ──────────────────────────────────────────────────────────

function buildInitialState(): { projects: CVProject[]; activeId: string } {
  const stored = loadFromStorage();

  if (stored.length > 0) {
    const savedActiveId = loadActiveId();
    const activeId = stored.find((p) => p.id === savedActiveId)
      ? savedActiveId!
      : stored[0].id;
    return { projects: stored, activeId };
  }

  // First launch — create a default project from cv-default
  const first: CVProject = {
    id: crypto.randomUUID(),
    name: "Mon CV",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    data: defaultCV,
  };
  return { projects: [first], activeId: first.id };
}

// ── Hook ───────────────────────────────────────────────────────────────────

export function useCVProjects() {
  const init = useRef(buildInitialState());

  const [projects, setProjects] = useState<CVProject[]>(init.current.projects);
  const [activeId, setActiveId] = useState<string>(init.current.activeId);

  // Derive active CV data
  const activeProject = projects.find((p) => p.id === activeId) ?? projects[0];
  const cv = activeProject.data;

  // ── Auto-save: persist projects to localStorage whenever they change ──────
  useEffect(() => {
    saveToStorage(projects);
  }, [projects]);

  useEffect(() => {
    saveActiveId(activeId);
  }, [activeId]);

  // ── Helper: update the active project's CV data ───────────────────────────
  const patchCV = useCallback((updater: (prev: CVData) => CVData) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === activeId
          ? { ...p, data: updater(p.data), updatedAt: new Date().toISOString() }
          : p
      )
    );
  }, [activeId]);

  // ── Project management ────────────────────────────────────────────────────

  const createProject = useCallback((name = "Nouveau CV") => {
    const newProject: CVProject = {
      id: crypto.randomUUID(),
      name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      data: { ...defaultCV },
    };
    setProjects((prev) => [newProject, ...prev]);
    setActiveId(newProject.id);
  }, []);

  const duplicateProject = useCallback((id: string) => {
    setProjects((prev) => {
      const source = prev.find((p) => p.id === id);
      if (!source) return prev;
      const copy: CVProject = {
        ...source,
        id: crypto.randomUUID(),
        name: `${source.name} (copie)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        data: JSON.parse(JSON.stringify(source.data)), // deep clone
      };
      const idx = prev.findIndex((p) => p.id === id);
      const next = [...prev];
      next.splice(idx + 1, 0, copy);
      return next;
    });
  }, []);

  const renameProject = useCallback((id: string, name: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, name, updatedAt: new Date().toISOString() } : p))
    );
  }, []);

  const deleteProject = useCallback((id: string) => {
    setProjects((prev) => {
      if (prev.length <= 1) return prev; // always keep at least one
      const next = prev.filter((p) => p.id !== id);
      if (activeId === id) setActiveId(next[0].id);
      return next;
    });
  }, [activeId]);

  const switchProject = useCallback((id: string) => {
    setActiveId(id);
  }, []);

  const loadCV = useCallback((data: CVData) => {
    patchCV(() => data);
  }, [patchCV]);

  const resetCV = useCallback(() => {
    patchCV(() => ({ ...defaultCV }));
  }, [patchCV]);

  // ── CV field mutations (mirrors useCV) ────────────────────────────────────

  const updateField = useCallback(<K extends keyof CVData>(key: K, value: CVData[K]) => {
    patchCV((prev) => ({ ...prev, [key]: value }));
  }, [patchCV]);

  const updateContact = useCallback((field: keyof CVData["contact"], value: string) => {
    patchCV((prev) => ({ ...prev, contact: { ...prev.contact, [field]: value } }));
  }, [patchCV]);

  const updateSectionTitle = useCallback((field: keyof SectionTitles, value: string) => {
    patchCV((prev) => ({ ...prev, sectionTitles: { ...prev.sectionTitles, [field]: value } }));
  }, [patchCV]);

  const setSectionTitles = useCallback((titles: SectionTitles) => {
    patchCV((prev) => ({ ...prev, sectionTitles: titles }));
  }, [patchCV]);

  const setOrientation = useCallback((orientation: CVOrientation) => {
    patchCV((prev) => ({ ...prev, orientation }));
  }, [patchCV]);

  const setTheme = useCallback((themeId: string) => {
    patchCV((prev) => ({ ...prev, themeId }));
  }, [patchCV]);

  const setPhoto = useCallback((base64: string | undefined) => {
    patchCV((prev) => ({ ...prev, photo: base64 }));
  }, [patchCV]);

  // Experiences
  const addExperience = useCallback(() => {
    patchCV((prev) => ({
      ...prev,
      experiences: [{ id: crypto.randomUUID(), period: "", title: "New Experience", company: "", location: "", description: "" }, ...prev.experiences],
    }));
  }, [patchCV]);

  const updateExperience = useCallback((id: string, field: keyof ExperienceItem, value: string) => {
    patchCV((prev) => ({
      ...prev,
      experiences: prev.experiences.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    }));
  }, [patchCV]);

  const removeExperience = useCallback((id: string) => {
    patchCV((prev) => ({ ...prev, experiences: prev.experiences.filter((e) => e.id !== id) }));
  }, [patchCV]);

  const reorderExperiences = useCallback((from: number, to: number) => {
    patchCV((prev) => {
      const arr = [...prev.experiences];
      const [moved] = arr.splice(from, 1);
      arr.splice(to, 0, moved);
      return { ...prev, experiences: arr };
    });
  }, [patchCV]);

  // Education
  const addEducation = useCallback(() => {
    patchCV((prev) => ({
      ...prev,
      education: [{ id: crypto.randomUUID(), period: "", degree: "New Degree", institution: "", location: "", description: "" }, ...prev.education],
    }));
  }, [patchCV]);

  const updateEducation = useCallback((id: string, field: keyof EducationItem, value: string) => {
    patchCV((prev) => ({
      ...prev,
      education: prev.education.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    }));
  }, [patchCV]);

  const removeEducation = useCallback((id: string) => {
    patchCV((prev) => ({ ...prev, education: prev.education.filter((e) => e.id !== id) }));
  }, [patchCV]);

  const reorderEducation = useCallback((from: number, to: number) => {
    patchCV((prev) => {
      const arr = [...prev.education];
      const [moved] = arr.splice(from, 1);
      arr.splice(to, 0, moved);
      return { ...prev, education: arr };
    });
  }, [patchCV]);

  // Skills
  const addSkill = useCallback(() => {
    patchCV((prev) => ({ ...prev, skills: [...prev.skills, { id: crypto.randomUUID(), label: "New Skill" }] }));
  }, [patchCV]);

  const updateSkill = useCallback((id: string, label: string) => {
    patchCV((prev) => ({ ...prev, skills: prev.skills.map((s) => (s.id === id ? { ...s, label } : s)) }));
  }, [patchCV]);

  const removeSkill = useCallback((id: string) => {
    patchCV((prev) => ({ ...prev, skills: prev.skills.filter((s) => s.id !== id) }));
  }, [patchCV]);

  // Languages
  const addLanguage = useCallback(() => {
    patchCV((prev) => ({ ...prev, languages: [...prev.languages, { id: crypto.randomUUID(), name: "Language", level: "A1" }] }));
  }, [patchCV]);

  const updateLanguage = useCallback((id: string, field: keyof Language, value: string) => {
    patchCV((prev) => ({ ...prev, languages: prev.languages.map((l) => (l.id === id ? { ...l, [field]: value } : l)) }));
  }, [patchCV]);

  const removeLanguage = useCallback((id: string) => {
    patchCV((prev) => ({ ...prev, languages: prev.languages.filter((l) => l.id !== id) }));
  }, [patchCV]);

  return {
    // Project management
    projects,
    activeId,
    activeProject,
    createProject,
    duplicateProject,
    renameProject,
    deleteProject,
    switchProject,
    // CV state
    cv,
    loadCV,
    resetCV,
    // CV mutations
    updateField,
    updateContact,
    updateSectionTitle,
    setSectionTitles,
    setOrientation,
    setTheme,
    setPhoto,
    addExperience, updateExperience, removeExperience, reorderExperiences,
    addEducation, updateEducation, removeEducation, reorderEducation,
    addSkill, updateSkill, removeSkill,
    addLanguage, updateLanguage, removeLanguage,
  };
}
