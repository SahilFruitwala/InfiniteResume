"use client";

import React from "react";
import { motion } from "motion/react";
import { Database, Cpu, ShieldAlert } from "lucide-react";

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

export function WhyInfiniteResume() {
  return (
    <section
      id="why-infiniteresume"
      className="py-32 bg-white dark:bg-background text-black dark:text-white border-y border-black/10 dark:border-white/10"
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 md:mb-24"
        >
          <h2 className="font-display text-4xl sm:text-5xl md:text-7xl font-black uppercase leading-[0.9] tracking-tighter mb-8">
            Why <span className="text-accent">InfiniteResume?</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            {reasons.map((reason, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col gap-6"
              >
                <div className="w-16 h-16 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center text-accent">
                  {reason.icon}
                </div>
                <h3 className="font-display text-2xl font-bold uppercase">
                  {reason.title}
                </h3>
                <p className="text-black/60 dark:text-white/60 font-medium leading-relaxed">
                  {reason.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
