"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { Select, ListBox } from "@heroui/react";
import { Loader2 } from "lucide-react";

import RecentDonationRequests from "@/components/dashboard/RecentDonationRequests";
import PaginationControl from "@/components/dashboard/PaginationControl";

const STATUS_OPTIONS = [
  { id: "all", label: "All statuses" },
  { id: "pending", label: "Pending" },
  { id: "inprogress", label: "In Progress" },
  { id: "done", label: "Done" },
  { id: "canceled", label: "Canceled" },
];

const PAGE_SIZE = 10;

export default function MyDonationRequestsList({
  requests,
  fetchPage,
  canManage = true,
}) {
  const isPaginatedMode = typeof fetchPage === "function";

  const [statusFilter, setStatusFilter] = useState("all");

  // --- Static mode state ---
  const sorted = useMemo(
    () =>
      [...(requests || [])].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      ),
    [requests],
  );
  const staticFiltered = useMemo(() => {
    if (statusFilter === "all") return sorted;
    return sorted.filter(
      (req) => (req.donationStatus || "pending") === statusFilter,
    );
  }, [sorted, statusFilter]);

  // --- Paginated mode state ---
  const [page, setPage] = useState(1);
  const [pageData, setPageData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, startLoading] = useTransition();

  useEffect(() => {
    if (!isPaginatedMode) return;
    startLoading(async () => {
      const result = await fetchPage(
        page,
        PAGE_SIZE,
        statusFilter === "all" ? undefined : statusFilter,
      );
      setPageData(result?.data || []);
      setTotalPages(result?.totalPages || 1);
      setTotal(result?.total ?? (result?.data?.length || 0));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPaginatedMode, page, statusFilter]);

  function handleStatusFilterChange(value) {
    setStatusFilter(value);
    setPage(1);
  }

  const displayedRequests = isPaginatedMode ? pageData : staticFiltered;
  const displayedCount = isPaginatedMode ? total : staticFiltered.length;
  const hasAnyRequests = isPaginatedMode
    ? total > 0 || page > 1
    : requests.length > 0;

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[var(--pl-ink-soft)]">
          {displayedCount} {displayedCount === 1 ? "request" : "requests"}
          {statusFilter !== "all" && ` · ${statusLabel(statusFilter)}`}
        </p>

        <Select
          className="flex w-full flex-col gap-1.5 sm:w-56"
          value={statusFilter}
          onChange={handleStatusFilterChange}
        >
          <Select.Trigger className="rounded-lg border border-[var(--pl-border)] bg-[var(--pl-bg)] px-3.5 py-2.5 text-sm text-[var(--pl-ink)]">
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              {STATUS_OPTIONS.map((option) => (
                <ListBox.Item
                  key={option.id}
                  id={option.id}
                  textValue={option.label}
                >
                  {option.label}
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>
      </div>

      {isPaginatedMode && isLoading ? (
        <div className="flex justify-center rounded-2xl border border-[var(--pl-border)] bg-[var(--pl-surface)] py-16">
          <Loader2 className="h-5 w-5 animate-spin text-[var(--pl-ink-soft)]" />
        </div>
      ) : displayedRequests.length > 0 ? (
        <>
          <RecentDonationRequests
            requests={displayedRequests}
            canManage={canManage}
          />
          {isPaginatedMode && (
            <PaginationControl
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      ) : (
        <div className="rounded-2xl border border-dashed border-[var(--pl-border)] bg-[var(--pl-surface)] p-10 text-center">
          <p className="text-sm text-[var(--pl-ink-soft)]">
            {!hasAnyRequests
              ? "No donation requests yet."
              : `No ${statusLabel(statusFilter).toLowerCase()} requests found.`}
          </p>
        </div>
      )}
    </div>
  );
}

function statusLabel(id) {
  return STATUS_OPTIONS.find((s) => s.id === id)?.label || id;
}
