import Link from "next/link";
import { MapPin, CalendarDays, Clock3, ArrowRight } from "lucide-react";
import { Droplet } from "@gravity-ui/icons";

// Blood group colour accent map
const BG_COLOURS = {
  "A+":  "bg-rose-50   text-rose-600   border-rose-200   dark:bg-rose-900/20  dark:text-rose-400",
  "A-":  "bg-rose-50   text-rose-600   border-rose-200   dark:bg-rose-900/20  dark:text-rose-400",
  "B+":  "bg-amber-50  text-amber-600  border-amber-200  dark:bg-amber-900/20 dark:text-amber-400",
  "B-":  "bg-amber-50  text-amber-600  border-amber-200  dark:bg-amber-900/20 dark:text-amber-400",
  "O+":  "bg-blue-50   text-blue-600   border-blue-200   dark:bg-blue-900/20  dark:text-blue-400",
  "O-":  "bg-blue-50   text-blue-600   border-blue-200   dark:bg-blue-900/20  dark:text-blue-400",
  "AB+": "bg-violet-50 text-violet-600 border-violet-200 dark:bg-violet-900/20 dark:text-violet-400",
  "AB-": "bg-violet-50 text-violet-600 border-violet-200 dark:bg-violet-900/20 dark:text-violet-400",
};

function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(timeStr) {
  if (!timeStr) return "—";
  const [h, m] = timeStr.split(":");
  const date = new Date();
  date.setHours(+h, +m);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function DonationRequestCard({ request }) {
  const {
    _id,
    recipientName,
    recipientDistrict,
    recipientUpazila,
    bloodGroup,
    donationDate,
    donationTime,
  } = request;

  const bgColour =
    BG_COLOURS[bloodGroup] ??
    "bg-[var(--pl-surface)] text-[var(--pl-ink)] border-[var(--pl-border)]";

  return (
    <div className="group flex flex-col rounded-2xl border border-[var(--pl-border)] bg-[var(--pl-bg)] shadow-sm transition-shadow duration-200 hover:shadow-md">
      {/* ── Card top accent bar ── */}
      <div className="h-1.5 w-full rounded-t-2xl bg-[var(--pl-accent)]" />

      <div className="flex flex-1 flex-col gap-4 p-5">
        {/* Blood group badge + recipient */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--pl-ink-soft)]">
              Recipient
            </p>
            <h3 className="mt-0.5 text-base font-bold text-[var(--pl-ink)]">
              {recipientName}
            </h3>
          </div>

          <span
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl border px-3 py-1 text-sm font-bold ${bgColour}`}
          >
            <Droplet className="h-3.5 w-3.5" />
            {bloodGroup}
          </span>
        </div>

        {/* Details */}
        <ul className="flex flex-col gap-2 text-sm text-[var(--pl-ink-soft)]">
          <li className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0 text-[var(--pl-primary)]" />
            <span className="truncate">
              {recipientUpazila}, {recipientDistrict}
            </span>
          </li>
          <li className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 shrink-0 text-[var(--pl-primary)]" />
            {formatDate(donationDate)}
          </li>
          <li className="flex items-center gap-2">
            <Clock3 className="h-4 w-4 shrink-0 text-[var(--pl-primary)]" />
            {formatTime(donationTime)}
          </li>
        </ul>

        {/* View button */}
        <div className="mt-auto pt-1">
          <Link
            href={`/donation-requests/${_id}`}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--pl-primary)] px-4 py-2.5 text-sm font-semibold text-white transition-all duration-150 hover:bg-[var(--pl-primary-light)] active:scale-[0.98]"
          >
            View Details
            <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}