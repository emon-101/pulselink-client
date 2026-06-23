"use client";

import { useMemo, useState } from "react";
import { Select, ListBox } from "@heroui/react";
import RecentDonationRequests from "./RecentDonationRequests";


const STATUS_OPTIONS = [
  { id: "all", label: "All statuses" },
  { id: "pending", label: "Pending" },
  { id: "inprogress", label: "In Progress" },
  { id: "done", label: "Done" },
  { id: "canceled", label: "Canceled" },
];

export default function MyDonationRequestsList({ requests }) {
  const [statusFilter, setStatusFilter] = useState("all");

  const sorted = useMemo(
    () =>
      [...(requests || [])].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      ),
    [requests]
  );

  const filtered = useMemo(() => {
    if (statusFilter === "all") return sorted;
    return sorted.filter(
      (req) => (req.donationStatus || "pending") === statusFilter
    );
  }, [sorted, statusFilter]);

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[var(--pl-ink-soft)]">
          {filtered.length} {filtered.length === 1 ? "request" : "requests"}
          {statusFilter !== "all" && ` · ${statusLabel(statusFilter)}`}
        </p>

        <Select
          className="flex w-full flex-col gap-1.5 sm:w-56"
          value={statusFilter}
          onChange={setStatusFilter}
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

      {filtered.length > 0 ? (
        <RecentDonationRequests requests={filtered} />
      ) : (
        <div className="rounded-2xl border border-dashed border-[var(--pl-border)] bg-[var(--pl-surface)] p-10 text-center">
          <p className="text-sm text-[var(--pl-ink-soft)]">
            {requests.length === 0
              ? "You haven't made any donation requests yet."
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