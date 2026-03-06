"use client";

import React, { useState } from "react";
import Link from "next/link";
import { RedirectToSignIn, SignOutButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  Authenticated,
  AuthLoading,
  Unauthenticated,
  useMutation,
  useQuery,
} from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import {
  Plus,
  Trash2,
  Pencil,
  Clock,
  Check,
  X,
  Copy,
  Loader2,
  Settings,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AppProviders } from "@/components/AppProviders";

function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function DashboardPage() {
  return (
    <AppProviders>
      <AuthLoading>
        <DashboardLoading />
      </AuthLoading>
      <Authenticated>
        <DashboardContent />
      </Authenticated>
      <Unauthenticated>
        <RedirectToSignIn redirectUrl="/dashboard" />
      </Unauthenticated>
    </AppProviders>
  );
}

function DashboardLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] text-black dark:text-white transition-colors">
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-24">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-64 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 animate-pulse"
            />
          ))}
        </div>
      </main>
    </div>
  );
}

function DashboardContent() {
  const router = useRouter();
  const resumes = useQuery(api.resumes.list);
  const removeResume = useMutation(api.resumes.remove);
  const renameResume = useMutation(api.resumes.rename);
  const duplicateResume = useMutation(api.resumes.duplicate);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDuplicating, setIsDuplicating] = useState<string | null>(null);

  const handleRename = async (id: string) => {
    if (editTitle.trim()) {
      await renameResume({
        id: id as Id<"resumes">,
        title: editTitle.trim(),
      });
    }
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    await removeResume({ id: id as Id<"resumes"> });
    setDeletingId(null);
  };

  const handleDuplicate = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setIsDuplicating(id);
    try {
      await duplicateResume({ id: id as Id<"resumes"> });
    } finally {
      setIsDuplicating(null);
    }
  };

  const startEditing = (id: string, currentTitle: string) => {
    setEditingId(id);
    setEditTitle(currentTitle);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] text-black dark:text-white transition-colors">
      {/* Header */}
      <header className="border-b border-black/10 dark:border-white/10 bg-white/80 dark:bg-[#050505]/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-accent rounded-sm flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
              <Image
                src="/icon.png"
                alt="InfiniteResume Logo"
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-display font-bold text-2xl tracking-tight">
              InfiniteResume
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/settings"
              className="flex items-center gap-2 px-4 py-2 border-2 border-black/10 dark:border-white/10 hover:border-accent text-black dark:text-white rounded-none text-xs font-bold uppercase tracking-wider transition-all"
            >
              <Settings className="w-3.5 h-3.5" />
              Settings
            </Link>
            <SignOutButton>
              <button
                type="button"
                className="px-4 py-2 border-2 border-black/10 dark:border-white/10 hover:border-red-500 hover:text-red-600 dark:hover:text-red-400 text-black dark:text-white rounded-none text-xs font-bold uppercase tracking-wider transition-all"
              >
                Log Out
              </button>
            </SignOutButton>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Title Row */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <h1 className="font-display text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none">
              My Resumes
            </h1>
            <p className="text-black/50 dark:text-white/50 font-mono text-sm uppercase tracking-wider mt-2">
              {resumes === undefined
                ? "Loading..."
                : `${resumes.length} resume${resumes.length !== 1 ? "s" : ""}`}
            </p>
          </div>
          <Link
            href="/builder"
            className="flex items-center gap-2 bg-accent text-black px-6 py-3 font-bold text-sm uppercase tracking-wider hover:bg-accent/90 hover:scale-105 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" strokeWidth={3} />
            New Resume
          </Link>
        </div>

        {/* Resume Grid */}
        {resumes === undefined ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-64 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 animate-pulse"
              />
            ))}
          </div>
        ) : resumes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-32 text-center"
          >
            <div className="w-24 h-24 bg-black/5 dark:bg-white/5 border-2 border-dashed border-black/20 dark:border-white/20 flex items-center justify-center overflow-hidden mb-6">
              <Image
                src="/icon.png"
                alt="InfiniteResume Logo"
                width={64}
                height={64}
                className="opacity-20 grayscale brightness-0 dark:invert"
              />
            </div>
            <h2 className="font-display text-2xl font-bold uppercase tracking-tight mb-2">
              No Resumes Yet
            </h2>
            <p className="text-black/50 dark:text-white/50 max-w-sm mb-8">
              Create your first professional resume and start landing
              interviews.
            </p>
            <Link
              href="/builder"
              className="flex items-center gap-2 bg-accent text-black px-8 py-4 font-bold text-sm uppercase tracking-wider hover:bg-accent/90 hover:scale-105 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" strokeWidth={3} />
              Create Your First Resume
            </Link>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {resumes.map((resume, index) => (
              <motion.div
                key={resume._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group relative bg-white dark:bg-[#111] border border-black/10 dark:border-white/10 hover:border-accent/50 transition-all duration-200 cursor-pointer"
                onClick={() => router.push(`/builder?id=${resume._id}`)}
              >
                {/* Card Preview Area */}
                <div className="h-40 bg-gradient-to-br from-black/[0.02] to-black/[0.06] dark:from-white/[0.02] dark:to-white/[0.06] flex items-center justify-center border-b border-black/10 dark:border-white/10 relative overflow-hidden">
                  <div className="w-20 h-28 bg-white dark:bg-[#1a1a1a] border border-black/10 dark:border-white/10 shadow-sm p-2 space-y-1.5">
                    <div className="h-2 w-10 bg-black/10 dark:bg-white/10 mx-auto" />
                    <div className="h-1 w-full bg-black/5 dark:bg-white/5" />
                    <div className="h-1 w-full bg-black/5 dark:bg-white/5" />
                    <div className="h-1 w-3/4 bg-black/5 dark:bg-white/5" />
                    <div className="h-px w-full bg-black/10 dark:bg-white/10 my-1" />
                    <div className="h-1 w-full bg-black/5 dark:bg-white/5" />
                    <div className="h-1 w-full bg-black/5 dark:bg-white/5" />
                    <div className="h-1 w-1/2 bg-black/5 dark:bg-white/5" />
                  </div>

                  {/* Template badge */}
                  <span className="absolute top-3 right-3 text-[10px] font-mono uppercase tracking-wider text-black/30 dark:text-white/30 bg-black/5 dark:bg-white/5 px-2 py-1">
                    {resume.template}
                  </span>
                </div>

                {/* Card Info */}
                <div className="p-4">
                  {editingId === resume._id ? (
                    <div
                      className="flex items-center gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleRename(resume._id);
                          if (e.key === "Escape") setEditingId(null);
                        }}
                        className="flex-1 px-2 py-1 bg-black/5 dark:bg-white/5 border border-accent text-sm font-medium text-black dark:text-white outline-none"
                        autoFocus
                      />
                      <button
                        onClick={() => handleRename(resume._id)}
                        className="p-1 text-accent hover:text-accent/80"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="p-1 text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <h3 className="font-bold text-sm truncate pr-16">
                      {resume.title}
                    </h3>
                  )}
                  <div className="flex items-center gap-1.5 mt-1.5 text-black/40 dark:text-white/40">
                    <Clock className="w-3 h-3" />
                    <span className="text-xs font-mono">
                      {formatDate(resume.updatedAt)}
                    </span>
                  </div>
                </div>

                {/* Action buttons */}
                <div
                  className="absolute bottom-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={(e) => handleDuplicate(e, resume._id)}
                    disabled={isDuplicating === resume._id}
                    className="p-1.5 text-black/40 dark:text-white/40 hover:text-accent hover:bg-accent/10 transition-colors disabled:opacity-50"
                    title="Duplicate"
                  >
                    {isDuplicating === resume._id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    onClick={() => startEditing(resume._id, resume.title)}
                    className="p-1.5 text-black/40 dark:text-white/40 hover:text-accent hover:bg-accent/10 transition-colors"
                    title="Rename"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  {deletingId === resume._id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDelete(resume._id)}
                        className="px-2 py-1 text-xs font-bold bg-red-500 text-white hover:bg-red-600 transition-colors"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => setDeletingId(null)}
                        className="p-1 text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeletingId(resume._id)}
                      className="p-1.5 text-black/40 dark:text-white/40 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}

            {/* New Resume Card */}
            <Link
              href="/builder"
              className="group flex flex-col items-center justify-center h-[264px] border-2 border-dashed border-black/15 dark:border-white/15 hover:border-accent/50 hover:bg-accent/5 transition-all duration-200"
            >
              <div className="w-14 h-14 border-2 border-black/15 dark:border-white/15 group-hover:border-accent group-hover:text-accent flex items-center justify-center transition-colors mb-3">
                <Plus className="w-6 h-6" />
              </div>
              <span className="font-bold text-sm uppercase tracking-wider text-black/40 dark:text-white/40 group-hover:text-accent transition-colors">
                New Resume
              </span>
            </Link>
          </motion.div>
        )}
      </main>
    </div>
  );
}
