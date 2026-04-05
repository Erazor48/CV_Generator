import { CVData } from "@/types/cv";
import { CVTheme } from "@/types/theme";
import { Mail, Phone, MapPin, Globe } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa"

interface CVSidebarProps {
  cv: CVData;
  theme: CVTheme;
}

export function CVSidebar({ cv, theme }: CVSidebarProps) {
  const { contact, skills, languages, intro, sectionTitles } = cv;

  const sectionStyle = {
    borderTopColor: theme.borderColor,
  };

  const accentBar = {
    borderLeftColor: theme.accent,
  };

  return (
    <aside
      className="flex flex-col"
      style={{
        backgroundColor: theme.sidebarBg,
        color: theme.sidebarText,
        width: "38%",
        minWidth: "38%",
      }}
    >
      {/* ── Intro blurb ── */}
      <div className="px-6 pt-7 pb-5">
        <p
          className="text-xs leading-relaxed italic"
          style={{ color: theme.introText }}
        >
          {intro}
        </p>
      </div>

      <div className="flex-1" />

      {/* ── Contact ── */}
      <section
        className="px-6 py-4 border-t"
        style={sectionStyle}
      >
        <h3
          className="text-sm font-bold mb-2.5 tracking-wide"
          style={{ color: theme.sidebarText }}
        >
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
        <section className="px-6 py-4 border-t" style={sectionStyle}>
          <h3
            className="text-sm font-bold mb-2.5 tracking-wide"
            style={{ color: theme.sidebarText }}
          >
            {sectionTitles.skills}
          </h3>
          <ul className="space-y-1">
            {skills.map((s) => (
              <li
                key={s.id}
                className="text-xs pl-2.5 border-l-2"
                style={{ color: theme.sidebarMuted, ...accentBar }}
              >
                {s.label}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── Languages ── */}
      {languages.length > 0 && (
        <section className="px-6 py-4 border-t" style={sectionStyle}>
          <h3
            className="text-sm font-bold mb-2.5 tracking-wide"
            style={{ color: theme.sidebarText }}
          >
            {sectionTitles.languages}
          </h3>
          <ul className="space-y-1">
            {languages.map((l) => (
              <li
                key={l.id}
                className="text-xs pl-2.5 border-l-2"
                style={{ color: theme.sidebarMuted, ...accentBar }}
              >
                {l.name}{" "}
                <span style={{ color: theme.sidebarMuted, opacity: 0.7 }}>({l.level})</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </aside>
  );
}
