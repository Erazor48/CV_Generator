"use client";

import { useCV } from "@/hooks/useCV";
import { CVPreview } from "@/components/cv/CVPreview";
import { CVEditor } from "@/components/cv-editor/CVEditor";
import { getThemeById } from "@/data/themes";

/**
 * /cv-generator — split view: editor (left) + live preview (right)
 *
 * Portrait A4 preview fits at scale ~0.72 in a standard 1920 screen
 * with the 360px editor panel. Landscape uses ~0.60.
 */
export default function CVGeneratorPage() {
  const cvControls = useCV();
  const { cv } = cvControls;

  const theme = getThemeById(cv.themeId);

  // Scale the preview to fit the right panel
  // Portrait: 794px wide → fits comfortably at 0.72
  // Landscape: 1122px wide → needs 0.60
  const scale = cv.orientation === "portrait" ? 0.72 : 0.58;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#070f18]">
      {/* ── Left panel: editor ── */}
      <div className="w-[360px] shrink-0 h-full overflow-hidden flex flex-col">
        <CVEditor {...cvControls} />
      </div>

      {/* ── Right panel: live preview ── */}
      <div className="flex-1 h-full overflow-auto flex items-start justify-center p-8 bg-[#070f18]">
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top center",
          }}
        >
          <CVPreview cv={cv} theme={theme} />
        </div>
      </div>
    </div>
  );
}
