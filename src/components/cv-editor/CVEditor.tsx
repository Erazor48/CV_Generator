"use client";

import { useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Printer, Download, Upload, RotateCcw, PanelLeftOpen, PanelLeftClose } from "lucide-react";
import { CVData, ExperienceItem, EducationItem, SectionTitles } from "@/types/cv";
import { PersonalForm } from "./PersonalForm";
import { ExperienceForm } from "./ExperienceForm";
import { EducationForm } from "./EducationForm";
import { SkillsForm } from "./SkillsForm";
import { ThemeForm } from "./ThemeForm";
import { printCV, saveJSON, loadJSON } from "@/lib/cv-export";


interface CVEditorProps {
  cv: CVData;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  updateField: <K extends keyof CVData>(key: K, value: CVData[K]) => void;
  updateContact: (field: keyof CVData["contact"], value: string) => void;
  setPhoto: (base64: string | undefined) => void;
  addExperience: () => void;
  updateExperience: (id: string, field: keyof ExperienceItem, value: string) => void;
  removeExperience: (id: string) => void;
  reorderExperiences: (from: number, to: number) => void;
  addEducation: () => void;
  updateEducation: (id: string, field: keyof EducationItem, value: string) => void;
  removeEducation: (id: string) => void;
  reorderEducation: (from: number, to: number) => void;
  addSkill: () => void;
  updateSkill: (id: string, label: string) => void;
  removeSkill: (id: string) => void;
  addLanguage: () => void;
  updateLanguage: (id: string, field: "name" | "level", value: string) => void;
  removeLanguage: (id: string) => void;
  setTheme: (id: string) => void;
  setOrientation: (o: "portrait" | "landscape") => void;
  updateSectionTitle: (field: keyof SectionTitles, value: string) => void;
  setSectionTitles: (titles: SectionTitles) => void;
  loadCV: (data: CVData) => void;
  resetCV: () => void;
  projectName: string;
}

export function CVEditor(props: CVEditorProps) {
  const { cv, resetCV, loadCV, projectName, sidebarOpen, onToggleSidebar } = props;
  const slug = projectName.replace(/\s+/g, "-").toLowerCase();
  const jsonInputRef = useRef<HTMLInputElement>(null);

  const handleLoadJSON = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = (await loadJSON(file)) as CVData;
      if (!data.name) throw new Error("Invalid");
      loadCV(data);
    } catch {
      alert("Fichier JSON invalide. Assure-toi qu'il a été exporté depuis cet outil.");
    }
    e.target.value = "";
  };

  return (
    <div className="flex flex-col h-full bg-[#0f1e2e] border-r border-slate-800">

      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center gap-1.5 px-3 py-2.5 border-b border-slate-800 bg-[#0d1b2a]">

        {/* Sidebar toggle */}
        <button
          type="button"
          onClick={onToggleSidebar}
          title={sidebarOpen ? "Masquer les projets" : "Afficher les projets"}
          className="cursor-pointer w-7 h-7 flex items-center justify-center rounded text-slate-500 hover:text-slate-200 hover:bg-slate-700 transition-colors duration-150 mr-0.5"
        >
          {sidebarOpen ? <PanelLeftClose size={14} /> : <PanelLeftOpen size={14} />}
        </button>

        <div className="w-px h-4 bg-slate-700 shrink-0" />

        {/* Print */}
        <Button
          type="button"
          size="sm"
          className="h-7 px-2.5 text-xs bg-cyan-600 hover:bg-cyan-500 text-white transition-colors duration-150"
          onClick={() => void printCV("cv-preview-root", cv.orientation)}
        >
          <Printer size={12} className="mr-1" /> PDF
        </Button>

        {/* Save JSON */}
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-7 px-2.5 text-xs hover:bg-slate-700 transition-colors duration-150"
          onClick={() => saveJSON(cv, `${slug}.json`)}
        >
          <Download size={12} className="mr-1" /> JSON
        </Button>

        {/* Load JSON */}
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-7 px-2.5 text-xs hover:bg-slate-700 transition-colors duration-150"
          onClick={() => jsonInputRef.current?.click()}
        >
          <Upload size={12} />
        </Button>
        <input ref={jsonInputRef} type="file" accept=".json" className="hidden" onChange={handleLoadJSON} />

        {/* Reset */}
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="h-7 w-7 p-0 text-slate-500 hover:text-red-400 hover:bg-red-950/20 ml-auto transition-colors duration-150"
          title="Réinitialiser le CV"
          onClick={() => { if (confirm("Réinitialiser ce CV ? Toutes les modifications seront perdues.")) resetCV(); }}
        >
          <RotateCcw size={12} />
        </Button>
      </div>

      {/* ── Tabs ── */}
      <Tabs defaultValue="personal" className="flex flex-col flex-1 overflow-hidden">
        <TabsList className="shrink-0 mx-4 mt-3 mb-0 grid grid-cols-5 bg-slate-800/50">
          <TabsTrigger value="personal"   className="text-xs cursor-pointer">Me</TabsTrigger>
          <TabsTrigger value="experience" className="text-xs cursor-pointer">Exp.</TabsTrigger>
          <TabsTrigger value="education"  className="text-xs cursor-pointer">Edu.</TabsTrigger>
          <TabsTrigger value="skills"     className="text-xs cursor-pointer">Skills</TabsTrigger>
          <TabsTrigger value="style"      className="text-xs cursor-pointer">Style</TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          <TabsContent value="personal" className="mt-0">
            <PersonalForm cv={cv} updateField={props.updateField} updateContact={props.updateContact} setPhoto={props.setPhoto} />
          </TabsContent>
          <TabsContent value="experience" className="mt-0">
            <ExperienceForm cv={cv} addExperience={props.addExperience} updateExperience={props.updateExperience} removeExperience={props.removeExperience} reorderExperiences={props.reorderExperiences} />
          </TabsContent>
          <TabsContent value="education" className="mt-0">
            <EducationForm cv={cv} addEducation={props.addEducation} updateEducation={props.updateEducation} removeEducation={props.removeEducation} reorderEducation={props.reorderEducation} />
          </TabsContent>
          <TabsContent value="skills" className="mt-0">
            <SkillsForm cv={cv} addSkill={props.addSkill} updateSkill={props.updateSkill} removeSkill={props.removeSkill} addLanguage={props.addLanguage} updateLanguage={props.updateLanguage} removeLanguage={props.removeLanguage} />
          </TabsContent>
          <TabsContent value="style" className="mt-0">
            <ThemeForm cv={cv} setTheme={props.setTheme} setOrientation={props.setOrientation} updateSectionTitle={props.updateSectionTitle} setSectionTitles={props.setSectionTitles} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
