import React from "react";
import { PersonalInfo } from "../../types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import { RichTextEditor } from "../RichTextEditor";

interface PersonalInfoSectionProps {
  data: PersonalInfo;
  onChange: (field: keyof PersonalInfo, value: string) => void;
}

export const PersonalInfoSection = React.memo(
  ({ data, onChange }: PersonalInfoSectionProps) => {
    return (
      <div className="space-y-4">
        <div>
          <Label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
            Profile Picture (Optional)
          </Label>
          <div className="flex items-center gap-4">
            {data.profilePicture && (
              <Image
                src={data.profilePicture}
                alt="Profile"
                width={48}
                height={48}
                unoptimized
                className="w-12 h-12 rounded-full object-cover border border-slate-200"
              />
            )}
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    onChange("profilePicture", reader.result as string);
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="flex-1 text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-slate-50 dark:file:bg-slate-800 file:text-slate-700 dark:file:text-slate-300 hover:file:bg-slate-100 dark:hover:file:bg-slate-700 transition-all cursor-pointer"
            />
            {data.profilePicture && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onChange("profilePicture", "")}
                className="h-8 w-8 text-slate-400 hover:text-red-500"
                aria-label="Remove profile picture"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
        <div>
          <Label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
            Full Name
          </Label>
          <Input
            type="text"
            name="fullName"
            autoComplete="name"
            value={data.fullName}
            onChange={(e) => onChange("fullName", e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 dark:border-border rounded-md text-sm focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all dark:bg-card dark:text-slate-200 placeholder:text-slate-400"
            placeholder="John Doe"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
              Email
            </Label>
            <Input
              type="email"
              name="email"
              autoComplete="email"
              value={data.email}
              onChange={(e) => onChange("email", e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-border rounded-md text-sm focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all dark:bg-card dark:text-slate-200 placeholder:text-slate-400"
              placeholder="john@example.com"
            />
          </div>
          <div>
            <Label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
              Phone
            </Label>
            <Input
              type="tel"
              name="phone"
              autoComplete="tel"
              value={data.phone}
              onChange={(e) => onChange("phone", e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-border rounded-md text-sm focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all dark:bg-card dark:text-slate-200 placeholder:text-slate-400"
              placeholder="+1 234 567 890"
            />
          </div>
        </div>
        <div>
          <Label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
            Location
          </Label>
          <Input
            type="text"
            name="location"
            autoComplete="address-level2"
            value={data.location}
            onChange={(e) => onChange("location", e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 dark:border-border rounded-md text-sm focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all dark:bg-card dark:text-slate-200 placeholder:text-slate-400"
            placeholder="New York, NY"
          />
        </div>
        <div>
          <Label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
            Website (Optional)
          </Label>
          <Input
            type="url"
            name="website"
            autoComplete="url"
            value={data.website}
            onChange={(e) => onChange("website", e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 dark:border-border rounded-md text-sm focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all dark:bg-card dark:text-slate-200 placeholder:text-slate-400"
            placeholder="johndoe.com"
          />
        </div>
        <div>
          <Label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
            Professional Summary
          </Label>
          <RichTextEditor
            value={data.summary}
            onChange={(val) => onChange("summary", val)}
            placeholder="A brief summary of your professional background…"
          />
        </div>
      </div>
    );
  },
);

PersonalInfoSection.displayName = "PersonalInfoSection";
