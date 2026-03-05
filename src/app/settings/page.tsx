"use client";

import React, { Suspense, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, FileText } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ResumeExtractionSettingsPanel } from "@/components/ResumeExtractionSettingsPanel";
import { getResumeExtractionSettings } from "@app/utils/resume-extraction-settings";

function GlobalSettingsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo");
  const initialSettings = useMemo(() => getResumeExtractionSettings(), []);

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] text-black dark:text-white transition-colors">
      <header className="border-b border-black/10 dark:border-white/10 bg-white/80 dark:bg-[#050505]/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-accent rounded-sm flex items-center justify-center text-black transition-transform">
              <FileText className="w-6 h-6" strokeWidth={2.5} />
            </div>
            <span className="font-display font-bold text-2xl tracking-tight">
              InfiniteResume
            </span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <button
          onClick={() => {
            if (returnTo?.startsWith("/")) {
              router.push(returnTo);
            } else {
              router.push("/dashboard");
            }
          }}
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {returnTo ? "Back" : "Back to Dashboard"}
        </button>

        <h1 className="mt-6 font-display text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none">
          Global Settings
        </h1>
        <p className="mt-2 text-black/50 dark:text-white/50 font-mono text-xs uppercase tracking-wider">
          Provider and API key configuration for AI resume extraction.
        </p>

        <section className="mt-8 border-2 border-black/10 dark:border-white/10 bg-white dark:bg-[#080808] p-6">
          <h2 className="font-display text-xl font-black uppercase tracking-tight">
            AI Resume Extraction
          </h2>
          <div className="mt-4">
            <ResumeExtractionSettingsPanel
              initialSettings={initialSettings}
              description="Use your own API key for AI resume extraction."
            />
          </div>
        </section>
      </main>
    </div>
  );
}

export default function GlobalSettingsPage() {
  return (
    <Suspense fallback={null}>
      <GlobalSettingsPageContent />
    </Suspense>
  );
}
