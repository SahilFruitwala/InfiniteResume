"use client";

import React, { useState, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id, Doc } from "@/convex/_generated/dataModel";
import { ResumeData } from "@app/types";
import { analyzeResume, flattenResumeData } from "@app/utils/resume-analyzer";
import {
  analyzeResumeWithAI,
  type AIAnalysisResult,
} from "@app/utils/ai-resume-analyzer";
import {
  getResumeExtractionSettings,
  loadResumeExtractionSettings,
} from "@app/utils/resume-extraction-settings";
import { useUser } from "@clerk/nextjs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Zap,
  Target,
  AlertCircle,
  CheckCircle2,
  Trophy,
  History,
  Loader2,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Trash2,
  RefreshCcw,
  Clock,
  Briefcase,
  FileText,
  Brain,
} from "lucide-react";

// ── Content Hash (mirrors convex/resumes.ts) ─────────────────────────────────
function computeContentHash(content: any): string {
  const { typography, spacing, theme, layout, ...contentFields } = content;
  const str = JSON.stringify(contentFields);
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) & 0xffffffff;
  }
  return (hash >>> 0).toString(36);
}

// ── Types ────────────────────────────────────────────────────────────────────
type Analysis = Doc<"resumeAnalyses">;

interface AnalysisTabProps {
  data: ResumeData;
  resumeId: Id<"resumes"> | null;
  onRequireApiKey?: () => void;
}

// ── Staleness Badge ──────────────────────────────────────────────────────────
function StaleBadge() {
  return (
    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-[9px] font-mono uppercase tracking-wider border border-amber-300 dark:border-amber-600">
      <RefreshCcw className="w-3 h-3" />
      Resume Updated
    </div>
  );
}

// ── Score Ring ────────────────────────────────────────────────────────────────
function ScoreRing({
  score,
  size = 80,
  label,
}: {
  score: number;
  size?: number;
  label?: string;
}) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color =
    score >= 80
      ? "text-emerald-500"
      : score >= 60
        ? "text-accent"
        : score >= 40
          ? "text-amber-500"
          : "text-red-500";

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            className="text-black/10 dark:text-white/10"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={cn(color, "transition-all duration-1000")}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-black tracking-tighter">{score}</span>
        </div>
      </div>
      {label && (
        <span className="text-[8px] font-mono uppercase tracking-[0.15em] text-black/40 dark:text-white/40">
          {label}
        </span>
      )}
    </div>
  );
}

// ── AI Analysis Result Card ──────────────────────────────────────────────────
function AIAnalysisCard({
  analysis,
  onDelete,
  defaultOpen = false,
}: {
  analysis: Analysis;
  onDelete?: (id: Id<"resumeAnalyses">) => void;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const title =
    analysis.type === "jd_match"
      ? `${analysis.jobTitle || "Job Match"}${analysis.jobCompany ? ` — ${analysis.jobCompany}` : ""}`
      : "Resume Analysis";

  const dateStr = new Date(analysis.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={cn(
        "border-2 transition-all",
        analysis.isStale
          ? "border-amber-400/40 dark:border-amber-500/30 bg-amber-50/30 dark:bg-amber-900/10"
          : "border-black/10 dark:border-white/10",
      )}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 p-3 text-left hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
      >
        {isOpen ? (
          <ChevronDown className="w-3.5 h-3.5 text-accent shrink-0" />
        ) : (
          <ChevronRight className="w-3.5 h-3.5 text-black/30 dark:text-white/30 shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {analysis.type === "jd_match" ? (
              <Briefcase className="w-3 h-3 text-accent shrink-0" />
            ) : (
              <FileText className="w-3 h-3 text-accent shrink-0" />
            )}
            <span className="text-xs font-bold uppercase tracking-wide truncate">
              {title}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[9px] font-mono text-black/40 dark:text-white/40">
              {dateStr}
            </span>
            {analysis.isStale && <StaleBadge />}
          </div>
        </div>
        <div className="shrink-0">
          <ScoreRing score={analysis.overallScore} size={36} />
        </div>
      </button>

      {isOpen && (
        <div className="p-3 pt-0 space-y-4 animate-in fade-in slide-in-from-top-1 duration-300">
          {/* Score Breakdown */}
          <div className="flex gap-3 justify-center pt-2">
            <ScoreRing
              score={analysis.scoreBreakdown.content * 4}
              size={52}
              label="Content"
            />
            <ScoreRing
              score={analysis.scoreBreakdown.format * 4}
              size={52}
              label="Format"
            />
            <ScoreRing
              score={analysis.scoreBreakdown.impact * 4}
              size={52}
              label="Impact"
            />
            <ScoreRing
              score={analysis.scoreBreakdown.keywords * 4}
              size={52}
              label="Keywords"
            />
          </div>

          {/* JD Match Score */}
          {analysis.type === "jd_match" &&
            analysis.matchScore !== undefined && (
              <div className="space-y-1 pt-1">
                <div className="flex justify-between items-center text-[9px] font-mono uppercase tracking-widest px-1">
                  <span className="text-black/60 dark:text-white/40">
                    JD Match
                  </span>
                  <span
                    className={cn(
                      "font-bold",
                      analysis.matchScore >= 80
                        ? "text-emerald-500"
                        : analysis.matchScore >= 50
                          ? "text-amber-500"
                          : "text-red-500",
                    )}
                  >
                    {analysis.matchScore}%
                  </span>
                </div>
                <Progress
                  value={analysis.matchScore}
                  className={cn(
                    "h-1 bg-black/10 dark:bg-white/10 [&>div]:transition-all duration-1000",
                    analysis.matchScore >= 80
                      ? "[&>div]:bg-emerald-500"
                      : analysis.matchScore >= 50
                        ? "[&>div]:bg-amber-500"
                        : "[&>div]:bg-red-500",
                  )}
                />
              </div>
            )}

          {/* AI Summary */}
          <div className="p-3 bg-black/[0.03] dark:bg-white/[0.03] border border-black/5 dark:border-white/5">
            <p className="text-[11px] leading-relaxed text-black/70 dark:text-white/70 italic">
              {analysis.aiSummary}
            </p>
          </div>

          {/* Strengths */}
          <div className="space-y-2">
            <span className="text-[9px] font-mono uppercase tracking-widest text-black/40 dark:text-white/40 flex items-center gap-1.5">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              Strengths
            </span>
            <div className="space-y-1.5">
              {analysis.strengths.map((s, i) => (
                <div
                  key={i}
                  className="p-2 border-l-2 border-emerald-500/30 bg-emerald-500/5 text-[10px] leading-relaxed text-black/70 dark:text-white/70"
                >
                  {s}
                </div>
              ))}
            </div>
          </div>

          {/* Improvements */}
          <div className="space-y-2">
            <span className="text-[9px] font-mono uppercase tracking-widest text-black/40 dark:text-white/40 flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-accent" />
              Improvements
            </span>
            <div className="space-y-1.5">
              {analysis.improvements.map((s, i) => (
                <div
                  key={i}
                  className="p-2 border-l-2 border-accent/30 bg-accent/5 text-[10px] leading-relaxed text-black/70 dark:text-white/70"
                >
                  {s}
                </div>
              ))}
            </div>
          </div>

          {/* Missing Keywords (JD match only) */}
          {analysis.type === "jd_match" &&
            analysis.missingKeywords &&
            analysis.missingKeywords.length > 0 && (
              <div className="space-y-2">
                <span className="text-[9px] font-mono uppercase tracking-widest text-black/40 dark:text-white/40 flex items-center gap-1.5">
                  <Target className="w-3 h-3 text-red-500" />
                  Missing Keywords
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.missingKeywords.map((kw, i) => (
                    <Badge
                      key={i}
                      variant="ghost"
                      className="rounded-none bg-red-500/5 hover:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 text-[8px] px-2 py-0.5 font-mono"
                    >
                      {kw}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

          {/* Matched Keywords (JD match only) */}
          {analysis.type === "jd_match" &&
            analysis.matchedKeywords &&
            analysis.matchedKeywords.length > 0 && (
              <div className="space-y-2">
                <span className="text-[9px] font-mono uppercase tracking-widest text-black/40 dark:text-white/40 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  Matched Keywords
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.matchedKeywords.map((kw, i) => (
                    <Badge
                      key={i}
                      variant="ghost"
                      className="rounded-none bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[8px] px-2 py-0.5 font-mono"
                    >
                      {kw}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

          {/* Delete button */}
          {onDelete && (
            <div className="flex justify-end pt-1">
              <button
                onClick={() => onDelete(analysis._id)}
                className="flex items-center gap-1 text-[9px] font-mono uppercase tracking-wider text-red-500/60 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                Delete
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main Analysis Tab ────────────────────────────────────────────────────────
export function AnalysisTab({
  data,
  resumeId,
  onRequireApiKey,
}: AnalysisTabProps) {
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAnalyzingJd, setIsAnalyzingJd] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();

  // Hydrate encrypted API keys from localStorage
  useEffect(() => {
    if (user?.id) {
      loadResumeExtractionSettings(user.id);
    }
  }, [user?.id]);

  // Client-side instant analysis
  const analysis = React.useMemo(() => {
    const flattened = flattenResumeData(data);
    return analyzeResume(flattened, jobDescription);
  }, [data, jobDescription]);

  // Persisted analyses from DB
  const savedAnalyses = useQuery(
    api.analyses.listByResume,
    resumeId ? { resumeId } : "skip",
  );
  const saveAnalysis = useMutation(api.analyses.save);
  const removeAnalysis = useMutation(api.analyses.remove);

  const standaloneAnalysis = savedAnalyses?.find(
    (a) => a.type === "standalone",
  );
  const jdAnalyses = savedAnalyses?.filter((a) => a.type === "jd_match") ?? [];

  const handleRunAnalysis = useCallback(async () => {
    if (!resumeId) return;
    setIsAnalyzing(true);
    setError(null);

    const settings = getResumeExtractionSettings();
    const missingKey =
      (settings.provider === "google" && !settings.googleApiKey) ||
      (settings.provider === "openrouter" && !settings.openrouterApiKey);

    if (missingKey) {
      setError("Add your API key in Settings to use AI analysis.");
      onRequireApiKey?.();
      setIsAnalyzing(false);
      return;
    }

    try {
      const resumeText = flattenResumeData(data);
      const result = await analyzeResumeWithAI(resumeText, settings);

      if (!result.success) {
        setError(result.error);
        return;
      }

      await saveAnalysis({
        resumeId,
        type: "standalone",
        resumeContentHash: computeContentHash(data),
        overallScore: result.data.overallScore,
        scoreBreakdown: result.data.scoreBreakdown,
        strengths: result.data.strengths,
        improvements: result.data.improvements,
        aiSummary: result.data.aiSummary,
      });
    } catch (err: any) {
      setError(err?.message || "Analysis failed");
    } finally {
      setIsAnalyzing(false);
    }
  }, [resumeId, data, saveAnalysis, onRequireApiKey]);

  const handleRunJdAnalysis = useCallback(async () => {
    if (!resumeId || !jobDescription.trim()) return;
    setIsAnalyzingJd(true);
    setError(null);

    const settings = getResumeExtractionSettings();
    const missingKey =
      (settings.provider === "google" && !settings.googleApiKey) ||
      (settings.provider === "openrouter" && !settings.openrouterApiKey);

    if (missingKey) {
      setError("Add your API key in Settings to use AI analysis.");
      onRequireApiKey?.();
      setIsAnalyzingJd(false);
      return;
    }

    try {
      const resumeText = flattenResumeData(data);
      const result = await analyzeResumeWithAI(
        resumeText,
        settings,
        jobDescription,
      );

      if (!result.success) {
        setError(result.error);
        return;
      }

      await saveAnalysis({
        resumeId,
        type: "jd_match",
        jobTitle: result.data.jobTitle || "Untitled Position",
        jobCompany: result.data.jobCompany || undefined,
        jobDescription: jobDescription.slice(0, 5000), // cap stored JD
        resumeContentHash: computeContentHash(data),
        overallScore: result.data.overallScore,
        scoreBreakdown: result.data.scoreBreakdown,
        matchScore: result.data.matchScore,
        strengths: result.data.strengths,
        improvements: result.data.improvements,
        missingKeywords: result.data.missingKeywords,
        matchedKeywords: result.data.matchedKeywords,
        aiSummary: result.data.aiSummary,
      });

      setJobDescription(""); // Clear JD after successful analysis
    } catch (err: any) {
      setError(err?.message || "Analysis failed");
    } finally {
      setIsAnalyzingJd(false);
    }
  }, [resumeId, data, jobDescription, saveAnalysis, onRequireApiKey]);

  const handleDelete = useCallback(
    async (id: Id<"resumeAnalyses">) => {
      await removeAnalysis({ id });
    },
    [removeAnalysis],
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* ── Quick Score Dashboard (instant, client-side) ────────────────── */}
      <div className="flex flex-col items-center text-center p-5 bg-black/5 dark:bg-white/5 border-2 border-black/10 dark:border-white/10 relative overflow-hidden group">
        <div className="absolute -top-6 -right-6 opacity-[0.03] dark:opacity-[0.05] group-hover:opacity-10 transition-opacity pointer-events-none -rotate-12 z-0">
          <Zap className="w-24 h-24 text-accent" />
        </div>
        <span className="relative z-10 font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 dark:text-white/40 mb-2">
          Quick Score
        </span>
        <div className="relative z-10">
          <span className="text-5xl font-black tracking-tighter text-black dark:text-white">
            {analysis.standaloneScore}
            <span className="text-xl text-accent">/100</span>
          </span>
        </div>
        <div className="w-full mt-4 space-y-3">
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
          {analysis.scoreBreakdown.penalties < 0 && (
            <div className="pt-1">
              <div className="flex justify-between items-center text-[9px] font-mono uppercase tracking-widest px-1 mb-1">
                <span className="text-red-500/60 font-bold flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Penalties
                </span>
                <span className="text-red-500 font-bold">
                  {analysis.scoreBreakdown.penalties}
                </span>
              </div>
            </div>
          )}
        </div>
        {/* Quick suggestions */}
        {analysis.suggestions.length > 0 && (
          <div className="w-full mt-4 space-y-1.5 text-left">
            {analysis.suggestions.slice(0, 3).map((s, i) => (
              <div
                key={i}
                className={cn(
                  "p-2 border-l-2 flex gap-2 items-start text-[10px]",
                  s.severity === "error"
                    ? "bg-red-500/5 border-red-500/30"
                    : s.severity === "warning"
                      ? "bg-amber-500/5 border-amber-500/30"
                      : "bg-emerald-500/5 border-emerald-500/30",
                )}
              >
                {s.severity === "error" ? (
                  <AlertCircle className="w-3 h-3 text-red-500 shrink-0 mt-0.5" />
                ) : s.severity === "warning" ? (
                  <AlertCircle className="w-3 h-3 text-amber-500 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" />
                )}
                <p className="leading-relaxed text-black/70 dark:text-white/70">
                  {s.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── AI Deep Analysis Section ──────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-accent" />
          <h3 className="font-display font-black uppercase tracking-tight text-sm">
            AI Deep Analysis
          </h3>
        </div>

        {!resumeId && (
          <div className="p-4 border-2 border-dashed border-black/10 dark:border-white/10 text-center">
            <p className="text-[10px] text-black/40 dark:text-white/40 italic">
              Save your resume first to use AI analysis.
            </p>
          </div>
        )}

        {resumeId && (
          <div className="space-y-3">
            {/* Resume-Only Analysis */}
            <Button
              onClick={handleRunAnalysis}
              disabled={isAnalyzing || isAnalyzingJd}
              variant="outline"
              className="w-full border-2 border-accent/30 hover:border-accent hover:bg-accent/5 rounded-none text-xs font-bold uppercase tracking-wider group"
            >
              {isAnalyzing ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 mr-2 group-hover:text-accent transition-colors" />
              )}
              {isAnalyzing
                ? "Analyzing..."
                : standaloneAnalysis
                  ? "Re-analyze Resume"
                  : "Analyze Resume"}
            </Button>

            {/* JD Match Analysis */}
            <div className="space-y-2 bg-white dark:bg-[#111] border-2 border-black/10 dark:border-white/10 p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Target className="w-3 h-3 text-accent" />
                <span className="text-[9px] font-mono uppercase tracking-widest text-black/50 dark:text-white/40">
                  Job Description Match
                </span>
              </div>
              <Textarea
                placeholder="Paste a job description to get a tailored match analysis..."
                className="min-h-[100px] rounded-none border-black/10 dark:border-white/10 focus:border-accent text-xs font-mono leading-relaxed resize-none"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
              <Button
                onClick={handleRunJdAnalysis}
                disabled={
                  isAnalyzingJd || isAnalyzing || !jobDescription.trim()
                }
                variant="outline"
                className="w-full border-2 border-black/10 dark:border-white/10 hover:border-accent rounded-none text-xs font-bold uppercase tracking-wider"
              >
                {isAnalyzingJd ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />
                ) : (
                  <Target className="w-3.5 h-3.5 mr-2" />
                )}
                {isAnalyzingJd ? "Analyzing Match..." : "Analyze Match"}
              </Button>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-[10px] text-red-600 dark:text-red-400 flex items-start gap-2">
            <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <p className="flex-1">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-[9px] font-bold uppercase underline shrink-0"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/* ── Saved Analyses ────────────────────────────────────────────── */}
      {resumeId && savedAnalyses && savedAnalyses.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-accent" />
            <h3 className="font-display font-black uppercase tracking-tight text-sm">
              Past Analyses
            </h3>
            <span className="text-[9px] font-mono text-black/40 dark:text-white/40 ml-auto">
              {savedAnalyses.length}
            </span>
          </div>

          {/* Standalone Analysis */}
          {standaloneAnalysis && (
            <AIAnalysisCard
              analysis={standaloneAnalysis}
              onDelete={handleDelete}
              defaultOpen={jdAnalyses.length === 0}
            />
          )}

          {/* JD Match Analyses */}
          {jdAnalyses.length > 0 && (
            <div className="space-y-2">
              <span className="text-[9px] font-mono uppercase tracking-widest text-black/40 dark:text-white/40 flex items-center gap-1.5">
                <Briefcase className="w-3 h-3" />
                Job Matches ({jdAnalyses.length})
              </span>
              {jdAnalyses.map((a, i) => (
                <AIAnalysisCard
                  key={a._id}
                  analysis={a}
                  onDelete={handleDelete}
                  defaultOpen={i === 0 && !standaloneAnalysis}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Stats Grid ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 pb-4">
        <div className="space-y-1">
          <span className="text-[8px] font-mono uppercase text-black/40 dark:text-white/40">
            Word Count
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold">{analysis.wordCount}</span>
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
    </div>
  );
}
