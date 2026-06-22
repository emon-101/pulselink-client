"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@heroui/react";
import { Heart, HeartCrack, Home, Search } from "lucide-react";

/**
 * PulseLink 404 page (app/not-found.jsx)
 * Theme: a "broken connection" — the bridge/link metaphor failing to
 * complete, rather than a generic "404" graphic. Two nodes try to pulse
 * toward each other but the line snaps before it connects.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-[75vh] flex-col items-center justify-center overflow-hidden bg-[var(--pl-bg)] px-4 py-20 text-center">
      {/* ambient glow, consistent with Banner */}
      <div
        aria-hidden="true"
        className="absolute h-[420px] w-[420px] rounded-full bg-[var(--pl-primary)]/10 blur-3xl"
      />

      <div className="relative flex items-center gap-6 sm:gap-10">
        {/* left node */}
        <motion.div
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--pl-primary)] sm:h-20 sm:w-20"
        >
          <Heart className="h-7 w-7 text-white sm:h-9 sm:w-9" fill="currentColor" />
        </motion.div>

        {/* broken connecting line */}
        <svg
          viewBox="0 0 160 40"
          className="h-8 w-24 sm:h-10 sm:w-32"
          aria-hidden="true"
        >
          <motion.path
            d="M0 20 H60"
            stroke="var(--pl-border)"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          />
          <motion.path
            d="M100 20 H160"
            stroke="var(--pl-border)"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          />
          {/* the gap where it snaps */}
          <motion.g
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <path
              d="M64 12 L72 28 M76 12 L84 28 M88 12 L96 28"
              stroke="var(--pl-accent)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </motion.g>
        </svg>

        {/* right node */}
        <motion.div
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--pl-surface)] ring-1 ring-[var(--pl-border)] sm:h-20 sm:w-20"
        >
          <HeartCrack className="h-7 w-7 text-[var(--pl-ink-soft)] sm:h-9 sm:w-9" />
        </motion.div>
      </div>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="mt-10 font-[var(--pl-font-display)] text-3xl font-bold tracking-tight text-[var(--pl-ink)] sm:text-4xl"
      >
        This link didn&#39;t connect
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="mt-3 max-w-md text-base leading-relaxed text-[var(--pl-ink-soft)]"
      >
        The page you&#39;re looking for moved, was removed, or never existed.
        Let&#39;s get you back on the pulse.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="mt-8 flex flex-col gap-3 sm:flex-row"
      >
        <Link href="/">
          <Button variant="primary" size="lg" className="min-w-[180px] gap-2">
            <Home className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
        <Link href="/search">
          <Button variant="outline" size="lg" className="min-w-[180px] gap-2">
            <Search className="h-4 w-4" />
            Search Donors
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}