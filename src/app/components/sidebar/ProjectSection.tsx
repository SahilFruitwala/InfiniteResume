import React from "react";
import { Project } from "../../types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";
import { RichTextEditor } from "../RichTextEditor";

interface ProjectSectionProps {
  items: Project[];
  onAdd: () => void;
  onUpdate: (id: string, field: keyof Project, value: string) => void;
  onRemove: (id: string) => void;
}

export const ProjectSection = React.memo(
  ({ items, onAdd, onUpdate, onRemove }: ProjectSectionProps) => {
    return (
      <div className="space-y-6">
        {items.map((proj, index) => (
          <div
            key={proj.id}
            className="relative p-4 border-2 border-black/10 dark:border-white/10 rounded-none bg-white dark:bg-[#111111] shadow-none mb-4"
          >
            <Button
              onClick={() => onRemove(proj.id)}
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 h-8 w-8 text-black/40 dark:text-white/40 hover:text-red-500 hover:bg-red-500/10 rounded-none"
              aria-label={`Remove project ${index + 1}`}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <h4 className="text-sm font-semibold text-black/80 dark:text-white/80 mb-3 pr-8">
              Project {index + 1}
            </h4>
            <div className="space-y-4">
              <div>
                <Label className="block text-xs font-medium text-black/70 dark:text-white/50 mb-1">
                  Project Name
                </Label>
                <Input
                  type="text"
                  value={proj.name}
                  onChange={(e) => onUpdate(proj.id, "name", e.target.value)}
                  className="w-full"
                  placeholder="E-commerce Platform"
                />
              </div>
              <div>
                <Label className="block text-xs font-medium text-black/70 dark:text-white/50 mb-1">
                  Link
                </Label>
                <Input
                  type="text"
                  value={proj.link}
                  onChange={(e) => onUpdate(proj.id, "link", e.target.value)}
                  className="w-full"
                  placeholder="github.com/johndoe/project"
                />
              </div>
              <div>
                <Label className="block text-xs font-medium text-black/70 dark:text-white/50 mb-1">
                  Description
                </Label>
                <RichTextEditor
                  value={proj.description}
                  onChange={(val) => onUpdate(proj.id, "description", val)}
                  placeholder="Describe the project and your role…"
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
          <Plus className="w-4 h-4" /> Add Project
        </Button>
      </div>
    );
  },
);

ProjectSection.displayName = "ProjectSection";
