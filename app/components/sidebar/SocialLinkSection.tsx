import React from "react";
import { SocialLink } from "../../types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";

interface SocialLinkSectionProps {
  items: SocialLink[];
  onAdd: () => void;
  onUpdate: (id: string, field: keyof SocialLink, value: string) => void;
  onRemove: (id: string) => void;
}

export const SocialLinkSection = React.memo(
  ({ items, onAdd, onUpdate, onRemove }: SocialLinkSectionProps) => {
    return (
      <div className="space-y-6">
        {items.map((link, index) => (
          <div
            key={link.id}
            className="relative p-4 border-2 border-black/10 dark:border-white/10 rounded-none bg-white dark:bg-[#111111] shadow-none mb-4"
          >
            <Button
              onClick={() => onRemove(link.id)}
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 h-8 w-8 text-black/40 dark:text-white/40 hover:text-red-500 hover:bg-red-500/10 rounded-none"
              aria-label={`Remove social link ${index + 1}`}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <h4 className="text-sm font-semibold text-black/80 dark:text-white/80 mb-3 pr-8">
              Link {index + 1}
            </h4>
            <div className="space-y-4">
              <div>
                <Label className="block text-xs font-medium text-black/70 dark:text-white/50 mb-1">
                  Platform / Title
                </Label>
                <Input
                  type="text"
                  value={link.name}
                  onChange={(e) => onUpdate(link.id, "name", e.target.value)}
                  className="w-full"
                  placeholder="LinkedIn, GitHub, Portfolio…"
                />
              </div>
              <div>
                <Label className="block text-xs font-medium text-black/70 dark:text-white/50 mb-1">
                  URL
                </Label>
                <Input
                  type="text"
                  value={link.url}
                  onChange={(e) => onUpdate(link.id, "url", e.target.value)}
                  className="w-full"
                  placeholder="https://…"
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
          <Plus className="w-4 h-4" /> Add Link
        </Button>
      </div>
    );
  },
);

SocialLinkSection.displayName = "SocialLinkSection";
