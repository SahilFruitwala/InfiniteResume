import React from "react";
import { CustomSection, CustomSectionItem } from "../../types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";
import { RichTextEditor } from "../RichTextEditor";

interface CustomSectionEditorProps {
  section: CustomSection;
  onUpdateTitle: (title: string) => void;
  onAddItem: () => void;
  onUpdateItem: (
    id: string,
    field: keyof CustomSectionItem,
    value: string,
  ) => void;
  onRemoveItem: (id: string) => void;
  onRemoveSection: () => void;
}

export const CustomSectionEditor = React.memo(
  ({
    section,
    onUpdateTitle,
    onAddItem,
    onUpdateItem,
    onRemoveItem,
    onRemoveSection,
  }: CustomSectionEditorProps) => {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1">
            <Label className="block text-xs font-medium text-black/40 dark:text-white/40 mb-1 uppercase tracking-wider">
              Section Title
            </Label>
            <Input
              value={section.title}
              onChange={(e) => onUpdateTitle(e.target.value)}
              className="text-lg font-bold bg-transparent border-none px-0 focus-visible:ring-0 dark:text-white"
              placeholder="e.g., Publications, Projects, etc."
            />
          </div>
          <Button
            onClick={onRemoveSection}
            variant="ghost"
            size="icon"
            className="text-black/40 dark:text-white/40 hover:text-red-500 hover:bg-red-500/10 transition-colors"
            aria-label="Remove Section"
          >
            <Trash2 className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-6 pl-4 border-l-2 border-black/10 dark:border-white/10">
          {section.items.map((item, index) => (
            <div
              key={item.id}
              className="relative p-4 border-2 border-black/10 dark:border-white/10 rounded-none bg-white dark:bg-[#111111] shadow-none mb-4"
            >
              <Button
                onClick={() => onRemoveItem(item.id)}
                variant="ghost"
                size="icon"
                className="absolute top-3 right-3 h-8 w-8 text-black/40 dark:text-white/40 hover:text-red-500 hover:bg-red-500/10 rounded-none"
                aria-label={`Remove item ${index + 1}`}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              <h4 className="text-sm font-semibold text-black/80 dark:text-white/80 mb-3 pr-8">
                Item {index + 1}
              </h4>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="block text-xs font-medium text-black/70 dark:text-white/50 mb-1">
                      Title
                    </Label>
                    <Input
                      type="text"
                      value={item.title}
                      onChange={(e) =>
                        onUpdateItem(item.id, "title", e.target.value)
                      }
                      className="w-full"
                      placeholder="e.g. Research Assistant"
                    />
                  </div>
                  <div>
                    <Label className="block text-xs font-medium text-black/70 dark:text-white/50 mb-1">
                      Subtitle / Org
                    </Label>
                    <Input
                      type="text"
                      value={item.subtitle || ""}
                      onChange={(e) =>
                        onUpdateItem(item.id, "subtitle", e.target.value)
                      }
                      className="w-full"
                      placeholder="e.g. Stanford University"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="block text-xs font-medium text-black/70 dark:text-white/50 mb-1">
                      Start Date
                    </Label>
                    <Input
                      type="text"
                      value={item.startDate || ""}
                      onChange={(e) =>
                        onUpdateItem(item.id, "startDate", e.target.value)
                      }
                      className="w-full"
                      placeholder="e.g. Jan 2022"
                    />
                  </div>
                  <div>
                    <Label className="block text-xs font-medium text-black/70 dark:text-white/50 mb-1">
                      End Date
                    </Label>
                    <Input
                      type="text"
                      value={item.endDate || ""}
                      onChange={(e) =>
                        onUpdateItem(item.id, "endDate", e.target.value)
                      }
                      className="w-full"
                      placeholder="e.g. Present"
                    />
                  </div>
                </div>
                <div>
                  <Label className="block text-xs font-medium text-black/70 dark:text-white/50 mb-1">
                    Location
                  </Label>
                  <Input
                    type="text"
                    value={item.location || ""}
                    onChange={(e) =>
                      onUpdateItem(item.id, "location", e.target.value)
                    }
                    className="w-full"
                    placeholder="e.g. Palo Alto, CA"
                  />
                </div>
                <div>
                  <Label className="block text-xs font-medium text-black/70 dark:text-white/50 mb-1">
                    Description
                  </Label>
                  <RichTextEditor
                    value={item.description || ""}
                    onChange={(val) =>
                      onUpdateItem(item.id, "description", val)
                    }
                    placeholder="Describe your work or achievement…"
                  />
                </div>
              </div>
            </div>
          ))}
          <Button
            onClick={onAddItem}
            variant="outline"
            className="w-full border-2 border-dashed border-black/10 dark:border-white/10 text-black/60 dark:text-white/60 hover:border-accent hover:text-accent hover:bg-accent/10 flex items-center justify-center gap-2 transition-colors rounded-none"
          >
            <Plus className="w-4 h-4" /> Add Item
          </Button>
        </div>
      </div>
    );
  },
);

CustomSectionEditor.displayName = "CustomSectionEditor";
