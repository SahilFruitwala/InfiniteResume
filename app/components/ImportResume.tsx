"use client";

import React, { useState } from "react";
import { Upload, Loader2, FileUp, AlertCircle } from "lucide-react";
import { parseResumeAction } from "../actions/parse-resume";
import { ResumeData } from "../types";
import { cn } from "@/lib/utils";

interface ImportResumeProps {
  onDataImported: (data: Partial<ResumeData>) => void;
  className?: string;
}

export function ImportResume({ onDataImported, className }: ImportResumeProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      const result = await parseResumeAction(uint8Array);

      if (result.success && result.data) {
        onDataImported(result.data as any);
      } else {
        throw new Error(result.error || "Failed to parse resume content");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong during import");
    } finally {
      setIsUploading(false);
      // Reset input
      e.target.value = "";
    }
  };

  return (
    <div className={cn("relative", className)}>
      <input
        type="file"
        id="resume-upload"
        className="hidden"
        accept=".pdf"
        onChange={handleFileChange}
        disabled={isUploading}
      />
      <button
        onClick={() => document.getElementById("resume-upload")?.click()}
        disabled={isUploading}
        className="flex items-center gap-2 px-4 py-1.5 border-2 border-black/10 dark:border-white/10 hover:border-accent text-black dark:text-white rounded-none text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50"
      >
        {isUploading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <FileUp className="w-3.5 h-3.5" />
        )}
        {isUploading ? "AI Parsing..." : "Import PDF"}
      </button>

      {error && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-2 text-[10px] text-red-600 dark:text-red-400 flex items-start gap-2 z-50">
          <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" />
          <p>{error}</p>
          <button
            onClick={() => setError(null)}
            className="ml-auto underline font-bold"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}
