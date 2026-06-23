import { redirect, notFound } from "next/navigation";
import { getUserSession } from "@/lib/core/session";
import { getDonationRequestById } from "@/lib/actions/donation_request";
import EditDonationRequestForm from "./EditDonationRequestForm";

const EditDonationRequestPage = async ({ params }) => {
  const { id } = await params;
  const user = await getUserSession();

  if (!user) {
    redirect("/auth/login");
  }

  const request = await getDonationRequestById(id);

  if (!request || !request._id) {
    notFound();
  }

  // Ownership guard — a donor can only edit their own requests, even if
  // they navigate directly to another request's edit URL.
  if (request.requesterId !== user.id && user.role !== "admin") {
    redirect("/dashboard/my-donation-requests");
  }

  return <EditDonationRequestForm user={user} request={request} />;
};

export default EditDonationRequestPage;