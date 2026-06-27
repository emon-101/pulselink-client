"use client";

import { useEffect, useState, useTransition } from "react";
import { Calendar, Loader2 } from "lucide-react";

import { getFundingInfo } from "@/lib/actions/funding";
import PaginationControl from "@/components/dashboard/PaginationControl";

const PAGE_SIZE = 8;

/**
 * Paginated contribution list for the public funding page. Fetches its
 * own data via getFundingInfo(page, limit) — same self-fetching pattern
 * as AllUsersTable — rather than receiving a static array, since the
 * underlying funding_info collection can grow indefinitely and the page
 * itself stays a server component for the hero/stat-card section above.
 */
export default function FundingContributionsList() {
  const [page, setPage] = useState(1);
  const [contributions, setContributions] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, startLoading] = useTransition();

  useEffect(() => {
    startLoading(async () => {
      const result = await getFundingInfo(page, PAGE_SIZE);
      setContributions(result?.data || []);
      setTotalPages(result?.totalPages || 1);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  if (isLoading && contributions.length === 0) {
    return (
      <div className="flex justify-center rounded-2xl border border-[var(--pl-border)] bg-[var(--pl-surface)] py-16">
        <Loader2 className="h-5 w-5 animate-spin text-[var(--pl-ink-soft)]" />
      </div>
    );
  }

  if (contributions.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[var(--pl-border)] bg-[var(--pl-surface)] p-10 text-center">
        <p className="text-sm text-[var(--pl-ink-soft)]">
          No contributions yet — be the first to give!
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-2.5">
        {contributions.map((fund) => (
          <div
            key={fund._id}
            className="flex items-center justify-between gap-4 rounded-2xl border border-[var(--pl-border)] bg-[var(--pl-surface)] px-4 py-3.5"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--pl-primary)]/10 font-[var(--pl-font-display)] text-sm font-bold text-[var(--pl-primary)]">
                {fund.userName?.charAt(0) || "?"}
              </span>
              <div>
                <p className="text-sm font-medium text-[var(--pl-ink)]">
                  {fund.userName}
                </p>
                <p className="flex items-center gap-1 text-xs text-[var(--pl-ink-soft)]">
                  <Calendar className="h-3 w-3" />
                  {new Date(fund.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <span className="shrink-0 font-[var(--pl-font-display)] text-sm font-bold text-[var(--pl-primary)]">
              ${Number(fund.amount).toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      <PaginationControl
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </>
  );
}
