import React from "react";
import { Experience } from "../../types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";
import { RichTextEditor } from "../RichTextEditor";

interface ExperienceSectionProps {
  items: Experience[];
  onAdd: () => void;
  onUpdate: (id: string, field: keyof Experience, value: string) => void;
  onRemove: (id: string) => void;
}

export const ExperienceSection = React.memo(
  ({ items, onAdd, onUpdate, onRemove }: ExperienceSectionProps) => {
    return (
      <div className="space-y-6">
        {items.map((exp, index) => (
          <div
            key={exp.id}
            className="relative p-4 border border-slate-200 dark:border-border rounded-lg bg-white dark:bg-background shadow-sm"
          >
            <Button
              onClick={() => onRemove(exp.id)}
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-card"
              aria-label={`Remove experience ${index + 1}`}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3 pr-8">
              Experience {index + 1}
            </h4>
            <div className="space-y-4">
              <div>
                <Label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
                  Company
                </Label>
                <Input
                  type="text"
                  value={exp.company}
                  onChange={(e) => onUpdate(exp.id, "company", e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-border rounded-md text-sm focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all dark:bg-card dark:text-slate-200 placeholder:text-slate-400"
                  placeholder="Acme Corp"
                />
              </div>
              <div>
                <Label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
                  Position
                </Label>
                <Input
                  type="text"
                  value={exp.position}
                  onChange={(e) => onUpdate(exp.id, "position", e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-border rounded-md text-sm focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all dark:bg-card dark:text-slate-200 placeholder:text-slate-400"
                  placeholder="Software Engineer"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
                    Start Date
                  </Label>
                  <Input
                    type="text"
                    value={exp.startDate}
                    onChange={(e) =>
                      onUpdate(exp.id, "startDate", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-slate-300 dark:border-border rounded-md text-sm focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all dark:bg-card dark:text-slate-200 placeholder:text-slate-400"
                    placeholder="Jan 2020"
                  />
                </div>
                <div>
                  <Label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
                    End Date
                  </Label>
                  <Input
                    type="text"
                    value={exp.endDate}
                    onChange={(e) =>
                      onUpdate(exp.id, "endDate", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-slate-300 dark:border-border rounded-md text-sm focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all dark:bg-card dark:text-slate-200 placeholder:text-slate-400"
                    placeholder="Present"
                  />
                </div>
              </div>
              <div>
                <Label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
                  Description
                </Label>
                <RichTextEditor
                  value={exp.description}
                  onChange={(val) => onUpdate(exp.id, "description", val)}
                  placeholder="Describe your responsibilities and achievements…"
                />
              </div>
            </div>
          </div>
        ))}
        <Button
          onClick={onAdd}
          variant="outline"
          className="w-full border-2 border-dashed border-slate-300 dark:border-border text-slate-600 dark:text-slate-400 hover:border-slate-800 dark:hover:border-slate-400 hover:text-slate-800 dark:hover:text-slate-200 flex items-center justify-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Experience
        </Button>
      </div>
    );
  },
);

ExperienceSection.displayName = "ExperienceSection";
