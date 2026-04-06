"use client";

import { useState, useCallback } from "react";
import {
  CVData, CVOrientation,
  ExperienceItem, EducationItem,
  Language, SectionTitles,
} from "@/types/cv";
import { defaultCV } from "@/data/cv-default";

export function useCV() {
  const [cv, setCV] = useState<CVData>(defaultCV);

  const updateField = useCallback(<K extends keyof CVData>(key: K, value: CVData[K]) => {
    setCV((prev) => ({ ...prev, [key]: value }));
  }, []);

  const updateContact = useCallback((field: keyof CVData["contact"], value: string) => {
    setCV((prev) => ({ ...prev, contact: { ...prev.contact, [field]: value } }));
  }, []);

  const updateSectionTitle = useCallback((field: keyof SectionTitles, value: string) => {
    setCV((prev) => ({ ...prev, sectionTitles: { ...prev.sectionTitles, [field]: value } }));
  }, []);

  const setSectionTitles = useCallback((titles: SectionTitles) => {
    setCV((prev) => ({ ...prev, sectionTitles: titles }));
  }, []);

  const setOrientation = useCallback((orientation: CVOrientation) => {
    setCV((prev) => ({ ...prev, orientation }));
  }, []);

  const setTheme = useCallback((themeId: string) => {
    setCV((prev) => ({ ...prev, themeId }));
  }, []);

  // ── Experiences ────────────────────────────────────────────────────────────
  const addExperience = useCallback(() => {
    const newExp: ExperienceItem = { id: crypto.randomUUID(), period: "", title: "New Experience", company: "", location: "", description: "" };
    setCV((prev) => ({ ...prev, experiences: [newExp, ...prev.experiences] }));
  }, []);

  const updateExperience = useCallback((id: string, field: keyof ExperienceItem, value: string) => {
    setCV((prev) => ({ ...prev, experiences: prev.experiences.map((e) => (e.id === id ? { ...e, [field]: value } : e)) }));
  }, []);

  const removeExperience = useCallback((id: string) => {
    setCV((prev) => ({ ...prev, experiences: prev.experiences.filter((e) => e.id !== id) }));
  }, []);

  const reorderExperiences = useCallback((from: number, to: number) => {
    setCV((prev) => {
      const arr = [...prev.experiences];
      const [moved] = arr.splice(from, 1);
      arr.splice(to, 0, moved);
      return { ...prev, experiences: arr };
    });
  }, []);

  // ── Education ──────────────────────────────────────────────────────────────
  const addEducation = useCallback(() => {
    const newEd: EducationItem = { id: crypto.randomUUID(), period: "", degree: "New Degree", institution: "", location: "", description: "" };
    setCV((prev) => ({ ...prev, education: [newEd, ...prev.education] }));
  }, []);

  const updateEducation = useCallback((id: string, field: keyof EducationItem, value: string) => {
    setCV((prev) => ({ ...prev, education: prev.education.map((e) => (e.id === id ? { ...e, [field]: value } : e)) }));
  }, []);

  const removeEducation = useCallback((id: string) => {
    setCV((prev) => ({ ...prev, education: prev.education.filter((e) => e.id !== id) }));
  }, []);

  const reorderEducation = useCallback((from: number, to: number) => {
    setCV((prev) => {
      const arr = [...prev.education];
      const [moved] = arr.splice(from, 1);
      arr.splice(to, 0, moved);
      return { ...prev, education: arr };
    });
  }, []);

  // ── Skills ─────────────────────────────────────────────────────────────────
  const addSkill = useCallback(() => {
    setCV((prev) => ({ ...prev, skills: [...prev.skills, { id: crypto.randomUUID(), label: "New Skill" }] }));
  }, []);

  const updateSkill = useCallback((id: string, label: string) => {
    setCV((prev) => ({ ...prev, skills: prev.skills.map((s) => (s.id === id ? { ...s, label } : s)) }));
  }, []);

  const removeSkill = useCallback((id: string) => {
    setCV((prev) => ({ ...prev, skills: prev.skills.filter((s) => s.id !== id) }));
  }, []);

  // ── Languages ─────────────────────────────────────────────────────────────
  const addLanguage = useCallback(() => {
    setCV((prev) => ({ ...prev, languages: [...prev.languages, { id: crypto.randomUUID(), name: "Language", level: "A1" }] }));
  }, []);

  const updateLanguage = useCallback((id: string, field: keyof Language, value: string) => {
    setCV((prev) => ({ ...prev, languages: prev.languages.map((l) => (l.id === id ? { ...l, [field]: value } : l)) }));
  }, []);

  const removeLanguage = useCallback((id: string) => {
    setCV((prev) => ({ ...prev, languages: prev.languages.filter((l) => l.id !== id) }));
  }, []);

  // ── Photo ─────────────────────────────────────────────────────────────────
  const setPhoto = useCallback((base64: string | undefined) => {
    setCV((prev) => ({ ...prev, photo: base64 }));
  }, []);

  // ── Full replace ──────────────────────────────────────────────────────────
  const loadCV = useCallback((data: CVData) => { setCV(data); }, []);
  const resetCV = useCallback(() => setCV(defaultCV), []);

  return {
    cv,
    updateField, updateContact,
    updateSectionTitle, setSectionTitles,
    setOrientation, setTheme,
    addExperience, updateExperience, removeExperience, reorderExperiences,
    addEducation, updateEducation, removeEducation, reorderEducation,
    addSkill, updateSkill, removeSkill,
    addLanguage, updateLanguage, removeLanguage,
    setPhoto, loadCV, resetCV,
  };
}
