"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, CheckCircle2, FileCheck2, Zap } from "lucide-react";
import { smoothScrollToId } from "./smooth-scroll";

export function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const mockupY = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
              href="/dashboard"
              prefetch={false}
              className="group flex items-center justify-center gap-3 bg-accent text-black px-8 py-5 text-lg font-bold uppercase tracking-wider hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black hover:scale-105 active:scale-95 transition-all duration-200 w-full sm:w-auto"
            >
              Analyze My Resume
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#demo"
              onClick={(e) => {
                e.preventDefault();
                smoothScrollToId("demo");
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
          <div className="relative w-full max-w-lg aspect-[3/4] bg-white dark:bg-card border border-black/10 dark:border-white/10 shadow-2xl overflow-hidden group">
            <div className="absolute top-0 w-full h-12 bg-gray-100 dark:bg-card border-b border-black/10 dark:border-white/10 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
              <div className="ml-4 text-xs font-mono text-black/30 dark:text-white/30">
                infiniteresume-analysis.exe
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
