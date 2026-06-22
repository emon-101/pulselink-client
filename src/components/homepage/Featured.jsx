"use client";

import { Heart, MapPinned, ShieldCheck, Users } from "lucide-react";

/**
 * PulseLink Featured Section
 * Not a generic "our features" grid — framed as the three real moments
 * in a donation's journey (request → match → done), since that sequence
 * is genuinely how this product works, not a decorative numbering scheme.
 */
const journey = [
  {
    icon: Heart,
    label: "Request",
    title: "Ask, and the network hears it",
    description:
      "Post what you need — blood group, hospital, date — and it instantly surfaces to nearby donors who can actually help.",
  },
  {
    icon: Users,
    label: "Match",
    title: "A real donor steps forward",
    description:
      "Donors in your district and upazila respond directly. You see exactly who's coming, with their contact details.",
  },
  {
    icon: ShieldCheck,
    label: "Done",
    title: "The loop closes, life continues",
    description:
      "Once the donation happens, the request is marked done — closing the bridge between the two of you for good.",
  },
];

const stats = [
  { icon: Users, value: "Donor network", label: "growing every district" },
  { icon: MapPinned, value: "64 districts", label: "covered across Bangladesh" },
  { icon: Heart, value: "Every blood group", label: "A+ to O-, all welcome" },
];

export default function Featured() {
  return (
    <section className="bg-[var(--pl-bg)] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wide text-[var(--pl-primary)]">
            How it bridges
          </span>
          <h2 className="mt-3 font-[var(--pl-font-display)] text-3xl font-bold tracking-tight text-[var(--pl-ink)] sm:text-4xl">
            Three beats, one connection
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[var(--pl-ink-soft)]">
            Every donation on PulseLink follows the same honest path — from a
            real need, to a real person, to a life that continues.
          </p>
        </div>

        {/* Journey cards connected by a pulse line */}
        <div className="relative mt-16">
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-10 hidden h-px bg-[var(--pl-border)] md:block"
          />
          <div className="grid gap-8 md:grid-cols-3">
            {journey.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.label} className="relative flex flex-col items-center text-center">
                  <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full border-4 border-[var(--pl-bg)] bg-[var(--pl-surface)] shadow-sm">
                    <Icon className="h-7 w-7 text-[var(--pl-primary)]" strokeWidth={2} />
                  </div>
                  <span className="mt-5 text-xs font-semibold uppercase tracking-wider text-[var(--pl-accent)]">
                    {step.label}
                  </span>
                  <h3 className="mt-2 font-[var(--pl-font-display)] text-xl font-semibold text-[var(--pl-ink)]">
                    {step.title}
                  </h3>
                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-[var(--pl-ink-soft)]">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stat strip */}
        <div className="mt-20 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-[var(--pl-border)] bg-[var(--pl-border)] sm:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.value}
                className="flex flex-col items-center gap-1 bg-[var(--pl-surface)] px-6 py-8 text-center"
              >
                <Icon className="mb-2 h-5 w-5 text-[var(--pl-primary)]" />
                <span className="font-[var(--pl-font-display)] text-lg font-bold text-[var(--pl-ink)]">
                  {stat.value}
                </span>
                <span className="text-sm text-[var(--pl-ink-soft)]">{stat.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}