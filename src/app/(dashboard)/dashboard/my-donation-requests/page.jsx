import { redirect } from "next/navigation";
import { getUserSession } from "@/lib/core/session";
import { getMyDonationRequests } from "@/lib/actions/donation_request";
import MyDonationRequestsList from "@/components/dashboard/MyDonationRequestsList";

const MyDonationRequestsPage = async () => {
  const user = await getUserSession();

  if (!user) {
    redirect("/auth/login");
  }

  const requests = await getMyDonationRequests(user.id);

  return (
    <div>
      <h1 className="font-[var(--pl-font-display)] text-2xl font-bold tracking-tight text-[var(--pl-ink)] sm:text-3xl">
        My Donation Requests
      </h1>
      <p className="mt-1 text-sm text-[var(--pl-ink-soft)]">
        Every request you&#39;ve made, in one place.
      </p>

      <div className="mt-6">
        <MyDonationRequestsList requests={requests} />
      </div>
    </div>
  );
};

export default MyDonationRequestsPage;