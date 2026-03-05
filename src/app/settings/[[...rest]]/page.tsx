"use client";

import React, { Suspense, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, FileText, User, Settings } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ResumeExtractionSettingsPanel } from "@/components/ResumeExtractionSettingsPanel";
import { getResumeExtractionSettings } from "@app/utils/resume-extraction-settings";
import { UserProfile } from "@clerk/nextjs";

function GlobalSettingsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo");
  const tab = searchParams.get("tab") || "ai";
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
          Settings
        </h1>
        <p className="mt-2 text-black/50 dark:text-white/50 font-mono text-xs uppercase tracking-wider">
          Configure your profile and AI preferences.
        </p>

        <div className="mt-10 flex flex-wrap gap-4 border-b border-black/10 dark:border-white/10 pb-4">
          <button
            onClick={() => router.push("?tab=ai", { scroll: false })}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-mono uppercase tracking-wider transition-colors ${
              tab === "ai"
                ? "bg-black dark:bg-white text-white dark:text-black"
                : "text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white"
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            AI Extraction
          </button>
          <button
            onClick={() => router.push("?tab=profile", { scroll: false })}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-mono uppercase tracking-wider transition-colors ${
              tab === "profile"
                ? "bg-black dark:bg-white text-white dark:text-black"
                : "text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white"
            }`}
          >
            <User className="w-3.5 h-3.5" />
            Profile
          </button>
        </div>

        <div className="mt-8">
          {tab === "ai" ? (
            <section className="border-2 border-black/10 dark:border-white/10 bg-white dark:bg-[#080808] p-6">
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
          ) : (
            <section className="bg-transparent overflow-hidden">
              <UserProfile
                routing="path"
                path="/settings"
                appearance={{
                  variables: {
                    colorPrimary: "#16a34a",
                    fontFamily: "var(--font-inter)",
                    borderRadius: "0.5rem",
                  },
                  elements: {
                    card: "bg-transparent shadow-none p-0 w-full max-w-none text-foreground",
                    navbar: "hidden",
                    headerTitle: "hidden",
                    headerSubtitle: "hidden",
                    pageScrollBox: "p-0",
                    profileSection:
                      "border border-border bg-card p-6 mb-6 rounded-xl shadow-sm",
                    profileSectionTitle:
                      "font-display text-xl font-bold tracking-tight text-foreground mb-4",
                    profileSectionPrimaryButton:
                      "text-accent hover:text-accent/80 font-medium transition-colors",
                    formButtonPrimary:
                      "bg-accent hover:bg-accent/90 text-black font-semibold h-9 px-4 py-2 rounded-md transition-colors",
                    formFieldInput:
                      "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-accent disabled:cursor-not-allowed disabled:opacity-50 text-foreground transition-all",
                    accordionTriggerButton:
                      "font-medium text-foreground hover:bg-muted/50 rounded-md transition-colors px-2 py-1 -ml-2",
                    badge:
                      "bg-accent/10 text-accent font-medium px-2 py-0.5 rounded-full text-xs",
                    profileSectionHeader: "border-b border-border pb-4 mb-4",
                    avatarImageActionsUpload:
                      "text-accent font-medium hover:text-accent/80 transition-colors",
                    breadcrumbsItem:
                      "font-medium text-muted-foreground hover:text-foreground transition-colors",
                    breadcrumbsSeparator: "text-muted-foreground",
                    userPreviewMainIdentifier: "text-foreground font-semibold",
                    userPreviewSecondaryIdentifier:
                      "text-muted-foreground text-sm",
                    formFieldLabel:
                      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground mb-1.5",
                  },
                }}
              />
            </section>
          )}
        </div>
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
