"use client";

import Image from "next/image";
import { useRef } from "react";
import type { CVData } from "@/types/cv";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
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
      <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-widest">
        Identity
      </h3>

      {/* Photo */}
      <div className="flex items-center gap-4">
        {cv.photo ? (
          <Image
            src={cv.photo}
            alt="photo"
            className="w-16 h-16 rounded-full object-cover border border-cyan-700"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-slate-500 text-xs">
            No photo
          </div>
        )}
        <div className="flex flex-col gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={13} className="mr-1" /> Upload photo
          </Button>
          {cv.photo && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-xs text-red-400"
              onClick={() => setPhoto(undefined)}
            >
              <X size={13} className="mr-1" /> Remove
            </Button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoChange}
          />
        </div>
      </div>

      <Field label="Full name">
        <Input value={cv.name} onChange={(e) => updateField("name", e.target.value)} />
      </Field>

      <Field label="Position / Title">
        <Input value={cv.title} onChange={(e) => updateField("title", e.target.value)} />
      </Field>

      <Field label="Availability">
        <Input
          value={cv.availability}
          onChange={(e) => updateField("availability", e.target.value)}
        />
      </Field>

      <Field label="Intro / Objective">
        <Textarea
          rows={4}
          value={cv.intro}
          onChange={(e) => updateField("intro", e.target.value)}
          className="resize-none text-sm"
        />
      </Field>

      <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-widest pt-2">
        Contact
      </h3>

      {(
        [
          ["email", "Email"],
          ["phone", "Phone"],
          ["location", "Location"],
          ["linkedin", "LinkedIn"],
          ["github", "GitHub"],
          ["portfolio", "Portfolio / Website"],
        ] as const
      ).map(([key, label]) => (
        <Field key={key} label={label}>
          <Input
            value={(cv.contact[key] as string) ?? ""}
            onChange={(e) => updateContact(key, e.target.value)}
          />
        </Field>
      ))}
    </div>
  );
}

// Small helper wrapper
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-slate-400">{label}</Label>
      {children}
    </div>
  );
}
