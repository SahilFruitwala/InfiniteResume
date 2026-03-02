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
            className="relative p-4 border-2 border-black/10 dark:border-white/10 rounded-none bg-white dark:bg-[#111111] shadow-none mb-4"
          >
            <Button
              onClick={() => onRemove(exp.id)}
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 h-8 w-8 text-black/40 dark:text-white/40 hover:text-red-500 hover:bg-red-500/10 rounded-none"
              aria-label={`Remove experience ${index + 1}`}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <h4 className="text-sm font-semibold text-black/80 dark:text-white/80 mb-3 pr-8">
              Experience {index + 1}
            </h4>
            <div className="space-y-4">
              <div>
                <Label className="block text-xs font-medium text-black/70 dark:text-white/50 mb-1">
                  Company
                </Label>
                <Input
                  type="text"
                  value={exp.company}
                  onChange={(e) => onUpdate(exp.id, "company", e.target.value)}
                  className="w-full"
                  placeholder="Acme Corp"
                />
              </div>
              <div>
                <Label className="block text-xs font-medium text-black/70 dark:text-white/50 mb-1">
                  Position
                </Label>
                <Input
                  type="text"
                  value={exp.position}
                  onChange={(e) => onUpdate(exp.id, "position", e.target.value)}
                  className="w-full"
                  placeholder="Software Engineer"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="block text-xs font-medium text-black/70 dark:text-white/50 mb-1">
                    Start Date
                  </Label>
                  <Input
                    type="text"
                    value={exp.startDate}
                    onChange={(e) =>
                      onUpdate(exp.id, "startDate", e.target.value)
                    }
                    className="w-full"
                    placeholder="Jan 2020"
                  />
                </div>
                <div>
                  <Label className="block text-xs font-medium text-black/70 dark:text-white/50 mb-1">
                    End Date
                  </Label>
                  <Input
                    type="text"
                    value={exp.endDate}
                    onChange={(e) =>
                      onUpdate(exp.id, "endDate", e.target.value)
                    }
                    className="w-full"
                    placeholder="Present"
                  />
                </div>
              </div>
              <div>
                <Label className="block text-xs font-medium text-black/70 dark:text-white/50 mb-1">
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
          className="w-full border-2 border-dashed border-black/10 dark:border-white/10 text-black/60 dark:text-white/60 hover:border-accent hover:text-accent hover:bg-accent/10 flex items-center justify-center gap-2 transition-colors rounded-none"
        >
          <Plus className="w-4 h-4" /> Add Experience
        </Button>
      </div>
    );
  },
);

ExperienceSection.displayName = "ExperienceSection";
