import React from "react";
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
} from "lucide-react";
import { useTheme } from "next-themes";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem as ShadcnAccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface RightSidebarProps {
  data: ResumeData;
  onChange: (data: ResumeData | ((prev: ResumeData) => ResumeData)) => void;
  template: TemplateType;
  onTemplateChange: (template: TemplateType) => void;
}

const AccordionItem = ({
  title,
  children,
  defaultOpen = false,
  value,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  value?: string;
}) => {
  const itemValue = value || title.toLowerCase().replace(/\s+/g, "-");
  return (
    <ShadcnAccordionItem
      value={itemValue}
      className="border-b border-slate-200 dark:border-slate-800 last:border-0"
    >
      <AccordionTrigger className="w-full flex justify-between items-center py-4 px-6 bg-white dark:bg-card hover:bg-accent dark:hover:bg-accent hover:text-black transition-colors text-left font-bold uppercase tracking-tight text-black dark:text-white hover:no-underline data-[state=open]:bg-accent data-[state=open]:text-black">
        {title}
      </AccordionTrigger>
      <AccordionContent className="p-6 bg-white dark:bg-[#111111] px-6 border-t-2 border-black/5 dark:border-white/5">
        {children}
      </AccordionContent>
    </ShadcnAccordionItem>
  );
};

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
          className="cursor-grab active:cursor-grabbing text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 p-1"
          {...attributes}
          {...listeners}
          type="button"
        >
          <GripVertical className="w-4 h-4" />
        </button>
        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
          {name}
        </span>
      </div>
      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 bg-slate-50 dark:bg-slate-700 text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
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
          className="h-7 w-7 bg-slate-50 dark:bg-slate-700 text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
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

export const RightSidebar = ({
  data,
  onChange,
  template,
  onTemplateChange,
}: RightSidebarProps) => {
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
  // We use the app's theme for dark/light mode consistency,
  // but we don't force the resume's accent color to follow the app's accent color.
  const isAppDark =
    appTheme === "dark" ||
    (appTheme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  const defaultResumeAccent = "#000000"; // Neutral black
  const defaultProfessionalBorder = "#00000040";

  return (
    <div className="w-80 bg-white dark:bg-card border-l border-slate-200 dark:border-border h-screen flex flex-col shadow-sm z-10 print:hidden shrink-0 transition-colors">
      <div className="p-6 border-b-2 border-black/10 dark:border-white/10 bg-white dark:bg-card text-black dark:text-white flex justify-between items-center shrink-0 transition-colors">
        <div>
          <h2 className="font-display text-2xl font-black uppercase tracking-tighter">
            Design <span className="text-accent">Settings</span>
          </h2>
          <p className="font-mono text-[10px] uppercase tracking-widest text-black/40 dark:text-white/40 mt-1">
            Customize your visual impact.
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-10 custom-scrollbar">
        <Accordion
          type="multiple"
          className="w-full"
          defaultValue={["template", "theme-modes"]}
        >
          <AccordionItem title="Template Selection" value="template">
            <div className="space-y-4">
              <div>
                <Label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-2">
                  Select Template
                </Label>
                <Select
                  value={template}
                  onValueChange={(value) =>
                    onTemplateChange(value as TemplateType)
                  }
                >
                  <SelectTrigger className="w-full bg-white dark:bg-card dark:border-border dark:text-slate-200">
                    <SelectValue placeholder="Select Template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minimal">Minimal</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
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
                <Label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-2">
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
                    className="w-10 h-10 p-1 border border-slate-300 rounded-md cursor-pointer"
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
                    className="flex-1 px-3 py-2 border border-slate-300 dark:border-border rounded-md text-sm focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all font-mono dark:bg-card dark:text-slate-200 placeholder:text-slate-400"
                  />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  Used for headings, borders, and decorative elements depending
                  on the template.
                </p>
              </div>

              {template === "professional" && (
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                  <Label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-2">
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
                      className="w-10 h-10 p-1 border border-slate-300 dark:border-border rounded-md cursor-pointer dark:bg-card"
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
                      className="flex-1 px-3 py-2 border border-slate-300 dark:border-border rounded-md text-sm focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all font-mono dark:bg-card dark:text-slate-200 placeholder:text-slate-400"
                    />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    Supports hex with opacity (e.g. #16A34A40).
                  </p>
                </div>
              )}

              {template === "modern" && (
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                  <Label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-2">
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
                      className="w-10 h-10 p-1 border border-slate-300 dark:border-border rounded-md cursor-pointer dark:bg-card"
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
                      className="flex-1 px-3 py-2 border border-slate-300 dark:border-border rounded-md text-sm focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all font-mono dark:bg-card dark:text-slate-200 placeholder:text-slate-400"
                    />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    Used for icons, links, and decorative elements in the Modern
                    template.
                  </p>
                </div>
              )}

              {template === "minimal" && (
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                  <Label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-2">
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
                      className="w-10 h-10 p-1 border border-slate-300 dark:border-border rounded-md cursor-pointer dark:bg-card"
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
                      className="flex-1 px-3 py-2 border border-slate-300 dark:border-border rounded-md text-sm focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all font-mono dark:bg-card dark:text-slate-200 placeholder:text-slate-400"
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
                <Label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
                  Font Family
                </Label>
                <Select
                  value={data.typography.fontFamily}
                  onValueChange={(value) =>
                    onChange({
                      ...data,
                      typography: { ...data.typography, fontFamily: value },
                    })
                  }
                >
                  <SelectTrigger className="w-full bg-white dark:bg-card dark:border-border dark:text-slate-200">
                    <SelectValue placeholder="Select a font" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="var(--font-inter)">
                      Inter (Sans-serif)
                    </SelectItem>
                    <SelectItem value="var(--font-roboto)">
                      Roboto (Sans-serif)
                    </SelectItem>
                    <SelectItem value="var(--font-open-sans)">
                      Open Sans (Sans-serif)
                    </SelectItem>
                    <SelectItem value="var(--font-merriweather)">
                      Merriweather (Serif)
                    </SelectItem>
                    <SelectItem value="var(--font-playfair)">
                      Playfair Display (Serif)
                    </SelectItem>
                    <SelectItem value="var(--font-lora)">
                      Lora (Serif)
                    </SelectItem>
                    <SelectItem value="var(--font-montserrat)">
                      Montserrat (Sans-serif)
                    </SelectItem>
                    <SelectItem value="var(--font-poppins)">
                      Poppins (Sans-serif)
                    </SelectItem>
                    <SelectItem value="var(--font-raleway)">
                      Raleway (Sans-serif)
                    </SelectItem>
                    <SelectItem value="var(--font-lato)">
                      Lato (Sans-serif)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
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
                    className="w-full px-3 py-2 border border-slate-300 dark:border-border rounded-md text-sm focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all dark:bg-card dark:text-slate-200 placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <Label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
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
                    className="w-full px-3 py-2 border border-slate-300 dark:border-border rounded-md text-sm focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all dark:bg-card dark:text-slate-200 placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <Label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
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
                    className="w-full px-3 py-2 border border-slate-300 dark:border-border rounded-md text-sm focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all dark:bg-card dark:text-slate-200 placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <Label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
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
                          fontSizeItemHeading: parseInt(e.target.value) || 16,
                        },
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 dark:border-border rounded-md text-sm focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all dark:bg-card dark:text-slate-200 placeholder:text-slate-400"
                  />
                </div>
              </div>
            </div>
          </AccordionItem>

          <AccordionItem title="Spacing">
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
                    Section Gap (px)
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    max="64"
                    value={data.spacing?.sectionGap ?? 24}
                    onChange={(e) =>
                      onChange({
                        ...data,
                        spacing: {
                          ...data.spacing,
                          sectionGap: parseInt(e.target.value) || 0,
                        },
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 dark:border-border rounded-md text-sm focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all dark:bg-card dark:text-slate-200 placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <Label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
                    Title Gap (px)
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    max="48"
                    value={data.spacing?.sectionTitleGap ?? 16}
                    onChange={(e) =>
                      onChange({
                        ...data,
                        spacing: {
                          ...data.spacing,
                          sectionTitleGap: parseInt(e.target.value) || 0,
                        },
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 dark:border-border rounded-md text-sm focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all dark:bg-card dark:text-slate-200 placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <Label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
                    Item Gap (px)
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    max="48"
                    value={data.spacing?.itemGap ?? 16}
                    onChange={(e) =>
                      onChange({
                        ...data,
                        spacing: {
                          ...data.spacing,
                          itemGap: parseInt(e.target.value) || 0,
                        },
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 dark:border-border rounded-md text-sm focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all dark:bg-card dark:text-slate-200 placeholder:text-slate-400"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
                    Top Margin (px)
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    max="120"
                    value={data.spacing?.pageMarginTop ?? 32}
                    onChange={(e) =>
                      onChange({
                        ...data,
                        spacing: {
                          ...data.spacing,
                          pageMarginTop: parseInt(e.target.value) || 0,
                        },
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 dark:border-border rounded-md text-sm focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all dark:bg-card dark:text-slate-200 placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <Label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
                    Bottom Margin (px)
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    max="120"
                    value={data.spacing?.pageMarginBottom ?? 32}
                    onChange={(e) =>
                      onChange({
                        ...data,
                        spacing: {
                          ...data.spacing,
                          pageMarginBottom: parseInt(e.target.value) || 0,
                        },
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 dark:border-border rounded-md text-sm focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all dark:bg-card dark:text-slate-200 placeholder:text-slate-400"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
                    Bullet Gap (px)
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    max="32"
                    value={data.spacing?.bulletItemGap ?? 4}
                    onChange={(e) =>
                      onChange({
                        ...data,
                        spacing: {
                          ...data.spacing,
                          bulletItemGap: parseInt(e.target.value) || 0,
                        },
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 dark:border-border rounded-md text-sm focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all dark:bg-card dark:text-slate-200 placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <Label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
                    List Margin (px)
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    max="32"
                    value={data.spacing?.bulletListMargin ?? 4}
                    onChange={(e) =>
                      onChange({
                        ...data,
                        spacing: {
                          ...data.spacing,
                          bulletListMargin: parseInt(e.target.value) || 0,
                        },
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 dark:border-border rounded-md text-sm focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all dark:bg-card dark:text-slate-200 placeholder:text-slate-400"
                  />
                </div>
              </div>
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 mt-4">
                <Label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-2">
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
                  <SelectTrigger className="w-full bg-white dark:bg-card dark:border-border dark:text-slate-200">
                    <SelectValue placeholder="Select Page Size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LETTER">
                      US Letter (8.5&quot; x 11&quot;)
                    </SelectItem>
                    <SelectItem value="A4">A4 (210mm x 297mm)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  Adjusts the preview dimensions and PDF generation format.
                </p>
              </div>
            </div>
          </AccordionItem>

          <AccordionItem title="Layout & Structure">
            <div className="space-y-2">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
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
                          layout: { ...data.layout, sectionOrder: newOrder },
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
                          layout: { ...data.layout, sectionOrder: newOrder },
                        });
                      }}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            </div>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};
