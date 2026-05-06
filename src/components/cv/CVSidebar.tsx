import { CVData, Skill } from "@/types/cv";
import { CVTheme } from "@/types/theme";
import { Mail, Phone, MapPin, Globe } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

interface CVSidebarProps {
  cv: CVData;
  theme: CVTheme;
}

function groupSkillsByCategory(skills: Skill[]): { category: string; items: Skill[] }[] {
  return skills.reduce((groups, s) => {
    const cat = s.category ?? "";
    const existing = groups.find((g) => g.category === cat);
    if (existing) existing.items.push(s);
    else groups.push({ category: cat, items: [s] });
    return groups;
  }, [] as { category: string; items: Skill[] }[]);
}

export function CVSidebar({ cv, theme }: CVSidebarProps) {
  const { contact, skills, languages, extras, intro, sectionTitles } = cv;

  const sectionStyle = { borderTopWidth: "1px", borderTopStyle: "solid" as const, borderTopColor: theme.borderColor };
  const accentBar    = { borderLeftColor: theme.accent };
  const hasCategories = skills.some((s) => s.category);

  return (
    <aside
      className="flex flex-col"
      style={{ backgroundColor: theme.sidebarBg, color: theme.sidebarText, width: "38%", minWidth: "38%" }}
    >
      {/* ── Intro blurb ── */}
      <div className="px-6 pt-5 pb-3">
        <p className="text-xs leading-relaxed italic" style={{ color: theme.introText }}>
          {intro}
        </p>
      </div>

      {/* ── Contact ── */}
      <section className="px-6 py-3" style={sectionStyle}>
        <h3 className="text-sm font-bold mb-2.5 tracking-wide" style={{ color: theme.sidebarText }}>
          {sectionTitles.contact}
        </h3>
        <ul className="space-y-1.5 text-xs">
          {contact.email && (
            <li className="flex items-center gap-2">
              <Mail size={11} className="shrink-0" style={{ color: theme.sidebarMuted }} />
              <span style={{ color: theme.sidebarMuted }} className="break-all">{contact.email}</span>
            </li>
          )}
          {contact.phone && (
            <li className="flex items-center gap-2">
              <Phone size={11} className="shrink-0" style={{ color: theme.sidebarMuted }} />
              <span style={{ color: theme.sidebarMuted }}>{contact.phone}</span>
            </li>
          )}
          {contact.location && (
            <li className="flex items-center gap-2">
              <MapPin size={11} className="shrink-0" style={{ color: theme.sidebarMuted }} />
              <span style={{ color: theme.sidebarMuted }}>{contact.location}</span>
            </li>
          )}
          {contact.linkedin && (
            <li className="flex items-center gap-2">
              <FaLinkedin size={11} className="shrink-0" style={{ color: theme.sidebarMuted }} />
              <span style={{ color: theme.sidebarMuted }} className="break-all">{contact.linkedin}</span>
            </li>
          )}
          {contact.github && (
            <li className="flex items-center gap-2">
              <FaGithub size={11} className="shrink-0" style={{ color: theme.sidebarMuted }} />
              <span style={{ color: theme.sidebarMuted }} className="break-all">{contact.github}</span>
            </li>
          )}
          {contact.portfolio && (
            <li className="flex items-center gap-2">
              <Globe size={11} className="shrink-0" style={{ color: theme.sidebarMuted }} />
              <span style={{ color: theme.sidebarMuted }} className="break-all">{contact.portfolio}</span>
            </li>
          )}
        </ul>
      </section>

      {/* ── Skills ── */}
      {skills.length > 0 && (
        <section className="px-6 py-3" style={sectionStyle}>
          <h3 className="text-sm font-bold mb-2.5 tracking-wide" style={{ color: theme.sidebarText }}>
            {sectionTitles.skills}
          </h3>
          {hasCategories ? (
            <div className="space-y-1.5">
              {groupSkillsByCategory(skills).map(({ category, items }) => (
                <div key={category}>
                  {category && (
                    <p className="text-[9px] uppercase tracking-widest mb-1" style={{ color: theme.accent }}>
                      {category}
                    </p>
                  )}
                  <ul className="space-y-1">
                    {items.map((s) => (
                      <li key={s.id} className="text-xs pl-2.5 border-l-2" style={{ color: theme.sidebarMuted, ...accentBar }}>
                        {s.label}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <ul className="space-y-1">
              {skills.map((s) => (
                <li key={s.id} className="text-xs pl-2.5 border-l-2" style={{ color: theme.sidebarMuted, ...accentBar }}>
                  {s.label}
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {/* ── Languages ── */}
      {languages.length > 0 && (
        <section className="px-6 py-3" style={sectionStyle}>
          <h3 className="text-sm font-bold mb-2.5 tracking-wide" style={{ color: theme.sidebarText }}>
            {sectionTitles.languages}
          </h3>
          <ul className="space-y-1">
            {languages.map((l) => (
              <li key={l.id} className="text-xs pl-2.5 border-l-2" style={{ color: theme.sidebarMuted, ...accentBar }}>
                {l.name}{" "}
                <span style={{ color: theme.sidebarMuted, opacity: 0.7 }}>({l.level})</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── Extras (Hackathons / Volunteer / Interests) ── */}
      {extras && extras.map((section) => (
        <section key={section.id} className="px-6 py-3" style={sectionStyle}>
          <h3 className="text-sm font-bold mb-2.5 tracking-wide" style={{ color: theme.sidebarText }}>
            {section.title}
          </h3>
          <ul className="space-y-1.5">
            {section.items.map((item) => (
              <li key={item.id} className="pl-2.5 border-l-2" style={{ ...accentBar }}>
                <p className="text-xs" style={{ color: theme.sidebarMuted }}>{item.label}</p>
                {item.sublabel && (
                  <p className="text-[10px]" style={{ color: theme.sidebarMuted, opacity: 0.7 }}>{item.sublabel}</p>
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </aside>
  );
}
