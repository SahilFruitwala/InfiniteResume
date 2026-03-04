import React from "react";
import { cn } from "@/lib/utils";
import { ResumeData, TemplateType } from "../types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  ArrowUp,
  ArrowDown,
  LayoutTemplate,
  GripVertical,
  Moon,
  Sun,
  Laptop,
  Palette,
  RotateCcw,
  Zap,
  Target,
  AlertCircle,
  CheckCircle2,
  Trophy,
  History,
  FileText as FileTextIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { analyzeResume, flattenResumeData } from "../utils/resume-analyzer";
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

interface RightSidebarProps {
  data: ResumeData;
  onChange: (data: ResumeData | ((prev: ResumeData) => ResumeData)) => void;
  template: TemplateType;
  onTemplateChange: (template: TemplateType) => void;
  onResetDesign: () => void;
  hasUnsavedDesignChanges: boolean;
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
  }: RightSidebarProps) => {
    const [jobDescription, setJobDescription] = React.useState("");
    const [activeTab, setActiveTab] = React.useState("design");

    const analysis = React.useMemo(() => {
      const flattened = flattenResumeData(data);
      return analyzeResume(flattened, jobDescription);
    }, [data, jobDescription]);

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
              className="m-0 border-none outline-none p-6 space-y-8 animate-in fade-in duration-500"
            >
              {/* Score Dashboard */}
              <div className="flex flex-col items-center text-center p-6 bg-black/5 dark:bg-white/5 border-2 border-black/10 dark:border-white/10 relative overflow-hidden group">
                <div className="absolute -top-6 -right-6 opacity-[0.03] dark:opacity-[0.05] group-hover:opacity-10 transition-opacity pointer-events-none -rotate-12 z-0">
                  <Zap className="w-24 h-24 text-accent" />
                </div>
                <span className="relative z-10 font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 dark:text-white/40 mb-2">
                  Overall Resume Score
                </span>
                <div className="relative z-10">
                  <span className="text-6xl font-black tracking-tighter text-black dark:text-white">
                    {analysis.standaloneScore}
                    <span className="text-2xl text-accent">/100</span>
                  </span>
                </div>
                <div className="w-full mt-6 space-y-4">
                  {/* Profile & Format (40pts) */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[9px] font-mono uppercase tracking-widest px-1">
                      <span className="text-black/60 dark:text-white/40">
                        Profile & Format
                      </span>
                      <span className="text-accent font-bold">
                        {analysis.scoreBreakdown.length +
                          analysis.scoreBreakdown.contactInfo}
                        /40
                      </span>
                    </div>
                    <Progress
                      value={
                        ((analysis.scoreBreakdown.length +
                          analysis.scoreBreakdown.contactInfo) /
                          40) *
                        100
                      }
                      className="h-1 bg-black/10 dark:bg-white/10"
                    />
                  </div>

                  {/* Action & Impact (30pts) */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[9px] font-mono uppercase tracking-widest px-1">
                      <span className="text-black/60 dark:text-white/40">
                        Action & Impact
                      </span>
                      <span className="text-accent font-bold">
                        {analysis.scoreBreakdown.actionVerbs}/30
                      </span>
                    </div>
                    <Progress
                      value={(analysis.scoreBreakdown.actionVerbs / 30) * 100}
                      className="h-1 bg-black/10 dark:bg-white/10"
                    />
                  </div>

                  {/* Results & Metrics (30pts) */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[9px] font-mono uppercase tracking-widest px-1">
                      <span className="text-black/60 dark:text-white/40">
                        Results & Metrics
                      </span>
                      <span className="text-accent font-bold">
                        {analysis.scoreBreakdown.metrics}/30
                      </span>
                    </div>
                    <Progress
                      value={(analysis.scoreBreakdown.metrics / 30) * 100}
                      className="h-1 bg-black/10 dark:bg-white/10"
                    />
                  </div>

                  {/* Penalties (if negative) */}
                  {analysis.scoreBreakdown.penalties < 0 && (
                    <div className="pt-1">
                      <div className="flex justify-between items-center text-[9px] font-mono uppercase tracking-widest px-1 mb-1">
                        <span className="text-red-500/60 font-bold flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Optimization Penalties
                        </span>
                        <span className="text-red-500 font-bold">
                          {analysis.scoreBreakdown.penalties}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Job Matching */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-accent" />
                  <h3 className="font-display font-black uppercase tracking-tight text-sm">
                    Job Description Match
                  </h3>
                </div>
                <div className="space-y-3 bg-white dark:bg-[#111] border-2 border-black/10 dark:border-white/10 p-4">
                  <Textarea
                    placeholder="Paste job description here to check your match score..."
                    className="min-h-[120px] rounded-none border-black/10 dark:border-white/10 focus:border-accent text-xs font-mono leading-relaxed resize-none"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                  />
                  {jobDescription && analysis.matchScore !== null && (
                    <div className="pt-2 animate-in fade-in slide-in-from-top-2 duration-500">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-black/60 dark:text-white/40">
                          Match Score
                        </span>
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "font-mono text-xs font-bold",
                              analysis.matchScore >= 80
                                ? "text-emerald-500"
                                : analysis.matchScore >= 50
                                  ? "text-amber-500"
                                  : "text-red-500",
                            )}
                          >
                            {analysis.matchScore}%
                          </span>
                          <Badge
                            variant="outline"
                            className="rounded-none border-accent text-[8px] py-0 h-4 uppercase font-mono tracking-tighter"
                          >
                            {analysis.matchScoreConfidence} Confidence
                          </Badge>
                        </div>
                      </div>
                      <Progress
                        value={analysis.matchScore}
                        className={cn(
                          "h-1.5 bg-black/10 dark:bg-white/10 [&>div]:transition-all duration-1000",
                          analysis.matchScore >= 80
                            ? "[&>div]:bg-emerald-500"
                            : analysis.matchScore >= 50
                              ? "[&>div]:bg-amber-500"
                              : "[&>div]:bg-red-500",
                        )}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Industry Context */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-accent" />
                  <h3 className="font-display font-black uppercase tracking-tight text-sm">
                    Found Industry
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-black/5 dark:bg-white/5 border-2 border-black/10 dark:border-white/10">
                    <span className="block text-[8px] font-mono uppercase text-black/40 dark:text-white/40 mb-1">
                      Primary
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-black dark:text-white">
                      {analysis.detectedIndustry}
                    </span>
                  </div>
                  {analysis.detectedIndustrySecondary && (
                    <div className="p-3 bg-black/5 dark:bg-white/5 border-2 border-black/10 dark:border-white/10">
                      <span className="block text-[8px] font-mono uppercase text-black/40 dark:text-white/40 mb-1">
                        Secondary
                      </span>
                      <span className="text-xs font-bold uppercase tracking-wider text-black dark:text-white/80">
                        {analysis.detectedIndustrySecondary}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Suggestions */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-accent" />
                  <h3 className="font-display font-black uppercase tracking-tight text-sm">
                    Smart Suggestions
                  </h3>
                </div>
                <div className="space-y-2">
                  {analysis.suggestions.map((s, i) => (
                    <div
                      key={i}
                      className={cn(
                        "p-3 border-l-2 flex gap-3 items-start",
                        s.severity === "error"
                          ? "bg-red-500/5 border-red-500/30"
                          : s.severity === "warning"
                            ? "bg-amber-500/5 border-amber-500/30"
                            : "bg-emerald-500/5 border-emerald-500/30",
                      )}
                    >
                      {s.severity === "error" ? (
                        <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      ) : s.severity === "warning" ? (
                        <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      )}
                      <p className="text-[11px] leading-relaxed text-black/70 dark:text-white/70">
                        {s.message}
                      </p>
                    </div>
                  ))}
                  {analysis.suggestions.length === 0 && (
                    <div className="p-4 border-2 border-dashed border-black/10 dark:border-white/10 text-center">
                      <Trophy className="w-6 h-6 text-accent mx-auto mb-2" />
                      <p className="text-[10px] text-black/40 dark:text-white/40 italic">
                        Your resume is in perfect shape!
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Keywords Recap */}
              {analysis.missingKeywords.length > 0 && jobDescription && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-accent" />
                    <h3 className="font-display font-black uppercase tracking-tight text-sm">
                      Missing Keywords
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {analysis.missingKeywords.slice(0, 15).map((kw, i) => (
                      <Badge
                        key={i}
                        variant="ghost"
                        className="rounded-none bg-red-500/5 hover:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 text-[9px] px-2 py-0.5 font-mono"
                      >
                        {kw}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 pb-4">
                <div className="space-y-1">
                  <span className="text-[8px] font-mono uppercase text-black/40 dark:text-white/40">
                    Word Count
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold">
                      {analysis.wordCount}
                    </span>
                    <span className="text-[10px] text-black/40">Words</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[8px] font-mono uppercase text-black/40 dark:text-white/40">
                    Action Verbs
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold">
                      {analysis.actionVerbsFound.length}
                    </span>
                    <span className="text-[10px] text-black/40">Found</span>
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    );
  },
);

RightSidebar.displayName = "RightSidebar";
