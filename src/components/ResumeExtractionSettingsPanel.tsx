"use client";

import React, { useMemo, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ResumeExtractionSettings,
  clearResumeExtractionSettings,
  setResumeExtractionSettings,
} from "@app/utils/resume-extraction-settings";

interface ResumeExtractionSettingsPanelProps {
  initialSettings: ResumeExtractionSettings;
  description?: string;
  onClose?: () => void;
  onSaveSuccess?: () => void;
  showClearButton?: boolean;
}

export function ResumeExtractionSettingsPanel({
  initialSettings,
  description,
  onClose,
  onSaveSuccess,
  showClearButton = true,
}: ResumeExtractionSettingsPanelProps) {
  const [settings, setSettings] =
    useState<ResumeExtractionSettings>(initialSettings);
  const [showGoogleKey, setShowGoogleKey] = useState(false);
  const [showOpenRouterKey, setShowOpenRouterKey] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const providerLabel = useMemo(
    () => (settings.provider === "google" ? "Google Gemini" : "OpenRouter"),
    [settings.provider],
  );

  const handleSave = () => {
    const saved = setResumeExtractionSettings(settings);
    setMessage(
      saved
        ? "Settings saved for this tab session."
        : "Unable to save settings in this browser.",
    );
    if (saved) {
      onSaveSuccess?.();
    }
  };

  const handleClear = () => {
    const cleared = clearResumeExtractionSettings();
    if (cleared) {
      setSettings({
        provider: "google",
        googleApiKey: "",
        openrouterApiKey: "",
      });
      setMessage("API keys cleared.");
    } else {
      setMessage("Unable to clear settings in this browser.");
    }
  };

  return (
    <div>
      <p className="text-xs font-mono uppercase tracking-wider text-black/60 dark:text-white/60">
        {description || "Use your own API key for AI resume extraction."}
      </p>

      <div className="mt-5">
        <label className="mb-2 block text-[10px] font-mono uppercase tracking-[0.2em] text-black/60 dark:text-white/60">
          Provider
        </label>
        <Select
          value={settings.provider}
          onValueChange={(value: "google" | "openrouter") =>
            setSettings((prev) => ({ ...prev, provider: value }))
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select provider" />
          </SelectTrigger>
          <SelectContent className="z-[120]">
            <SelectItem value="google">Google Gemini</SelectItem>
            <SelectItem value="openrouter">OpenRouter</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {settings.provider === "google" && (
        <div className="mt-4">
          <label className="mb-2 block text-[10px] font-mono uppercase tracking-[0.2em] text-black/60 dark:text-white/60">
            Google API Key
          </label>
          <div className="flex gap-2">
            <Input
              type={showGoogleKey ? "text" : "password"}
              value={settings.googleApiKey}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, googleApiKey: e.target.value }))
              }
              placeholder="AIza..."
              autoComplete="off"
            />
            <Button
              type="button"
              size="icon"
              variant="outline"
              onClick={() => setShowGoogleKey((prev) => !prev)}
              className="border-2 border-black/10 dark:border-white/10"
            >
              {showGoogleKey ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      )}

      {settings.provider === "openrouter" && (
        <div className="mt-4">
          <div>
            <label className="mb-2 block text-[10px] font-mono uppercase tracking-[0.2em] text-black/60 dark:text-white/60">
              OpenRouter API Key
            </label>
            <div className="flex gap-2">
              <Input
                type={showOpenRouterKey ? "text" : "password"}
                value={settings.openrouterApiKey}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    openrouterApiKey: e.target.value,
                  }))
                }
                placeholder="sk-or-v1-..."
                autoComplete="off"
              />
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={() => setShowOpenRouterKey((prev) => !prev)}
                className="border-2 border-black/10 dark:border-white/10"
              >
                {showOpenRouterKey ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 space-y-1 text-[10px] font-mono uppercase tracking-wider text-black/60 dark:text-white/60">
        <p>Selected provider: {providerLabel}.</p>
        <p>API keys are kept in memory for this tab only.</p>
        <p>Keys are never persisted and never saved to our servers.</p>
      </div>

      {message && (
        <p className="mt-3 text-[10px] font-mono uppercase tracking-wider text-accent">
          {message}
        </p>
      )}

      <div className="mt-6 flex items-center justify-between gap-3">
        {showClearButton ? (
          <Button
            type="button"
            variant="outline"
            onClick={handleClear}
            className="border-2 border-black/10 dark:border-white/10"
          >
            Clear Keys
          </Button>
        ) : (
          <div />
        )}
        <div className="flex items-center gap-2">
          {onClose && (
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-2 border-black/10 dark:border-white/10"
            >
              Close
            </Button>
          )}
          <Button type="button" onClick={handleSave}>
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
