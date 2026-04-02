/**
 * CVPreview
 *
 * This is the printable component. It receives the full CVData and renders
 * it in the dark-themed two-column layout matching Ethan's portfolio style.
 *
 * For print/PDF: wrap it in <div id="cv-preview-root"> and call printCV().
 */

import Image from "next/image";
import type { CVData } from "@/types/cv";
import { CVSidebar } from "./CVSidebar";
import { CVMain } from "./CVMain";

interface CVPreviewProps {
  cv: CVData;
}

export function CVPreview({ cv }: CVPreviewProps) {
  return (
    <div
      id="cv-preview-root"
      className="flex flex-col bg-[#0d1b2a] font-sans"
      // A4 landscape at 96dpi ≈ 1122 × 794px
      style={{ width: "1122px", minHeight: "794px", fontSize: "13px" }}
    >
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="relative flex items-center gap-6 px-8 py-6 bg-[#0f2034] border-b border-cyan-800">
        {/* Photo */}
        <div className="shrink-0">
          {cv.photo ? (
            <Image
              src={cv.photo}
              alt={cv.name}
              className="w-24 h-24 rounded-full object-cover border-2 border-cyan-600"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-[#1a3a55] border-2 border-cyan-700 flex items-center justify-center text-slate-500 text-xs text-center p-2">
              No photo
            </div>
          )}
        </div>

        {/* Title block */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-white tracking-wide">{cv.title}</h1>
          <p className="text-3xl font-extrabold text-white">{cv.name}</p>
          <p className="text-sm text-slate-400">{cv.availability}</p>
        </div>

        {/* Teal accent bar */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-600 via-cyan-400 to-transparent" />
      </header>

      {/* ── Body: sidebar + main ────────────────────────────────────────── */}
      <div className="flex flex-1">
        <CVSidebar cv={cv} />
        <CVMain cv={cv} />
      </div>
    </div>
  );
}
