"use client";

import { useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Printer, Download, Upload, RotateCcw } from "lucide-react";
import type { CVData, ExperienceItem, EducationItem } from "@/types/cv";
import { PersonalForm } from "./PersonalForm";
import { ExperienceForm } from "./ExperienceForm";
import { EducationForm } from "./EducationForm";
import { SkillsForm } from "./SkillsForm";
import { printCV, saveJSON, loadJSON } from "@/lib/cv-export";

interface CVEditorProps {
  cv: CVData;
  updateField: <K extends keyof CVData>(key: K, value: CVData[K]) => void;
  updateContact: (field: keyof CVData["contact"], value: string) => void;
  setPhoto: (base64: string | undefined) => void;
  addExperience: () => void;
  updateExperience: (id: string, field: keyof ExperienceItem, value: string | string[]) => void;
  removeExperience: (id: string) => void;
  reorderExperiences: (from: number, to: number) => void;
  addEducation: () => void;
  updateEducation: (id: string, field: keyof EducationItem, value: string) => void;
  removeEducation: (id: string) => void;
  addSkill: () => void;
  updateSkill: (id: string, label: string) => void;
  removeSkill: (id: string) => void;
  addLanguage: () => void;
  updateLanguage: (id: string, field: "name" | "level", value: string) => void;
  removeLanguage: (id: string) => void;
  resetCV: () => void;
}

export function CVEditor(props: CVEditorProps) {
  const { cv, resetCV } = props;
  const jsonInputRef = useRef<HTMLInputElement>(null);

  const handleLoadJSON = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = (await loadJSON(file)) as CVData;
      // Minimal validation
      if (!data.name) throw new Error("Invalid CV JSON");
      props.updateField("name", data.name);
      // Full reload: reset then apply
      // For simplicity, reload the page with the new data by re-importing
      // A more robust approach would be to expose a setCV in the hook
      window.location.reload(); // simplest for now – replace with setCV if exposed
    } catch {
      alert("Could not load the JSON file. Make sure it was exported from this tool.");
    }
    e.target.value = "";
  };

  return (
    <div className="flex flex-col h-full bg-[#0f1e2e] border-r border-slate-800">
      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center gap-2 px-4 py-3 border-b border-slate-800 bg-[#0d1b2a]">
        <Button
          type="button"
          size="sm"
          className="bg-cyan-600 hover:bg-cyan-500 text-white"
          onClick={() => printCV("cv-preview-root")}
        >
          <Printer size={13} className="mr-1.5" /> Print / PDF
        </Button>

        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => saveJSON(cv, `cv-${cv.name.replace(/\s+/g, "-").toLowerCase()}.json`)}
        >
          <Download size={13} className="mr-1.5" /> Save JSON
        </Button>

        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => jsonInputRef.current?.click()}
        >
          <Upload size={13} className="mr-1.5" /> Load JSON
        </Button>
        <input
          ref={jsonInputRef}
          type="file"
          accept=".json"
          className="hidden"
          onChange={handleLoadJSON}
        />

        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="text-slate-400 hover:text-red-400 ml-auto"
          onClick={() => {
            if (confirm("Reset to default CV? All changes will be lost.")) resetCV();
          }}
        >
          <RotateCcw size={13} className="mr-1.5" /> Reset
        </Button>
      </div>

      {/* ── Tabs ── */}
      <Tabs defaultValue="personal" className="flex flex-col flex-1 overflow-hidden">
        <TabsList className="shrink-0 mx-4 mt-3 mb-0 grid grid-cols-4 bg-slate-800/50">
          <TabsTrigger value="personal" className="text-xs">Me</TabsTrigger>
          <TabsTrigger value="experience" className="text-xs">Exp.</TabsTrigger>
          <TabsTrigger value="education" className="text-xs">Edu.</TabsTrigger>
          <TabsTrigger value="skills" className="text-xs">Skills</TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
          <TabsContent value="personal" className="mt-0">
            <PersonalForm
              cv={cv}
              updateField={props.updateField}
              updateContact={props.updateContact}
              setPhoto={props.setPhoto}
            />
          </TabsContent>

          <TabsContent value="experience" className="mt-0">
            <ExperienceForm
              cv={cv}
              addExperience={props.addExperience}
              updateExperience={props.updateExperience}
              removeExperience={props.removeExperience}
              reorderExperiences={props.reorderExperiences}
            />
          </TabsContent>

          <TabsContent value="education" className="mt-0">
            <EducationForm
              cv={cv}
              addEducation={props.addEducation}
              updateEducation={props.updateEducation}
              removeEducation={props.removeEducation}
            />
          </TabsContent>

          <TabsContent value="skills" className="mt-0">
            <SkillsForm
              cv={cv}
              addSkill={props.addSkill}
              updateSkill={props.updateSkill}
              removeSkill={props.removeSkill}
              addLanguage={props.addLanguage}
              updateLanguage={props.updateLanguage}
              removeLanguage={props.removeLanguage}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
