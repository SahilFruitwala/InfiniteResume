import React, { useState } from "react";
// Sidebar component for editing resume data
import {
  ResumeData,
  Experience,
  Education,
  Project,
  SocialLink,
  Award,
  Language,
  Volunteer,
  Interest,
  TemplateType,
  SkillCategory,
  CustomSection,
  CustomSectionItem,
} from "../types";
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  ArrowUp,
  ArrowDown,
  Undo2,
  Redo2,
  Moon,
  Sun,
  Laptop,
} from "lucide-react";
import { RichTextEditor } from "./RichTextEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
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

interface LeftSidebarProps {
  data: ResumeData;
  onChange: (data: ResumeData | ((prev: ResumeData) => ResumeData)) => void;

  undo?: () => void;
  redo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
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
      <AccordionTrigger className="w-full flex justify-between items-center py-4 px-6 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left font-semibold text-slate-800 dark:text-slate-200 hover:no-underline data-[state=open]:bg-slate-50 dark:data-[state=open]:bg-slate-800">
        {title}
      </AccordionTrigger>
      <AccordionContent className="p-6 bg-slate-50/50 dark:bg-slate-900/50 px-6">
        {children}
      </AccordionContent>
    </ShadcnAccordionItem>
  );
};

const ExperienceSection = React.memo(
  ({
    items,
    onAdd,
    onUpdate,
    onRemove,
  }: {
    items: Experience[];
    onAdd: () => void;
    onUpdate: (id: string, field: keyof Experience, value: string) => void;
    onRemove: (id: string) => void;
  }) => {
    return (
      <>
        <div className="space-y-6">
          {items.map((exp, index) => (
            <div
              key={exp.id}
              className="relative p-4 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 shadow-sm"
            >
              <Button
                onClick={() => onRemove(exp.id)}
                variant="ghost"
                size="icon"
                className="absolute top-3 right-3 h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3 pr-8">
                Experience {index + 1}
              </h4>
              <div className="space-y-4">
                <div>
                  <Label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
                    Company
                  </Label>
                  <Input
                    type="text"
                    value={exp.company}
                    onChange={(e) =>
                      onUpdate(exp.id, "company", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md text-sm focus:ring-2 focus:ring-slate-800 dark:focus:ring-slate-400 focus:border-slate-800 dark:focus:border-slate-400 outline-none transition-all dark:bg-slate-800 dark:text-slate-200 placeholder:text-slate-400"
                    placeholder="Acme Corp"
                  />
                </div>
                <div>
                  <Label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
                    Position
                  </Label>
                  <Input
                    type="text"
                    value={exp.position}
                    onChange={(e) =>
                      onUpdate(exp.id, "position", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md text-sm focus:ring-2 focus:ring-slate-800 dark:focus:ring-slate-400 focus:border-slate-800 dark:focus:border-slate-400 outline-none transition-all dark:bg-slate-800 dark:text-slate-200 placeholder:text-slate-400"
                    placeholder="Software Engineer"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
                      Start Date
                    </Label>
                    <Input
                      type="text"
                      value={exp.startDate}
                      onChange={(e) =>
                        onUpdate(exp.id, "startDate", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md text-sm focus:ring-2 focus:ring-slate-800 dark:focus:ring-slate-400 focus:border-slate-800 dark:focus:border-slate-400 outline-none transition-all dark:bg-slate-800 dark:text-slate-200 placeholder:text-slate-400"
                      placeholder="Jan 2020"
                    />
                  </div>
                  <div>
                    <Label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
                      End Date
                    </Label>
                    <Input
                      type="text"
                      value={exp.endDate}
                      onChange={(e) =>
                        onUpdate(exp.id, "endDate", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md text-sm focus:ring-2 focus:ring-slate-800 dark:focus:ring-slate-400 focus:border-slate-800 dark:focus:border-slate-400 outline-none transition-all dark:bg-slate-800 dark:text-slate-200 placeholder:text-slate-400"
                      placeholder="Present"
                    />
                  </div>
                </div>
                <div>
                  <Label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
                    Description
                  </Label>
                  <RichTextEditor
                    value={exp.description}
                    onChange={(val) => onUpdate(exp.id, "description", val)}
                    placeholder="Describe your responsibilities and achievements…"
                  />
                </div>
              </div>
            </div>
          ))}
          <Button
            onClick={onAdd}
            variant="outline"
            className="w-full border-2 border-dashed border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-800 dark:hover:border-slate-400 hover:text-slate-800 dark:hover:text-slate-200 flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Experience
          </Button>
        </div>
      </>
    );
  },
);

const EducationSection = React.memo(
  ({
    items,
    onAdd,
    onUpdate,
    onRemove,
  }: {
    items: Education[];
    onAdd: () => void;
    onUpdate: (id: string, field: keyof Education, value: string) => void;
    onRemove: (id: string) => void;
  }) => {
    return (
      <>
        <div className="space-y-6">
          {items.map((edu, index) => (
            <div
              key={edu.id}
              className="relative p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 shadow-sm dark:shadow-lg"
            >
              <Button
                onClick={() => onRemove(edu.id)}
                variant="ghost"
                size="icon"
                className="absolute top-3 right-3 h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3 pr-8">
                Education {index + 1}
              </h4>
              <div className="space-y-4">
                <div>
                  <Label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
                    Institution
                  </Label>
                  <Input
                    type="text"
                    value={edu.institution}
                    onChange={(e) =>
                      onUpdate(edu.id, "institution", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md text-sm focus:ring-2 focus:ring-slate-800 dark:focus:ring-slate-400 focus:border-slate-800 dark:focus:border-slate-400 outline-none transition-all dark:bg-slate-800 dark:text-slate-200 placeholder:text-slate-400"
                    placeholder="University of Technology"
                  />
                </div>
                <div>
                  <Label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
                    Degree
                  </Label>
                  <Input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => onUpdate(edu.id, "degree", e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md text-sm focus:ring-2 focus:ring-slate-800 dark:focus:ring-slate-400 focus:border-slate-800 dark:focus:border-slate-400 outline-none transition-all dark:bg-slate-800 dark:text-slate-200 placeholder:text-slate-400"
                    placeholder="B.S. Computer Science"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
                      Start Date
                    </Label>
                    <Input
                      type="text"
                      value={edu.startDate}
                      onChange={(e) =>
                        onUpdate(edu.id, "startDate", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md text-sm focus:ring-2 focus:ring-slate-800 dark:focus:ring-slate-400 focus:border-slate-800 dark:focus:border-slate-400 outline-none transition-all dark:bg-slate-800 dark:text-slate-200 placeholder:text-slate-400"
                      placeholder="Aug 2016"
                    />
                  </div>
                  <div>
                    <Label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
                      End Date
                    </Label>
                    <Input
                      type="text"
                      value={edu.endDate}
                      onChange={(e) =>
                        onUpdate(edu.id, "endDate", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md text-sm focus:ring-2 focus:ring-slate-800 dark:focus:ring-slate-400 focus:border-slate-800 dark:focus:border-slate-400 outline-none transition-all dark:bg-slate-800 dark:text-slate-200 placeholder:text-slate-400"
                      placeholder="May 2020"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
          <Button
            onClick={onAdd}
            variant="outline"
            className="w-full border-2 border-dashed border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-800 dark:hover:border-slate-400 hover:text-slate-800 dark:hover:text-slate-200 flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Education
          </Button>
        </div>
      </>
    );
  },
);

const ProjectSection = React.memo(
  ({
    items,
    onAdd,
    onUpdate,
    onRemove,
  }: {
    items: Project[];
    onAdd: () => void;
    onUpdate: (id: string, field: keyof Project, value: string) => void;
    onRemove: (id: string) => void;
  }) => {
    return (
      <>
        <div className="space-y-6">
          {items.map((proj, index) => (
            <div
              key={proj.id}
              className="relative p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 shadow-sm dark:shadow-lg"
            >
              <Button
                onClick={() => onRemove(proj.id)}
                variant="ghost"
                size="icon"
                className="absolute top-3 right-3 h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3 pr-8">
                Project {index + 1}
              </h4>
              <div className="space-y-4">
                <div>
                  <Label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
                    Project Name
                  </Label>
                  <Input
                    type="text"
                    value={proj.name}
                    onChange={(e) => onUpdate(proj.id, "name", e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md text-sm focus:ring-2 focus:ring-slate-800 dark:focus:ring-slate-400 focus:border-slate-800 dark:focus:border-slate-400 outline-none transition-all dark:bg-slate-800 dark:text-slate-200 placeholder:text-slate-400"
                    placeholder="E-commerce Platform"
                  />
                </div>
                <div>
                  <Label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
                    Link
                  </Label>
                  <Input
                    type="text"
                    value={proj.link}
                    onChange={(e) => onUpdate(proj.id, "link", e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md text-sm focus:ring-2 focus:ring-slate-800 dark:focus:ring-slate-400 focus:border-slate-800 dark:focus:border-slate-400 outline-none transition-all dark:bg-slate-800 dark:text-slate-200 placeholder:text-slate-400"
                    placeholder="github.com/johndoe/project"
                  />
                </div>
                <div>
                  <Label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
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
            className="w-full border-2 border-dashed border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-800 dark:hover:border-slate-400 hover:text-slate-800 dark:hover:text-slate-200 flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Project
          </Button>
        </div>
      </>
    );
  },
);

const SocialLinkSection = React.memo(
  ({
    items,
    onAdd,
    onUpdate,
    onRemove,
  }: {
    items: SocialLink[];
    onAdd: () => void;
    onUpdate: (id: string, field: keyof SocialLink, value: string) => void;
    onRemove: (id: string) => void;
  }) => {
    return (
      <>
        <div className="space-y-6">
          {items.map((link, index) => (
            <div
              key={link.id}
              className="relative p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 shadow-sm dark:shadow-lg"
            >
              <Button
                onClick={() => onRemove(link.id)}
                variant="ghost"
                size="icon"
                className="absolute top-3 right-3 h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800"
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
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md text-sm focus:ring-2 focus:ring-slate-800 dark:focus:ring-slate-400 focus:border-slate-800 dark:focus:border-slate-400 outline-none transition-all dark:bg-slate-800 dark:text-slate-200 placeholder:text-slate-400"
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
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md text-sm focus:ring-2 focus:ring-slate-800 dark:focus:ring-slate-400 focus:border-slate-800 dark:focus:border-slate-400 outline-none transition-all dark:bg-slate-800 dark:text-slate-200 placeholder:text-slate-400"
                    placeholder="https://…"
                  />
                </div>
              </div>
            </div>
          ))}
          <Button
            onClick={onAdd}
            variant="outline"
            className="w-full border-2 border-dashed border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-800 dark:hover:border-slate-400 hover:text-slate-800 dark:hover:text-slate-200 flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Link
          </Button>
        </div>
      </>
    );
  },
);

const LanguageSection = React.memo(
  ({
    items,
    onAdd,
    onUpdate,
    onRemove,
  }: {
    items: Language[];
    onAdd: () => void;
    onUpdate: (id: string, field: keyof Language, value: string) => void;
    onRemove: (id: string) => void;
  }) => {
    return (
      <>
        <div className="space-y-6">
          {items.map((lang, index) => (
            <div
              key={lang.id}
              className="relative p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 shadow-sm dark:shadow-lg"
            >
              <Button
                onClick={() => onRemove(lang.id)}
                variant="ghost"
                size="icon"
                className="absolute top-3 right-3 h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3 pr-8">
                Language {index + 1}
              </h4>
              <div className="space-y-4">
                <div>
                  <Label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
                    Language
                  </Label>
                  <Input
                    type="text"
                    value={lang.name}
                    onChange={(e) => onUpdate(lang.id, "name", e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md text-sm focus:ring-2 focus:ring-slate-800 dark:focus:ring-slate-400 focus:border-slate-800 dark:focus:border-slate-400 outline-none transition-all dark:bg-slate-800 dark:text-slate-200 placeholder:text-slate-400"
                    placeholder="English"
                  />
                </div>
                <div>
                  <Label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
                    Proficiency
                  </Label>
                  <Input
                    type="text"
                    value={lang.proficiency}
                    onChange={(e) =>
                      onUpdate(lang.id, "proficiency", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md text-sm focus:ring-2 focus:ring-slate-800 dark:focus:ring-slate-400 focus:border-slate-800 dark:focus:border-slate-400 outline-none transition-all dark:bg-slate-800 dark:text-slate-200 placeholder:text-slate-400"
                    placeholder="Native, Fluent, Beginner…"
                  />
                </div>
              </div>
            </div>
          ))}
          <Button
            onClick={onAdd}
            variant="outline"
            className="w-full border-2 border-dashed border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-800 dark:hover:border-slate-400 hover:text-slate-800 dark:hover:text-slate-200 flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Language
          </Button>
        </div>
      </>
    );
  },
);

const VolunteerSection = React.memo(
  ({
    items,
    onAdd,
    onUpdate,
    onRemove,
  }: {
    items: Volunteer[];
    onAdd: () => void;
    onUpdate: (id: string, field: keyof Volunteer, value: string) => void;
    onRemove: (id: string) => void;
  }) => {
    return (
      <>
        <div className="space-y-6">
          {items.map((vol, index) => (
            <div
              key={vol.id}
              className="relative p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 shadow-sm dark:shadow-lg"
            >
              <Button
                onClick={() => onRemove(vol.id)}
                variant="ghost"
                size="icon"
                className="absolute top-3 right-3 h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3 pr-8">
                Volunteer {index + 1}
              </h4>
              <div className="space-y-4">
                <div>
                  <Label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
                    Organization
                  </Label>
                  <Input
                    type="text"
                    value={vol.organization}
                    onChange={(e) =>
                      onUpdate(vol.id, "organization", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md text-sm focus:ring-2 focus:ring-slate-800 dark:focus:ring-slate-400 focus:border-slate-800 dark:focus:border-slate-400 outline-none transition-all dark:bg-slate-800 dark:text-slate-200 placeholder:text-slate-400"
                    placeholder="Red Cross"
                  />
                </div>
                <div>
                  <Label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
                    Position
                  </Label>
                  <Input
                    type="text"
                    value={vol.position}
                    onChange={(e) =>
                      onUpdate(vol.id, "position", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md text-sm focus:ring-2 focus:ring-slate-800 dark:focus:ring-slate-400 focus:border-slate-800 dark:focus:border-slate-400 outline-none transition-all dark:bg-slate-800 dark:text-slate-200 placeholder:text-slate-400"
                    placeholder="Volunteer Coordinator"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
                      Start Date
                    </Label>
                    <Input
                      type="text"
                      value={vol.startDate}
                      onChange={(e) =>
                        onUpdate(vol.id, "startDate", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md text-sm focus:ring-2 focus:ring-slate-800 dark:focus:ring-slate-400 focus:border-slate-800 dark:focus:border-slate-400 outline-none transition-all dark:bg-slate-800 dark:text-slate-200 placeholder:text-slate-400"
                      placeholder="Jan 2018"
                    />
                  </div>
                  <div>
                    <Label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
                      End Date
                    </Label>
                    <Input
                      type="text"
                      value={vol.endDate}
                      onChange={(e) =>
                        onUpdate(vol.id, "endDate", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md text-sm focus:ring-2 focus:ring-slate-800 dark:focus:ring-slate-400 focus:border-slate-800 dark:focus:border-slate-400 outline-none transition-all dark:bg-slate-800 dark:text-slate-200 placeholder:text-slate-400"
                      placeholder="Present"
                    />
                  </div>
                </div>
                <div>
                  <Label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
                    Description
                  </Label>
                  <RichTextEditor
                    value={vol.description}
                    onChange={(val) => onUpdate(vol.id, "description", val)}
                    placeholder="Describe your volunteer work…"
                  />
                </div>
              </div>
            </div>
          ))}
          <Button
            onClick={onAdd}
            variant="outline"
            className="w-full border-2 border-dashed border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-800 dark:hover:border-slate-400 hover:text-slate-800 dark:hover:text-slate-200 flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Volunteer Work
          </Button>
        </div>
      </>
    );
  },
);

const InterestSection = React.memo(
  ({
    items,
    onAdd,
    onUpdate,
    onRemove,
  }: {
    items: Interest[];
    onAdd: () => void;
    onUpdate: (id: string, field: keyof Interest, value: string) => void;
    onRemove: (id: string) => void;
  }) => {
    return (
      <>
        <div className="space-y-6">
          {items.map((interest, index) => (
            <div
              key={interest.id}
              className="relative p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 shadow-sm dark:shadow-lg"
            >
              <Button
                onClick={() => onRemove(interest.id)}
                variant="ghost"
                size="icon"
                className="absolute top-3 right-3 h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3 pr-8">
                Interest {index + 1}
              </h4>
              <div className="space-y-4">
                <div>
                  <Label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
                    Interest Name
                  </Label>
                  <Input
                    type="text"
                    value={interest.name}
                    onChange={(e) =>
                      onUpdate(interest.id, "name", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md text-sm focus:ring-2 focus:ring-slate-800 dark:focus:ring-slate-400 focus:border-slate-800 dark:focus:border-slate-400 outline-none transition-all dark:bg-slate-800 dark:text-slate-200 placeholder:text-slate-400"
                    placeholder="Photography, Hiking…"
                  />
                </div>
              </div>
            </div>
          ))}
          <Button
            onClick={onAdd}
            variant="outline"
            className="w-full border-2 border-dashed border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-800 dark:hover:border-slate-400 hover:text-slate-800 dark:hover:text-slate-200 flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Interest
          </Button>
        </div>
      </>
    );
  },
);

const SkillCategorySection = React.memo(
  ({
    items,
    onAdd,
    onUpdate,
    onRemove,
  }: {
    items: SkillCategory[];
    onAdd: () => void;
    onUpdate: (id: string, field: keyof SkillCategory, value: string) => void;
    onRemove: (id: string) => void;
  }) => {
    return (
      <>
        <div className="space-y-6">
          {items.map((category, index) => (
            <div
              key={category.id}
              className="relative p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 shadow-sm dark:shadow-lg"
            >
              <Button
                onClick={() => onRemove(category.id)}
                variant="ghost"
                size="icon"
                className="absolute top-3 right-3 h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3 pr-8">
                Category {index + 1}
              </h4>
              <div className="space-y-4">
                <div>
                  <Label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
                    Category Name
                  </Label>
                  <Input
                    type="text"
                    value={category.name}
                    onChange={(e) =>
                      onUpdate(category.id, "name", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md text-sm focus:ring-2 focus:ring-slate-800 dark:focus:ring-slate-400 focus:border-slate-800 dark:focus:border-slate-400 outline-none transition-all dark:bg-slate-800 dark:text-slate-200 placeholder:text-slate-400"
                    placeholder="Frontend, Backend, Tools…"
                  />
                </div>
                <div>
                  <Label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
                    Skills
                  </Label>
                  <RichTextEditor
                    value={category.skills}
                    onChange={(val) => onUpdate(category.id, "skills", val)}
                    placeholder="React, Next.js, Node.js…"
                  />
                </div>
              </div>
            </div>
          ))}
          <Button
            onClick={onAdd}
            variant="outline"
            className="w-full border-2 border-dashed border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-800 dark:hover:border-slate-400 hover:text-slate-800 dark:hover:text-slate-200 flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Skill Category
          </Button>
        </div>
      </>
    );
  },
);

ExperienceSection.displayName = "ExperienceSection";
EducationSection.displayName = "EducationSection";
ProjectSection.displayName = "ProjectSection";
SocialLinkSection.displayName = "SocialLinkSection";
LanguageSection.displayName = "LanguageSection";
VolunteerSection.displayName = "VolunteerSection";
InterestSection.displayName = "InterestSection";
SkillCategorySection.displayName = "SkillCategorySection";

const CustomSectionEditor = React.memo(
  ({
    section,
    onUpdateTitle,
    onAddItem,
    onUpdateItem,
    onRemoveItem,
    onRemoveSection,
  }: {
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
  }) => {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1">
            <Label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
              Section Title
            </Label>
            <Input
              value={section.title}
              onChange={(e) => onUpdateTitle(e.target.value)}
              className="text-lg font-bold bg-transparent border-none px-0 focus-visible:ring-0 dark:text-slate-100"
              placeholder="e.g., Publications, Projects, etc."
            />
          </div>
          <Button
            onClick={onRemoveSection}
            variant="ghost"
            size="icon"
            className="text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Remove Section"
          >
            <Trash2 className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-6 pl-4 border-l-2 border-slate-200 dark:border-slate-700">
          {section.items.map((item, index) => (
            <div
              key={item.id}
              className="relative p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 shadow-sm dark:shadow-lg"
            >
              <Button
                onClick={() => onRemoveItem(item.id)}
                variant="ghost"
                size="icon"
                className="absolute top-3 right-3 h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3 pr-8">
                Item {index + 1}
              </h4>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
                      Title
                    </Label>
                    <Input
                      type="text"
                      value={item.title}
                      onChange={(e) =>
                        onUpdateItem(item.id, "title", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-slate-800 focus:border-slate-800 outline-none transition-all"
                      placeholder="e.g. Research Assistant"
                    />
                  </div>
                  <div>
                    <Label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
                      Subtitle / Org
                    </Label>
                    <Input
                      type="text"
                      value={item.subtitle || ""}
                      onChange={(e) =>
                        onUpdateItem(item.id, "subtitle", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-slate-800 focus:border-slate-800 outline-none transition-all"
                      placeholder="e.g. Stanford University"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
                      Start Date
                    </Label>
                    <Input
                      type="text"
                      value={item.startDate || ""}
                      onChange={(e) =>
                        onUpdateItem(item.id, "startDate", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-slate-800 focus:border-slate-800 outline-none transition-all"
                      placeholder="e.g. Jan 2022"
                    />
                  </div>
                  <div>
                    <Label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
                      End Date
                    </Label>
                    <Input
                      type="text"
                      value={item.endDate || ""}
                      onChange={(e) =>
                        onUpdateItem(item.id, "endDate", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-slate-800 focus:border-slate-800 outline-none transition-all"
                      placeholder="e.g. Present"
                    />
                  </div>
                </div>
                <div>
                  <Label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
                    Location
                  </Label>
                  <Input
                    type="text"
                    value={item.location || ""}
                    onChange={(e) =>
                      onUpdateItem(item.id, "location", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-slate-800 focus:border-slate-800 outline-none transition-all"
                    placeholder="e.g. Palo Alto, CA"
                  />
                </div>
                <div>
                  <Label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
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
            className="w-full border-2 border-dashed border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-800 dark:hover:border-slate-400 hover:text-slate-800 dark:hover:text-slate-200 flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Item
          </Button>
        </div>
      </div>
    );
  },
);

CustomSectionEditor.displayName = "CustomSectionEditor";

const EMPTY_ARRAY: any[] = [];

export const LeftSidebar = ({
  data,
  onChange,
  undo,
  redo,
  canUndo,
  canRedo,
}: LeftSidebarProps) => {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "z") {
        if (e.shiftKey) {
          e.preventDefault();
          redo?.();
        } else {
          e.preventDefault();
          undo?.();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

  const updatePersonalInfo = React.useCallback(
    (field: keyof ResumeData["personalInfo"], value: string) => {
      onChange((prev) => ({
        ...prev,
        personalInfo: { ...prev.personalInfo, [field]: value },
      }));
    },
    [onChange],
  );

  const addExperience = React.useCallback(() => {
    onChange((prev) => ({
      ...prev,
      experience: [
        ...(prev.experience || []),
        {
          id: crypto.randomUUID(),
          company: "",
          position: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
    }));
  }, [onChange]);

  const updateExperience = React.useCallback(
    (id: string, field: keyof Experience, value: string) => {
      onChange((prev) => ({
        ...prev,
        experience: (prev.experience || []).map((exp) =>
          exp.id === id ? { ...exp, [field]: value } : exp,
        ),
      }));
    },
    [onChange],
  );

  const removeExperience = React.useCallback(
    (id: string) => {
      onChange((prev) => ({
        ...prev,
        experience: (prev.experience || []).filter((exp) => exp.id !== id),
      }));
    },
    [onChange],
  );

  const addEducation = React.useCallback(() => {
    onChange((prev) => ({
      ...prev,
      education: [
        ...(prev.education || []),
        {
          id: crypto.randomUUID(),
          institution: "",
          degree: "",
          startDate: "",
          endDate: "",
        },
      ],
    }));
  }, [onChange]);

  const updateEducation = React.useCallback(
    (id: string, field: keyof Education, value: string) => {
      onChange((prev) => ({
        ...prev,
        education: (prev.education || []).map((edu) =>
          edu.id === id ? { ...edu, [field]: value } : edu,
        ),
      }));
    },
    [onChange],
  );

  const removeEducation = React.useCallback(
    (id: string) => {
      onChange((prev) => ({
        ...prev,
        education: (prev.education || []).filter((edu) => edu.id !== id),
      }));
    },
    [onChange],
  );

  const addProject = React.useCallback(() => {
    onChange((prev) => ({
      ...prev,
      projects: [
        ...(prev.projects || []),
        { id: crypto.randomUUID(), name: "", description: "", link: "" },
      ],
    }));
  }, [onChange]);

  const updateProject = React.useCallback(
    (id: string, field: keyof Project, value: string) => {
      onChange((prev) => ({
        ...prev,
        projects: (prev.projects || []).map((proj) =>
          proj.id === id ? { ...proj, [field]: value } : proj,
        ),
      }));
    },
    [onChange],
  );

  const removeProject = React.useCallback(
    (id: string) => {
      onChange((prev) => ({
        ...prev,
        projects: (prev.projects || []).filter((proj) => proj.id !== id),
      }));
    },
    [onChange],
  );

  const addSocialLink = React.useCallback(() => {
    onChange((prev) => ({
      ...prev,
      socialLinks: [
        ...(prev.socialLinks || []),
        { id: crypto.randomUUID(), name: "", url: "" },
      ],
    }));
  }, [onChange]);

  const updateSocialLink = React.useCallback(
    (id: string, field: keyof SocialLink, value: string) => {
      onChange((prev) => ({
        ...prev,
        socialLinks: (prev.socialLinks || []).map((link) =>
          link.id === id ? { ...link, [field]: value } : link,
        ),
      }));
    },
    [onChange],
  );

  const removeSocialLink = React.useCallback(
    (id: string) => {
      onChange((prev) => ({
        ...prev,
        socialLinks: (prev.socialLinks || []).filter((link) => link.id !== id),
      }));
    },
    [onChange],
  );

  const addAward = React.useCallback(() => {
    onChange((prev) => ({
      ...prev,
      awards: [
        ...(prev.awards || []),
        {
          id: crypto.randomUUID(),
          name: "",
          issuer: "",
          date: "",
          description: "",
        },
      ],
    }));
  }, [onChange]);

  const updateAward = React.useCallback(
    (id: string, field: keyof Award, value: string) => {
      onChange((prev) => ({
        ...prev,
        awards: (prev.awards || []).map((item) =>
          item.id === id ? { ...item, [field]: value } : item,
        ),
      }));
    },
    [onChange],
  );

  const removeAward = React.useCallback(
    (id: string) => {
      onChange((prev) => ({
        ...prev,
        awards: (prev.awards || []).filter((item) => item.id !== id),
      }));
    },
    [onChange],
  );

  const addLanguage = React.useCallback(() => {
    onChange((prev) => ({
      ...prev,
      languages: [
        ...(prev.languages || []),
        { id: crypto.randomUUID(), name: "", proficiency: "" },
      ],
    }));
  }, [onChange]);

  const updateLanguage = React.useCallback(
    (id: string, field: keyof Language, value: string) => {
      onChange((prev) => ({
        ...prev,
        languages: (prev.languages || []).map((item) =>
          item.id === id ? { ...item, [field]: value } : item,
        ),
      }));
    },
    [onChange],
  );

  const removeLanguage = React.useCallback(
    (id: string) => {
      onChange((prev) => ({
        ...prev,
        languages: (prev.languages || []).filter((item) => item.id !== id),
      }));
    },
    [onChange],
  );

  const addVolunteer = React.useCallback(() => {
    onChange((prev) => ({
      ...prev,
      volunteerWork: [
        ...(prev.volunteerWork || []),
        {
          id: crypto.randomUUID(),
          organization: "",
          position: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
    }));
  }, [onChange]);

  const updateVolunteer = React.useCallback(
    (id: string, field: keyof Volunteer, value: string) => {
      onChange((prev) => ({
        ...prev,
        volunteerWork: (prev.volunteerWork || []).map((item) =>
          item.id === id ? { ...item, [field]: value } : item,
        ),
      }));
    },
    [onChange],
  );

  const removeVolunteer = React.useCallback(
    (id: string) => {
      onChange((prev) => ({
        ...prev,
        volunteerWork: (prev.volunteerWork || []).filter(
          (item) => item.id !== id,
        ),
      }));
    },
    [onChange],
  );

  const addInterest = React.useCallback(() => {
    onChange((prev) => ({
      ...prev,
      interests: [
        ...(prev.interests || []),
        { id: crypto.randomUUID(), name: "" },
      ],
    }));
  }, [onChange]);

  const updateInterest = React.useCallback(
    (id: string, field: keyof Interest, value: string) => {
      onChange((prev) => ({
        ...prev,
        interests: (prev.interests || []).map((item) =>
          item.id === id ? { ...item, [field]: value } : item,
        ),
      }));
    },
    [onChange],
  );

  const removeInterest = React.useCallback(
    (id: string) => {
      onChange((prev) => ({
        ...prev,
        interests: (prev.interests || []).filter((item) => item.id !== id),
      }));
    },
    [onChange],
  );

  const addSkillCategory = React.useCallback(() => {
    onChange((prev) => ({
      ...prev,
      skills: [
        ...(prev.skills || []),
        { id: crypto.randomUUID(), name: "", skills: "" },
      ],
    }));
  }, [onChange]);

  const updateSkillCategory = React.useCallback(
    (id: string, field: keyof SkillCategory, value: string) => {
      onChange((prev) => ({
        ...prev,
        skills: (prev.skills || []).map((item) =>
          item.id === id ? { ...item, [field]: value } : item,
        ),
      }));
    },
    [onChange],
  );

  const removeSkillCategory = React.useCallback(
    (id: string) => {
      onChange((prev) => ({
        ...prev,
        skills: (prev.skills || []).filter((item) => item.id !== id),
      }));
    },
    [onChange],
  );

  return (
    <div className="w-80 md:w-96 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-screen flex flex-col shadow-sm transition-colors z-10 print:hidden shrink-0">
      <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-800 dark:bg-slate-950 text-white flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Resume Editor</h2>
          <p className="text-sm text-slate-400 mt-1">
            Fill in your details to generate your resume.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={undo}
            disabled={!canUndo}
            className="text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-30"
            title="Undo (Cmd+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={redo}
            disabled={!canRedo}
            className="text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-30"
            title="Redo (Cmd+Shift+Z)"
          >
            <Redo2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-10">
        <Accordion type="multiple" className="w-full">
          <AccordionItem title="Personal Information" defaultOpen>
            <div className="space-y-4">
              <div>
                <Label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
                  Profile Picture (Optional)
                </Label>
                <div className="flex items-center gap-4">
                  {data.personalInfo.profilePicture && (
                    <Image
                      src={data.personalInfo.profilePicture}
                      alt="Profile"
                      width={48}
                      height={48}
                      unoptimized
                      className="w-12 h-12 rounded-full object-cover border border-slate-200"
                    />
                  )}
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          updatePersonalInfo(
                            "profilePicture",
                            reader.result as string,
                          );
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="flex-1 text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-slate-50 dark:file:bg-slate-800 file:text-slate-700 dark:file:text-slate-300 hover:file:bg-slate-100 dark:hover:file:bg-slate-700 transition-all cursor-pointer"
                  />
                  {data.personalInfo.profilePicture && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => updatePersonalInfo("profilePicture", "")}
                      className="h-8 w-8 text-slate-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
              <div>
                <Label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
                  Full Name
                </Label>
                <Input
                  type="text"
                  name="fullName"
                  autoComplete="name"
                  value={data.personalInfo.fullName}
                  onChange={(e) =>
                    updatePersonalInfo("fullName", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md text-sm focus:ring-2 focus:ring-slate-800 dark:focus:ring-slate-400 focus:border-slate-800 dark:focus:border-slate-400 outline-none transition-all dark:bg-slate-800 dark:text-slate-200 placeholder:text-slate-400"
                  placeholder="John Doe"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
                    Email
                  </Label>
                  <Input
                    type="email"
                    name="email"
                    autoComplete="email"
                    value={data.personalInfo.email}
                    onChange={(e) =>
                      updatePersonalInfo("email", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md text-sm focus:ring-2 focus:ring-slate-800 dark:focus:ring-slate-400 focus:border-slate-800 dark:focus:border-slate-400 outline-none transition-all dark:bg-slate-800 dark:text-slate-200 placeholder:text-slate-400"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <Label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
                    Phone
                  </Label>
                  <Input
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    value={data.personalInfo.phone}
                    onChange={(e) =>
                      updatePersonalInfo("phone", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md text-sm focus:ring-2 focus:ring-slate-800 dark:focus:ring-slate-400 focus:border-slate-800 dark:focus:border-slate-400 outline-none transition-all dark:bg-slate-800 dark:text-slate-200 placeholder:text-slate-400"
                    placeholder="+1 234 567 890"
                  />
                </div>
              </div>
              <div>
                <Label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
                  Location
                </Label>
                <Input
                  type="text"
                  name="location"
                  autoComplete="address-level2"
                  value={data.personalInfo.location}
                  onChange={(e) =>
                    updatePersonalInfo("location", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md text-sm focus:ring-2 focus:ring-slate-800 dark:focus:ring-slate-400 focus:border-slate-800 dark:focus:border-slate-400 outline-none transition-all dark:bg-slate-800 dark:text-slate-200 placeholder:text-slate-400"
                  placeholder="New York, NY"
                />
              </div>
              <div>
                <Label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
                  Website (Optional)
                </Label>
                <Input
                  type="url"
                  name="website"
                  autoComplete="url"
                  value={data.personalInfo.website}
                  onChange={(e) =>
                    updatePersonalInfo("website", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md text-sm focus:ring-2 focus:ring-slate-800 dark:focus:ring-slate-400 focus:border-slate-800 dark:focus:border-slate-400 outline-none transition-all dark:bg-slate-800 dark:text-slate-200 placeholder:text-slate-400"
                  placeholder="johndoe.com"
                />
              </div>
              <div>
                <Label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
                  Professional Summary
                </Label>
                <RichTextEditor
                  value={data.personalInfo.summary}
                  onChange={(val) => updatePersonalInfo("summary", val)}
                  placeholder="A brief summary of your professional background…"
                />
              </div>
            </div>
          </AccordionItem>

          <AccordionItem title="Social Links">
            <SocialLinkSection
              items={data.socialLinks || EMPTY_ARRAY}
              onAdd={addSocialLink}
              onUpdate={updateSocialLink}
              onRemove={removeSocialLink}
            />
          </AccordionItem>

          <AccordionItem title="Experience">
            <ExperienceSection
              items={data.experience || EMPTY_ARRAY}
              onAdd={addExperience}
              onUpdate={updateExperience}
              onRemove={removeExperience}
            />
          </AccordionItem>

          <AccordionItem title="Education">
            <EducationSection
              items={data.education || EMPTY_ARRAY}
              onAdd={addEducation}
              onUpdate={updateEducation}
              onRemove={removeEducation}
            />
          </AccordionItem>

          <AccordionItem title="Projects">
            <ProjectSection
              items={data.projects || EMPTY_ARRAY}
              onAdd={addProject}
              onUpdate={updateProject}
              onRemove={removeProject}
            />
          </AccordionItem>

          <AccordionItem title="Awards & Certifications">
            <div className="space-y-6">
              {(data.awards || []).map((award, index) => (
                <div
                  key={award.id}
                  className="relative p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 shadow-sm"
                >
                  <Button
                    onClick={() => removeAward(award.id)}
                    variant="ghost"
                    size="icon"
                    className="absolute top-3 right-3 h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-slate-100"
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
                        className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-slate-800 focus:border-slate-800 outline-none transition-all"
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
                        className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-slate-800 focus:border-slate-800 outline-none transition-all"
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
                        className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-slate-800 focus:border-slate-800 outline-none transition-all"
                        placeholder="Dec 2022"
                      />
                    </div>
                    <div>
                      <Label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
                        Description
                      </Label>
                      <RichTextEditor
                        value={award.description}
                        onChange={(val) =>
                          updateAward(award.id, "description", val)
                        }
                        placeholder="Recognized for outstanding contributions…"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button
                onClick={addAward}
                variant="outline"
                className="w-full border-2 border-dashed border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-800 dark:hover:border-slate-400 hover:text-slate-800 dark:hover:text-slate-200 flex items-center justify-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Award
              </Button>
            </div>
          </AccordionItem>

          <AccordionItem title="Languages">
            <LanguageSection
              items={data.languages || EMPTY_ARRAY}
              onAdd={addLanguage}
              onUpdate={updateLanguage}
              onRemove={removeLanguage}
            />
          </AccordionItem>

          <AccordionItem title="Volunteer Work">
            <VolunteerSection
              items={data.volunteerWork || EMPTY_ARRAY}
              onAdd={addVolunteer}
              onUpdate={updateVolunteer}
              onRemove={removeVolunteer}
            />
          </AccordionItem>

          <AccordionItem title="Interests">
            <InterestSection
              items={data.interests || EMPTY_ARRAY}
              onAdd={addInterest}
              onUpdate={updateInterest}
              onRemove={removeInterest}
            />
          </AccordionItem>

          <AccordionItem title="Skills">
            <SkillCategorySection
              items={data.skills || EMPTY_ARRAY}
              onAdd={addSkillCategory}
              onUpdate={updateSkillCategory}
              onRemove={removeSkillCategory}
            />
          </AccordionItem>

          {data.customSections?.map((section) => (
            <AccordionItem
              key={section.id}
              title={section.title || "Custom Section"}
              value={`custom-${section.id}`}
            >
              <CustomSectionEditor
                section={section}
                onUpdateTitle={(title) => {
                  onChange((prev) => ({
                    ...prev,
                    customSections: (prev.customSections || []).map((s) =>
                      s.id === section.id ? { ...s, title } : s,
                    ),
                  }));
                }}
                onAddItem={() => {
                  onChange((prev) => ({
                    ...prev,
                    customSections: (prev.customSections || []).map((s) =>
                      s.id === section.id
                        ? {
                            ...s,
                            items: [
                              ...s.items,
                              { id: crypto.randomUUID(), title: "" },
                            ],
                          }
                        : s,
                    ),
                  }));
                }}
                onUpdateItem={(itemId, field, value) => {
                  onChange((prev) => ({
                    ...prev,
                    customSections: (prev.customSections || []).map((s) =>
                      s.id === section.id
                        ? {
                            ...s,
                            items: s.items.map((item) =>
                              item.id === itemId
                                ? { ...item, [field]: value }
                                : item,
                            ),
                          }
                        : s,
                    ),
                  }));
                }}
                onRemoveItem={(itemId) => {
                  onChange((prev) => ({
                    ...prev,
                    customSections: (prev.customSections || []).map((s) =>
                      s.id === section.id
                        ? {
                            ...s,
                            items: s.items.filter((item) => item.id !== itemId),
                          }
                        : s,
                    ),
                  }));
                }}
                onRemoveSection={() => {
                  onChange((prev) => ({
                    ...prev,
                    customSections: (prev.customSections || [])
                      .map((s) =>
                        s.id === section.id ? { ...s, title: "DELETED" } : s,
                      )
                      .filter((s) => s.title !== "DELETED"),
                    layout: {
                      ...prev.layout,
                      sectionOrder: (prev.layout?.sectionOrder || []).filter(
                        (id) => id !== `custom-${section.id}`,
                      ),
                    },
                  }));
                }}
              />
            </AccordionItem>
          ))}

          <div className="px-6 py-4">
            <Button
              onClick={() => {
                const newId = crypto.randomUUID();
                onChange((prev) => ({
                  ...prev,
                  customSections: [
                    ...(prev.customSections || []),
                    { id: newId, title: "New Section", items: [] },
                  ],
                  layout: {
                    ...prev.layout,
                    sectionOrder: [
                      ...(prev.layout?.sectionOrder || [
                        "summary",
                        "experience",
                        "education",
                        "projects",
                        "volunteerWork",
                        "awards",
                        "skills",
                        "languages",
                        "interests",
                      ]),
                      `custom-${newId}`,
                    ],
                  },
                }));
              }}
              variant="outline"
              className="w-full border-2 border-dashed border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-800 dark:hover:border-slate-400 hover:text-slate-800 dark:hover:text-slate-200 flex items-center justify-center gap-2 font-semibold transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Custom Section
            </Button>
          </div>
        </Accordion>
      </div>
    </div>
  );
};
