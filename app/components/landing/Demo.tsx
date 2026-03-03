"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Zap, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

export function Demo() {
  const [jobTitle, setJobTitle] = useState("");
  const [status, setStatus] = useState<"idle" | "scanning" | "complete">(
    "idle",
  );

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle) return;
    setStatus("scanning");
    setTimeout(() => {
      setStatus("complete");
    }, 2500);
  };

  const reset = () => {
    setJobTitle("");
    setStatus("idle");
  };

  return (
    <section
      id="demo"
      className="py-32 bg-white/40 dark:bg-black/40 backdrop-blur-md text-black dark:text-foreground border-t border-black/10 dark:border-white/10 relative overflow-hidden"
    >
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl sm:text-5xl md:text-7xl font-black uppercase leading-[0.9] tracking-tighter mb-6">
            Test the <span className="text-accent">Engine.</span>
          </h2>
          <p className="text-xl text-black/60 dark:text-white/60 font-light max-w-2xl mx-auto">
            Enter a job title to see how our ATS scanner extracts keywords and
            scores your resume against the competition.
          </p>
        </motion.div>

        <div className="bg-gray-50 dark:bg-card border border-black/10 dark:border-white/10 p-6 md:p-10 shadow-2xl relative overflow-hidden">
          {/* Decorative top bar */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-50"></div>

          <AnimatePresence mode="wait">
            {status === "idle" && (
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                onSubmit={handleScan}
                className="flex flex-col gap-6"
              >
                <div className="relative">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-black/40 dark:text-white/40" />
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g. Senior Product Manager"
                    className="w-full bg-black/5 dark:bg-white/5 border-2 border-black/10 dark:border-white/10 focus:border-accent dark:focus:border-accent text-black dark:text-white px-16 py-6 text-xl md:text-2xl font-display outline-none transition-colors placeholder:text-black/20 dark:placeholder:text-white/20"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-accent text-black px-8 py-6 text-xl font-bold uppercase tracking-wider hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-3"
                >
                  <Zap className="w-6 h-6" />
                  Run Simulation
                </button>
              </motion.form>
            )}

            {status === "scanning" && (
              <motion.div
                key="scanning"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-20 flex flex-col items-center justify-center gap-6"
              >
                <Loader2 className="w-16 h-16 text-accent animate-spin" />
                <div className="text-center">
                  <p className="font-display text-2xl font-bold uppercase tracking-wider mb-2">
                    Analyzing Job Description
                  </p>
                  <p className="font-mono text-sm text-black/40 dark:text-white/40 animate-pulse">
                    Extracting required skills for &quot;{jobTitle}&quot;...
                  </p>
                </div>
              </motion.div>
            )}

            {status === "complete" && (
              <motion.div
                key="complete"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="grid md:grid-cols-2 gap-12"
              >
                <div className="flex flex-col items-center justify-center p-8 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
                  <p className="font-mono text-sm text-black/40 dark:text-white/40 uppercase tracking-widest mb-6 text-center">
                    Simulated Match Score
                  </p>
                  <div className="w-40 h-40 rounded-full border-8 border-accent flex items-center justify-center mb-6 relative">
                    <div className="absolute inset-0 border-8 border-accent/20 rounded-full"></div>
                    <span className="font-display text-6xl font-black text-accent">
                      68
                    </span>
                  </div>
                  <p className="text-center text-black/60 dark:text-white/60 font-medium">
                    Your sample resume is missing key terms for{" "}
                    <strong className="text-black dark:text-white">
                      {jobTitle}
                    </strong>
                    .
                  </p>
                </div>

                <div className="flex flex-col gap-6">
                  <div>
                    <h4 className="font-display text-lg font-bold uppercase mb-4 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-red-500" />
                      Missing Keywords
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "Cross-functional",
                        "Agile",
                        "Stakeholder Management",
                        "Data-Driven",
                      ].map((kw) => (
                        <span
                          key={kw}
                          className="bg-red-500/10 border border-red-500/20 text-red-400 px-3 py-1 text-sm font-mono"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-display text-lg font-bold uppercase mb-4 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-accent" />
                      Found Keywords
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {["Project Management", "Communication", "Strategy"].map(
                        (kw) => (
                          <span
                            key={kw}
                            className="bg-accent/10 border border-accent/20 text-accent px-3 py-1 text-sm font-mono"
                          >
                            {kw}
                          </span>
                        ),
                      )}
                    </div>
                  </div>

                  <button
                    onClick={reset}
                    className="mt-auto bg-black/10 dark:bg-white/10 text-black dark:text-white px-6 py-4 font-bold uppercase tracking-wider hover:bg-black/20 dark:hover:bg-white/20 transition-colors text-sm"
                  >
                    Test Another Role
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
