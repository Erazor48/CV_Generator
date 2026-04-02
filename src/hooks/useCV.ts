"use client";

import { useState, useCallback } from "react";
import type { CVData, ExperienceItem, EducationItem, Skill, Language } from "@/types/cv";
import { defaultCV } from "@/data/cv-default";

export function useCV() {
  const [cv, setCV] = useState<CVData>(defaultCV);

  // ── Generic field updater ──────────────────────────────────────────────────
  const updateField = useCallback(<K extends keyof CVData>(key: K, value: CVData[K]) => {
    setCV((prev) => ({ ...prev, [key]: value }));
  }, []);

  const updateContact = useCallback(
    (field: keyof CVData["contact"], value: string) => {
      setCV((prev) => ({ ...prev, contact: { ...prev.contact, [field]: value } }));
    },
    []
  );

  // ── Experiences ────────────────────────────────────────────────────────────
  const addExperience = useCallback(() => {
    const newExp: ExperienceItem = {
      id: crypto.randomUUID(),
      period: "",
      title: "New Experience",
      company: "",
      location: "",
    };
    setCV((prev) => ({ ...prev, experiences: [newExp, ...prev.experiences] }));
  }, []);

  const updateExperience = useCallback(
    (id: string, field: keyof ExperienceItem, value: string | string[]) => {
      setCV((prev) => ({
        ...prev,
        experiences: prev.experiences.map((e) =>
          e.id === id ? { ...e, [field]: value } : e
        ),
      }));
    },
    []
  );

  const removeExperience = useCallback((id: string) => {
    setCV((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((e) => e.id !== id),
    }));
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
    const newEd: EducationItem = {
      id: crypto.randomUUID(),
      period: "",
      degree: "New Degree",
      institution: "",
      location: "",
    };
    setCV((prev) => ({ ...prev, education: [newEd, ...prev.education] }));
  }, []);

  const updateEducation = useCallback(
    (id: string, field: keyof EducationItem, value: string) => {
      setCV((prev) => ({
        ...prev,
        education: prev.education.map((e) =>
          e.id === id ? { ...e, [field]: value } : e
        ),
      }));
    },
    []
  );

  const removeEducation = useCallback((id: string) => {
    setCV((prev) => ({
      ...prev,
      education: prev.education.filter((e) => e.id !== id),
    }));
  }, []);

  // ── Skills ─────────────────────────────────────────────────────────────────
  const addSkill = useCallback(() => {
    const newSkill: Skill = { id: crypto.randomUUID(), label: "New Skill" };
    setCV((prev) => ({ ...prev, skills: [...prev.skills, newSkill] }));
  }, []);

  const updateSkill = useCallback((id: string, label: string) => {
    setCV((prev) => ({
      ...prev,
      skills: prev.skills.map((s) => (s.id === id ? { ...s, label } : s)),
    }));
  }, []);

  const removeSkill = useCallback((id: string) => {
    setCV((prev) => ({ ...prev, skills: prev.skills.filter((s) => s.id !== id) }));
  }, []);

  // ── Languages ─────────────────────────────────────────────────────────────
  const addLanguage = useCallback(() => {
    const newLang: Language = { id: crypto.randomUUID(), name: "Language", level: "A1" };
    setCV((prev) => ({ ...prev, languages: [...prev.languages, newLang] }));
  }, []);

  const updateLanguage = useCallback(
    (id: string, field: keyof Language, value: string) => {
      setCV((prev) => ({
        ...prev,
        languages: prev.languages.map((l) => (l.id === id ? { ...l, [field]: value } : l)),
      }));
    },
    []
  );

  const removeLanguage = useCallback((id: string) => {
    setCV((prev) => ({
      ...prev,
      languages: prev.languages.filter((l) => l.id !== id),
    }));
  }, []);

  // ── Photo ─────────────────────────────────────────────────────────────────
  const setPhoto = useCallback((base64: string | undefined) => {
    setCV((prev) => ({ ...prev, photo: base64 }));
  }, []);

  // ── Reset ─────────────────────────────────────────────────────────────────
  const resetCV = useCallback(() => setCV(defaultCV), []);

  return {
    cv,
    updateField,
    updateContact,
    // experiences
    addExperience,
    updateExperience,
    removeExperience,
    reorderExperiences,
    // education
    addEducation,
    updateEducation,
    removeEducation,
    // skills
    addSkill,
    updateSkill,
    removeSkill,
    // languages
    addLanguage,
    updateLanguage,
    removeLanguage,
    // photo
    setPhoto,
    // reset
    resetCV,
  };
}
