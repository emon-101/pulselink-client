import { DonationRequestCard } from "@/components/dashboard/DonationRequestCard";
import { serverQuery } from "@/lib/core/server";
import { Droplet } from "@gravity-ui/icons";

export const metadata = {
  title: "Blood Donation Requests | PulseLink",
  description: "Browse pending blood donation requests and help save a life.",
};

export default async function BloodDonationRequestsPage() {
  // Fetch only pending requests from the backend
  const allRequests = await serverQuery("/api/donation-request");
  const pendingRequests = Array.isArray(allRequests)
    ? allRequests.filter((r) => r.donationStatus === "pending")
    : [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      {/* ── Page header ── */}
      <div className="mb-10 text-center">
        <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-[var(--pl-surface)] px-4 py-1.5 text-sm font-medium text-[var(--pl-primary)]">
          <Droplet className="h-3.5 w-3.5" />
          Live Requests
        </span>
        <h1
          className="text-3xl font-bold tracking-tight text-[var(--pl-ink)] sm:text-4xl"
          style={{ fontFamily: "var(--pl-font-display)" }}
        >
          Blood Donation Requests
        </h1>
        <p className="mt-3 text-base text-[var(--pl-ink-soft)]">
          Every donation counts. Find a pending request near you and help save a
          life.
        </p>
      </div>

      {/* ── Request count badge ── */}
      {pendingRequests.length > 0 && (
        <p className="mb-6 text-sm text-[var(--pl-ink-soft)]">
          Showing{" "}
          <span className="font-semibold text-[var(--pl-ink)]">
            {pendingRequests.length}
          </span>{" "}
          pending request{pendingRequests.length !== 1 ? "s" : ""}
        </p>
      )}

      {/* ── Cards grid ── */}
      {pendingRequests.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-[var(--pl-border)] py-20 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--pl-surface)]">
            <Droplet className="h-7 w-7 text-[var(--pl-ink-soft)]" />
          </span>
          <p className="text-lg font-semibold text-[var(--pl-ink)]">
            No pending requests right now
          </p>
          <p className="max-w-sm text-sm text-[var(--pl-ink-soft)]">
            Check back later — new requests are posted regularly.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {pendingRequests.map((request) => (
            <DonationRequestCard key={request._id} request={request} />
          ))}
        </div>
      )}
    </div>
  );
}