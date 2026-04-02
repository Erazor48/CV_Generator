"use client";

import type { CVData } from "@/types/cv";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
//import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";

interface SkillsFormProps {
  cv: CVData;
  addSkill: () => void;
  updateSkill: (id: string, label: string) => void;
  removeSkill: (id: string) => void;
  addLanguage: () => void;
  updateLanguage: (id: string, field: "name" | "level", value: string) => void;
  removeLanguage: (id: string) => void;
}

export function SkillsForm({
  cv,
  addSkill,
  updateSkill,
  removeSkill,
  addLanguage,
  updateLanguage,
  removeLanguage,
}: SkillsFormProps) {
  return (
    <div className="space-y-8">
      {/* ── Skills ── */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-widest">
            Skills
          </h3>
          <Button type="button" size="sm" variant="outline" onClick={addSkill}>
            <Plus size={13} className="mr-1" /> Add
          </Button>
        </div>

        <div className="space-y-2">
          {cv.skills.map((skill) => (
            <div key={skill.id} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shrink-0" />
              <Input
                value={skill.label}
                onChange={(e) => updateSkill(skill.id, e.target.value)}
                className="flex-1 h-8 text-sm"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-red-400 hover:text-red-300 shrink-0"
                onClick={() => removeSkill(skill.id)}
              >
                <Trash2 size={12} />
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* ── Languages ── */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-widest">
            Languages
          </h3>
          <Button type="button" size="sm" variant="outline" onClick={addLanguage}>
            <Plus size={13} className="mr-1" /> Add
          </Button>
        </div>

        <div className="space-y-2">
          {cv.languages.map((lang) => (
            <div key={lang.id} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shrink-0" />
              <Input
                value={lang.name}
                placeholder="Language"
                onChange={(e) => updateLanguage(lang.id, "name", e.target.value)}
                className="flex-1 h-8 text-sm"
              />
              <Input
                value={lang.level}
                placeholder="Level (B1, Native…)"
                onChange={(e) => updateLanguage(lang.id, "level", e.target.value)}
                className="w-28 h-8 text-sm"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-red-400 hover:text-red-300 shrink-0"
                onClick={() => removeLanguage(lang.id)}
              >
                <Trash2 size={12} />
              </Button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
