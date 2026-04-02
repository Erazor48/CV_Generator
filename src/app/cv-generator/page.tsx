"use client";

import { useCV } from "@/hooks/useCV";
import { CVPreview } from "@/components/cv/CVPreview";
import { CVEditor } from "@/components/cv-editor/CVEditor";

/**
 * /cv-generator  – Full-page split view:
 *   left  ← scrollable editor panel (360px)
 *   right ← zoomable live preview of the CV
 *
 * To add this page to your site:
 *   Place this file at  src/app/cv-generator/page.tsx
 */
export default function CVGeneratorPage() {
  const cvControls = useCV();
  const { cv } = cvControls;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0d1b2a]">
      {/* ── Left panel: editor ── */}
      <div className="w-[360px] shrink-0 h-full overflow-hidden flex flex-col">
        <CVEditor {...cvControls} />
      </div>

      {/* ── Right panel: live preview ── */}
      <div className="flex-1 h-full overflow-auto flex items-start justify-center bg-[#070f18] p-8">
        {/*
          Scale the A4 preview (1122px wide) to fit the available area.
          The scale-origin is top-center so it doesn't jump around.
        */}
        <div
          className="origin-top"
          style={{
            transform: "scale(var(--cv-scale, 0.75))",
            // Dynamically set via CSS custom property if you want a resize observer.
            // For now 0.75 fits most 1920-wide screens.
          }}
        >
          <CVPreview cv={cv} />
        </div>
      </div>
    </div>
  );
}
