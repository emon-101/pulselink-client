import { HandHeart, Users, Wallet, TrendingUp, Calendar } from "lucide-react";
import FundingGiveButton from "@/components/funding/FundingGiveButton";
import { getUserSession } from "@/lib/core/session";
import { redirect } from "next/navigation";

// Static placeholder data — no funding backend exists yet (payment
// integration is a bonus task per spec). Swap this for a real fetch
// once that's built; the markup below is already shaped for it.

const STATIC_FUNDS = [
  { name: "Tanvir Ahmed", amount: 50, date: "2026-06-18" },
  { name: "Nusrat Jahan", amount: 100, date: "2026-06-15" },
  { name: "Rafiul Islam", amount: 25, date: "2026-06-10" },
  { name: "Shahriar Kabir", amount: 75, date: "2026-06-02" },
  { name: "Farzana Akter", amount: 30, date: "2026-05-28" },
];

const STATIC_TOTAL = STATIC_FUNDS.reduce((sum, f) => sum + f.amount, 0);

const FundingPage = async() => {
  const user = await getUserSession();
  console.log(user);
  if(!user) {
    redirect('/auth/login');
  }
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
        {/* Stat cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            icon={Wallet}
            label="Total raised"
            value={`$${STATIC_TOTAL.toLocaleString()}`}
            color="var(--pl-primary)"
          />
          <StatCard
            icon={Users}
            label="Contributors"
            value={STATIC_FUNDS.length}
            color="var(--pl-accent)"
          />
          <StatCard
            icon={TrendingUp}
            label="This month"
            value="3 gifts"
            color="var(--pl-info)"
          />
        </div>

        {/* Recent contributions — card list */}
        <div className="mt-12">
          <h2 className="mb-4 font-[var(--pl-font-display)] text-lg font-semibold text-[var(--pl-ink)]">
            Recent contributions
          </h2>

          <div className="flex flex-col gap-2.5">
            {STATIC_FUNDS.map((fund, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-4 rounded-2xl border border-[var(--pl-border)] bg-[var(--pl-surface)] px-4 py-3.5"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--pl-primary)]/10 font-[var(--pl-font-display)] text-sm font-bold text-[var(--pl-primary)]">
                    {fund.name.charAt(0)}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-[var(--pl-ink)]">
                      {fund.name}
                    </p>
                    <p className="flex items-center gap-1 text-xs text-[var(--pl-ink-soft)]">
                      <Calendar className="h-3 w-3" />
                      {fund.date}
                    </p>
                  </div>
                </div>

                <span className="shrink-0 font-[var(--pl-font-display)] text-sm font-bold text-[var(--pl-primary)]">
                  ${fund.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <p className="mt-4 text-center text-xs text-[var(--pl-ink-soft)]">
            Sample data shown — live contributions will appear here once
            payments go live.
          </p>
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