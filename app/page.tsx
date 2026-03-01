"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { useTheme } from "next-themes";
import {
  FileText,
  Menu,
  X,
  ArrowRight,
  CheckCircle2,
  FileCheck2,
  Zap,
  Search,
  Loader2,
  AlertCircle,
  Target,
  FileSearch,
  Layers,
  Database,
  Cpu,
  ShieldAlert,
  Check,
  Sun,
  Moon,
} from "lucide-react";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-md border border-black/10 dark:border-white/10 bg-transparent text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
      aria-label="Toggle theme"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </button>
  );
}

function BackgroundGrid() {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden bg-white dark:bg-[#050505]">
      <motion.div
        animate={{
          backgroundPosition: ["0px 0px", "64px 64px"],
        }}
        transition={{
          repeat: Infinity,
          duration: 4,
          ease: "linear",
        }}
        className="absolute inset-0 bg-[linear-gradient(to_right,#00000006_1px,transparent_1px),linear-gradient(to_bottom,#00000006_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] will-change-[background-position]"
      />
    </div>
  );
}

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const menuVars = {
    initial: { scaleY: 0 },
    animate: {
      scaleY: 1,
      transition: { duration: 0.5, ease: [0.12, 0, 0.39, 0] as const },
    },
    exit: {
      scaleY: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1] as const,
        delay: 0.3,
      },
    },
  };

  const containerVars = {
    initial: { transition: { staggerChildren: 0.09, staggerDirection: -1 } },
    open: {
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.09,
        staggerDirection: 1,
      },
    },
  };

  const linkVars = {
    initial: {
      y: "30vh",
      opacity: 0,
      transition: { duration: 0.5, ease: [0.37, 0, 0.63, 1] as const },
    },
    open: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.7, ease: [0, 0.55, 0.45, 1] as const },
    },
  };

  const handleScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      setIsOpen(false);

      setTimeout(() => {
        const targetId = href.replace("#", "");
        const elem = document.getElementById(targetId);
        if (elem) {
          elem.scrollIntoView({ behavior: "smooth" });
          window.history.pushState(null, "", href);
        }
      }, 100);
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 w-full z-50 border-b border-black/10 dark:border-white/10 bg-white/80 dark:bg-[#050505]/80 backdrop-blur-md"
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 group z-50 relative"
          >
            <div className="w-10 h-10 bg-accent rounded-sm flex items-center justify-center text-black group-hover:rotate-12 transition-transform">
              <FileText className="w-6 h-6" strokeWidth={2.5} />
            </div>
            <span className="font-display font-bold text-2xl tracking-tight">
              InfiniteResume
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide uppercase">
            <Link
              href="#features"
              onClick={(e) => handleScroll(e, "#features")}
              className="hover:text-accent transition-colors"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              onClick={(e) => handleScroll(e, "#how-it-works")}
              className="hover:text-accent transition-colors"
            >
              How it Works
            </Link>
            <Link
              href="#pricing"
              onClick={(e) => handleScroll(e, "#pricing")}
              className="hover:text-accent transition-colors"
            >
              Pricing
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <Link
              href="/builder"
              className="text-sm font-medium hover:text-accent transition-colors uppercase tracking-wide"
            >
              Log In
            </Link>
            <Link
              href="/builder"
              className="bg-accent text-black px-6 py-3 rounded-none font-bold text-sm uppercase tracking-wider hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black hover:scale-105 active:scale-95 transition-all duration-200"
            >
              Start Free
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-4 z-50 relative">
            <ThemeToggle />
            <button
              className="p-2 text-black dark:text-white hover:text-accent dark:hover:text-accent transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={menuVars}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed inset-0 z-40 bg-white dark:bg-[#050505] pt-28 px-6 flex flex-col md:hidden origin-top"
          >
            <motion.div
              variants={containerVars}
              initial="initial"
              animate="open"
              exit="initial"
              className="flex flex-col gap-8 text-3xl font-display font-black uppercase tracking-tighter text-black dark:text-white"
            >
              <div className="overflow-hidden">
                <motion.div variants={linkVars}>
                  <Link
                    href="#features"
                    onClick={(e) => handleScroll(e, "#features")}
                    className="hover:text-accent transition-colors block"
                  >
                    Features
                  </Link>
                </motion.div>
              </div>
              <div className="overflow-hidden">
                <motion.div variants={linkVars}>
                  <Link
                    href="#why-matchpoint"
                    onClick={(e) => handleScroll(e, "#why-matchpoint")}
                    className="hover:text-accent transition-colors block"
                  >
                    Why InfiniteResume
                  </Link>
                </motion.div>
              </div>
              <div className="overflow-hidden">
                <motion.div variants={linkVars}>
                  <Link
                    href="#how-it-works"
                    onClick={(e) => handleScroll(e, "#how-it-works")}
                    className="hover:text-accent transition-colors block"
                  >
                    How it Works
                  </Link>
                </motion.div>
              </div>
              <div className="overflow-hidden">
                <motion.div variants={linkVars}>
                  <Link
                    href="#pricing"
                    onClick={(e) => handleScroll(e, "#pricing")}
                    className="hover:text-accent transition-colors block"
                  >
                    Pricing
                  </Link>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mt-auto mb-12 flex flex-col gap-4"
            >
              <Link
                href="/builder"
                onClick={() => setIsOpen(false)}
                className="w-full border border-black/20 dark:border-white/20 text-center py-4 font-bold uppercase tracking-wider hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-black dark:text-white"
              >
                Log In
              </Link>
              <Link
                href="/builder"
                onClick={() => setIsOpen(false)}
                className="w-full bg-accent text-black text-center py-4 font-bold uppercase tracking-wider hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
              >
                Start Free
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const mockupY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <section
      ref={ref}
      className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden"
    >
      {/* Subtle Animated Background Waves */}
      <motion.div
        style={{ y: bgY }}
        className="absolute top-0 left-0 w-full h-full overflow-hidden z-[-1] pointer-events-none opacity-20"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
          className="absolute -top-[50%] -left-[10%] w-[120%] aspect-square bg-gradient-to-b from-accent/10 to-transparent rounded-[45%] will-change-transform"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 50, ease: "linear" }}
          className="absolute -top-[60%] -right-[10%] w-[120%] aspect-square bg-gradient-to-b from-accent/10 to-transparent rounded-[40%] will-change-transform"
        />
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          style={{ y: textY }}
          className="flex flex-col gap-8"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 px-4 py-2 rounded-full w-fit"
          >
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
            <span className="text-sm font-mono tracking-wider text-black/80 dark:text-white/80 uppercase">
              ATS Analysis Engine v2.0
            </span>
          </motion.div>

          <h1 className="font-display text-5xl sm:text-6xl md:text-8xl font-black leading-[0.85] tracking-tighter uppercase flex flex-col gap-1">
            <div className="overflow-hidden pb-1">
              <motion.div variants={itemVariants}>Beat the</motion.div>
            </div>
            <div className="overflow-hidden pb-1">
              <motion.div variants={itemVariants} className="text-accent">
                Machine.
              </motion.div>
            </div>
            <div className="overflow-hidden pb-1">
              <motion.div variants={itemVariants}>Get the</motion.div>
            </div>
            <div className="overflow-hidden pb-1">
              <motion.div variants={itemVariants}>Interview.</motion.div>
            </div>
          </h1>

          <motion.p
            variants={itemVariants}
            className="text-xl text-black/60 dark:text-white/60 max-w-lg font-light leading-relaxed"
          >
            Stop guessing what recruiters want. Our AI-powered resume builder
            analyzes your CV against real ATS algorithms to guarantee you pass
            the screen.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto"
          >
            <Link
              href="/builder"
              className="group flex items-center justify-center gap-3 bg-accent text-black px-8 py-5 text-lg font-bold uppercase tracking-wider hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black hover:scale-105 active:scale-95 transition-all duration-200 w-full sm:w-auto"
            >
              Analyze My Resume
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#demo"
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById("demo")
                  ?.scrollIntoView({ behavior: "smooth" });
                window.history.pushState(null, "", "#demo");
              }}
              className="flex items-center justify-center gap-3 bg-transparent border border-black/20 dark:border-white/20 text-black dark:text-white px-8 py-5 text-lg font-bold uppercase tracking-wider hover:bg-black/5 dark:hover:bg-white/5 hover:border-black dark:hover:border-white hover:scale-105 active:scale-95 transition-all duration-200 w-full sm:w-auto"
            >
              View Demo
            </Link>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex items-center gap-6 mt-6 text-sm font-mono text-black/40 dark:text-white/40"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-accent" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-accent" />
              <span>Instant ATS Score</span>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ y: mockupY }}
          className="relative lg:h-[600px] flex items-center justify-center"
        >
          {/* Decorative elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-accent/5 blur-[120px] rounded-full -z-10"></div>

          {/* Main App Mockup */}
          <div className="relative w-full max-w-lg aspect-[3/4] bg-white dark:bg-[#111] border border-black/10 dark:border-white/10 shadow-2xl overflow-hidden group">
            <div className="absolute top-0 w-full h-12 bg-gray-100 dark:bg-[#1a1a1a] border-b border-black/10 dark:border-white/10 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
              <div className="ml-4 text-xs font-mono text-black/30 dark:text-white/30">
                matchpoint-analysis.exe
              </div>
            </div>

            <div className="p-8 pt-20 h-full flex flex-col gap-6">
              <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-6">
                <div>
                  <h3 className="font-display text-2xl font-bold text-black dark:text-white">
                    Senior Frontend Engineer
                  </h3>
                  <p className="text-black/40 dark:text-white/40 font-mono text-sm mt-1">
                    Target Role Match
                  </p>
                </div>
                <div className="w-20 h-20 rounded-full border-4 border-accent flex items-center justify-center">
                  <span className="font-display text-3xl font-black text-accent">
                    94
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
                  <div className="flex items-center gap-3">
                    <FileCheck2 className="text-accent w-5 h-5" />
                    <span className="font-mono text-sm text-black dark:text-white">
                      Keyword Optimization
                    </span>
                  </div>
                  <span className="text-accent font-bold">PASS</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
                  <div className="flex items-center gap-3">
                    <Zap className="text-accent w-5 h-5" />
                    <span className="font-mono text-sm text-black dark:text-white">
                      Action Verbs
                    </span>
                  </div>
                  <span className="text-accent font-bold">PASS</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-red-500/10 border border-red-500/20">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 text-xs font-bold">
                      !
                    </div>
                    <span className="font-mono text-sm text-red-600 dark:text-red-400">
                      Formatting Issues
                    </span>
                  </div>
                  <span className="text-red-500 font-bold">FAIL</span>
                </div>
              </div>

              <div className="mt-auto">
                <div className="h-2 w-full bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-accent w-[94%] relative">
                    <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
                  </div>
                </div>
                <p className="text-center font-mono text-xs text-black/40 dark:text-white/40 mt-3 uppercase tracking-widest">
                  Scanning complete
                </p>
              </div>
            </div>
          </div>

          {/* Floating badge */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute -right-8 top-32 bg-accent text-black p-4 shadow-2xl border border-black/10"
          >
            <p className="font-display font-black text-xl uppercase leading-none">
              Hired
            </p>
            <p className="font-mono text-xs font-bold mt-1 opacity-80">
              in 14 days
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function Demo() {
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
      className="py-32 bg-white/40 dark:bg-black/40 backdrop-blur-md text-black dark:text-[#f5f5f4] border-t border-black/10 dark:border-white/10 relative overflow-hidden"
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

        <div className="bg-gray-50 dark:bg-[#0a0a0a] border border-black/10 dark:border-white/10 p-6 md:p-10 shadow-2xl relative overflow-hidden">
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

const features = [
  {
    id: "01",
    title: "ATS Scoring Engine",
    description:
      "Upload your resume and a job description. Our AI instantly scores your match percentage based on the exact algorithms used by Workday, Greenhouse, and Lever.",
    icon: <Target className="w-8 h-8" />,
  },
  {
    id: "02",
    title: "Keyword Optimization",
    description:
      "Stop guessing which words matter. We extract the hard skills, soft skills, and action verbs the ATS is looking for and tell you exactly where to put them.",
    icon: <FileSearch className="w-8 h-8" />,
  },
  {
    id: "03",
    title: "Format Validation",
    description:
      "Complex layouts confuse robots. We scan your PDF or Docx for parsing errors, ensuring every word is readable by the machines that screen you.",
    icon: <Layers className="w-8 h-8" />,
  },
  {
    id: "04",
    title: "Smart Builder",
    description:
      "Start from scratch with our ATS-native templates. Built to be 100% machine-readable while remaining visually striking for human recruiters.",
    icon: <Zap className="w-8 h-8" />,
  },
];

function Features() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const badgeY = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section
      ref={ref}
      id="features"
      className="py-24 bg-white dark:bg-[#050505] text-black dark:text-white border-y border-black/10 dark:border-white/10 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl"
          >
            <h2 className="font-display text-4xl sm:text-5xl md:text-7xl font-black uppercase leading-[0.9] tracking-tighter">
              The System is <br />
              <span className="text-black/30 dark:text-white/30">Rigged.</span>
            </h2>
            <p className="text-xl mt-6 font-medium text-black/60 dark:text-white/60 max-w-lg">
              75% of resumes are rejected by an ATS before a human ever sees
              them. Here is how we get you past the bots.
            </p>
          </motion.div>
          <motion.div style={{ y: badgeY }} className="hidden md:block">
            <div className="w-24 h-24 border-4 border-black dark:border-white rounded-full flex items-center justify-center">
              <span className="font-display font-black text-3xl">4x</span>
            </div>
            <p className="font-mono text-xs font-bold uppercase mt-3 text-center tracking-widest text-black/60 dark:text-white/60">
              More Interviews
            </p>
          </motion.div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-0 border-t border-l border-black/10 dark:border-white/10">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group p-8 border-r border-b border-black/10 dark:border-white/10 hover:bg-accent dark:hover:bg-accent transition-colors duration-300 flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-12">
                <div className="text-black/40 dark:text-white/40 group-hover:text-black dark:group-hover:text-black transition-all duration-300 group-hover:scale-125 group-hover:-rotate-6 origin-bottom-left">
                  {feature.icon}
                </div>
                <span className="font-display text-4xl font-black text-black/20 dark:text-white/20 group-hover:text-black/40 dark:group-hover:text-black/40 transition-colors">
                  {feature.id}
                </span>
              </div>

              <h3 className="font-display text-2xl font-bold uppercase mb-4 leading-tight group-hover:text-black dark:group-hover:text-black">
                {feature.title}
              </h3>

              <p className="text-black/70 dark:text-white/70 font-medium group-hover:text-black/90 dark:group-hover:text-black/90 transition-colors mt-auto">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const reasons = [
  {
    icon: <Database className="w-8 h-8" />,
    title: "Data-Driven, Not Guesswork",
    description:
      "We don't rely on generic career advice. Our engine is trained on millions of data points from successful hires at FAANG and Fortune 500 companies.",
  },
  {
    icon: <Cpu className="w-8 h-8" />,
    title: "Advanced NLP Parsing",
    description:
      "Generic builders just format text. We use advanced Natural Language Processing to understand context, ensuring your skills map perfectly to the job description.",
  },
  {
    icon: <ShieldAlert className="w-8 h-8" />,
    title: "Beat the Rejection Filter",
    description:
      "Most resumes die in the 'auto-reject' pile because of poor formatting or missing exact-match keywords. We simulate the exact filters used by Workday and Greenhouse.",
  },
];

function WhyInfiniteResume() {
  return (
    <section
      id="why-matchpoint"
      className="py-32 bg-white dark:bg-[#050505] text-black dark:text-white border-y border-black/10 dark:border-white/10"
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 md:mb-24"
        >
          <h2 className="font-display text-5xl md:text-7xl font-black uppercase leading-[0.9] tracking-tighter mb-6 text-black dark:text-white">
            Why <br /> InfiniteResume?
          </h2>
          <p className="text-xl font-medium max-w-2xl opacity-80 text-black/80 dark:text-white/80">
            We aren&apos;t just another pretty resume template. We are a
            reverse-engineered ATS bypass system designed to get your foot in
            the door.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-12">
          {reasons.map((reason, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: i * 0.15,
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="flex flex-col gap-4 group"
            >
              <div className="w-16 h-16 bg-black dark:bg-white text-accent flex items-center justify-center rounded-sm mb-4 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300 origin-bottom-left">
                {reason.icon}
              </div>
              <h3 className="font-display text-2xl font-bold uppercase text-black dark:text-white">
                {reason.title}
              </h3>
              <p className="font-medium opacity-80 leading-relaxed text-black/80 dark:text-white/80">
                {reason.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const steps = [
  {
    number: "01",
    title: "Upload & Target",
    description:
      "Drop in your current resume and the exact job description you want to apply for. We instantly parse both.",
  },
  {
    number: "02",
    title: "Analyze & Score",
    description:
      "Our engine runs your resume against the same algorithms used by Fortune 500 ATS systems, giving you a match score.",
  },
  {
    number: "03",
    title: "Optimize & Export",
    description:
      "Follow our line-by-line recommendations to inject missing keywords, fix formatting, and download a machine-readable PDF.",
  },
];

function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-32 bg-transparent text-black dark:text-[#f5f5f4] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 px-4 py-2 rounded-full w-fit mb-8">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
              <span className="text-sm font-mono tracking-wider text-accent uppercase">
                The Process
              </span>
            </div>

            <h2 className="font-display text-4xl sm:text-5xl md:text-7xl font-black uppercase leading-[0.9] tracking-tighter mb-8">
              Don&apos;t leave <br />
              it to <span className="text-accent">chance.</span>
            </h2>

            <p className="text-xl text-black/60 dark:text-white/60 font-light max-w-md mb-12">
              We reverse-engineered the most popular Applicant Tracking Systems
              so you don&apos;t have to guess what works.
            </p>

            <Link
              href="/builder"
              className="group inline-flex items-center justify-center gap-3 bg-transparent border border-accent text-accent px-8 py-4 text-lg font-bold uppercase tracking-wider hover:bg-accent hover:text-black hover:scale-105 active:scale-95 transition-all duration-200 w-full sm:w-auto"
            >
              Start Building Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          <div className="space-y-8 relative">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-black/10 dark:bg-white/10 hidden md:block"></div>

            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative pl-0 md:pl-20"
              >
                <div className="hidden md:flex absolute left-0 top-0 w-16 h-16 bg-white dark:bg-[#0a0a0a] border border-black/10 dark:border-white/10 rounded-full items-center justify-center z-10">
                  <span className="font-display font-black text-xl text-accent">
                    {step.number}
                  </span>
                </div>

                <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 p-8 hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
                  <div className="md:hidden font-display font-black text-4xl text-accent mb-4">
                    {step.number}
                  </div>
                  <h3 className="font-display text-3xl font-bold uppercase mb-4">
                    {step.title}
                  </h3>
                  <p className="text-black/60 dark:text-white/60 font-light text-lg leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Basic ATS analysis for one resume.",
    features: [
      "1 Resume Scan per month",
      "Basic Keyword Matching",
      "Format Validation",
      "Standard Templates",
    ],
    cta: "Start Free",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/mo",
    description: "Unlimited scans and advanced optimization.",
    features: [
      "Unlimited Resume Scans",
      "Advanced Keyword Extraction",
      "Line-by-line Recommendations",
      "Premium ATS-Native Templates",
      "Cover Letter Generator",
    ],
    cta: "Get Pro",
    highlight: true,
  },
];

function Pricing() {
  return (
    <section
      id="pricing"
      className="py-32 bg-white/40 dark:bg-black/40 backdrop-blur-md text-black dark:text-[#f5f5f4] border-t border-black/10 dark:border-white/10"
    >
      <div className="max-w-7xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="font-display text-4xl sm:text-5xl md:text-7xl font-black uppercase leading-[0.9] tracking-tighter mb-6">
            Invest in your <br />
            <span className="text-accent">Career.</span>
          </h2>
          <p className="text-xl text-black/60 dark:text-white/60 font-light max-w-2xl mx-auto mb-20">
            Stop sending your resume into the void. Get the tools you need to
            beat the bots and land the interview.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className={`relative p-10 border ${plan.highlight ? "border-accent bg-accent/5" : "border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5"} flex flex-col h-full`}
            >
              {plan.highlight && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-accent text-black px-4 py-1 text-xs font-bold uppercase tracking-widest">
                  Most Popular
                </div>
              )}

              <h3 className="font-display text-3xl font-bold uppercase mb-2">
                {plan.name}
              </h3>
              <p className="text-black/60 dark:text-white/60 font-light mb-8">
                {plan.description}
              </p>

              <div className="mb-8">
                <span className="font-display text-6xl font-black">
                  {plan.price}
                </span>
                {plan.period && (
                  <span className="text-black/40 dark:text-white/40 font-mono text-lg">
                    {plan.period}
                  </span>
                )}
              </div>

              <ul className="space-y-4 mb-10 text-left flex-grow">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Check
                      className={`w-5 h-5 ${plan.highlight ? "text-accent" : "text-black/40 dark:text-white/40"}`}
                    />
                    <span className="font-medium text-black/80 dark:text-white/80">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href="/builder"
                className={`block w-full py-4 font-bold uppercase tracking-wider transition-all duration-200 hover:scale-105 active:scale-95 ${plan.highlight ? "bg-accent text-black hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black" : "bg-black/10 dark:bg-white/10 text-black dark:text-white hover:bg-black/20 dark:hover:bg-white/20"}`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
      setEmail("");
    }, 1500);
  };

  return (
    <section className="py-32 bg-accent text-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="font-display text-5xl sm:text-6xl md:text-9xl font-black uppercase leading-[0.8] tracking-tighter mb-8">
            Stop <br />
            Waiting. <br />
            Start <br />
            Working.
          </h2>

          <p className="text-xl md:text-2xl font-medium max-w-2xl mx-auto mb-12 opacity-80">
            Join 10,000+ job seekers who beat the ATS and landed their dream
            roles at top tech companies.
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto justify-center"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={status === "loading" || status === "success"}
              className="flex-1 bg-white/20 border-2 border-black text-black placeholder:text-black/60 px-6 py-5 text-lg font-display outline-none focus:bg-white/40 transition-colors disabled:opacity-50"
              required
            />
            <button
              type="submit"
              disabled={status === "loading" || status === "success"}
              className="group flex items-center justify-center gap-3 bg-black text-white px-8 py-5 text-lg font-bold uppercase tracking-wider hover:bg-white hover:text-black hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:bg-black disabled:hover:text-white border-2 border-black"
            >
              {status === "loading" ? (
                "Joining..."
              ) : status === "success" ? (
                <>
                  Joined <CheckCircle2 className="w-5 h-5" />
                </>
              ) : (
                <>
                  Join Waitlist
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
          {status === "success" && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-sm font-bold uppercase tracking-widest text-black"
            >
              You're on the list! We'll be in touch soon.
            </motion.p>
          )}
        </motion.div>
      </div>

      {/* Decorative Marquee */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden whitespace-nowrap py-4 border-t-4 border-black bg-accent">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="inline-block font-mono text-sm font-bold uppercase tracking-widest will-change-transform"
        >
          <span className="mx-4">ATS OPTIMIZED</span> •
          <span className="mx-4">KEYWORD MATCHING</span> •
          <span className="mx-4">FORMAT VALIDATION</span> •
          <span className="mx-4">INSTANT SCORING</span> •
          <span className="mx-4">ATS OPTIMIZED</span> •
          <span className="mx-4">KEYWORD MATCHING</span> •
          <span className="mx-4">FORMAT VALIDATION</span> •
          <span className="mx-4">INSTANT SCORING</span> •
          <span className="mx-4">ATS OPTIMIZED</span> •
          <span className="mx-4">KEYWORD MATCHING</span> •
          <span className="mx-4">FORMAT VALIDATION</span> •
          <span className="mx-4">INSTANT SCORING</span> •
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  const handleScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const targetId = href.replace("#", "");
      const elem = document.getElementById(targetId);
      if (elem) {
        elem.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", href);
      }
    }
  };

  return (
    <footer className="bg-transparent text-black/60 dark:text-white/60 py-20 border-t border-black/10 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
        <div className="col-span-2">
          <Link href="/" className="flex items-center gap-2 mb-6 group">
            <div className="w-8 h-8 bg-accent rounded-sm flex items-center justify-center text-black group-hover:rotate-12 transition-transform">
              <FileText className="w-5 h-5" strokeWidth={2.5} />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-black dark:text-white">
              InfiniteResume
            </span>
          </Link>
          <p className="max-w-xs font-light text-sm leading-relaxed">
            The ATS analysis engine built to get you past the bots and in front
            of human recruiters.
          </p>
        </div>

        <div>
          <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-black dark:text-white mb-6">
            Product
          </h4>
          <ul className="space-y-4 text-sm font-medium">
            <li>
              <Link
                href="#features"
                onClick={(e) => handleScroll(e, "#features")}
                className="hover:text-accent transition-colors"
              >
                Features
              </Link>
            </li>
            <li>
              <Link
                href="#how-it-works"
                onClick={(e) => handleScroll(e, "#how-it-works")}
                className="hover:text-accent transition-colors"
              >
                How it Works
              </Link>
            </li>
            <li>
              <Link
                href="#pricing"
                onClick={(e) => handleScroll(e, "#pricing")}
                className="hover:text-accent transition-colors"
              >
                Pricing
              </Link>
            </li>
            <li>
              <Link
                href="/templates"
                className="hover:text-accent transition-colors"
              >
                ATS Templates
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-black dark:text-white mb-6">
            Company
          </h4>
          <ul className="space-y-4 text-sm font-medium">
            <li>
              <Link
                href="/about"
                className="hover:text-accent transition-colors"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/blog"
                className="hover:text-accent transition-colors"
              >
                Blog
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="hover:text-accent transition-colors"
              >
                Contact
              </Link>
            </li>
            <li>
              <Link
                href="/privacy"
                className="hover:text-accent transition-colors"
              >
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-black/10 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs font-mono uppercase tracking-widest">
          © {new Date().getFullYear()} InfiniteResume Inc. All rights reserved.
        </p>
        <div className="flex gap-4 text-xs font-mono uppercase tracking-widest">
          <Link href="/terms" className="hover:text-accent transition-colors">
            Terms
          </Link>
          <Link href="/privacy" className="hover:text-accent transition-colors">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-transparent text-black dark:text-[#f5f5f4] selection:bg-accent selection:text-black">
      <BackgroundGrid />
      <Navbar />
      <Hero />
      <Demo />
      <Features />
      <WhyInfiniteResume />
      <HowItWorks />
      <Pricing />
      <CTA />
      <Footer />
    </main>
  );
}
