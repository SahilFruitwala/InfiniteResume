"use client";

import React, { useState, useEffect } from "react";
import { Loader2, FileUp, AlertCircle } from "lucide-react";
import { ResumeData } from "@app/types";
import { cn } from "@/lib/utils";
import {
  getResumeExtractionSettings,
  loadResumeExtractionSettings,
} from "@app/utils/resume-extraction-settings";
import { useUser } from "@clerk/nextjs";
import { parseResumeInBrowser } from "@app/utils/client-resume-parser";
import { Button } from "@/components/ui/button";

interface ImportResumeProps {
  onDataImported: (data: Partial<ResumeData>) => void;
  onRequireApiKey?: () => void;
  className?: string;
}

export interface ImportResumeHandle {
  openFilePicker: () => void;
}

export const ImportResume = React.forwardRef<
  ImportResumeHandle,
  ImportResumeProps
>(({ onDataImported, onRequireApiKey, className }, ref) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();

  // Hydrate encrypted API keys from localStorage
  useEffect(() => {
    if (user?.id) {
      loadResumeExtractionSettings(user.id);
    }
  }, [user?.id]);

  const openPicker = () => {
    document.getElementById("resume-upload")?.click();
  };

  React.useImperativeHandle(ref, () => ({
    openFilePicker: openPicker,
  }));

  const handleOpenUpload = () => {
    const settings = getResumeExtractionSettings();
    const missingKey =
      (settings.provider === "google" && !settings.googleApiKey) ||
      (settings.provider === "openrouter" && !settings.openrouterApiKey);

    if (missingKey) {
      setError("Add your API key in Settings to use AI resume extraction.");
      onRequireApiKey?.();
      return;
    }

    openPicker();
  };

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
      const settings = getResumeExtractionSettings();
      const missingKey =
        (settings.provider === "google" && !settings.googleApiKey) ||
        (settings.provider === "openrouter" && !settings.openrouterApiKey);

      if (missingKey) {
        setError("Add your API key in Settings to use AI resume extraction.");
        onRequireApiKey?.();
        return;
      }

      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const result = await parseResumeInBrowser(uint8Array, settings);

      if (result.success && result.data) {
        onDataImported(result.data as any);
      } else {
        const errorMessage = result.success
          ? "Failed to parse resume content"
          : result.error;
        throw new Error(errorMessage || "Failed to parse resume content");
      }
    } catch (err: any) {
      console.error(err);
      const message = err?.message || "Something went wrong during import";
      if (
        /invalid api key|api key not valid|unauthorized|permission/i.test(
          message,
        )
      ) {
        setError("Invalid API key. Update your key in Settings and try again.");
      } else if (/quota|rate limit|429/i.test(message)) {
        setError("API quota exceeded or rate-limited. Try again later.");
      } else {
        setError(message);
      }
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
      <Button
        type="button"
        onClick={handleOpenUpload}
        disabled={isUploading}
        variant="outline"
        size="xs"
        className="border-2 border-black/10 dark:border-white/10 hover:border-accent text-black dark:text-white"
      >
        {isUploading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <FileUp className="w-3.5 h-3.5" />
        )}
        {isUploading ? "AI Parsing..." : "Import PDF"}
      </Button>

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
});

ImportResume.displayName = "ImportResume";
