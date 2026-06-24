"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, CalendarDays, Clock3, ArrowRight } from "lucide-react";
import { Droplet } from "@gravity-ui/icons";

// Blood group colours
const BG_STYLE = {
  "A+":  { bg: "bg-rose-50",   text: "text-rose-600",   dot: "bg-rose-500"   },
  "A-":  { bg: "bg-rose-50",   text: "text-rose-600",   dot: "bg-rose-500"   },
  "B+":  { bg: "bg-amber-50",  text: "text-amber-600",  dot: "bg-amber-500"  },
  "B-":  { bg: "bg-amber-50",  text: "text-amber-600",  dot: "bg-amber-500"  },
  "O+":  { bg: "bg-blue-50",   text: "text-blue-600",   dot: "bg-blue-500"   },
  "O-":  { bg: "bg-blue-50",   text: "text-blue-600",   dot: "bg-blue-500"   },
  "AB+": { bg: "bg-violet-50", text: "text-violet-600", dot: "bg-violet-500" },
  "AB-": { bg: "bg-violet-50", text: "text-violet-600", dot: "bg-violet-500" },
};

const STATUS_STYLE = {
  pending:    { dot: "bg-amber-400",  label: "Pending",     text: "text-amber-600"  },
  inprogress: { dot: "bg-blue-400",   label: "In Progress", text: "text-blue-600"   },
  done:       { dot: "bg-emerald-400",label: "Done",        text: "text-emerald-600"},
};

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(timeStr) {
  if (!timeStr) return "—";
  const [h, m] = timeStr.split(":");
  const d = new Date();
  d.setHours(+h, +m);
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}

export function DonationRequestCard({ request, index = 0 }) {
  const {
    _id,
    recipientName,
    recipientDistrict,
    recipientUpazila,
    bloodGroup,
    donationDate,
    donationTime,
    donationStatus = "pending",
  } = request;

  const bgStyle   = BG_STYLE[bloodGroup]  ?? BG_STYLE["O+"];
  const status    = STATUS_STYLE[donationStatus] ?? STATUS_STYLE.pending;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.07, ease: "easeOut" }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative flex flex-col rounded-3xl border border-[var(--pl-border)] bg-[var(--pl-bg)] shadow-sm overflow-hidden"
    >
      {/* ── Top tinted area (like the sample's peach gradient top) ── */}
      <div className={`relative px-5 pt-5 pb-6 ${bgStyle.bg}`}>
        {/* Status dot + label */}
        <div className="flex items-center gap-1.5 mb-4">
          <span className={`h-2 w-2 rounded-full ${status.dot} animate-pulse`} />
          <span className={`text-xs font-bold uppercase tracking-widest ${status.text}`}>
            {status.label}
          </span>
        </div>

        {/* Blood group badge — large, like the sample */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-md ${bgStyle.text}`}
        >
          <span className="text-2xl font-black">{bloodGroup}</span>
        </motion.div>
      </div>

      {/* ── Card body ── */}
      <div className="flex flex-1 flex-col gap-4 px-5 py-5">
        {/* Recipient */}
        <div className="text-center">
          <h3 className="text-lg font-bold text-[var(--pl-ink)]"
            style={{ fontFamily: "var(--pl-font-display)" }}>
            {recipientName}
          </h3>
          <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-widest text-[var(--pl-ink-soft)]">
            Recipient
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-[var(--pl-border)]" />

        {/* Info rows */}
        <div className="flex flex-col gap-3">
          {/* Location */}
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[var(--pl-surface)]">
              <MapPin className="h-3.5 w-3.5 text-[var(--pl-primary)]" />
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--pl-ink-soft)]">
                Location
              </p>
              <p className="text-sm font-semibold text-[var(--pl-ink)]">
                {recipientUpazila}, {recipientDistrict}
              </p>
            </div>
          </div>

          {/* Date & time combined (matching sample layout) */}
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[var(--pl-surface)]">
              <CalendarDays className="h-3.5 w-3.5 text-[var(--pl-primary)]" />
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--pl-ink-soft)]">
                Date &amp; Time
              </p>
              <p className="text-sm font-semibold text-[var(--pl-ink)]">
                {formatDate(donationDate)}
                <span className="mx-1.5 text-[var(--pl-border)]">|</span>
                {formatTime(donationTime)}
              </p>
            </div>
          </div>
        </div>

        {/* CTA button — full width, rounded pill (like the orange button in sample) */}
        <motion.div
          className="mt-auto pt-1"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
        >
          <Link
            href={`/donation-requests/${_id}`}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--pl-primary)] py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[var(--pl-primary-light)]"
          >
            View Details
            <motion.span
              initial={{ x: 0 }}
              whileHover={{ x: 3 }}
              transition={{ duration: 0.15 }}
            >
              <ArrowRight className="h-4 w-4" />
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}