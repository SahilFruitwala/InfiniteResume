import React from "react";
import { Award } from "@app/types";
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
            className="relative p-4 border-2 border-black/10 dark:border-white/10 rounded-none bg-white dark:bg-[#111111] shadow-none mb-4"
          >
            <Button
              onClick={() => onRemove(award.id)}
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 h-8 w-8 text-black/40 dark:text-white/40 hover:text-red-500 hover:bg-red-500/10 rounded-none"
              aria-label={`Remove award ${index + 1}`}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <h4 className="text-sm font-semibold text-black/80 dark:text-white/80 mb-3 pr-8">
              Award {index + 1}
            </h4>
            <div className="space-y-4">
              <div>
                <Label className="block text-xs font-medium text-black/70 dark:text-white/50 mb-1">
                  Award Name
                </Label>
                <Input
                  type="text"
                  value={award.name}
                  onChange={(e) =>
                    updateAward(award.id, "name", e.target.value)
                  }
                  className="w-full"
                  placeholder="Employee of the Year"
                />
              </div>
              <div>
                <Label className="block text-xs font-medium text-black/70 dark:text-white/50 mb-1">
                  Issuer
                </Label>
                <Input
                  type="text"
                  value={award.issuer}
                  onChange={(e) =>
                    updateAward(award.id, "issuer", e.target.value)
                  }
                  className="w-full"
                  placeholder="Tech Innovators Inc."
                />
              </div>
              <div>
                <Label className="block text-xs font-medium text-black/70 dark:text-white/50 mb-1">
                  Date
                </Label>
                <Input
                  type="text"
                  value={award.date}
                  onChange={(e) =>
                    updateAward(award.id, "date", e.target.value)
                  }
                  className="w-full"
                  placeholder="Dec 2022"
                />
              </div>
              <div>
                <Label className="block text-xs font-medium text-black/70 dark:text-white/50 mb-1">
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
          className="w-full border-2 border-dashed border-black/10 dark:border-white/10 text-black/60 dark:text-white/60 hover:border-accent hover:text-accent hover:bg-accent/10 flex items-center justify-center gap-2 transition-colors rounded-none"
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
