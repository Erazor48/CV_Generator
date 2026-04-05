import { CVData } from "@/types/cv";
import { CVTheme } from "@/types/theme";

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
                    at {exp.company}{exp.location ? `, ${exp.location}` : ""}
                  </span>
                )}
              </div>

              {exp.description && (
                <p
                  className="mt-0.5 text-xs leading-relaxed"
                  style={{ color: theme.mainMuted }}
                >
                  {exp.description}
                </p>
              )}

              {exp.bullets && exp.bullets.length > 0 && (
                <ul className="mt-0.5 ml-2 space-y-0.5">
                  {exp.bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs" style={{ color: theme.mainMuted }}>
                      <span
                        className="mt-1.5 w-1 h-1 rounded-full shrink-0"
                        style={{ backgroundColor: theme.mainMuted }}
                      />
                      {b}
                    </li>
                  ))}
                </ul>
              )}
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
                  at {ed.institution}{ed.location ? `, ${ed.location}.` : "."}
                </span>
              </div>
              {ed.description && (
                <p className="mt-0.5 text-xs leading-relaxed" style={{ color: theme.mainMuted }}>
                  {ed.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
