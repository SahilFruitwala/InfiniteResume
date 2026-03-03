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
import Link from "next/link";

interface PreviewProps {
  data: ResumeData;
  template: TemplateType;
  leftSidebarOpen: boolean;
  rightSidebarOpen: boolean;
  onToggleLeftSidebar: () => void;
  onToggleRightSidebar: () => void;
  onPrint?: () => void;
  onHeightChange?: (height: number, isOver: boolean) => void;
}

export const Preview = ({
  data,
  template,
  leftSidebarOpen,
  rightSidebarOpen,
  onToggleLeftSidebar,
  onToggleRightSidebar,
  onPrint,
  onHeightChange,
}: PreviewProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);
  const [scale, setScale] = useState(1);
  const { theme, resolvedTheme } = useTheme();

  // Use resolvedTheme to handle 'system' preference correctly
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    if (!contentRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const height = entry.contentRect.height;
        setContentHeight(height);

        // Calculate if over one page
        const pageSize = data.spacing?.pageSize || "LETTER";
        const pageHeight = pageSize === "A4" ? 1123 : 1056;
        if (onHeightChange) {
          onHeightChange(height, height > pageHeight);
        }
      }
    });

    observer.observe(contentRef.current);
    return () => observer.disconnect();
  }, [data, template, onHeightChange]);

  const pageSize = data.spacing?.pageSize || "LETTER";
  const PAGE_WIDTH = pageSize === "A4" ? 794 : 816;
  const PAGE_HEIGHT = pageSize === "A4" ? 1123 : 1056;

  // Scale resume to fit container width
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        // contentRect.width is the inner content width (excludes padding)
        const availableWidth = entry.contentRect.width;
        setScale(availableWidth < PAGE_WIDTH ? availableWidth / PAGE_WIDTH : 1);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [PAGE_WIDTH]);

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
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-[#1a1a1a] overflow-hidden print:h-auto print:bg-white print:overflow-visible print:block transition-colors">
      {/* Internal Toolbar - Left/Right sidebar toggles kept here as they feel specific to the preview container layout */}
      <div className="h-10 bg-white dark:bg-card border-b border-black/10 dark:border-white/10 flex items-center justify-between px-3 shrink-0 shadow-none z-10 print:hidden transition-colors">
        <button
          onClick={onToggleLeftSidebar}
          className="p-1.5 text-black/50 dark:text-white/50 hover:text-accent hover:bg-accent/10 rounded-none transition-colors"
          title={leftSidebarOpen ? "Hide Data Entry" : "Show Data Entry"}
        >
          {leftSidebarOpen ? (
            <PanelLeftClose className="w-4 h-4" />
          ) : (
            <PanelLeft className="w-4 h-4" />
          )}
        </button>

        <button
          onClick={onToggleRightSidebar}
          className="p-1.5 text-black/50 dark:text-white/50 hover:text-accent hover:bg-accent/10 rounded-none transition-colors"
          title={
            rightSidebarOpen ? "Hide Design Settings" : "Show Design Settings"
          }
        >
          {rightSidebarOpen ? (
            <PanelRightClose className="w-4 h-4" />
          ) : (
            <PanelRight className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Preview Area */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto overflow-x-hidden p-8 pb-32 resume-preview-scroll print:p-0 print:overflow-visible print:block bg-slate-50 dark:bg-[#050505]"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {/* Wrapper: sized to match the scaled resume, centered with mx-auto */}
        <div
          className="resume-scale-wrapper mx-auto print:!w-auto print:!h-auto print:!transform-none"
          style={{
            width: `${PAGE_WIDTH * scale}px`,
            height: `${Math.max(contentHeight, PAGE_HEIGHT) * scale}px`,
            marginBottom: "2rem",
          }}
        >
          <div
            className={`relative shadow-xl print:shadow-none print:border-0 print:m-0 transition-colors ${
              isDark ? "border border-white/10" : "bg-white"
            }`}
            style={{
              width: `${PAGE_WIDTH}px`,
              minHeight: `${PAGE_HEIGHT}px`,
              transform: scale < 1 ? `scale(${scale})` : undefined,
              transformOrigin: "top left",
              backgroundColor: isDark ? "#111111" : "white",
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
                  /* Reset scaling wrapper for print */
                  .resume-scale-wrapper {
                    width: auto !important;
                    height: auto !important;
                    overflow: visible !important;
                  }
                  /* Reset any inline transform for print */
                  [data-resume-theme] {
                    transform: none !important;
                    width: 100% !important;
                    min-height: auto !important;
                  }
                  /* Override inline padding-top and padding-bottom from templates */
                  #resume-preview-content [data-print-wrapper] {
                    padding-top: 0 !important;
                    padding-bottom: 0 !important;
                  }
                }`,
              }}
            />
            <div
              id="resume-preview-content"
              ref={contentRef}
              className="w-full"
            >
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
    </div>
  );
};
