'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ReactNode } from 'react';

interface RevealLinkProps {
  label: string;
  children: ReactNode;
}

export function RevealLink({ label, children }: RevealLinkProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="my-5">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 text-brand-orange font-bold text-sm hover:text-brand-orange/80 transition-colors group"
      >
        <motion.svg
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-4 h-4"
          animate={{ rotate: open ? 90 : 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
        >
          <path
            fillRule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </motion.svg>
        <span className="group-hover:underline underline-offset-2">{label}</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="overflow-hidden"
          >
            <div className="pt-3 pl-6 text-foreground/70 text-sm leading-relaxed border-l-2 border-brand-orange/20 ml-2">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
