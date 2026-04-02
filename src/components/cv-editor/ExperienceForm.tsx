"use client";

import type { CVData, ExperienceItem } from "@/types/cv";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";

interface ExperienceFormProps {
  cv: CVData;
  addExperience: () => void;
  updateExperience: (id: string, field: keyof ExperienceItem, value: string | string[]) => void;
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
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-widest">
          Experiences
        </h3>
        <Button type="button" size="sm" variant="outline" onClick={addExperience}>
          <Plus size={13} className="mr-1" /> Add
        </Button>
      </div>

      {cv.experiences.map((exp, index) => (
        <div
          key={exp.id}
          className="rounded-lg border border-slate-700 bg-slate-900 p-4 space-y-3"
        >
          {/* Controls row */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium truncate max-w-[180px]">
              {exp.title || "Untitled"}
            </span>
            <div className="flex gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                disabled={index === 0}
                onClick={() => reorderExperiences(index, index - 1)}
              >
                <ChevronUp size={12} />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                disabled={index === cv.experiences.length - 1}
                onClick={() => reorderExperiences(index, index + 1)}
              >
                <ChevronDown size={12} />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-red-400 hover:text-red-300"
                onClick={() => removeExperience(exp.id)}
              >
                <Trash2 size={12} />
              </Button>
            </div>
          </div>

          <Field label="Period">
            <Input
              value={exp.period}
              placeholder="Jan 2025 - Apr 2025"
              onChange={(e) => updateExperience(exp.id, "period", e.target.value)}
            />
          </Field>

          <Field label="Title / Role">
            <Input
              value={exp.title}
              onChange={(e) => updateExperience(exp.id, "title", e.target.value)}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Company">
              <Input
                value={exp.company}
                onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
              />
            </Field>
            <Field label="Location">
              <Input
                value={exp.location}
                onChange={(e) => updateExperience(exp.id, "location", e.target.value)}
              />
            </Field>
          </div>

          <Field label="Description (paragraph)">
            <Textarea
              rows={3}
              value={exp.description ?? ""}
              onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
              className="resize-none text-sm"
              placeholder="Optional paragraph..."
            />
          </Field>

          <Field label="Bullet points (one per line)">
            <Textarea
              rows={3}
              value={(exp.bullets ?? []).join("\n")}
              onChange={(e) =>
                updateExperience(
                  exp.id,
                  "bullets",
                  e.target.value.split("\n").filter(Boolean)
                )
              }
              className="resize-none text-sm font-mono"
              placeholder="One bullet per line..."
            />
          </Field>
        </div>
      ))}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-slate-400">{label}</Label>
      {children}
    </div>
  );
}
