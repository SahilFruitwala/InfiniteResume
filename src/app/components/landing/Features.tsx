"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Target, FileSearch, Layers, Zap } from "lucide-react";

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

export function Features() {
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
      className="py-24 bg-white dark:bg-background text-black dark:text-white border-y border-black/10 dark:border-white/10 relative overflow-hidden"
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
