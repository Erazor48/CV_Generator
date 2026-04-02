import type { CVData } from "@/types/cv";
import { Mail, Phone, MapPin, Globe } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa"

interface CVSidebarProps {
  cv: CVData;
}

export function CVSidebar({ cv }: CVSidebarProps) {
  const { contact, skills, languages, intro, /*photo, name*/ } = cv;

  return (
    <aside className="w-[38%] flex flex-col bg-[#0f2034] text-white font-sans">
      {/* ── Intro blurb ── */}
      <div className="px-7 pt-8 pb-6">
        <p className="text-sm leading-relaxed italic text-slate-300">{intro}</p>
      </div>

      {/* ── Photo + Name (small screens fold here, but on CV it sits in header) */}
      {/* Kept as spacer so layout matches the original */}
      <div className="flex-1" />

      {/* ── Contact ── */}
      <section className="px-7 py-5 border-t border-[#1a3a55]">
        <h3 className="text-base font-bold mb-3 tracking-wide text-white">Contact</h3>
        <ul className="space-y-2 text-sm text-slate-300">
          {contact.email && (
            <li className="flex items-center gap-2">
              <Mail size={13} className="shrink-0 text-slate-400" />
              <span className="break-all">{contact.email}</span>
            </li>
          )}
          {contact.phone && (
            <li className="flex items-center gap-2">
              <Phone size={13} className="shrink-0 text-slate-400" />
              <span>{contact.phone}</span>
            </li>
          )}
          {contact.location && (
            <li className="flex items-center gap-2">
              <MapPin size={13} className="shrink-0 text-slate-400" />
              <span>{contact.location}</span>
            </li>
          )}
          {contact.linkedin && (
            <li className="flex items-center gap-2">
              <FaLinkedin size={13} className="shrink-0 text-slate-400" />
              <span className="break-all">{contact.linkedin}</span>
            </li>
          )}
          {contact.github && (
            <li className="flex items-center gap-2">
              <FaGithub size={13} className="shrink-0 text-slate-400" />
              <span className="break-all">{contact.github}</span>
            </li>
          )}
          {contact.portfolio && (
            <li className="flex items-center gap-2">
              <Globe size={13} className="shrink-0 text-slate-400" />
              <span className="break-all">{contact.portfolio}</span>
            </li>
          )}
        </ul>
      </section>

      {/* ── Skills ── */}
      {skills.length > 0 && (
        <section className="px-7 py-5 border-t border-[#1a3a55]">
          <h3 className="text-base font-bold mb-3 tracking-wide text-white">Skills</h3>
          <ul className="space-y-1">
            {skills.map((s) => (
              <li
                key={s.id}
                className="text-sm text-slate-300 pl-3 border-l-2 border-cyan-500"
              >
                {s.label}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── Languages ── */}
      {languages.length > 0 && (
        <section className="px-7 py-5 border-t border-[#1a3a55]">
          <h3 className="text-base font-bold mb-3 tracking-wide text-white">Languages</h3>
          <ul className="space-y-1">
            {languages.map((l) => (
              <li key={l.id} className="text-sm text-slate-300 pl-3 border-l-2 border-cyan-500">
                {l.name}{" "}
                <span className="text-slate-400 text-xs">({l.level})</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </aside>
  );
}
