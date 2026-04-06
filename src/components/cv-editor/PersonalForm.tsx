"use client";

import { useRef } from "react";
import { CVData } from "@/types/cv";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";

interface PersonalFormProps {
  cv: CVData;
  updateField: <K extends keyof CVData>(key: K, value: CVData[K]) => void;
  updateContact: (field: keyof CVData["contact"], value: string) => void;
  setPhoto: (base64: string | undefined) => void;
}

export function PersonalForm({ cv, updateField, updateContact, setPhoto }: PersonalFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPhoto(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-5">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Identité</h3>

      {/* Photo */}
      <div className="flex items-center gap-4">
        {cv.photo ? (
          <img src={cv.photo} alt="photo" className="w-14 h-14 rounded-full object-cover border border-cyan-700" />
        ) : (
          <div className="w-14 h-14 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-slate-500 text-xs">
            No photo
          </div>
        )}
        <div className="flex flex-col gap-1">
          <Button type="button" variant="outline" size="sm" className="text-xs hover:bg-slate-700 transition-colors duration-150" onClick={() => fileInputRef.current?.click()}>
            <Upload size={12} className="mr-1" /> Photo
          </Button>
          {cv.photo && (
            <Button type="button" variant="ghost" size="sm" className="text-xs text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-colors duration-150" onClick={() => setPhoto(undefined)}>
              <X size={12} className="mr-1" /> Retirer
            </Button>
          )}
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
        </div>
      </div>

      <Field label="Nom complet">
        <Input value={cv.name} onChange={(e) => updateField("name", e.target.value)} className="h-8 text-sm" />
      </Field>
      <Field label="Poste / Titre">
        <Input value={cv.title} onChange={(e) => updateField("title", e.target.value)} className="h-8 text-sm" />
      </Field>
      <Field label="Disponibilité">
        <Input value={cv.availability} onChange={(e) => updateField("availability", e.target.value)} className="h-8 text-sm" />
      </Field>
      <Field label="Accroche / Intro">
        <Textarea rows={4} value={cv.intro} onChange={(e) => updateField("intro", e.target.value)} className="resize-none text-sm" />
      </Field>

      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest pt-2">Contact</h3>

      {(
        [
          ["email",     "Email"],
          ["phone",     "Téléphone"],
          ["location",  "Localisation"],
          ["linkedin",  "LinkedIn"],
          ["github",    "GitHub"],
          ["portfolio", "Portfolio / Site"],
        ] as const
      ).map(([key, label]) => (
        <Field key={key} label={label}>
          <Input value={(cv.contact[key] as string) ?? ""} onChange={(e) => updateContact(key, e.target.value)} className="h-8 text-xs" />
        </Field>
      ))}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs text-slate-500">{label}</Label>
      {children}
    </div>
  );
}
