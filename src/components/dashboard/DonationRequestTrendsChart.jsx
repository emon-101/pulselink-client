"use client";

import { useEffect, useState, useTransition } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Loader2 } from "lucide-react";

import { getDonationRequestTrends } from "@/lib/actions/donation_request";

const RANGE_OPTIONS = [
  { id: "day", label: "Daily" },
  { id: "week", label: "Weekly" },
  { id: "month", label: "Monthly" },
];

const DATE_FORMAT_OPTIONS = {
  day: { month: "short", day: "numeric" },
  week: { month: "short", day: "numeric" },
  month: { month: "short", year: "numeric" },
};

export default function DonationRequestTrendsChart() {
  const [range, setRange] = useState("day");
  const [data, setData] = useState([]);
  const [isPending, startTransition] = useTransition();
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  useEffect(() => {
    startTransition(async () => {
      const result = await getDonationRequestTrends(range);
      const formatted = (result || []).map((point) => ({
        ...point,
        label: new Date(point.date).toLocaleDateString(
          "en-US",
          DATE_FORMAT_OPTIONS[range]
        ),
      }));
      setData(formatted);
      setHasLoadedOnce(true);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range]);

  return (
    <div className="rounded-2xl border border-[var(--pl-border)] bg-[var(--pl-surface)] p-5 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-[var(--pl-font-display)] text-lg font-semibold text-[var(--pl-ink)]">
            Donation request trends
          </h2>
          <p className="mt-0.5 text-sm text-[var(--pl-ink-soft)]">
            How many requests have come in over time.
          </p>
        </div>

        <div className="inline-flex w-fit rounded-lg bg-[var(--pl-bg)] p-1">
          {RANGE_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setRange(option.id)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                range === option.id
                  ? "bg-[var(--pl-primary)] text-white"
                  : "text-[var(--pl-ink-soft)] hover:text-[var(--pl-ink)]"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 h-64">
        {isPending && !hasLoadedOnce ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-[var(--pl-ink-soft)]" />
          </div>
        ) : data.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-[var(--pl-ink-soft)]">
              No donation requests yet.
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--pl-border)"
                vertical={false}
              />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 12, fill: "var(--pl-ink-soft)" }}
                axisLine={{ stroke: "var(--pl-border)" }}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 12, fill: "var(--pl-ink-soft)" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid var(--pl-border)",
                  background: "var(--pl-bg)",
                  fontSize: 13,
                }}
                labelStyle={{ color: "var(--pl-ink)", fontWeight: 600 }}
              />
              <Line
                type="monotone"
                dataKey="count"
                name="Requests"
                stroke="var(--pl-primary)"
                strokeWidth={2.5}
                dot={{ r: 3, fill: "var(--pl-primary)" }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}