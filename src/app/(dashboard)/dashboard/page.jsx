import Link from "next/link";
import { getUserSession } from "@/lib/core/session";
import { getMyDonationRequests } from "@/lib/actions/donation_request";
import { getDashboardStats } from "@/lib/actions/stats";
import RecentDonationRequests from "@/components/dashboard/RecentDonationRequests";
import DashboardStatCards from "@/components/dashboard/DashboardStatCards";
import DonationRequestTrendsChart from "@/components/dashboard/DonationRequestTrendsChart";
import { getFundingInfo } from "@/lib/actions/funding";

const DashboardPage = async () => {
  const user = await getUserSession();
  const firstName = user?.name || "there";

  const isDonor = !user?.role || user.role === "donor";
  const isStaff = user?.role === "admin" || user?.role === "volunteer";
  const isAdmin = user?.role === "admin";

  let recentRequests = [];
  let stats = null;

  const {
    data: allFundings = [],
    totalAmount = 0,
    totalContributors = 0,
  } = (await getFundingInfo()) || {};

  if (isDonor) {
    const allRequests = await getMyDonationRequests(user?.id);
    // Most recent first, capped to 3 for the dashboard home — full list
    // lives on "My Donation Requests".
    recentRequests = [...(allRequests || [])]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3);
  }

  if (isStaff) {
    stats = await getDashboardStats();
  }

  return (
    <div>
      <h1 className="font-[var(--pl-font-display)] text-3xl font-bold tracking-tight text-[var(--pl-ink)] sm:text-4xl lg:text-5xl">
        Welcome, {firstName}
      </h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-[var(--pl-ink-soft)]">
        Manage your donation requests, keep your profile up to date, and stay on
        top of every connection PulseLink helps you make — all from one place.
      </p>

      {/* Admin / volunteer: featured stat cards. Same welcome section as
          the donor dashboard above, different content below it. */}
      {isStaff && (
        <div className="mt-8">
          <DashboardStatCards
            totalDonors={stats?.totalDonors ?? 0}
            totalFunding={`$${totalAmount}`}
            totalRequests={stats?.totalRequests ?? 0}
          />
        </div>
      )}

      {/* Admin only — daily/weekly/monthly donation request trend chart.
          Volunteers see the stat cards above but not this. */}
      {isAdmin && (
        <div className="mt-8">
          <DonationRequestTrendsChart />
        </div>
      )}

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
