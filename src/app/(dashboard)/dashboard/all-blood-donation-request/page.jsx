import { redirect } from "next/navigation";
import { getUserSession } from "@/lib/core/session";
import { getAllDonationRequests } from "@/lib/actions/donation_request";
import MyDonationRequestsList from "@/components/dashboard/MyDonationRequestsList";

const AllBloodDonationRequestPage = async () => {
  const user = await getUserSession();

  if (!user) {
    redirect("/auth/login");
  }

  if (user.role !== "admin" && user.role !== "volunteer") {
    redirect("/dashboard");
  }

  // Unfiltered — admin/volunteer see every request, not just their own.
  const requests = await getAllDonationRequests();

  const canManage = user.role === "admin";

  return (
    <div>
      <h1 className="font-[var(--pl-font-display)] text-2xl font-bold tracking-tight text-[var(--pl-ink)] sm:text-3xl">
        All Blood Donation Requests
      </h1>
      <p className="mt-1 text-sm text-[var(--pl-ink-soft)]">
        {canManage
          ? "Every donation request across PulseLink — manage status, edit, or remove any request."
          : "Every donation request across PulseLink. You can update donation status while a request is in progress."}
      </p>

      <div className="mt-6">
        <MyDonationRequestsList requests={requests} canManage={canManage} />
      </div>
    </div>
  );
};

export default AllBloodDonationRequestPage;