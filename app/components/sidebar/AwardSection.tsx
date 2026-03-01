import React from "react";
import { Award } from "../../types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";
import { RichTextEditor } from "../RichTextEditor";

interface AwardSectionProps {
  items: Award[];
  onAdd: () => void;
  onUpdate: (id: string, field: keyof Award, value: string) => void;
  onRemove: (id: string) => void;
}

export const AwardSection = React.memo(
  ({ items, onAdd, onUpdate, onRemove }: AwardSectionProps) => {
    return (
      <div className="space-y-6">
        {items.map((award, index) => (
          <div
            key={award.id}
            className="relative p-4 border border-slate-200 dark:border-border rounded-lg bg-white dark:bg-background shadow-sm"
          >
            <Button
              onClick={() => onRemove(award.id)}
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-card"
              aria-label={`Remove award ${index + 1}`}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3 pr-8">
              Award {index + 1}
            </h4>
            <div className="space-y-4">
              <div>
                <Label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
                  Award Name
                </Label>
                <Input
                  type="text"
                  value={award.name}
                  onChange={(e) =>
                    updateAward(award.id, "name", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-slate-300 dark:border-border rounded-md text-sm focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all dark:bg-card dark:text-slate-200 placeholder:text-slate-400"
                  placeholder="Employee of the Year"
                />
              </div>
              <div>
                <Label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
                  Issuer
                </Label>
                <Input
                  type="text"
                  value={award.issuer}
                  onChange={(e) =>
                    updateAward(award.id, "issuer", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-slate-300 dark:border-border rounded-md text-sm focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all dark:bg-card dark:text-slate-200 placeholder:text-slate-400"
                  placeholder="Tech Innovators Inc."
                />
              </div>
              <div>
                <Label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
                  Date
                </Label>
                <Input
                  type="text"
                  value={award.date}
                  onChange={(e) =>
                    updateAward(award.id, "date", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-slate-300 dark:border-border rounded-md text-sm focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all dark:bg-card dark:text-slate-200 placeholder:text-slate-400"
                  placeholder="Dec 2022"
                />
              </div>
              <div>
                <Label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
                  Description
                </Label>
                <RichTextEditor
                  value={award.description}
                  onChange={(val) => updateAward(award.id, "description", val)}
                  placeholder="Recognized for outstanding contributions…"
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
          <Plus className="w-4 h-4" /> Add Award
        </Button>
      </div>
    );
  },
);

AwardSection.displayName = "AwardSection";

// Helper internal function to match local component usage (though passed from props)
const updateAward = (id: string, field: string, value: string) => {
  // This is a placeholder as the actual updater is passed via props
};
