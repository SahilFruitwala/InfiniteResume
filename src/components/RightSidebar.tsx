import React from "react";
import { cn } from "@/lib/utils";
import { ResumeData, TemplateType } from "@app/types";
import type { Id } from "@/convex/_generated/dataModel";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, GripVertical, RotateCcw } from "lucide-react";
import { useTheme } from "next-themes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Accordion } from "@/components/ui/accordion";
import { SidebarAccordionItem as AccordionItem } from "./shared/SidebarAccordionItem";
import { Slider } from "@/components/ui/slider";
import { AnalysisTab } from "./AnalysisTab";

interface RightSidebarProps {
  data: ResumeData;
  onChange: (data: ResumeData | ((prev: ResumeData) => ResumeData)) => void;
  template: TemplateType;
  onTemplateChange: (template: TemplateType) => void;
  onResetDesign: () => void;
  hasUnsavedDesignChanges: boolean;
  resumeId: Id<"resumes"> | null;
  onRequireApiKey?: () => void;
}

const SortableSectionItem = ({
  id,
  name,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: {
  id: string;
  name: string;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 20 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex justify-between items-center bg-white dark:bg-[#111111] border-2 border-black/10 dark:border-white/10 p-3 rounded-none shadow-none mb-2 ${
        isDragging
          ? "opacity-50 border-accent dark:border-accent ring-2 ring-accent/20"
          : ""
      }`}
    >
      <div className="flex items-center gap-2">
        <button
          className="cursor-grab active:cursor-grabbing text-black/30 dark:text-white/30 hover:text-accent p-1"
          {...attributes}
          {...listeners}
          type="button"
        >
          <GripVertical className="w-4 h-4" />
        </button>
        <span className="text-sm font-medium text-black/80 dark:text-white/80">
          {name}
        </span>
      </div>
      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 bg-transparent text-black/40 dark:text-white/40 hover:text-accent rounded-none"
          onClick={(e) => {
            e.stopPropagation();
            onMoveUp();
          }}
          disabled={isFirst}
        >
          <ArrowUp className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 bg-transparent text-black/40 dark:text-white/40 hover:text-accent rounded-none"
          onClick={(e) => {
            e.stopPropagation();
            onMoveDown();
          }}
          disabled={isLast}
        >
          <ArrowDown className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export const RightSidebar = React.memo(
  ({
    data,
    onChange,
    template,
    onTemplateChange,
    onResetDesign,
    hasUnsavedDesignChanges,
    resumeId,
    onRequireApiKey,
  }: RightSidebarProps) => {
    const [activeTab, setActiveTab] = React.useState("design");

    const sensors = useSensors(
      useSensor(PointerSensor),
      useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
      }),
    );

    const handleDragEnd = (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        const oldIndex = (data.layout?.sectionOrder || []).indexOf(
          active.id as string,
        );
        const newIndex = (data.layout?.sectionOrder || []).indexOf(
          over.id as string,
        );

        if (oldIndex !== -1 && newIndex !== -1) {
          const newOrder = arrayMove(
            data.layout?.sectionOrder || [],
            oldIndex,
            newIndex,
          );
          onChange({
            ...data,
            layout: { ...data.layout, sectionOrder: newOrder },
          });
        }
      }
    };

    const sectionNames: Record<string, string> = {
      summary: "Professional Summary",
      experience: "Experience",
      education: "Education",
      projects: "Projects",
      volunteerWork: "Volunteer Work",
      awards: "Awards & Certifications",
      skills: "Skills",
      languages: "Languages",
      interests: "Interests",
    };

    const getSectionName = (id: string) => {
      if (sectionNames[id]) return sectionNames[id];
      if (id.startsWith("custom-")) {
        const customId = id.replace("custom-", "");
        const section = data.customSections?.find((s) => s.id === customId);
        return section?.title || "Custom Section";
      }
      return id;
    };
    const { theme: appTheme, setTheme: setAppTheme } = useTheme();
    // Safe SSR check for dark mode detection
    const isAppDark =
      appTheme === "dark" ||
      (appTheme === "system" &&
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    const defaultResumeAccent = "#000000"; // Neutral black
    const defaultProfessionalBorder = "#00000040";

    return (
      <div className="w-full bg-white dark:bg-card border-l-2 border-black/10 dark:border-white/10 h-screen flex flex-col shadow-none z-10 print:hidden shrink-0 transition-colors">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex flex-col h-full"
        >
          <div className="pt-6 border-b-2 border-black/10 dark:border-white/10 bg-white dark:bg-card shrink-0">
            <div className="px-6 flex justify-between items-center mb-4">
              <div>
                <h2 className="font-display text-2xl font-black uppercase tracking-tighter">
                  Resume{" "}
                  <span className="text-accent">
                    {activeTab === "design" ? "Design" : "Analysis"}
                  </span>
                </h2>
                <p className="font-mono text-[10px] uppercase tracking-widest text-black/40 dark:text-white/40 mt-1">
                  {activeTab === "design"
                    ? "Customize your visual"
                    : "Optimize for ATS & job match"}
                </p>
              </div>
              {activeTab === "design" && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-black/40 dark:text-white/40 hover:text-accent rounded-none disabled:opacity-30 transition-all"
                  onClick={onResetDesign}
                  disabled={!hasUnsavedDesignChanges}
                  title="Restore Design Settings"
                >
                  <RotateCcw
                    className={`w-4 h-4 ${hasUnsavedDesignChanges ? "text-accent animate-in fade-in zoom-in duration-300" : ""}`}
                  />
                </Button>
              )}
            </div>

            <TabsList className="w-full grid grid-cols-2 rounded-none bg-black/5 dark:bg-white/5 h-10 mb-[-2px] border-t-2 border-black/10 dark:border-white/10">
              <TabsTrigger
                value="design"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase font-mono text-[10px] tracking-[0.2em] font-bold h-full"
              >
                Design
              </TabsTrigger>
              <TabsTrigger
                value="analysis"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase font-mono text-[10px] tracking-[0.2em] font-bold h-full"
              >
                Analysis
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-y-auto pb-10 custom-scrollbar">
            <TabsContent
              value="design"
              className="m-0 border-none outline-none"
            >
              <Accordion
                type="multiple"
                className="w-full"
                defaultValue={["theme-modes"]}
              >
                <AccordionItem title="Template Selection" value="template">
                  <div className="space-y-4">
                    <div>
                      <Label className="block text-xs font-medium text-black/70 dark:text-white/50 mb-2">
                        Select Template
                      </Label>
                      <Select
                        value={template}
                        onValueChange={(value) =>
                          onTemplateChange(value as TemplateType)
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Template" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="minimal">Minimal</SelectItem>
                          <SelectItem value="professional">
                            Professional
                          </SelectItem>
                          <SelectItem value="academic">Academic</SelectItem>
                          {/* Temporary disabled */}
                          {/* <SelectItem value="modern">Modern</SelectItem> */}
                          {/* <SelectItem value="creative">Creative</SelectItem> */}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </AccordionItem>
                {/* Theme & Colors hidden for now */}
                {/* 
          <AccordionItem title="Theme & Colors">
            <div className="space-y-4">
              <div>
                <Label className="block text-xs font-medium text-black/70 dark:text-white/50 mb-2">
                  Global Accent Color
                </Label>
                <div className="flex items-center gap-3">
                  <Input
                    type="color"
                    value={data.theme?.accentColor ?? defaultResumeAccent}
                    onChange={(e) =>
                      onChange({
                        ...data,
                        theme: { ...data.theme, accentColor: e.target.value },
                      })
                    }
                    className="w-10 h-10 p-1 border-2 border-black/10 dark:border-white/10 rounded-none cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={data.theme?.accentColor ?? defaultResumeAccent}
                    onChange={(e) =>
                      onChange({
                        ...data,
                        theme: { ...data.theme, accentColor: e.target.value },
                      })
                    }
                    className="flex-1 px-3 py-2 border-2 border-black/10 dark:border-white/10 rounded-none text-sm focus:border-accent outline-none transition-colors font-mono dark:bg-card dark:text-white placeholder:text-muted-foreground"
                  />
                </div>
                <p className="text-xs text-black/40 dark:text-white/40 mt-2">
                  Used for headings, borders, and decorative elements depending
                  on the template.
                </p>
              </div>

              {template === "professional" && (
                <div className="pt-4 border-t border-black/10 dark:border-white/10">
                  <Label className="block text-xs font-medium text-black/70 dark:text-white/50 mb-2">
                    Section Border Color (Professional)
                  </Label>
                  <div className="flex items-center gap-3">
                    <Input
                      type="color"
                      value={
                        data.theme?.professional?.sectionBorderColor?.slice(
                          0,
                          7,
                        ) ?? defaultResumeAccent
                      }
                      onChange={(e) => {
                        // Keep opacity if it was there, or default to 40 (25%)
                        const current =
                          data.theme?.professional?.sectionBorderColor ??
                          defaultProfessionalBorder;
                        const opacity =
                          current.length === 9 ? current.slice(7) : "40";
                        onChange({
                          ...data,
                          theme: {
                            ...data.theme,
                            professional: {
                              ...data.theme?.professional,
                              sectionBorderColor: e.target.value + opacity,
                            },
                          },
                        });
                      }}
                      className="w-10 h-10 p-1 border-2 border-black/10 dark:border-white/10 rounded-none cursor-pointer dark:bg-card"
                    />
                    <Input
                      type="text"
                      value={
                        data.theme?.professional?.sectionBorderColor ??
                        defaultProfessionalBorder
                      }
                      onChange={(e) =>
                        onChange({
                          ...data,
                          theme: {
                            ...data.theme,
                            professional: {
                              ...data.theme?.professional,
                              sectionBorderColor: e.target.value,
                            },
                          },
                        })
                      }
                      className="flex-1 px-3 py-2 border-2 border-black/10 dark:border-white/10 rounded-none text-sm focus:border-accent outline-none transition-colors font-mono dark:bg-card dark:text-white placeholder:text-muted-foreground"
                    />
                  </div>
                  <p className="text-xs text-black/40 dark:text-white/40 mt-2">
                    Supports hex with opacity (e.g. #16A34A40).
                  </p>
                </div>
              )}

              {template === "modern" && (
                <div className="pt-4 border-t border-black/10 dark:border-white/10">
                  <Label className="block text-xs font-medium text-black/70 dark:text-white/50 mb-2">
                    Primary Accent Color (Modern)
                  </Label>
                  <div className="flex items-center gap-3">
                    <Input
                      type="color"
                      value={
                        data.theme?.modern?.accentColor ?? defaultResumeAccent
                      }
                      onChange={(e) =>
                        onChange({
                          ...data,
                          theme: {
                            ...data.theme,
                            modern: {
                              ...data.theme?.modern,
                              accentColor: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-10 h-10 p-1 border-2 border-black/10 dark:border-white/10 rounded-none cursor-pointer dark:bg-card"
                    />
                    <Input
                      type="text"
                      value={
                        data.theme?.modern?.accentColor ?? defaultResumeAccent
                      }
                      onChange={(e) =>
                        onChange({
                          ...data,
                          theme: {
                            ...data.theme,
                            modern: {
                              ...data.theme?.modern,
                              accentColor: e.target.value,
                            },
                          },
                        })
                      }
                      className="flex-1 px-3 py-2 border-2 border-black/10 dark:border-white/10 rounded-none text-sm focus:border-accent outline-none transition-colors font-mono dark:bg-card dark:text-white placeholder:text-muted-foreground"
                    />
                  </div>
                  <p className="text-xs text-black/40 dark:text-white/40 mt-2">
                    Used for icons, links, and decorative elements in the Modern
                    template.
                  </p>
                </div>
              )}

              {template === "minimal" && (
                <div className="pt-4 border-t border-black/10 dark:border-white/10">
                  <Label className="block text-xs font-medium text-black/70 dark:text-white/50 mb-2">
                    Accent Color (Minimal)
                  </Label>
                  <div className="flex items-center gap-3">
                    <Input
                      type="color"
                      value={
                        data.theme?.minimal?.accentColor ?? defaultResumeAccent
                      }
                      onChange={(e) =>
                        onChange({
                          ...data,
                          theme: {
                            ...data.theme,
                            minimal: {
                              ...data.theme?.minimal,
                              accentColor: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-10 h-10 p-1 border-2 border-black/10 dark:border-white/10 rounded-none cursor-pointer dark:bg-card"
                    />
                    <Input
                      type="text"
                      value={
                        data.theme?.minimal?.accentColor ?? defaultResumeAccent
                      }
                      onChange={(e) =>
                        onChange({
                          ...data,
                          theme: {
                            ...data.theme,
                            minimal: {
                              ...data.theme?.minimal,
                              accentColor: e.target.value,
                            },
                          },
                        })
                      }
                      className="flex-1 px-3 py-2 border-2 border-black/10 dark:border-white/10 rounded-none text-sm focus:border-accent outline-none transition-colors font-mono dark:bg-card dark:text-white placeholder:text-muted-foreground"
                    />
                  </div>
                </div>
              )}
            </div>
          </AccordionItem>
          */}

                <AccordionItem title="Typography">
                  <div className="space-y-4">
                    <div>
                      <Label className="block text-xs font-medium text-black/70 dark:text-white/50 mb-1">
                        Font Family
                      </Label>
                      <Select
                        value={data.typography.fontFamily}
                        onValueChange={(value) =>
                          onChange({
                            ...data,
                            typography: {
                              ...data.typography,
                              fontFamily: value,
                            },
                          })
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a font" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="var(--font-inter)">
                            Inter (Sans-serif)
                          </SelectItem>
                          <SelectItem value="var(--font-lora)">
                            Lora (Serif)
                          </SelectItem>
                          <SelectItem value="var(--font-poppins)">
                            Poppins (Sans-serif)
                          </SelectItem>
                          <SelectItem value="var(--font-system)">
                            System UI (Sans-serif)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="block text-xs font-medium text-black/70 dark:text-white/50 mb-1">
                          Body (px)
                        </Label>
                        <Input
                          type="number"
                          min="10"
                          max="20"
                          value={data.typography.fontSizeBody}
                          onChange={(e) =>
                            onChange({
                              ...data,
                              typography: {
                                ...data.typography,
                                fontSizeBody: parseInt(e.target.value) || 14,
                              },
                            })
                          }
                          className="w-full"
                        />
                      </div>
                      <div>
                        <Label className="block text-xs font-medium text-black/70 dark:text-white/50 mb-1">
                          Name (px)
                        </Label>
                        <Input
                          type="number"
                          min="16"
                          max="64"
                          value={data.typography.fontSizeHeading}
                          onChange={(e) =>
                            onChange({
                              ...data,
                              typography: {
                                ...data.typography,
                                fontSizeHeading: parseInt(e.target.value) || 36,
                              },
                            })
                          }
                          className="w-full"
                        />
                      </div>
                      <div>
                        <Label className="block text-xs font-medium text-black/70 dark:text-white/50 mb-1">
                          Section (px)
                        </Label>
                        <Input
                          type="number"
                          min="12"
                          max="32"
                          value={data.typography.fontSizeSectionHeading}
                          onChange={(e) =>
                            onChange({
                              ...data,
                              typography: {
                                ...data.typography,
                                fontSizeSectionHeading:
                                  parseInt(e.target.value) || 18,
                              },
                            })
                          }
                          className="w-full"
                        />
                      </div>
                      <div>
                        <Label className="block text-xs font-medium text-black/70 dark:text-white/50 mb-1">
                          Item Title (px)
                        </Label>
                        <Input
                          type="number"
                          min="10"
                          max="32"
                          value={data.typography.fontSizeItemHeading ?? 16}
                          onChange={(e) =>
                            onChange({
                              ...data,
                              typography: {
                                ...data.typography,
                                fontSizeItemHeading:
                                  parseInt(e.target.value) || 16,
                              },
                            })
                          }
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                </AccordionItem>

                <AccordionItem title="Spacing">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-6">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <Label className="text-[10px] font-bold uppercase tracking-widest text-black/50 dark:text-white/40">
                            Section Gap
                          </Label>
                          <span className="text-[10px] font-mono font-bold text-accent bg-accent/10 px-1.5 py-0.5">
                            {data.spacing?.sectionGap ?? 24}px
                          </span>
                        </div>
                        <Slider
                          value={[data.spacing?.sectionGap ?? 24]}
                          min={0}
                          max={64}
                          step={1}
                          onValueChange={([value]) =>
                            onChange({
                              ...data,
                              spacing: {
                                ...data.spacing,
                                sectionGap: value,
                              },
                            })
                          }
                        />
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <Label className="text-[10px] font-bold uppercase tracking-widest text-black/50 dark:text-white/40">
                            Title Gap
                          </Label>
                          <span className="text-[10px] font-mono font-bold text-accent bg-accent/10 px-1.5 py-0.5">
                            {data.spacing?.sectionTitleGap ?? 16}px
                          </span>
                        </div>
                        <Slider
                          value={[data.spacing?.sectionTitleGap ?? 16]}
                          min={0}
                          max={48}
                          step={1}
                          onValueChange={([value]) =>
                            onChange({
                              ...data,
                              spacing: {
                                ...data.spacing,
                                sectionTitleGap: value,
                              },
                            })
                          }
                        />
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <Label className="text-[10px] font-bold uppercase tracking-widest text-black/50 dark:text-white/40">
                            Item Gap
                          </Label>
                          <span className="text-[10px] font-mono font-bold text-accent bg-accent/10 px-1.5 py-0.5">
                            {data.spacing?.itemGap ?? 16}px
                          </span>
                        </div>
                        <Slider
                          value={[data.spacing?.itemGap ?? 16]}
                          min={0}
                          max={48}
                          step={1}
                          onValueChange={([value]) =>
                            onChange({
                              ...data,
                              spacing: {
                                ...data.spacing,
                                itemGap: value,
                              },
                            })
                          }
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-black/50 dark:text-white/40">
                              Top Margin
                            </Label>
                            <span className="text-[10px] font-mono font-bold text-accent">
                              {data.spacing?.pageMarginTop ?? 32}
                            </span>
                          </div>
                          <Slider
                            value={[data.spacing?.pageMarginTop ?? 32]}
                            min={0}
                            max={120}
                            step={1}
                            onValueChange={([value]) =>
                              onChange({
                                ...data,
                                spacing: {
                                  ...data.spacing,
                                  pageMarginTop: value,
                                },
                              })
                            }
                          />
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-black/50 dark:text-white/40">
                              Bottom Margin
                            </Label>
                            <span className="text-[10px] font-mono font-bold text-accent">
                              {data.spacing?.pageMarginBottom ?? 32}
                            </span>
                          </div>
                          <Slider
                            value={[data.spacing?.pageMarginBottom ?? 32]}
                            min={0}
                            max={120}
                            step={1}
                            onValueChange={([value]) =>
                              onChange({
                                ...data,
                                spacing: {
                                  ...data.spacing,
                                  pageMarginBottom: value,
                                },
                              })
                            }
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-black/50 dark:text-white/40">
                              Bullet Gap
                            </Label>
                            <span className="text-[10px] font-mono font-bold text-accent">
                              {data.spacing?.bulletItemGap ?? 4}
                            </span>
                          </div>
                          <Slider
                            value={[data.spacing?.bulletItemGap ?? 4]}
                            min={0}
                            max={32}
                            step={1}
                            onValueChange={([value]) =>
                              onChange({
                                ...data,
                                spacing: {
                                  ...data.spacing,
                                  bulletItemGap: value,
                                },
                              })
                            }
                          />
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-black/50 dark:text-white/40">
                              List Margin
                            </Label>
                            <span className="text-[10px] font-mono font-bold text-accent">
                              {data.spacing?.bulletListMargin ?? 4}
                            </span>
                          </div>
                          <Slider
                            value={[data.spacing?.bulletListMargin ?? 4]}
                            min={0}
                            max={32}
                            step={1}
                            onValueChange={([value]) =>
                              onChange({
                                ...data,
                                spacing: {
                                  ...data.spacing,
                                  bulletListMargin: value,
                                },
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-black/10 dark:border-white/10 mt-4">
                      <Label className="block text-xs font-medium text-black/70 dark:text-white/50 mb-2">
                        Page Size
                      </Label>
                      <Select
                        value={data.spacing?.pageSize || "LETTER"}
                        onValueChange={(value) =>
                          onChange({
                            ...data,
                            spacing: {
                              ...data.spacing,
                              pageSize: value as "A4" | "LETTER",
                            },
                          })
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Page Size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="LETTER">
                            US Letter (8.5&quot; x 11&quot;)
                          </SelectItem>
                          <SelectItem value="A4">A4 (210mm x 297mm)</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-black/40 dark:text-white/40 mt-2">
                        Adjusts the preview dimensions and PDF generation
                        format.
                      </p>
                    </div>
                  </div>
                </AccordionItem>

                <AccordionItem title="Layout & Structure">
                  <div className="space-y-2">
                    <p className="text-xs text-black/40 dark:text-white/40 mb-3">
                      Drag handles or use arrows to reorder resume sections.
                    </p>
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                    >
                      <SortableContext
                        items={data.layout?.sectionOrder || []}
                        strategy={verticalListSortingStrategy}
                      >
                        {(
                          data.layout?.sectionOrder || [
                            "summary",
                            "experience",
                            "education",
                            "projects",
                            "volunteerWork",
                            "awards",
                            "skills",
                            "languages",
                            "interests",
                          ]
                        ).map((sectionId, index, array) => (
                          <SortableSectionItem
                            key={sectionId}
                            id={sectionId}
                            name={getSectionName(sectionId)}
                            isFirst={index === 0}
                            isLast={index === array.length - 1}
                            onMoveUp={() => {
                              if (index === 0) return;
                              const newOrder = [...array];
                              [newOrder[index - 1], newOrder[index]] = [
                                newOrder[index],
                                newOrder[index - 1],
                              ];
                              onChange({
                                ...data,
                                layout: {
                                  ...data.layout,
                                  sectionOrder: newOrder,
                                },
                              });
                            }}
                            onMoveDown={() => {
                              if (index === array.length - 1) return;
                              const newOrder = [...array];
                              [newOrder[index + 1], newOrder[index]] = [
                                newOrder[index],
                                newOrder[index + 1],
                              ];
                              onChange({
                                ...data,
                                layout: {
                                  ...data.layout,
                                  sectionOrder: newOrder,
                                },
                              });
                            }}
                          />
                        ))}
                      </SortableContext>
                    </DndContext>
                  </div>
                </AccordionItem>
              </Accordion>
            </TabsContent>

            <TabsContent
              value="analysis"
              className="m-0 border-none outline-none p-6 animate-in fade-in duration-500"
            >
              <AnalysisTab
                data={data}
                resumeId={resumeId}
                onRequireApiKey={onRequireApiKey}
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    );
  },
);

RightSidebar.displayName = "RightSidebar";
