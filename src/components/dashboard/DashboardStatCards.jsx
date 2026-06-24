import { Users, HeartHandshake, Droplet } from "lucide-react";

const CARDS = [
  {
    key: "donors",
    icon: Users,
    label: "Total Donors",
    color: "var(--pl-primary)",
  },
  {
    key: "funding",
    icon: HeartHandshake,
    label: "Total Funding",
    color: "var(--pl-accent)",
  },
  {
    key: "requests",
    icon: Droplet,
    label: "Blood Donation Requests",
    color: "var(--pl-info)",
  },
];

export default function DashboardStatCards({
  totalDonors,
  totalFunding,
  totalRequests,
}) {
  const values = {
    donors: totalDonors,
    funding: totalFunding,
    requests: totalRequests,
  };

  return (
    <div className="grid gap-5 sm:grid-cols-3">
      {CARDS.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.key}
            className="rounded-2xl border border-[var(--pl-border)] bg-[var(--pl-surface)] p-5"
          >
            <span
              className="flex h-11 w-11 items-center justify-center rounded-xl"
              style={{ backgroundColor: `${card.color}1A` }}
            >
              <Icon className="h-5 w-5" style={{ color: card.color }} />
            </span>
            <p className="mt-4 font-[var(--pl-font-display)] text-3xl font-bold tracking-tight text-[var(--pl-ink)]">
              {values[card.key]}
            </p>
            <p className="mt-1 text-sm text-[var(--pl-ink-soft)]">
              {card.label}
            </p>
          </div>
        );
      })}
    </div>
  );
}