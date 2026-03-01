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
            className="relative p-4 border border-slate-200 dark:border-border rounded-lg bg-white dark:bg-card shadow-sm dark:shadow-lg"
          >
            <Button
              onClick={() => onRemove(category.id)}
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-card"
              aria-label={`Remove skill category ${index + 1}`}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3 pr-8">
              Category {index + 1}
            </h4>
            <div className="space-y-4">
              <div>
                <Label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
                  Category Name
                </Label>
                <Input
                  type="text"
                  value={category.name}
                  onChange={(e) =>
                    onUpdate(category.id, "name", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-slate-300 dark:border-border rounded-md text-sm focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all dark:bg-card dark:text-slate-200 placeholder:text-slate-400"
                  placeholder="Frontend, Backend, Tools…"
                />
              </div>
              <div>
                <Label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
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
          className="w-full border-2 border-dashed border-slate-300 dark:border-border text-slate-600 dark:text-slate-400 hover:border-slate-800 dark:hover:border-slate-400 hover:text-slate-800 dark:hover:text-slate-200 flex items-center justify-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Skill Category
        </Button>
      </div>
    );
  },
);

SkillCategorySection.displayName = "SkillCategorySection";
