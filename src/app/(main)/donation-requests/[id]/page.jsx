import { redirect } from "next/navigation";
import { getDonationRequestById } from "@/lib/actions/donation_request";
import { getUserSession } from "@/lib/core/session";
import { DonationDetailView } from "@/components/dashboard/DonationDetailView";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const request = await getDonationRequestById(id);
  return {
    title: request
      ? `${request.recipientName} needs ${request.bloodGroup} | PulseLink`
      : "Donation Request | PulseLink",
  };
}

export default async function DonationRequestDetailPage({ params }) {
  const { id } = await params;

  // ── Auth guard ──────────────────────────────────────────────────────────────
  const user = await getUserSession();
  if (!user) {
    redirect("/auth/login");
  }

  // ── Fetch request ───────────────────────────────────────────────────────────
  const request = await getDonationRequestById(id);
  if (!request || !request._id) {
    redirect("/blood-donation-requests");
  }

  const safeUser = {
    id:    user.id,
    name:  user.name  ?? "",
    email: user.email ?? "",
  };

  return <DonationDetailView request={request} user={safeUser} />;
}