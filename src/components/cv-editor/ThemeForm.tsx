"use client";

import { CVData, SectionTitles } from "@/types/cv";
import { themes } from "@/data/themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Locale presets
const LOCALE_PRESETS: Record<string, SectionTitles> = {
  en: {
    contact: "Contact",
    skills: "Skills",
    languages: "Languages",
    experiences: "Experiences",
    education: "Education",
  },
  fr: {
    contact: "Contact",
    skills: "Compétences",
    languages: "Langues",
    experiences: "Expériences",
    education: "Formation",
  },
};

interface ThemeFormProps {
  cv: CVData;
  setTheme: (id: string) => void;
  setOrientation: (o: "portrait" | "landscape") => void;
  updateSectionTitle: (field: keyof SectionTitles, value: string) => void;
  setSectionTitles: (titles: SectionTitles) => void;
}

export function ThemeForm({
  cv,
  setTheme,
  setOrientation,
  updateSectionTitle,
  setSectionTitles,
}: ThemeFormProps) {
  return (
    <div className="space-y-7">

      {/* ── Theme picker ── */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-widest">
          Thème visuel
        </h3>
        <div className="grid grid-cols-1 gap-2">
          {themes.map((t) => {
            const active = cv.themeId === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTheme(t.id)}
                className={`
                  flex items-center gap-3 rounded-lg px-3 py-2.5 text-left
                  border transition-all duration-150 cursor-pointer
                  ${active
                    ? "border-cyan-500 bg-cyan-950/40"
                    : "border-slate-700 bg-slate-900 hover:border-slate-500 hover:bg-slate-800"
                  }
                `}
              >
                {/* Color swatch */}
                <div className="flex gap-1 shrink-0">
                  <div
                    className="w-4 h-8 rounded-sm"
                    style={{ backgroundColor: t.sidebarBg }}
                  />
                  <div
                    className="w-6 h-8 rounded-sm"
                    style={{ backgroundColor: t.mainBg, border: "1px solid #334155" }}
                  />
                </div>
                <div className="min-w-0">
                  <p className={`text-sm font-medium ${active ? "text-cyan-400" : "text-slate-200"}`}>
                    {t.label}
                  </p>
                  <p className="text-xs text-slate-500 truncate">{t.description}</p>
                </div>
                {active && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Orientation ── */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-widest">
          Format
        </h3>
        <div className="flex gap-2">
          {(["portrait", "landscape"] as const).map((o) => (
            <button
              key={o}
              type="button"
              onClick={() => setOrientation(o)}
              className={`
                flex-1 flex flex-col items-center gap-1.5 py-3 rounded-lg border
                transition-all duration-150 cursor-pointer
                ${cv.orientation === o
                  ? "border-cyan-500 bg-cyan-950/40 text-cyan-400"
                  : "border-slate-700 bg-slate-900 text-slate-400 hover:border-slate-500 hover:text-slate-200"
                }
              `}
            >
              {/* Mini page icon */}
              <div
                className={`border rounded-sm ${cv.orientation === o ? "border-cyan-500" : "border-slate-600"}`}
                style={
                  o === "portrait"
                    ? { width: 18, height: 24 }
                    : { width: 24, height: 18 }
                }
              />
              <span className="text-xs capitalize">{o === "portrait" ? "Portrait" : "Paysage"}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ── Section titles / Locale ── */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-widest">
            Titres de section
          </h3>
          <div className="flex gap-1.5">
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-7 px-2.5 text-xs hover:bg-slate-700 transition-colors duration-150"
              onClick={() => setSectionTitles(LOCALE_PRESETS.fr)}
            >
              🇫🇷 FR
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-7 px-2.5 text-xs hover:bg-slate-700 transition-colors duration-150"
              onClick={() => setSectionTitles(LOCALE_PRESETS.en)}
            >
              🇬🇧 EN
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          {(
            [
              ["contact",     "Contact"],
              ["skills",      "Compétences / Skills"],
              ["languages",   "Langues / Languages"],
              ["experiences", "Expériences / Experiences"],
              ["education",   "Formation / Education"],
            ] as [keyof SectionTitles, string][]
          ).map(([field, placeholder]) => (
            <div key={field} className="flex items-center gap-2">
              <span className="text-xs text-slate-500 w-24 shrink-0">{field}</span>
              <Input
                value={cv.sectionTitles[field]}
                placeholder={placeholder}
                onChange={(e) => updateSectionTitle(field, e.target.value)}
                className="h-7 text-xs flex-1 cursor-text"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
