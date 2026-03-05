"use client";

import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

interface SaveDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string) => void;
  defaultTitle: string;
}

export function SaveDialog({
  isOpen,
  onClose,
  onSave,
  defaultTitle,
}: SaveDialogProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Focus the input after animation
      setTimeout(() => inputRef.current?.select(), 100);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rawTitle = inputRef.current?.value ?? "";
    const finalTitle = rawTitle.trim() || defaultTitle;
    onSave(finalTitle);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md"
          >
            <div className="bg-white dark:bg-[#1a1a1a] border-2 border-black/10 dark:border-white/10 shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-black/10 dark:border-white/10">
                <h2 className="font-display text-lg font-bold uppercase tracking-wider text-black dark:text-white">
                  Save Resume
                </h2>
                <button
                  onClick={onClose}
                  className="p-1 text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-black/50 dark:text-white/50 mb-2">
                    Resume Name
                  </label>
                  <input
                    key={defaultTitle}
                    ref={inputRef}
                    type="text"
                    defaultValue={defaultTitle}
                    placeholder={defaultTitle}
                    className="w-full px-4 py-3 bg-black/5 dark:bg-white/5 border-2 border-black/10 dark:border-white/10 focus:border-accent dark:focus:border-accent text-black dark:text-white font-medium outline-none transition-colors placeholder:text-black/30 dark:placeholder:text-white/30"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-3 border-2 border-black/10 dark:border-white/10 text-black dark:text-white font-bold text-sm uppercase tracking-wider hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-accent text-black font-bold text-sm uppercase tracking-wider hover:bg-accent/90 transition-colors"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
