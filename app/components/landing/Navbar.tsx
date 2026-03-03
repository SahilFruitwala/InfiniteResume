"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { FileText, Menu, X } from "lucide-react";
import { ThemeToggle } from "../ThemeToggle";

export function Navbar() {
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
        className="fixed top-0 w-full z-50 border-b border-black/10 dark:border-white/10 bg-white/80 dark:bg-background/80 backdrop-blur-md"
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 group z-50 relative"
          >
            <div className="w-10 h-10 bg-accent rounded-sm flex items-center justify-center text-black transition-transform">
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
              href="/dashboard"
              className="text-sm font-medium hover:text-accent transition-colors uppercase tracking-wide"
            >
              Log In
            </Link>
            <Link
              href="/dashboard"
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
            className="fixed inset-0 z-40 bg-white dark:bg-background pt-28 px-6 flex flex-col md:hidden origin-top"
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
                    href="#why-infiniteresume"
                    onClick={(e) => handleScroll(e, "#why-infiniteresume")}
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
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="w-full border border-black/20 dark:border-white/20 text-center py-4 font-bold uppercase tracking-wider hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-black dark:text-white"
              >
                Log In
              </Link>
              <Link
                href="/dashboard"
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
