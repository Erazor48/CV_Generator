"use client";

import { useState } from "react";
import { CVData, ExperienceItem } from "@/types/cv";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, ChevronUp, ChevronDown, Pencil, ChevronRight } from "lucide-react";

interface ExperienceFormProps {
  cv: CVData;
  addExperience: () => void;
  updateExperience: (id: string, field: keyof ExperienceItem, value: string) => void;
  removeExperience: (id: string) => void;
  reorderExperiences: (from: number, to: number) => void;
}

export function ExperienceForm({
  cv,
  addExperience,
  updateExperience,
  removeExperience,
  reorderExperiences,
}: ExperienceFormProps) {
  // Track which cards are expanded — default: all open so user can edit immediately
  const [expanded, setExpanded] = useState<Record<string, boolean>>(
    () => Object.fromEntries(cv.experiences.map((e) => [e.id, true]))
  );

  const toggle = (id: string) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleAdd = () => {
    addExperience();
    // New items should open immediately
    // We don't have the id yet; the new item lands at index 0 after state update.
    // We open all as a safe fallback after next render via a short delay.
    setTimeout(() => {
      setExpanded((prev) => {
        const updated = { ...prev };
        cv.experiences.forEach((e) => { updated[e.id] = updated[e.id] ?? true; });
        return updated;
      });
    }, 50);
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-widest">
          Experiences
        </h3>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={handleAdd}
          className="hover:bg-slate-700 transition-colors duration-150"
        >
          <Plus size={13} className="mr-1" /> Add
        </Button>
      </div>

      {cv.experiences.map((exp, index) => {
        const isOpen = expanded[exp.id] ?? true;

        return (
          <div
            key={exp.id}
            className="rounded-lg border border-slate-700 bg-slate-900 overflow-hidden"
          >
            {/* ── Card header (always visible) ── */}
            <div className="flex items-center gap-1 px-3 py-2 bg-slate-800/60">
              {/* Expand toggle */}
              <button
                type="button"
                onClick={() => toggle(exp.id)}
                className="flex items-center gap-2 flex-1 min-w-0 text-left cursor-pointer group"
              >
                <ChevronRight
                  size={13}
                  className={`shrink-0 text-slate-400 transition-transform duration-150 ${isOpen ? "rotate-90" : ""}`}
                />
                <span className="text-xs font-medium text-slate-200 truncate group-hover:text-white transition-colors duration-150">
                  {exp.title || <span className="italic text-slate-500">Untitled</span>}
                </span>
                {exp.period && (
                  <span className="text-xs text-slate-500 shrink-0 hidden sm:inline">
                    {exp.period}
                  </span>
                )}
                <Pencil size={10} className="shrink-0 text-slate-600 group-hover:text-slate-400 transition-colors duration-150" />
              </button>

              {/* Reorder + delete */}
              <div className="flex gap-0.5 shrink-0">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 hover:bg-slate-700 transition-colors duration-150 disabled:opacity-30"
                  disabled={index === 0}
                  onClick={() => reorderExperiences(index, index - 1)}
                  title="Move up"
                >
                  <ChevronUp size={12} />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 hover:bg-slate-700 transition-colors duration-150 disabled:opacity-30"
                  disabled={index === cv.experiences.length - 1}
                  onClick={() => reorderExperiences(index, index + 1)}
                  title="Move down"
                >
                  <ChevronDown size={12} />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-colors duration-150"
                  onClick={() => removeExperience(exp.id)}
                  title="Delete"
                >
                  <Trash2 size={12} />
                </Button>
              </div>
            </div>

            {/* ── Expandable fields ── */}
            {isOpen && (
              <div className="px-4 py-3 space-y-3 border-t border-slate-700/50">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-slate-400">Period</Label>
                    <Input
                      value={exp.period}
                      placeholder="Jan 2025 - Apr 2025"
                      onChange={(e) => updateExperience(exp.id, "period", e.target.value)}
                      className="h-8 text-xs cursor-text"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-slate-400">Title / Role</Label>
                    <Input
                      value={exp.title}
                      placeholder="Clinical Project"
                      onChange={(e) => updateExperience(exp.id, "title", e.target.value)}
                      className="h-8 text-xs cursor-text"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-slate-400">Company</Label>
                    <Input
                      value={exp.company}
                      placeholder="Aivancity"
                      onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                      className="h-8 text-xs cursor-text"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-slate-400">Location</Label>
                    <Input
                      value={exp.location}
                      placeholder="Cachan (94), France"
                      onChange={(e) => updateExperience(exp.id, "location", e.target.value)}
                      className="h-8 text-xs cursor-text"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs text-slate-400">
                    Description{" "}
                    <span className="text-slate-600 font-normal">
                      — lines starting with <code className="bg-slate-800 px-1 rounded">-</code> become bullet points •
                    </span>
                  </Label>
                  <Textarea
                    rows={4}
                    value={exp.description ?? ""}
                    onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                    className="resize-none text-xs font-mono cursor-text leading-relaxed"
                    placeholder={"Some paragraph text...\n- Bullet point one\n- Bullet point two"}
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
