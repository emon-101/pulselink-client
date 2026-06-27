import { redirect } from "next/navigation";
import { HandHeart, Users, Wallet, TrendingUp } from "lucide-react";

import { getUserSession } from "@/lib/core/session";
import { getFundingInfo } from "@/lib/actions/funding";
import FundingGiveButton from "@/components/funding/FundingGiveButton";
import FundingContributionsList from "@/components/funding/FundingContributionsList";

const FundingPage = async () => {
  const user = await getUserSession();
  if (!user) {
    redirect("/auth/login");
  }

  const { data: allFundings = [], totalAmount = 0, totalContributors = 0 } =
    (await getFundingInfo()) || {};

  const now = new Date();
  const thisMonthCount = allFundings.filter((f) => {
    const created = new Date(f.createdAt);
    return (
      created.getMonth() === now.getMonth() &&
      created.getFullYear() === now.getFullYear()
    );
  }).length;

  return (
    <div className="bg-[var(--pl-bg)]">
      {/* Hero — same layered glow treatment as the homepage Banner */}
      <section className="relative overflow-hidden bg-[var(--pl-ink)]">
        <div
          aria-hidden="true"
          className="absolute -top-40 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[var(--pl-primary)]/25 blur-3xl"
        />

        <div className="relative mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/70">
            <HandHeart className="h-3.5 w-3.5 text-[var(--pl-accent)]" />
            Support the network
          </span>

          <h1 className="mt-5 font-[var(--pl-font-display)] text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Help keep PulseLink running
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/60">
            PulseLink connects donors and recipients for free. Every
            contribution — big or small — helps cover the cost of keeping
            that bridge open for everyone who needs it.
          </p>

          <div className="mt-7">
            <FundingGiveButton />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Stat cards — all real, derived from the funding_info collection */}
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            icon={Wallet}
            label="Total raised"
            value={`$${Number(totalAmount).toLocaleString()}`}
            color="var(--pl-primary)"
          />
          <StatCard
            icon={Users}
            label="Contributors"
            value={totalContributors}
            color="var(--pl-accent)"
          />
          <StatCard
            icon={TrendingUp}
            label="This month"
            value={`${thisMonthCount} gift${thisMonthCount === 1 ? "" : "s"}`}
            color="var(--pl-info)"
          />
        </div>

        {/* Recent contributions — paginated, fetches its own pages */}
        <div className="mt-12">
          <h2 className="mb-4 font-[var(--pl-font-display)] text-lg font-semibold text-[var(--pl-ink)]">
            Recent contributions
          </h2>

          <FundingContributionsList />
        </div>
      </div>
    </div>
  );
};

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="rounded-2xl border border-[var(--pl-border)] bg-[var(--pl-surface)] p-5">
      <span
        className="flex h-11 w-11 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${color}1A` }}
      >
        <Icon className="h-5 w-5" style={{ color }} />
      </span>
      <p className="mt-4 font-[var(--pl-font-display)] text-2xl font-bold tracking-tight text-[var(--pl-ink)]">
        {value}
      </p>
      <p className="mt-1 text-sm text-[var(--pl-ink-soft)]">{label}</p>
    </div>
  );
}

export default FundingPage;