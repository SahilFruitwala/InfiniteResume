import React, { useRef, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { ResumeData, TemplateType } from "../types";
import { MinimalTemplate } from "./templates/MinimalTemplate";
import { ProfessionalTemplate } from "./templates/ProfessionalTemplate";
import { ModernTemplate } from "./templates/ModernTemplate";
import { AcademicTemplate } from "./templates/AcademicTemplate";
import { CreativeTemplate } from "./templates/CreativeTemplate";
import {
  Download,
  AlertTriangle,
  PanelLeftClose,
  PanelRightClose,
  PanelLeft,
  PanelRight,
} from "lucide-react";

import { ThemeToggle } from "./ThemeToggle";

interface PreviewProps {
  data: ResumeData;
  template: TemplateType;
  leftSidebarOpen: boolean;
  rightSidebarOpen: boolean;
  onToggleLeftSidebar: () => void;
  onToggleRightSidebar: () => void;
}

export const Preview = ({
  data,
  template,
  leftSidebarOpen,
  rightSidebarOpen,
  onToggleLeftSidebar,
  onToggleRightSidebar,
}: PreviewProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);
  const { theme, resolvedTheme } = useTheme();

  // Use resolvedTheme to handle 'system' preference correctly
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    if (!contentRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContentHeight(entry.contentRect.height);
      }
    });

    observer.observe(contentRef.current);
    return () => observer.disconnect();
  }, [data, template]);

  const pageSize = data.spacing?.pageSize || "LETTER";
  const PAGE_WIDTH = pageSize === "A4" ? 794 : 816; // 96 DPI: A4 is ~794px, Letter is 816px (8.5in)
  const PAGE_HEIGHT = pageSize === "A4" ? 1123 : 1056; // 96 DPI: A4 is 1123px, Letter is 1056px (11in)

  const getTemplateMargins = () => {
    switch (template) {
      case "minimal":
      case "modern":
        return {
          top: data.spacing?.pageMarginTop ?? 32,
          bottom: data.spacing?.pageMarginBottom ?? 32,
        };
      case "academic":
        return {
          top: data.spacing?.pageMarginTop ?? 48,
          bottom: data.spacing?.pageMarginBottom ?? 48,
        };
      case "professional":
      case "creative":
      default:
        return {
          top: data.spacing?.pageMarginTop ?? 40,
          bottom: data.spacing?.pageMarginBottom ?? 40,
        };
    }
  };

  const margins = getTemplateMargins();
  const pdfPrintableHeight = PAGE_HEIGHT - margins.top - margins.bottom;
  const isOverOnePage = contentHeight > PAGE_HEIGHT;
  // Calculate how many page break lines to draw based on printable content height
  const innerContentHeight = contentHeight - margins.top - margins.bottom;
  const pageBreakCount = Math.max(
    0,
    Math.floor((innerContentHeight - 1) / pdfPrintableHeight),
  );

  const [isGenerating, setIsGenerating] = useState(false);

  const handlePrint = () => {
    // The browser's native print dialog takes care of PDF generation instantaneously
    // and correctly honors all the `print:` Tailwind classes in our templates.
    window.print();
  };

  const renderTemplate = () => {
    switch (template) {
      case "minimal":
        return <MinimalTemplate data={data} isDark={isDark} />;
      case "professional":
        return <ProfessionalTemplate data={data} isDark={isDark} />;
      case "modern":
        return <ModernTemplate data={data} isDark={isDark} />;
      case "academic":
        return <AcademicTemplate data={data} isDark={isDark} />;
      case "creative":
        return <CreativeTemplate data={data} isDark={isDark} />;
      default:
        return <MinimalTemplate data={data} isDark={isDark} />;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-slate-100 dark:bg-background overflow-hidden print:h-auto print:bg-white print:overflow-visible print:block transition-colors">
      {/* Toolbar */}
      <div className="h-16 bg-white dark:bg-card border-b border-slate-200 dark:border-border flex items-center justify-between px-4 shrink-0 shadow-sm z-10 print:hidden transition-colors">
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleLeftSidebar}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
            title={leftSidebarOpen ? "Hide Data Entry" : "Show Data Entry"}
          >
            {leftSidebarOpen ? (
              <PanelLeftClose className="w-5 h-5" />
            ) : (
              <PanelLeft className="w-5 h-5" />
            )}
          </button>
          {isOverOnePage && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-md text-sm font-medium border border-amber-200 ml-2">
              <AlertTriangle className="w-4 h-4" />
              Content exceeds 1 page
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-md text-sm font-medium transition-all shadow-sm"
          >
            <Download className="w-4 h-4" />
            Save as PDF
          </button>

          <ThemeToggle />

          <div className="w-px h-6 bg-slate-200 mx-1"></div>

          <button
            onClick={onToggleRightSidebar}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
            title={
              rightSidebarOpen ? "Hide Design Settings" : "Show Design Settings"
            }
          >
            {rightSidebarOpen ? (
              <PanelRightClose className="w-5 h-5" />
            ) : (
              <PanelRight className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 overflow-auto p-8 flex justify-center custom-scrollbar print:p-0 print:overflow-visible print:block">
        <div
          className={`shadow-xl shrink-0 print:shadow-none print:m-0 relative transition-colors ${
            isDark ? "border border-slate-700/60" : "bg-white"
          }`}
          style={{
            width: `${PAGE_WIDTH}px`,
            minHeight: `${PAGE_HEIGHT}px`,
            ...(isDark ? { backgroundColor: "#1a1a2e" } : {}),
          }}
          data-resume-theme={isDark ? "dark" : "light"}
        >
          <style
            dangerouslySetInnerHTML={{
              __html: `@media print { 
                @page { 
                  size: ${pageSize === "A4" ? "A4" : "letter"}; 
                  margin-top: ${margins.top}px;
                  margin-bottom: ${margins.bottom}px;
                  margin-left: 0;
                  margin-right: 0;
                } 
                /* Override inline padding-top and padding-bottom from templates */
                #resume-preview-content [data-print-wrapper] {
                  padding-top: 0 !important;
                  padding-bottom: 0 !important;
                }
              }`,
            }}
          />
          <div id="resume-preview-content" ref={contentRef} className="w-full">
            {renderTemplate()}
          </div>

          {/* Page breaks */}
          {isOverOnePage &&
            Array.from({ length: pageBreakCount }).map((_, i) => (
              <div
                key={i}
                className="absolute left-0 right-0 border-b-2 border-dashed border-amber-400 z-10 print:hidden pointer-events-none"
                style={{
                  top: `${margins.top + (i + 1) * pdfPrintableHeight}px`,
                }}
              >
                <span className="absolute right-4 -top-6 text-xs text-amber-600 font-medium bg-amber-50 px-2 py-1 rounded-t-md border border-b-0 border-amber-400 shadow-sm">
                  Page {i + 1} Break
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
