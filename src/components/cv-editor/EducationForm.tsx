"use client";

import type { CVData, EducationItem } from "@/types/cv";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";

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
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-widest">
          Education
        </h3>
        <Button type="button" size="sm" variant="outline" onClick={addEducation}>
          <Plus size={13} className="mr-1" /> Add
        </Button>
      </div>

      {cv.education.map((ed) => (
        <div
          key={ed.id}
          className="rounded-lg border border-slate-700 bg-slate-900 p-4 space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium truncate max-w-[200px]">
              {ed.degree || "Untitled"}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-red-400 hover:text-red-300"
              onClick={() => removeEducation(ed.id)}
            >
              <Trash2 size={12} />
            </Button>
          </div>

          <Field label="Period">
            <Input
              value={ed.period}
              placeholder="Sep 2022 - Apr 2024"
              onChange={(e) => updateEducation(ed.id, "period", e.target.value)}
            />
          </Field>

          <Field label="Degree / Program">
            <Input
              value={ed.degree}
              onChange={(e) => updateEducation(ed.id, "degree", e.target.value)}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Institution">
              <Input
                value={ed.institution}
                onChange={(e) => updateEducation(ed.id, "institution", e.target.value)}
              />
            </Field>
            <Field label="Location">
              <Input
                value={ed.location}
                onChange={(e) => updateEducation(ed.id, "location", e.target.value)}
              />
            </Field>
          </div>

          <Field label="Description">
            <Textarea
              rows={3}
              value={ed.description ?? ""}
              onChange={(e) => updateEducation(ed.id, "description", e.target.value)}
              className="resize-none text-sm"
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
