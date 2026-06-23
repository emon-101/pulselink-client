import { getUserSession } from "@/lib/core/session";

const DashboardPage = async () => {
  const user = await getUserSession();
  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <div>
      <h1 className="font-[var(--pl-font-display)] text-3xl font-bold tracking-tight text-[var(--pl-ink)] sm:text-4xl lg:text-5xl">
        Welcome, <span className="text-[var(--pl-primary)]">{firstName}!</span>
      </h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-[var(--pl-ink-soft)]">
        Manage your donation requests, keep your profile up to date, and stay
        on top of every connection PulseLink helps you make — all from one
        place.
      </p>
    </div>
  );
};

export default DashboardPage;