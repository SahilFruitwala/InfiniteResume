"use client";

import React from "react";
import { motion } from "motion/react";
import { Database, Cpu, ShieldAlert } from "lucide-react";

const reasons = [
  {
    icon: <Database className="w-8 h-8" />,
    title: "Data-Driven Insights",
    description:
      "We don't rely on generic career advice. Our AI engine evaluates your resume against the specific job description to provide tailored, actionable feedback.",
  },
  {
    icon: <Cpu className="w-8 h-8" />,
    title: "Advanced AI Parsing",
    description:
      "Generic builders just format text. We use advanced LLMs to understand the context of your experience, ensuring your skills map perfectly to the role.",
  },
  {
    icon: <ShieldAlert className="w-8 h-8" />,
    title: "Zero-Trust Privacy",
    description:
      "Bring your own OpenAI API key. We encrypt and store it locally on your device using AES-GCM. Your data never touches our servers.",
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
