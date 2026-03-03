"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export function CTA() {
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
