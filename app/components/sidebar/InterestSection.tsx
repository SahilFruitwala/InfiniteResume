import React from "react";
import { Interest } from "../../types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";

interface InterestSectionProps {
  items: Interest[];
  onAdd: () => void;
  onUpdate: (id: string, field: keyof Interest, value: string) => void;
  onRemove: (id: string) => void;
}

export const InterestSection = React.memo(
  ({ items, onAdd, onUpdate, onRemove }: InterestSectionProps) => {
    return (
      <div className="space-y-6">
        {items.map((interest, index) => (
          <div
            key={interest.id}
            className="relative p-4 border-2 border-black/10 dark:border-white/10 rounded-none bg-white dark:bg-[#111111] shadow-none mb-4"
          >
            <Button
              onClick={() => onRemove(interest.id)}
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 h-8 w-8 text-black/40 dark:text-white/40 hover:text-red-500 hover:bg-red-500/10 rounded-none"
              aria-label={`Remove interest ${index + 1}`}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <h4 className="text-sm font-semibold text-black/80 dark:text-white/80 mb-3 pr-8">
              Interest {index + 1}
            </h4>
            <div className="space-y-4">
              <div>
                <Label className="block text-xs font-medium text-black/70 dark:text-white/50 mb-1">
                  Interest Name
                </Label>
                <Input
                  type="text"
                  value={interest.name}
                  onChange={(e) =>
                    onUpdate(interest.id, "name", e.target.value)
                  }
                  className="w-full"
                  placeholder="Photography, Hiking…"
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
          <Plus className="w-4 h-4" /> Add Interest
        </Button>
      </div>
    );
  },
);

InterestSection.displayName = "InterestSection";
