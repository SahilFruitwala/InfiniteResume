import React from "react";
import { SkillCategory } from "../../types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";
import { RichTextEditor } from "../RichTextEditor";

interface SkillCategorySectionProps {
  items: SkillCategory[];
  onAdd: () => void;
  onUpdate: (id: string, field: keyof SkillCategory, value: string) => void;
  onRemove: (id: string) => void;
}

export const SkillCategorySection = React.memo(
  ({ items, onAdd, onUpdate, onRemove }: SkillCategorySectionProps) => {
    return (
      <div className="space-y-6">
        {items.map((category, index) => (
          <div
            key={category.id}
            className="relative p-4 border-2 border-black/10 dark:border-white/10 rounded-none bg-white dark:bg-[#111111] shadow-none mb-4"
          >
            <Button
              onClick={() => onRemove(category.id)}
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 h-8 w-8 text-black/40 dark:text-white/40 hover:text-red-500 hover:bg-red-500/10 rounded-none"
              aria-label={`Remove skill category ${index + 1}`}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <h4 className="text-sm font-semibold text-black/80 dark:text-white/80 mb-3 pr-8">
              Category {index + 1}
            </h4>
            <div className="space-y-4">
              <div>
                <Label className="block text-xs font-medium text-black/70 dark:text-white/50 mb-1">
                  Category Name
                </Label>
                <Input
                  type="text"
                  value={category.name}
                  onChange={(e) =>
                    onUpdate(category.id, "name", e.target.value)
                  }
                  className="w-full"
                  placeholder="Frontend, Backend, Tools…"
                />
              </div>
              <div>
                <Label className="block text-xs font-medium text-black/70 dark:text-white/50 mb-1">
                  Skills
                </Label>
                <RichTextEditor
                  value={category.skills}
                  onChange={(val) => onUpdate(category.id, "skills", val)}
                  placeholder="React, Next.js, Node.js…"
                />
              </div>
            </div>
          </div>
        ))}
        <Button
          onClick={onAdd}
          variant="outline"
          className="w-full border-2 border-dashed border-black/10 dark:border-white/10 text-black/60 dark:text-white/60 hover:border-accent hover:text-accent flex items-center justify-center gap-2 transition-colors rounded-none"
        >
          <Plus className="w-4 h-4" /> Add Skill Category
        </Button>
      </div>
    );
  },
);

SkillCategorySection.displayName = "SkillCategorySection";
