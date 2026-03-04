"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

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

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-32 bg-transparent text-black dark:text-foreground relative overflow-hidden"
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
              prefetch={false}
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
                <div className="hidden md:flex absolute left-0 top-0 w-16 h-16 bg-white dark:bg-card border border-black/10 dark:border-white/10 rounded-full items-center justify-center z-10">
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
