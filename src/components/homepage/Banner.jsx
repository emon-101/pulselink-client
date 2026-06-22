"use client";

import Link from "next/link";
import { Button } from "@heroui/react";
import { ArrowRight, Search } from "lucide-react";

/**
 * PulseLink Banner / Hero
 * Signature element: an animated ECG-style pulse line running through the
 * headline — the "heartbeat" motif instead of the generic blood-drop cliché.
 */
export default function Banner() {
  return (
    <section className="relative overflow-hidden bg-[var(--pl-ink)]">
      {/* ambient glow */}
      <div
        aria-hidden="true"
        className="absolute -top-40 left-1/2 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-[var(--pl-primary)]/25 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/70">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--pl-accent)] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--pl-accent)]" />
            </span>
            Someone nearby needs your pulse, right now
          </span>

          <h1 className="max-w-3xl font-[var(--pl-font-display)] text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-6xl">
            Feel the pulse.
            <br />
            <span className="text-[var(--pl-accent-light)]">Save a life.</span>
          </h1>

          {/* Signature pulse-line divider */}
          <div className="mt-8 w-full max-w-md">
            <PulseLine />
          </div>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg">
            PulseLink links willing donors to the people who need them most —
            one beat, one bridge, one life at a time.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href="/auth/register">
              <Button variant="primary" size="lg" className="min-w-[200px] gap-2">
                Join as a Donor
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/search">
              <Button
                variant="outline"
                size="lg"
                className="min-w-[200px] gap-2 border-white/20 text-white hover:bg-white/10"
              >
                <Search className="h-4 w-4" />
                Search Donors
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Animated heartbeat / pulse SVG line — the page's signature motif */
function PulseLine() {
  return (
    <svg
      viewBox="0 0 400 60"
      className="h-12 w-full"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M0 30 H120 L140 10 L160 50 L180 20 L195 30 H400"
        fill="none"
        stroke="var(--pl-accent)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength="1"
        className="pulse-draw"
      />
      <style>{`
        .pulse-draw {
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
          animation: pulse-draw 2.4s ease-in-out infinite;
        }
        @keyframes pulse-draw {
          0% { stroke-dashoffset: 1; opacity: 0.3; }
          50% { stroke-dashoffset: 0; opacity: 1; }
          100% { stroke-dashoffset: -1; opacity: 0.3; }
        }
        @media (prefers-reduced-motion: reduce) {
          .pulse-draw { animation: none; stroke-dashoffset: 0; opacity: 1; }
        }
      `}</style>
    </svg>
  );
}