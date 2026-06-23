import Link from "next/link";
import { getUserSession } from "@/lib/core/session";
import { getMyDonationRequests } from "@/lib/actions/donation_request";
import RecentDonationRequests from "@/components/dashboard/RecentDonationRequests";

const DashboardPage = async () => {
  const user = await getUserSession();
  const firstName = user?.name?.split(" ")[0] || "there";

  const isDonor = !user?.role || user.role === "donor";
  let recentRequests = [];

  if (isDonor) {
    const allRequests = await getMyDonationRequests(user?.id);
    // Most recent first, capped to 3 for the dashboard home — full list
    // lives on "My Donation Requests".
    recentRequests = [...(allRequests || [])]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3);
  }

  return (
    <div>
      <h1 className="font-[var(--pl-font-display)] text-3xl font-bold tracking-tight text-[var(--pl-ink)] sm:text-4xl lg:text-5xl">
        Welcome, {firstName}
      </h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-[var(--pl-ink-soft)]">
        Manage your donation requests, keep your profile up to date, and stay
        on top of every connection PulseLink helps you make — all from one
        place.
      </p>

      {/* Recent donation requests — hidden entirely if the donor hasn't
          made any request yet, per spec. */}
      {recentRequests.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-4 font-[var(--pl-font-display)] text-lg font-semibold text-[var(--pl-ink)]">
            Your recent donation requests
          </h2>

          <RecentDonationRequests requests={recentRequests} />

          <div className="mt-4 flex justify-end">
            <Link
              href="/dashboard/my-donation-requests"
              className="text-sm font-medium text-[var(--pl-primary)] hover:underline"
            >
              View my all requests →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;