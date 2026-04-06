"use client";

import { useState, useRef, useEffect } from "react";
import { CVProject } from "@/types/project";
import { Button } from "@/components/ui/button";
import { Plus, Copy, Trash2, Pencil, Check, X, FileText } from "lucide-react";

interface ProjectPanelProps {
  projects: CVProject[];
  activeId: string;
  onSwitch: (id: string) => void;
  onCreate: () => void;
  onDuplicate: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
}

export function ProjectPanel({
  projects,
  activeId,
  onSwitch,
  onCreate,
  onDuplicate,
  onRename,
  onDelete,
}: ProjectPanelProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when entering edit mode
  useEffect(() => {
    if (editingId) inputRef.current?.focus();
  }, [editingId]);

  const startEdit = (project: CVProject) => {
    setEditingId(project.id);
    setEditValue(project.name);
  };

  const commitEdit = () => {
    if (editingId && editValue.trim()) {
      onRename(editingId, editValue.trim());
    }
    setEditingId(null);
  };

  const cancelEdit = () => setEditingId(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") commitEdit();
    if (e.key === "Escape") cancelEdit();
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "2-digit" });
  };

  return (
    <div className="flex flex-col h-full bg-[#090f19] border-r border-slate-800/80">
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-3 py-3 border-b border-slate-800">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
          Mes CVs
        </span>
        <button
          type="button"
          onClick={onCreate}
          title="Nouveau CV"
          className="cursor-pointer w-6 h-6 flex items-center justify-center rounded text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors duration-150"
        >
          <Plus size={14} />
        </button>
      </div>

      {/* ── Project list ── */}
      <ul className="flex-1 overflow-y-auto py-1">
        {projects.map((project) => {
          const isActive   = project.id === activeId;
          const isEditing  = editingId === project.id;

          return (
            <li key={project.id}>
              <div
                className={`
                  group relative flex flex-col px-3 py-2.5 cursor-pointer
                  transition-colors duration-150
                  ${isActive
                    ? "bg-slate-800/70 border-l-2 border-cyan-500"
                    : "border-l-2 border-transparent hover:bg-slate-800/40 hover:border-slate-600"
                  }
                `}
                onClick={() => !isEditing && onSwitch(project.id)}
              >
                {/* Icon + name */}
                <div className="flex items-start gap-2">
                  <FileText
                    size={13}
                    className={`shrink-0 mt-0.5 ${isActive ? "text-cyan-400" : "text-slate-600 group-hover:text-slate-400"} transition-colors duration-150`}
                  />

                  {isEditing ? (
                    <div className="flex items-center gap-1 flex-1" onClick={(e) => e.stopPropagation()}>
                      <input
                        ref={inputRef}
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 min-w-0 bg-slate-700 border border-cyan-600 rounded px-1.5 py-0.5 text-xs text-white outline-none"
                      />
                      <button type="button" onClick={commitEdit} className="cursor-pointer text-cyan-400 hover:text-cyan-300 transition-colors duration-150">
                        <Check size={12} />
                      </button>
                      <button type="button" onClick={cancelEdit} className="cursor-pointer text-slate-500 hover:text-slate-300 transition-colors duration-150">
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <span
                      className={`text-xs leading-snug break-words ${isActive ? "text-white font-medium" : "text-slate-400 group-hover:text-slate-200"} transition-colors duration-150`}
                    >
                      {project.name}
                    </span>
                  )}
                </div>

                {/* Date */}
                {!isEditing && (
                  <span className="text-[10px] text-slate-600 mt-0.5 pl-5">
                    {formatDate(project.updatedAt)}
                  </span>
                )}

                {/* Action buttons — visible on hover or active */}
                {!isEditing && (
                  <div
                    className={`
                      absolute right-2 top-1/2 -translate-y-1/2 flex gap-0.5
                      transition-opacity duration-150
                      ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}
                    `}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      title="Renommer"
                      onClick={() => startEdit(project)}
                      className="cursor-pointer w-5 h-5 flex items-center justify-center rounded text-slate-500 hover:text-slate-200 hover:bg-slate-700 transition-colors duration-150"
                    >
                      <Pencil size={10} />
                    </button>
                    <button
                      type="button"
                      title="Dupliquer"
                      onClick={() => onDuplicate(project.id)}
                      className="cursor-pointer w-5 h-5 flex items-center justify-center rounded text-slate-500 hover:text-slate-200 hover:bg-slate-700 transition-colors duration-150"
                    >
                      <Copy size={10} />
                    </button>
                    {projects.length > 1 && (
                      <button
                        type="button"
                        title="Supprimer"
                        onClick={() => {
                          if (confirm(`Supprimer "${project.name}" ?`)) onDelete(project.id);
                        }}
                        className="cursor-pointer w-5 h-5 flex items-center justify-center rounded text-slate-500 hover:text-red-400 hover:bg-red-950/30 transition-colors duration-150"
                      >
                        <Trash2 size={10} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {/* ── Footer: count ── */}
      <div className="px-3 py-2 border-t border-slate-800">
        <span className="text-[10px] text-slate-600">
          {projects.length} CV{projects.length > 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
}
