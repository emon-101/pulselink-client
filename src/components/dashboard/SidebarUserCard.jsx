"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@heroui/react";
import { LogOut, Loader2 } from "lucide-react";

import { authClient } from "@/lib/auth-client";

/**
 * Bottom-of-sidebar user card: avatar, name, email, logout.
 * Client component because logout needs interactivity — the parent
 * DashboardSidebar stays an async server component and just passes the
 * plain `user` object down as a prop.
 */
export default function SidebarUserCard({ user }) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (!user) return null;

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "";

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/login");
            router.refresh();
          },
        },
      });
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <div className="rounded-2xl bg-[var(--pl-surface)] p-2 ring-1 ring-[var(--pl-border)]">
      <div className="flex items-center gap-3 rounded-xl px-2 py-2">
        <Avatar size="sm" className="shrink-0 ring-2 ring-[var(--pl-bg)]">
          {user.image ? <Avatar.Image src={user.image} alt={user.name} /> : null}
          <AvatarFallback className="bg-[var(--pl-primary)] text-white">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-semibold text-[var(--pl-ink)]">
            {user.name}
          </span>
          <span className="truncate text-xs text-[var(--pl-ink-soft)]">
            {user.email}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleLogout}
        disabled={isLoggingOut}
        className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-[var(--pl-danger)] transition-colors hover:bg-[var(--pl-danger)]/10 disabled:opacity-60"
      >
        {isLoggingOut ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <LogOut className="h-4 w-4" />
        )}
        {isLoggingOut ? "Logging out..." : "Logout"}
      </button>
    </div>
  );
}