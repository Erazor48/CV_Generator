"use client";

import { useState } from "react";
import { CVData, ProjectItem } from "@/types/cv";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, ChevronUp, ChevronDown, Pencil, ChevronRight } from "lucide-react";

interface ProjectsFormProps {
  cv: CVData;
  addProject: () => void;
  updateProject: (id: string, field: keyof ProjectItem, value: string) => void;
  removeProject: (id: string) => void;
  reorderProjects: (from: number, to: number) => void;
}

export function ProjectsForm({
  cv,
  addProject,
  updateProject,
  removeProject,
  reorderProjects,
}: ProjectsFormProps) {
  const projects = cv.projects ?? [];

  const [expanded, setExpanded] = useState<Record<string, boolean>>(
    () => Object.fromEntries(projects.map((p) => [p.id, true]))
  );

  const toggle = (id: string) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleAdd = () => {
    addProject();
    setTimeout(() => {
      setExpanded((prev) => {
        const updated = { ...prev };
        projects.forEach((p) => { updated[p.id] = updated[p.id] ?? true; });
        return updated;
      });
    }, 50);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-widest">
          Projects
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

      {projects.map((proj, index) => {
        const isOpen = expanded[proj.id] ?? true;

        return (
          <div
            key={proj.id}
            className="rounded-lg border border-slate-700 bg-slate-900 overflow-hidden"
          >
            {/* Card header */}
            <div className="flex items-center gap-1 px-3 py-2 bg-slate-800/60">
              <button
                type="button"
                onClick={() => toggle(proj.id)}
                className="flex items-center gap-2 flex-1 min-w-0 text-left cursor-pointer group"
              >
                <ChevronRight
                  size={13}
                  className={`shrink-0 text-slate-400 transition-transform duration-150 ${isOpen ? "rotate-90" : ""}`}
                />
                <span className="text-xs font-medium text-slate-200 truncate group-hover:text-white transition-colors duration-150">
                  {proj.name || <span className="italic text-slate-500">Untitled</span>}
                </span>
                {proj.period && (
                  <span className="text-xs text-slate-500 shrink-0 hidden sm:inline">
                    {proj.period}
                  </span>
                )}
                <Pencil size={10} className="shrink-0 text-slate-600 group-hover:text-slate-400 transition-colors duration-150" />
              </button>

              <div className="flex gap-0.5 shrink-0">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 hover:bg-slate-700 transition-colors duration-150 disabled:opacity-30"
                  disabled={index === 0}
                  onClick={() => reorderProjects(index, index - 1)}
                  title="Move up"
                >
                  <ChevronUp size={12} />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 hover:bg-slate-700 transition-colors duration-150 disabled:opacity-30"
                  disabled={index === projects.length - 1}
                  onClick={() => reorderProjects(index, index + 1)}
                  title="Move down"
                >
                  <ChevronDown size={12} />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-colors duration-150"
                  onClick={() => removeProject(proj.id)}
                  title="Delete"
                >
                  <Trash2 size={12} />
                </Button>
              </div>
            </div>

            {/* Expandable fields */}
            {isOpen && (
              <div className="px-4 py-3 space-y-3 border-t border-slate-700/50">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-slate-400">Name</Label>
                    <Input
                      value={proj.name}
                      placeholder="My Project"
                      onChange={(e) => updateProject(proj.id, "name", e.target.value)}
                      className="h-8 text-xs cursor-text"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-slate-400">Period</Label>
                    <Input
                      value={proj.period ?? ""}
                      placeholder="2025"
                      onChange={(e) => updateProject(proj.id, "period", e.target.value)}
                      className="h-8 text-xs cursor-text"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs text-slate-400">URL</Label>
                  <Input
                    value={proj.url ?? ""}
                    placeholder="github.com/user/repo"
                    onChange={(e) => updateProject(proj.id, "url", e.target.value)}
                    className="h-8 text-xs cursor-text font-mono"
                  />
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
                    value={proj.description ?? ""}
                    onChange={(e) => updateProject(proj.id, "description", e.target.value)}
                    className="resize-none text-xs font-mono cursor-text leading-relaxed"
                    placeholder={"- Built with Next.js and TypeScript\n- Deployed on Vercel"}
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}

      {projects.length === 0 && (
        <p className="text-xs text-slate-600 italic text-center py-4">
          No projects yet. Click Add to get started.
        </p>
      )}
    </div>
  );
}
