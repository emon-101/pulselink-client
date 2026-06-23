import { redirect } from "next/navigation";
import { getUserSession } from "@/lib/core/session";
import CreateDonationRequestForm from "@/components/dashboard/CreateDonationRequestForm";

const CreateDonationRequest = async () => {
  const user = await getUserSession();

  if (!user) {
    redirect("/auth/login");
  }

  if (user.status === "blocked") {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-[var(--pl-border)] bg-[var(--pl-surface)] p-8 text-center">
        <h1 className="font-[var(--pl-font-display)] text-xl font-bold text-[var(--pl-ink)]">
          Your account is blocked
        </h1>
        <p className="mt-2 text-sm text-[var(--pl-ink-soft)]">
          You currently can&#39;t create donation requests. If you believe this
          is a mistake, please contact PulseLink support.
        </p>
      </div>
    );
  }

  return <CreateDonationRequestForm user={user} />;
};

export default CreateDonationRequest;