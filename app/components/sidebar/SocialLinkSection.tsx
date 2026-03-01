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
            className="relative p-4 border border-slate-200 dark:border-border rounded-lg bg-white dark:bg-card shadow-sm dark:shadow-lg"
          >
            <Button
              onClick={() => onRemove(link.id)}
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-card"
              aria-label={`Remove social link ${index + 1}`}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3 pr-8">
              Link {index + 1}
            </h4>
            <div className="space-y-4">
              <div>
                <Label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
                  Platform / Title
                </Label>
                <Input
                  type="text"
                  value={link.name}
                  onChange={(e) => onUpdate(link.id, "name", e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-border rounded-md text-sm focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all dark:bg-card dark:text-slate-200 placeholder:text-slate-400"
                  placeholder="LinkedIn, GitHub, Portfolio…"
                />
              </div>
              <div>
                <Label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
                  URL
                </Label>
                <Input
                  type="text"
                  value={link.url}
                  onChange={(e) => onUpdate(link.id, "url", e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-border rounded-md text-sm focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all dark:bg-card dark:text-slate-200 placeholder:text-slate-400"
                  placeholder="https://…"
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
          <Plus className="w-4 h-4" /> Add Link
        </Button>
      </div>
    );
  },
);

SocialLinkSection.displayName = "SocialLinkSection";
