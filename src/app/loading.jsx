"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 bg-[var(--pl-bg)] px-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--pl-primary)]"
      >
        <motion.div
          animate={{ scale: [1, 1.18, 1] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
        >
          <Heart className="h-7 w-7 text-white" fill="currentColor" strokeWidth={2} />
        </motion.div>

        {/* expanding ring, like a heartbeat pulse radiating outward */}
        <motion.span
          className="absolute inset-0 rounded-2xl border-2 border-[var(--pl-primary)]"
          animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: "easeOut" }}
        />
      </motion.div>

      {/* animated ECG pulse line */}
      <svg viewBox="0 0 400 60" className="h-12 w-full max-w-xs" aria-hidden="true">
        <motion.path
          d="M0 30 H120 L140 10 L160 50 L180 20 L195 30 H400"
          fill="none"
          stroke="var(--pl-accent)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          initial={{ pathLength: 0, opacity: 0.3 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            duration: 1.3,
            repeat: Infinity,
            ease: "easeInOut",
            repeatType: "loop",
          }}
        />
      </svg>

      <motion.p
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="text-sm font-medium text-[var(--pl-ink-soft)]"
      >
        Finding the pulse...
      </motion.p>
    </div>
  );
}