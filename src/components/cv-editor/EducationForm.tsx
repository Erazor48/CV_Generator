"use client";

import { useState } from "react";
import { CVData, EducationItem } from "@/types/cv";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Pencil, ChevronRight } from "lucide-react";

interface EducationFormProps {
  cv: CVData;
  addEducation: () => void;
  updateEducation: (id: string, field: keyof EducationItem, value: string) => void;
  removeEducation: (id: string) => void;
}

export function EducationForm({
  cv,
  addEducation,
  updateEducation,
  removeEducation,
}: EducationFormProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>(
    () => Object.fromEntries(cv.education.map((e) => [e.id, true]))
  );

  const toggle = (id: string) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-widest">
          Education
        </h3>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={addEducation}
          className="hover:bg-slate-700 transition-colors duration-150"
        >
          <Plus size={13} className="mr-1" /> Add
        </Button>
      </div>

      {cv.education.map((ed) => {
        const isOpen = expanded[ed.id] ?? true;

        return (
          <div
            key={ed.id}
            className="rounded-lg border border-slate-700 bg-slate-900 overflow-hidden"
          >
            {/* ── Card header ── */}
            <div className="flex items-center gap-1 px-3 py-2 bg-slate-800/60">
              <button
                type="button"
                onClick={() => toggle(ed.id)}
                className="flex items-center gap-2 flex-1 min-w-0 text-left cursor-pointer group"
              >
                <ChevronRight
                  size={13}
                  className={`shrink-0 text-slate-400 transition-transform duration-150 ${isOpen ? "rotate-90" : ""}`}
                />
                <span className="text-xs font-medium text-slate-200 truncate group-hover:text-white transition-colors duration-150">
                  {ed.degree || <span className="italic text-slate-500">Untitled</span>}
                </span>
                {ed.period && (
                  <span className="text-xs text-slate-500 shrink-0 hidden sm:inline">
                    {ed.period}
                  </span>
                )}
                <Pencil size={10} className="shrink-0 text-slate-600 group-hover:text-slate-400 transition-colors duration-150" />
              </button>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-colors duration-150 shrink-0"
                onClick={() => removeEducation(ed.id)}
                title="Delete"
              >
                <Trash2 size={12} />
              </Button>
            </div>

            {/* ── Expandable fields ── */}
            {isOpen && (
              <div className="px-4 py-3 space-y-3 border-t border-slate-700/50">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-slate-400">Period</Label>
                    <Input
                      value={ed.period}
                      placeholder="Sep 2022 - Apr 2024"
                      onChange={(e) => updateEducation(ed.id, "period", e.target.value)}
                      className="h-8 text-xs cursor-text"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-slate-400">Degree / Program</Label>
                    <Input
                      value={ed.degree}
                      placeholder="Master IA"
                      onChange={(e) => updateEducation(ed.id, "degree", e.target.value)}
                      className="h-8 text-xs cursor-text"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-slate-400">Institution</Label>
                    <Input
                      value={ed.institution}
                      placeholder="Aivancity"
                      onChange={(e) => updateEducation(ed.id, "institution", e.target.value)}
                      className="h-8 text-xs cursor-text"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-slate-400">Location</Label>
                    <Input
                      value={ed.location}
                      placeholder="Cachan (94), France"
                      onChange={(e) => updateEducation(ed.id, "location", e.target.value)}
                      className="h-8 text-xs cursor-text"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs text-slate-400">
                    Description{" "}
                    <span className="text-slate-600 font-normal">
                      — lignes avec <code className="bg-slate-800 px-1 rounded">-</code> → points •
                    </span>
                  </Label>
                  <Textarea
                    rows={4}
                    value={ed.description ?? ""}
                    onChange={(e) => updateEducation(ed.id, "description", e.target.value)}
                    className="resize-none text-xs font-mono cursor-text leading-relaxed"
                    placeholder={"5-year Grande Ecole program.\n- Data & AI\n- Law and Ethics"}
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
