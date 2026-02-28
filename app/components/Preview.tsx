import React, { useRef, useEffect, useState } from "react";
import { ResumeData, TemplateType } from "../types";
import { MinimalTemplate } from "./templates/MinimalTemplate";
import { ProfessionalTemplate } from "./templates/ProfessionalTemplate";
import { ModernTemplate } from "./templates/ModernTemplate";
import { AcademicTemplate } from "./templates/AcademicTemplate";
import { CreativeTemplate } from "./templates/CreativeTemplate";
import { Download, LayoutTemplate, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PreviewProps {
  data: ResumeData;
  template: TemplateType;
  onTemplateChange: (template: TemplateType) => void;
}

export const Preview = ({ data, template, onTemplateChange }: PreviewProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

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

  const PAGE_HEIGHT = 1056;
  const isOverOnePage = contentHeight > PAGE_HEIGHT;
  const [isGenerating, setIsGenerating] = useState(false);

  const handlePrint = () => {
    // The browser's native print dialog takes care of PDF generation instantaneously
    // and correctly honors all the `print:` Tailwind classes in our templates.
    window.print();
  };

  const renderTemplate = () => {
    switch (template) {
      case "minimal":
        return <MinimalTemplate data={data} />;
      case "professional":
        return <ProfessionalTemplate data={data} />;
      case "modern":
        return <ModernTemplate data={data} />;
      case "academic":
        return <AcademicTemplate data={data} />;
      case "creative":
        return <CreativeTemplate data={data} />;
      default:
        return <MinimalTemplate data={data} />;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-slate-100 overflow-hidden print:h-auto print:bg-white print:overflow-visible print:block">
      {/* Toolbar */}
      <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 shadow-sm z-10 print:hidden">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <LayoutTemplate className="w-4 h-4" />
            Template:
          </div>
          <select
            value={template}
            onChange={(e) => onTemplateChange(e.target.value as TemplateType)}
            className="px-3 py-1.5 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-slate-800 focus:border-slate-800 outline-none bg-white min-w-[140px]"
          >
            <option value="minimal">Minimal</option>
            <option value="professional">Professional</option>
            <option value="modern">Modern</option>
            <option value="academic">Academic</option>
            <option value="creative">Creative</option>
          </select>

          {isOverOnePage && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-md text-sm font-medium border border-amber-200">
              <AlertTriangle className="w-4 h-4" />
              Content exceeds 1 page
            </div>
          )}
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-md text-sm font-medium hover:bg-slate-700 transition-colors shadow-sm"
        >
          <>
            <Download className="w-4 h-4" />
            Save as PDF
          </>
        </button>
      </div>

      {/* Preview Area */}
      <div className="flex-1 overflow-y-auto p-8 flex justify-center custom-scrollbar print:p-0 print:overflow-visible print:block">
        <div className="bg-white shadow-xl max-w-4xl w-full min-h-[1056px] print:shadow-none print:m-0 print:max-w-none print:w-full relative">
          <div ref={contentRef} className="w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={template}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="w-full"
              >
                {renderTemplate()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Page breaks */}
          {isOverOnePage &&
            Array.from({
              length: Math.floor((contentHeight - 1) / PAGE_HEIGHT),
            }).map((_, i) => (
              <div
                key={i}
                className="absolute left-0 right-0 border-b-2 border-dashed border-amber-400 z-10 print:hidden pointer-events-none"
                style={{ top: `${(i + 1) * PAGE_HEIGHT}px` }}
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
