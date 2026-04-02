import type { CVData } from "@/types/cv";

interface CVMainProps {
  cv: CVData;
}

export function CVMain({ cv }: CVMainProps) {
  const { experiences, education } = cv;

  return (
    <main className="flex-1 bg-[#0d1b2a] text-white px-8 py-7 overflow-hidden">
      {/* ── Experiences ── */}
      <section className="mb-7">
        <h2 className="text-lg font-bold tracking-widest mb-4 pb-1 border-b border-cyan-700 text-white">
          Experiences
        </h2>

        <div className="space-y-4">
          {experiences.map((exp) => (
            <div key={exp.id}>
              {/* Period + title row */}
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-xs font-semibold text-slate-400 whitespace-nowrap">
                  {exp.period}:
                </span>
                <span className="text-sm font-bold text-white">{exp.title}</span>
                {exp.company && (
                  <span className="text-sm text-slate-300">
                    at {exp.company}
                    {exp.location ? `, ${exp.location}` : ""}
                  </span>
                )}
              </div>

              {/* Description paragraph */}
              {exp.description && (
                <p className="mt-1 text-xs leading-relaxed text-slate-300 ml-0">
                  {exp.description}
                </p>
              )}

              {/* Bullet points */}
              {exp.bullets && exp.bullets.length > 0 && (
                <ul className="mt-1 ml-3 space-y-0.5">
                  {exp.bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs text-slate-300">
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-slate-400 shrink-0" />
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
        <h2 className="text-lg font-bold tracking-widest mb-4 pb-1 border-b border-cyan-700 text-white">
          Education
        </h2>

        <div className="space-y-4">
          {education.map((ed) => (
            <div key={ed.id}>
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-xs font-semibold text-slate-400 whitespace-nowrap">
                  {ed.period}:
                </span>
                <span className="text-sm font-bold text-white">{ed.degree}</span>
                <span className="text-sm text-slate-300">
                  at {ed.institution}
                  {ed.location ? `, ${ed.location}.` : "."}
                </span>
              </div>
              {ed.description && (
                <p className="mt-1 text-xs leading-relaxed text-slate-300">
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
