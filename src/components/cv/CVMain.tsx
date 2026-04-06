import { CVData } from "@/types/cv";
import { CVTheme } from "@/types/theme";
import { renderDescription } from "@/lib/render-description";

interface CVMainProps {
  cv: CVData;
  theme: CVTheme;
}

export function CVMain({ cv, theme }: CVMainProps) {
  const { experiences, education, sectionTitles } = cv;

  const headingStyle = {
    color: theme.sectionHeadingText,
    borderBottomColor: theme.sectionHeadingBorder,
  };

  const descStyles = {
    textColor: theme.mainMuted,
    bulletColor: theme.mainMuted,
    fontSize: "0.7rem",
  };

  return (
    <main
      className="flex-1 px-7 py-6 overflow-hidden"
      style={{ backgroundColor: theme.mainBg, color: theme.mainText }}
    >
      {/* ── Experiences ── */}
      <section className="mb-6">
        <h2
          className="text-base font-bold tracking-widest mb-3 pb-1 border-b"
          style={headingStyle}
        >
          {sectionTitles.experiences}
        </h2>

        <div className="space-y-3.5">
          {experiences.map((exp) => (
            <div key={exp.id}>
              <div className="flex items-baseline gap-2 flex-wrap">
                <span
                  className="text-xs font-semibold whitespace-nowrap"
                  style={{ color: theme.mainMuted }}
                >
                  {exp.period}:
                </span>
                <span className="text-xs font-bold" style={{ color: theme.mainText }}>
                  {exp.title}
                </span>
                {exp.company && (
                  <span className="text-xs" style={{ color: theme.mainMuted }}>
                    at {exp.company}
                    {exp.location ? `, ${exp.location}` : ""}
                  </span>
                )}
              </div>

              {renderDescription(exp.description, descStyles)}
            </div>
          ))}
        </div>
      </section>

      {/* ── Education ── */}
      <section>
        <h2
          className="text-base font-bold tracking-widest mb-3 pb-1 border-b"
          style={headingStyle}
        >
          {sectionTitles.education}
        </h2>

        <div className="space-y-3.5">
          {education.map((ed) => (
            <div key={ed.id}>
              <div className="flex items-baseline gap-2 flex-wrap">
                <span
                  className="text-xs font-semibold whitespace-nowrap"
                  style={{ color: theme.mainMuted }}
                >
                  {ed.period}:
                </span>
                <span className="text-xs font-bold" style={{ color: theme.mainText }}>
                  {ed.degree}
                </span>
                <span className="text-xs" style={{ color: theme.mainMuted }}>
                  at {ed.institution}
                  {ed.location ? `, ${ed.location}.` : "."}
                </span>
              </div>

              {renderDescription(ed.description, descStyles)}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
