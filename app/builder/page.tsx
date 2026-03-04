"use client";

import React, {
  Suspense,
  useState,
  useDeferredValue,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  FileText,
  Save,
  Loader2,
  Pencil,
  Download,
  AlertTriangle,
  Undo2,
  Redo2,
} from "lucide-react";
import { useHistory } from "../hooks/useHistory";
import { LeftSidebar } from "../components/LeftSidebar";
import { RightSidebar } from "../components/RightSidebar";
import { Preview } from "../components/Preview";
import { SaveDialog } from "../components/SaveDialog";
import { ThemeToggle } from "../components/ThemeToggle";
import {
  ImportResume,
  ImportResumeHandle,
} from "../components/ImportResume";
import { ResumeExtractionSettingsPanel } from "../components/ResumeExtractionSettingsPanel";
import { ResumeData, TemplateType } from "../types";
import { getResumeExtractionSettings } from "../utils/resume-extraction-settings";

const initialData: ResumeData = {
  personalInfo: {
    fullName: "Jane Doe",
    email: "jane.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    website: "linkedin.com/in/janedoe",
    summary:
      "A highly motivated and results-driven software engineer with <b>5+ years of experience</b> in full-stack development. Proven ability to architect and deliver scalable web applications. Passionate about <i>clean code</i>, user experience, and continuous learning.",
  },
  experience: [
    {
      id: "1",
      company: "Tech Innovators Inc.",
      position: "Senior Software Engineer",
      startDate: "Jan 2021",
      endDate: "Present",
      description:
        "<ul><li>Led a team of 4 developers to rebuild the core customer portal using <b>React</b> and <b>Node.js</b>, resulting in a <i>40% increase</i> in user engagement.</li><li>Implemented CI/CD pipelines using GitHub Actions, reducing deployment time by 60%.</li><li>Mentored junior engineers and conducted weekly code reviews.</li></ul>",
    },
    {
      id: "2",
      company: "Web Solutions LLC",
      position: "Software Engineer",
      startDate: "Jun 2018",
      endDate: "Dec 2020",
      description:
        "<ul><li>Developed and maintained multiple client websites using <b>React</b>, <b>Next.js</b>, and Tailwind CSS.</li><li>Integrated third-party APIs including Stripe for payments and SendGrid for email notifications.</li><li>Optimized database queries, improving application performance by <u>25%</u>.</li></ul>",
    },
  ],
  education: [
    {
      id: "1",
      institution: "University of California, Berkeley",
      degree: "B.S. in Computer Science",
      startDate: "Aug 2014",
      endDate: "May 2018",
    },
  ],
  projects: [
    {
      id: "1",
      name: "E-commerce Dashboard",
      description:
        "A comprehensive dashboard for e-commerce store owners to track sales, inventory, and customer data. Built with React, Redux, and Chart.js.",
      link: "github.com/janedoe/ecommerce-dashboard",
    },
  ],
  awards: [
    {
      id: "1",
      name: "Employee of the Year",
      issuer: "Tech Innovators Inc.",
      date: "Dec 2022",
      description:
        "Recognized for outstanding contributions to the core product.",
    },
  ],
  languages: [
    {
      id: "1",
      name: "English",
      proficiency: "Native",
    },
    {
      id: "2",
      name: "Spanish",
      proficiency: "Fluent",
    },
  ],
  volunteerWork: [
    {
      id: "1",
      organization: "Code for America",
      position: "Volunteer Developer",
      startDate: "Jan 2019",
      endDate: "Dec 2019",
      description: "Mentored local youth in web development basics.",
    },
  ],
  interests: [
    {
      id: "1",
      name: "Photography",
    },
    {
      id: "2",
      name: "Hiking",
    },
  ],
  skills: [
    {
      id: "1",
      name: "Languages",
      skills: "JavaScript, TypeScript, Python, HTML/CSS",
    },
    {
      id: "2",
      name: "Frameworks",
      skills: "React, Next.js, Node.js, Express",
    },
    {
      id: "3",
      name: "Tools",
      skills: "Git, Docker, AWS, Webpack, Figma",
    },
  ],
  socialLinks: [
    {
      id: "1",
      name: "LinkedIn",
      url: "https://linkedin.com/in/janedoe",
    },
    {
      id: "2",
      name: "GitHub",
      url: "https://github.com/janedoe",
    },
  ],
  typography: {
    fontFamily: "var(--font-inter)",
    fontSizeBody: 14,
    fontSizeHeading: 36,
    fontSizeSectionHeading: 18,
  },
  spacing: {
    sectionGap: 24,
    sectionTitleGap: 16,
    itemGap: 16,
    pageMarginTop: 32,
    pageMarginBottom: 32,
    bulletItemGap: 4,
    bulletListMargin: 4,
  },
  theme: {
    accentColor: "#000000", // neutral black
    professional: {
      sectionBorderColor: "#00000040",
    },
    modern: {
      accentColor: "#000000",
    },
    minimal: {
      accentColor: "#000000",
    },
  },
  layout: {
    sectionOrder: [
      "summary",
      "experience",
      "education",
      "projects",
      "volunteerWork",
      "awards",
      "skills",
      "languages",
      "interests",
    ],
  },
};

import { motion, AnimatePresence } from "motion/react";
import { Resizer } from "../components/Resizer";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full bg-white dark:bg-[#050505] justify-center items-center text-black dark:text-white transition-colors">
          <div className="flex flex-col items-center gap-6">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-4 border-accent/20 rounded-none"></div>
              <div className="absolute inset-0 border-4 border-accent border-t-transparent animate-spin rounded-none"></div>
            </div>
            <div className="text-center">
              <p className="font-display text-2xl font-black uppercase tracking-tighter animate-pulse">
                Infinite<span className="text-accent">Resume</span>
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 dark:text-white/40 mt-2">
                Initializing Engine...
              </p>
            </div>
          </div>
        </div>
      }
    >
      <BuilderContent />
    </Suspense>
  );
}

function BuilderContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const resumeId = searchParams.get("id") as Id<"resumes"> | null;

  const existingResume = useQuery(
    api.resumes.get,
    resumeId ? { id: resumeId } : "skip",
  );
  const saveResume = useMutation(api.resumes.save);

  const {
    state: historyState,
    setState: setHistoryState,
    undo,
    redo,
    canUndo,
    canRedo,
    reset: resetHistory,
    version,
  } = useHistory({ data: initialData, template: "minimal" as TemplateType });

  const resumeData = historyState.data;
  const template = historyState.template;
  const deferredResumeData = useDeferredValue(resumeData);

  const setResumeData = useCallback(
    (newData: ResumeData | ((prev: ResumeData) => ResumeData)) => {
      setHistoryState((curr) => ({
        ...curr,
        data: typeof newData === "function" ? newData(curr.data) : newData,
      }));
    },
    [setHistoryState],
  );

  const setTemplate = useCallback(
    (newTemplate: TemplateType) => {
      setHistoryState((prev) => ({ ...prev, template: newTemplate }));
    },
    [setHistoryState],
  );

  const [showLeftSidebar, setShowLeftSidebar] = useState(true);
  const [showRightSidebar, setShowRightSidebar] = useState(true);
  const [leftWidth, setLeftWidth] = useState(384);
  const [rightWidth, setRightWidth] = useState(320);
  const [isResizingLeft, setIsResizingLeft] = useState(false);
  const [isResizingRight, setIsResizingRight] = useState(false);
  const [isMounted, setIsMounted] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();
  // Refs for resize handlers — avoids re-attaching listeners on every pixel
  const leftWidthRef = useRef(leftWidth);
  const rightWidthRef = useRef(rightWidth);
  leftWidthRef.current = leftWidth;
  rightWidthRef.current = rightWidth;

  // Save-related state
  const [resumeTitle, setResumeTitle] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSavedVersion, setLastSavedVersion] = useState<number | null>(null);
  const [lastSavedTemplate, setLastSavedTemplate] =
    useState<TemplateType | null>(null);
  const [isOverOnePage, setIsOverOnePage] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsPromptMessage, setSettingsPromptMessage] = useState<
    string | undefined
  >(undefined);
  const [resumeImportPending, setResumeImportPending] = useState(false);
  const hasLoadedRef = useRef(false);
  const importResumeRef = useRef<ImportResumeHandle>(null);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleHeightChange = useCallback((height: number, isOver: boolean) => {
    setIsOverOnePage(isOver);
  }, []);

  useEffect(() => {
    if (!resumeId && !hasLoadedRef.current) {
      resetHistory({ data: initialData, template: "minimal" });
      setResumeTitle("");
      setLastSavedVersion(0);
      setLastSavedTemplate("minimal");
      setHasUnsavedChanges(false);
      hasLoadedRef.current = true;
    }
  }, [resumeId, resetHistory]);

  useEffect(() => {
    if (existingResume && !hasLoadedRef.current) {
      const initialContent = existingResume.content as ResumeData;
      const initialTemplate = (existingResume.template ||
        "minimal") as TemplateType;

      resetHistory({ data: initialContent, template: initialTemplate });
      setResumeTitle(existingResume.title);
      setLastSavedVersion(0);
      setLastSavedTemplate(initialTemplate);
      setHasUnsavedChanges(false);
      hasLoadedRef.current = true;
    }
  }, [existingResume, resetHistory]);

  // Add keyboard shortcuts for Undo/Redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "z") {
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      } else if ((e.metaKey || e.ctrlKey) && e.key === "y") {
        redo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

  // Track unsaved changes via version counter — no JSON.stringify needed
  useEffect(() => {
    if (lastSavedVersion !== null && lastSavedTemplate !== null) {
      const dataChanged = version !== lastSavedVersion;
      const templateChanged = template !== lastSavedTemplate;
      setHasUnsavedChanges(dataChanged || templateChanged);
    }
  }, [version, lastSavedVersion, template, lastSavedTemplate]);

  // Design changes are tracked by version + template diff (cheap check)
  const hasUnsavedDesignChanges = useMemo(() => {
    if (lastSavedVersion === null || !lastSavedTemplate) return false;
    return version !== lastSavedVersion || template !== lastSavedTemplate;
  }, [version, lastSavedVersion, template, lastSavedTemplate]);

  const lastSavedDataRef = useRef<ResumeData | null>(null);

  const handleResetDesign = useCallback(() => {
    if (!lastSavedDataRef.current || !lastSavedTemplate) return;
    const lastSaved = lastSavedDataRef.current;
    setResumeData((prev) => ({
      ...prev,
      typography: lastSaved.typography,
      spacing: lastSaved.spacing,
    }));
    setTemplate(lastSavedTemplate);
  }, [lastSavedTemplate, setResumeData, setTemplate]);

  const getDefaultTitle = () => {
    const now = new Date();
    return `Resume - ${now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
  };

  const performSave = useCallback(
    async (title: string) => {
      setIsSaving(true);
      try {
        const id = await saveResume({
          id: resumeId || undefined,
          title,
          template,
          content: resumeData,
        });
        setResumeTitle(title);
        lastSavedDataRef.current = resumeData;
        setLastSavedVersion(version);
        setLastSavedTemplate(template);
        setHasUnsavedChanges(false);
        if (!resumeId) {
          // Update URL with new ID without full navigation
          router.replace(`/builder?id=${id}`, { scroll: false });
        }
      } finally {
        setIsSaving(false);
      }
    },
    [resumeId, template, resumeData, saveResume, router, version],
  );

  const handleSaveClick = useCallback(() => {
    if (!resumeId && !resumeTitle) {
      // First save — show the naming dialog
      setShowSaveDialog(true);
    } else {
      // Subsequent save — just save
      performSave(resumeTitle || getDefaultTitle());
    }
  }, [resumeId, resumeTitle, resumeData, template, performSave]);

  const handleSaveDialogSave = (title: string) => {
    setShowSaveDialog(false);
    performSave(title);
  };

  React.useEffect(() => {
    setIsMounted(true);
    // Load saved widths
    const savedLeft = localStorage.getItem("sidebarWidthLeft");
    const savedRight = localStorage.getItem("sidebarWidthRight");
    if (savedLeft) setLeftWidth(parseInt(savedLeft, 10));
    if (savedRight) setRightWidth(parseInt(savedRight, 10));
  }, []);

  const handleMouseDownLeft = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizingLeft(true);
  };

  const handleMouseDownRight = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizingRight(true);
  };

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizingLeft) {
        const newWidth = Math.min(Math.max(280, e.clientX), 600);
        setLeftWidth(newWidth);
      }
      if (isResizingRight) {
        const newWidth = Math.min(
          Math.max(280, window.innerWidth - e.clientX),
          600,
        );
        setRightWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      if (isResizingLeft) {
        localStorage.setItem(
          "sidebarWidthLeft",
          leftWidthRef.current.toString(),
        );
        setIsResizingLeft(false);
      }
      if (isResizingRight) {
        localStorage.setItem(
          "sidebarWidthRight",
          rightWidthRef.current.toString(),
        );
        setIsResizingRight(false);
      }
    };

    if (isResizingLeft || isResizingRight) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "default";
      document.body.style.userSelect = "auto";
    };
  }, [isResizingLeft, isResizingRight]);

  const toggleSidebar = React.useCallback(
    (side: "left" | "right") => {
      startTransition(() => {
        if (side === "left") setShowLeftSidebar((prev) => !prev);
        if (side === "right") setShowRightSidebar((prev) => !prev);
      });
    },
    [startTransition],
  );

  const openSettingsModal = useCallback((message?: string) => {
    setSettingsPromptMessage(message);
    setIsSettingsOpen(true);
  }, []);

  const closeSettingsModal = useCallback(() => {
    setIsSettingsOpen(false);
    setSettingsPromptMessage(undefined);
    setResumeImportPending(false);
  }, []);

  if (!isMounted) {
    return (
      <div className="flex h-screen w-full bg-white dark:bg-[#050505] justify-center items-center text-black dark:text-white transition-colors">
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-accent/20 rounded-none"></div>
            <div className="absolute inset-0 border-4 border-accent border-t-transparent animate-spin rounded-none"></div>
          </div>
          <div className="text-center">
            <p className="font-display text-2xl font-black uppercase tracking-tighter animate-pulse">
              Infinite<span className="text-accent">Resume</span>
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 dark:text-white/40 mt-2">
              Initializing Engine...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full bg-slate-50 dark:bg-[#050505] overflow-hidden font-sans print:h-auto print:overflow-visible print:block transition-colors">
      {/* Top Nav Bar */}
      <nav className="h-14 bg-white dark:bg-[#111] border-b-2 border-black/10 dark:border-white/10 flex items-center justify-between px-4 shrink-0 z-30 print:hidden transition-colors">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 group"
            title="Back to Dashboard"
          >
            <div className="w-8 h-8 bg-accent rounded-sm flex items-center justify-center text-black transition-transform">
              <FileText className="w-4 h-4" strokeWidth={2.5} />
            </div>
            <span className="font-display font-bold text-lg tracking-tight text-black dark:text-white">
              Infinite<span className="text-accent">Resume</span>
            </span>
          </Link>

          <div className="w-px h-5 bg-black/10 dark:bg-white/10" />
          <div className="relative group/title px-1">
            {isEditingTitle ? (
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={() => {
                  setIsEditingTitle(false);
                  if (editTitle.trim() && editTitle !== resumeTitle) {
                    performSave(editTitle.trim());
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setIsEditingTitle(false);
                    if (editTitle.trim() && editTitle !== resumeTitle) {
                      performSave(editTitle.trim());
                    }
                  }
                  if (e.key === "Escape") {
                    setIsEditingTitle(false);
                    setEditTitle(resumeTitle || "Untitled Resume");
                  }
                }}
                className="text-xs font-mono bg-black/5 dark:bg-white/5 border border-accent text-black dark:text-white uppercase tracking-wider px-2 py-1 outline-none min-w-[120px]"
                autoFocus
              />
            ) : (
              <button
                onClick={() => {
                  setEditTitle(resumeTitle || "Untitled Resume");
                  setIsEditingTitle(true);
                }}
                className="text-xs font-mono text-black/40 dark:text-white/40 uppercase tracking-wider truncate max-w-[200px] hover:text-black dark:hover:text-white transition-colors flex items-center gap-2 group"
                title="Click to rename"
              >
                {resumeTitle || "Untitled Resume"}
                <Pencil className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            )}
          </div>

          <div className="w-px h-5 bg-black/10 dark:bg-white/10 mx-1" />

          <div className="flex items-center gap-1">
            <button
              onClick={undo}
              disabled={!canUndo}
              className="p-2 text-black/40 dark:text-white/40 hover:text-accent disabled:opacity-20 transition-all rounded-none"
              title="Undo (Cmd+Z)"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              className="p-2 text-black/40 dark:text-white/40 hover:text-accent disabled:opacity-20 transition-all rounded-none"
              title="Redo (Cmd+Shift+Z)"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>

          <div className="w-px h-5 bg-black/10 dark:bg-white/10" />

          {hasUnsavedChanges && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-mono text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
              Unsaved
            </div>
          )}

          {isOverOnePage && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-none text-[10px] font-mono uppercase tracking-wider border border-amber-300 dark:border-amber-600">
              <AlertTriangle className="w-3.5 h-3.5" />
              Content exceeds 1 page
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <ImportResume
            ref={importResumeRef}
            onRequireApiKey={() => {
              setResumeImportPending(true);
              openSettingsModal(
                "Add your API key in Settings to use AI resume extraction.",
              );
            }}
            onDataImported={async (data) => {
              // Explicitly clear arrays to ensure fields not in import are emptied
              const emptySections = {
                experience: [],
                education: [],
                skills: [],
                projects: [],
                awards: [],
                languages: [],
                volunteerWork: [],
                interests: [],
                socialLinks: [],
              };

              // Create full new data structure starting from initialData (for structure)
              // then applying empty sections, then imported data, but preserving design settings
              const newData: ResumeData = {
                ...initialData,
                ...emptySections,
                ...data,
                typography: resumeData.typography,
                spacing: resumeData.spacing,
                theme: resumeData.theme,
                layout: {
                  sectionOrder: initialData.layout?.sectionOrder || [],
                },
              };

              // Update local state
              setResumeData(newData);

              // Auto-save to database immediately
              const title =
                resumeTitle || data.personalInfo?.fullName || "Imported Resume";
              setIsSaving(true);
              try {
                const id = await saveResume({
                  id: resumeId || undefined,
                  title: title,
                  template: template,
                  content: newData,
                });

                if (!resumeTitle) setResumeTitle(title);
                if (!resumeId) {
                  router.replace(`/builder?id=${id}`, { scroll: false });
                }

                // Update save baseline
                lastSavedDataRef.current = newData;
                setLastSavedVersion(version + 1); // Approximate next version
                setLastSavedTemplate(template);
                setHasUnsavedChanges(false);
              } catch (error) {
                console.error("Auto-save failed after import:", error);
              } finally {
                setIsSaving(false);
              }
            }}
          />

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-1.5 bg-accent hover:bg-accent/90 text-black rounded-none text-xs font-bold uppercase tracking-wider transition-all shadow-none mr-2"
          >
            <Download className="w-3.5 h-3.5" />
            Download
          </button>

          <button
            onClick={handleSaveClick}
            disabled={isSaving || !hasUnsavedChanges}
            className="flex items-center gap-2 px-4 py-1.5 border-2 border-black/10 dark:border-white/10 hover:border-accent text-black dark:text-white rounded-none text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-30 disabled:hover:border-black/10 dark:disabled:hover:border-white/10"
          >
            {isSaving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            {isSaving ? "Saving..." : "Save"}
          </button>
          <ThemeToggle />
        </div>
      </nav>
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={closeSettingsModal}
          />
          <div className="relative w-full max-w-lg border-2 border-black/10 dark:border-white/10 bg-white dark:bg-[#050505] p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <h2 className="font-display text-xl font-black uppercase tracking-tight">
                AI Extraction Settings
              </h2>
              <button
                onClick={closeSettingsModal}
                className="text-xs font-bold uppercase tracking-wider text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white"
              >
                Close
              </button>
            </div>
            <div className="mt-4">
              <ResumeExtractionSettingsPanel
                initialSettings={getResumeExtractionSettings()}
                description={
                  settingsPromptMessage ||
                  "Use your own API key for AI resume extraction."
                }
                showClearButton={false}
                onSaveSuccess={() => {
                  if (resumeImportPending) {
                    setResumeImportPending(false);
                    closeSettingsModal();
                    window.setTimeout(
                      () => importResumeRef.current?.openFilePicker(),
                      0,
                    );
                  }
                }}
                onClose={closeSettingsModal}
              />
            </div>
          </div>
        </div>
      )}

      {/* Sidebars + Preview Row */}
      <div className="flex flex-1 overflow-hidden print:block print:overflow-visible">
        <AnimatePresence initial={false}>
          {showLeftSidebar && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: leftWidth, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={
                isResizingLeft
                  ? { duration: 0 }
                  : { duration: 0.3, ease: "easeInOut" }
              }
              className="shrink-0 overflow-hidden h-full z-20 shadow-md shadow-slate-200/50 dark:shadow-slate-900/50 flex print:hidden"
            >
              <div className="flex-1 w-full overflow-hidden">
                <LeftSidebar data={resumeData} onChange={setResumeData} />
              </div>
              <Resizer onMouseDown={handleMouseDownLeft} side="left" />
            </motion.div>
          )}
        </AnimatePresence>

        <div
          className={cn(
            "flex-1 flex flex-col min-w-0 transition-opacity",
            (isResizingLeft || isResizingRight) &&
              "pointer-events-none opacity-80",
          )}
        >
          <Preview
            data={deferredResumeData}
            template={template}
            leftSidebarOpen={showLeftSidebar}
            rightSidebarOpen={showRightSidebar}
            onToggleLeftSidebar={() => toggleSidebar("left")}
            onToggleRightSidebar={() => toggleSidebar("right")}
            onPrint={handlePrint}
            onHeightChange={handleHeightChange}
          />
        </div>

        <AnimatePresence initial={false}>
          {showRightSidebar && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: rightWidth, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={
                isResizingRight
                  ? { duration: 0 }
                  : { duration: 0.3, ease: "easeInOut" }
              }
              className="shrink-0 overflow-hidden h-full z-20 shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)] flex print:hidden"
            >
              <Resizer onMouseDown={handleMouseDownRight} side="right" />
              <div className="flex-1 w-full overflow-hidden">
                <RightSidebar
                  data={resumeData}
                  onChange={setResumeData}
                  template={template}
                  onTemplateChange={setTemplate}
                  onResetDesign={handleResetDesign}
                  hasUnsavedDesignChanges={hasUnsavedDesignChanges}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <SaveDialog
        isOpen={showSaveDialog}
        onClose={() => setShowSaveDialog(false)}
        onSave={handleSaveDialogSave}
        defaultTitle={getDefaultTitle()}
      />
    </div>
  );
}
