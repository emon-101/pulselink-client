import { redirect } from "next/navigation";
import { getUserSession } from "@/lib/core/session";
import ProfileForm from "@/components/dashboard/ProfileForm";

export default async function ProfilePage() {
  const user = await getUserSession();

  if (!user) {
    redirect("/auth/login");
  }

  return <ProfileForm user={user} />;
}