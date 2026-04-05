/**
 * CVPreview — printable CV component.
 * Portrait A4: 794 × 1122px at 96dpi (210 × 297mm)
 * Landscape A4: 1122 × 794px
 */

import { CVData } from "@/types/cv";
import { CVTheme } from "@/types/theme";
import { CVSidebar } from "./CVSidebar";
import { CVMain } from "./CVMain";

interface CVPreviewProps {
  cv: CVData;
  theme: CVTheme;
}

// A4 dimensions in px at 96dpi
const A4 = {
  portrait:  { width: 794,  height: 1122 },
  landscape: { width: 1122, height: 794  },
};

export function CVPreview({ cv, theme }: CVPreviewProps) {
  const dim = A4[cv.orientation];

  return (
    <div
      id="cv-preview-root"
      className="flex flex-col font-sans select-none"
      style={{
        width: `${dim.width}px`,
        minHeight: `${dim.height}px`,
        fontSize: "12px",
        backgroundColor: theme.mainBg,
      }}
    >
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header
        className="relative flex items-center gap-5 px-7 py-5"
        style={{ backgroundColor: theme.headerBg }}
      >
        {/* Photo */}
        <div className="shrink-0">
          {cv.photo ? (
            <img
              src={cv.photo}
              alt={cv.name}
              className="w-20 h-20 rounded-full object-cover"
              style={{ border: `2px solid ${theme.accent}` }}
            />
          ) : (
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-xs text-center p-2"
              style={{
                backgroundColor: theme.sidebarBg,
                border: `2px solid ${theme.accentLight}`,
                color: theme.sidebarMuted,
              }}
            >
              Photo
            </div>
          )}
        </div>

        {/* Title block */}
        <div className="flex flex-col gap-0.5">
          <p
            className="text-xl font-bold tracking-wide"
            style={{ color: theme.headerText }}
          >
            {cv.title}
          </p>
          <p
            className="text-2xl font-extrabold"
            style={{ color: theme.headerText }}
          >
            {cv.name}
          </p>
          <p
            className="text-xs mt-0.5"
            style={{ color: theme.headerSubText }}
          >
            {cv.availability}
          </p>
        </div>

        {/* Bottom accent line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background: `linear-gradient(to right, ${theme.accent}, ${theme.accentLight}, transparent)`,
          }}
        />
      </header>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-1">
        <CVSidebar cv={cv} theme={theme} />
        <CVMain cv={cv} theme={theme} />
      </div>
    </div>
  );
}
