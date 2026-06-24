import { redirect } from "next/navigation";
import { getUserSession } from "@/lib/core/session";
import { getAllUsers } from "@/lib/actions/user";
import AllUsersTable from "@/components/dashboard/AllUsersTable";

const AllUsersPage = async () => {
  const user = await getUserSession();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "admin") {
    redirect("/dashboard");
  }

  const users = await getAllUsers();

  return (
    <div>
      <h1 className="font-[var(--pl-font-display)] text-2xl font-bold tracking-tight text-[var(--pl-ink)] sm:text-3xl">
        All Users
      </h1>
      <p className="mt-1 text-sm text-[var(--pl-ink-soft)]">
        Manage every donor, volunteer, and admin on PulseLink.
      </p>

      <div className="mt-6">
        <AllUsersTable users={users} currentUserId={user.id} />
      </div>
    </div>
  );
};

export default AllUsersPage;