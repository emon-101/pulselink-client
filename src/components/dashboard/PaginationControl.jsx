"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Simple page-number control: Previous, a small window of page numbers
 * centered on the current page, Next. Disabled at the boundaries.
 */
export default function PaginationControl({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = getPageWindow(page, totalPages);

  return (
    <div className="mt-5 flex items-center justify-center gap-1">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--pl-ink-soft)] transition-colors hover:bg-[var(--pl-surface)] disabled:opacity-40 disabled:hover:bg-transparent"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="px-2 text-sm text-[var(--pl-ink-soft)]">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            aria-current={p === page ? "page" : undefined}
            className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
              p === page
                ? "bg-[var(--pl-primary)] text-white"
                : "text-[var(--pl-ink)] hover:bg-[var(--pl-surface)]"
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--pl-ink-soft)] transition-colors hover:bg-[var(--pl-surface)] disabled:opacity-40 disabled:hover:bg-transparent"
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

/** Builds a compact page list like [1, "...", 4, 5, 6, "...", 12] */
function getPageWindow(current, total, windowSize = 1) {
  const pages = [];
  const start = Math.max(2, current - windowSize);
  const end = Math.min(total - 1, current + windowSize);

  pages.push(1);
  if (start > 2) pages.push("...");
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push("...");
  if (total > 1) pages.push(total);

  return pages;
}