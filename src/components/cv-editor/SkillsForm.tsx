"use client";

import { CVData } from "@/types/cv";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";

interface SkillsFormProps {
  cv: CVData;
  addSkill: () => void;
  updateSkill: (id: string, field: "label" | "category", value: string) => void;
  removeSkill: (id: string) => void;
  addLanguage: () => void;
  updateLanguage: (id: string, field: "name" | "level", value: string) => void;
  removeLanguage: (id: string) => void;
  addExtraSection: () => void;
  updateExtraSectionTitle: (sectionId: string, title: string) => void;
  removeExtraSection: (sectionId: string) => void;
  addExtraItem: (sectionId: string) => void;
  updateExtraItem: (sectionId: string, itemId: string, field: "label" | "sublabel", value: string) => void;
  removeExtraItem: (sectionId: string, itemId: string) => void;
}

export function SkillsForm({
  cv,
  addSkill, updateSkill, removeSkill,
  addLanguage, updateLanguage, removeLanguage,
  addExtraSection, updateExtraSectionTitle, removeExtraSection,
  addExtraItem, updateExtraItem, removeExtraItem,
}: SkillsFormProps) {
  return (
    <div className="space-y-8">

      {/* ── Skills ── */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-widest">Skills</h3>
          <Button type="button" size="sm" variant="outline" onClick={addSkill} className="hover:bg-slate-700 transition-colors duration-150">
            <Plus size={13} className="mr-1" /> Add
          </Button>
        </div>

        <div className="space-y-2">
          {cv.skills.map((skill) => (
            <div key={skill.id} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shrink-0" />
              <Input
                value={skill.category ?? ""}
                placeholder="Category…"
                onChange={(e) => updateSkill(skill.id, "category", e.target.value)}
                className="w-28 h-8 text-xs cursor-text text-slate-400"
              />
              <Input
                value={skill.label}
                placeholder="Skill label…"
                onChange={(e) => updateSkill(skill.id, "label", e.target.value)}
                className="flex-1 h-8 text-sm cursor-text"
              />
              <Button
                type="button" variant="ghost" size="icon"
                className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-950/30 shrink-0 transition-colors duration-150"
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
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-widest">Languages</h3>
          <Button type="button" size="sm" variant="outline" onClick={addLanguage} className="hover:bg-slate-700 transition-colors duration-150">
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
                className="flex-1 h-8 text-sm cursor-text"
              />
              <Input
                value={lang.level}
                placeholder="B1, Native…"
                onChange={(e) => updateLanguage(lang.id, "level", e.target.value)}
                className="w-24 h-8 text-sm cursor-text"
              />
              <Button
                type="button" variant="ghost" size="icon"
                className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-950/30 shrink-0 transition-colors duration-150"
                onClick={() => removeLanguage(lang.id)}
              >
                <Trash2 size={12} />
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* ── Extras (Hackathons / Volunteer / Interests / …) ── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-widest">Activities</h3>
          <Button type="button" size="sm" variant="outline" onClick={addExtraSection} className="hover:bg-slate-700 transition-colors duration-150">
            <Plus size={13} className="mr-1" /> Section
          </Button>
        </div>

        {(cv.extras ?? []).map((section) => (
          <div key={section.id} className="rounded border border-slate-700 p-3 space-y-2">
            {/* Section title row */}
            <div className="flex items-center gap-2">
              <Input
                value={section.title}
                placeholder="Section title…"
                onChange={(e) => updateExtraSectionTitle(section.id, e.target.value)}
                className="flex-1 h-8 text-sm font-semibold cursor-text"
              />
              <Button
                type="button" variant="ghost" size="icon"
                className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-950/30 shrink-0 transition-colors duration-150"
                title="Delete section"
                onClick={() => removeExtraSection(section.id)}
              >
                <Trash2 size={12} />
              </Button>
            </div>

            {/* Items */}
            <div className="space-y-2 pl-1">
              {section.items.map((item) => (
                <div key={item.id} className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-slate-500 shrink-0" />
                    <Input
                      value={item.label}
                      placeholder="Label…"
                      onChange={(e) => updateExtraItem(section.id, item.id, "label", e.target.value)}
                      className="flex-1 h-7 text-xs cursor-text"
                    />
                    <Button
                      type="button" variant="ghost" size="icon"
                      className="h-7 w-7 text-red-400 hover:text-red-300 hover:bg-red-950/30 shrink-0 transition-colors duration-150"
                      onClick={() => removeExtraItem(section.id, item.id)}
                    >
                      <Trash2 size={10} />
                    </Button>
                  </div>
                  <Input
                    value={item.sublabel ?? ""}
                    placeholder="Sublabel (optional)…"
                    onChange={(e) => updateExtraItem(section.id, item.id, "sublabel", e.target.value)}
                    className="h-6 text-[11px] ml-3 cursor-text text-slate-400"
                  />
                </div>
              ))}
            </div>

            <Button
              type="button" size="sm" variant="ghost"
              onClick={() => addExtraItem(section.id)}
              className="h-6 px-2 text-xs text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors duration-150"
            >
              <Plus size={10} className="mr-1" /> Add item
            </Button>
          </div>
        ))}
      </section>

    </div>
  );
}
