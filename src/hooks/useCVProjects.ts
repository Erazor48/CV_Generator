"use client";

import { useState, useCallback, useEffect } from "react";
import {
  CVData, CVOrientation,
  ExperienceItem, EducationItem,
  Language, SectionTitles,
} from "@/types/cv";
import { CVProject } from "@/types/project";
import { defaultCV } from "@/data/cv-default";

const STORAGE_KEY = "cv-generator-projects";
const ACTIVE_KEY  = "cv-generator-active-id";

function loadFromStorage(): CVProject[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CVProject[];
  } catch { return []; }
}

function saveToStorage(projects: CVProject[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(projects)); }
  catch { console.warn("[useCVProjects] localStorage write failed"); }
}

function loadActiveId(): string | null {
  try { return localStorage.getItem(ACTIVE_KEY); }
  catch { return null; }
}

function saveActiveId(id: string) {
  try { localStorage.setItem(ACTIVE_KEY, id); }
  catch {}
}

function makeDefaultProject(): CVProject {
  return {
    id: crypto.randomUUID(),
    name: "Mon CV",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    data: { ...defaultCV },
  };
}

export function useCVProjects() {
  // Start with empty state — no localStorage access during SSR
  const [projects, setProjects] = useState<CVProject[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage after mount (client only)
  useEffect(() => {
    const stored = loadFromStorage();
    if (stored.length > 0) {
      const savedActiveId = loadActiveId();
      const resolvedActiveId = stored.find((p) => p.id === savedActiveId)
        ? savedActiveId!
        : stored[0].id;
      setProjects(stored);
      setActiveId(resolvedActiveId);
    } else {
      const first = makeDefaultProject();
      setProjects([first]);
      setActiveId(first.id);
    }
    setHydrated(true);
  }, []);

  // Auto-save whenever projects change (after hydration to avoid overwriting with empty)
  useEffect(() => {
    if (!hydrated) return;
    saveToStorage(projects);
  }, [projects, hydrated]);

  useEffect(() => {
    if (!hydrated || !activeId) return;
    saveActiveId(activeId);
  }, [activeId, hydrated]);

  // Derive active project — safe fallback
  const activeProject = projects.find((p) => p.id === activeId) ?? projects[0] ?? makeDefaultProject();
  const cv = activeProject?.data ?? defaultCV;

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
    const p: CVProject = {
      id: crypto.randomUUID(),
      name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      data: { ...defaultCV },
    };
    setProjects((prev) => [p, ...prev]);
    setActiveId(p.id);
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
        data: JSON.parse(JSON.stringify(source.data)),
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
      if (prev.length <= 1) return prev;
      const next = prev.filter((p) => p.id !== id);
      setActiveId((cur) => (cur === id ? next[0].id : cur));
      return next;
    });
  }, []);

  const switchProject = useCallback((id: string) => setActiveId(id), []);
  const loadCV = useCallback((data: CVData) => { patchCV(() => data); }, [patchCV]);
  const resetCV = useCallback(() => { patchCV(() => ({ ...defaultCV })); }, [patchCV]);

  // ── CV mutations ──────────────────────────────────────────────────────────
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

  const setOrientation = useCallback((o: CVOrientation) => {
    patchCV((prev) => ({ ...prev, orientation: o }));
  }, [patchCV]);

  const setTheme = useCallback((themeId: string) => {
    patchCV((prev) => ({ ...prev, themeId }));
  }, [patchCV]);

  const setPhoto = useCallback((base64: string | undefined) => {
    patchCV((prev) => ({ ...prev, photo: base64 }));
  }, [patchCV]);

  const addExperience = useCallback(() => {
    patchCV((prev) => ({
      ...prev,
      experiences: [{ id: crypto.randomUUID(), period: "", title: "New Experience", company: "", location: "", description: "" }, ...prev.experiences],
    }));
  }, [patchCV]);

  const updateExperience = useCallback((id: string, field: keyof ExperienceItem, value: string) => {
    patchCV((prev) => ({ ...prev, experiences: prev.experiences.map((e) => (e.id === id ? { ...e, [field]: value } : e)) }));
  }, [patchCV]);

  const removeExperience = useCallback((id: string) => {
    patchCV((prev) => ({ ...prev, experiences: prev.experiences.filter((e) => e.id !== id) }));
  }, [patchCV]);

  const reorderExperiences = useCallback((from: number, to: number) => {
    patchCV((prev) => {
      const arr = [...prev.experiences];
      const [m] = arr.splice(from, 1);
      arr.splice(to, 0, m);
      return { ...prev, experiences: arr };
    });
  }, [patchCV]);

  const addEducation = useCallback(() => {
    patchCV((prev) => ({
      ...prev,
      education: [{ id: crypto.randomUUID(), period: "", degree: "New Degree", institution: "", location: "", description: "" }, ...prev.education],
    }));
  }, [patchCV]);

  const updateEducation = useCallback((id: string, field: keyof EducationItem, value: string) => {
    patchCV((prev) => ({ ...prev, education: prev.education.map((e) => (e.id === id ? { ...e, [field]: value } : e)) }));
  }, [patchCV]);

  const removeEducation = useCallback((id: string) => {
    patchCV((prev) => ({ ...prev, education: prev.education.filter((e) => e.id !== id) }));
  }, [patchCV]);

  const reorderEducation = useCallback((from: number, to: number) => {
    patchCV((prev) => {
      const arr = [...prev.education];
      const [m] = arr.splice(from, 1);
      arr.splice(to, 0, m);
      return { ...prev, education: arr };
    });
  }, [patchCV]);

  const addSkill = useCallback(() => {
    patchCV((prev) => ({ ...prev, skills: [...prev.skills, { id: crypto.randomUUID(), label: "New Skill" }] }));
  }, [patchCV]);

  const updateSkill = useCallback((id: string, label: string) => {
    patchCV((prev) => ({ ...prev, skills: prev.skills.map((s) => (s.id === id ? { ...s, label } : s)) }));
  }, [patchCV]);

  const removeSkill = useCallback((id: string) => {
    patchCV((prev) => ({ ...prev, skills: prev.skills.filter((s) => s.id !== id) }));
  }, [patchCV]);

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
    hydrated,
    projects, activeId, activeProject, cv,
    createProject, duplicateProject, renameProject, deleteProject, switchProject,
    loadCV, resetCV,
    updateField, updateContact, updateSectionTitle, setSectionTitles,
    setOrientation, setTheme, setPhoto,
    addExperience, updateExperience, removeExperience, reorderExperiences,
    addEducation, updateEducation, removeEducation, reorderEducation,
    addSkill, updateSkill, removeSkill,
    addLanguage, updateLanguage, removeLanguage,
  };
}
