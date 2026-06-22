import { getUserSession } from "@/lib/core/session";
import { LayoutSideContentLeft, HeartPulse } from "@gravity-ui/icons";
import { Button, Drawer } from "@heroui/react";
import Link from "next/link";

import SidebarUserCard from "./SidebarUserCard";
import SidebarNav from "./SidebarNav";

export async function DashboardSidebar() {
  const user = await getUserSession();

  const donorNavLinks = [
    { icon: "House", href: "/dashboard", label: "Dashboard", color: "var(--pl-primary)" },
    { icon: "CirclePlus", href: "/dashboard/create-donation-request", label: "Create Request", color: "var(--pl-accent)" },
    { icon: "ListCheck", href: "/dashboard/my-donation-requests", label: "My Requests", color: "var(--pl-info)" },
    { icon: "Person", href: "/dashboard/profile", label: "Profile", color: "var(--pl-success)" },
  ];

  const volunteerNavLinks = [
    { icon: "House", href: "/dashboard", label: "Dashboard", color: "var(--pl-primary)" },
    { icon: "Droplet", href: "/dashboard/all-blood-donation-request", label: "All Requests", color: "var(--pl-accent)" },
    { icon: "Person", href: "/dashboard/profile", label: "Profile", color: "var(--pl-success)" },
  ];

  const adminNavLinks = [
    { icon: "House", href: "/dashboard", label: "Dashboard", color: "var(--pl-primary)" },
    { icon: "Persons", href: "/dashboard/all-users", label: "All Users", color: "var(--pl-warning)" },
    { icon: "Droplet", href: "/dashboard/all-blood-donation-request", label: "All Requests", color: "var(--pl-accent)" },
    { icon: "Person", href: "/dashboard/profile", label: "Profile", color: "var(--pl-success)" },
    { icon: "Gear", href: "/dashboard/settings", label: "Settings", color: "var(--pl-ink-soft)" },
  ];

  const navLinksMap = {
    donor: donorNavLinks,
    volunteer: volunteerNavLinks,
    admin: adminNavLinks,
  };

  const navItems = navLinksMap[user?.role || "donor"];

  const logo = (
    <Link href="/" className="flex items-center gap-2.5 px-2">
      <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--pl-primary)] to-[var(--pl-primary-light)] shadow-md shadow-[var(--pl-primary)]/30">
        <span className="absolute inset-0 rounded-xl bg-[var(--pl-primary)] opacity-40 blur-md" />
        <HeartPulse className="relative h-5 w-5 text-white" />
      </span>
      <span className="font-[var(--pl-font-display)] text-lg font-bold tracking-tight text-[var(--pl-ink)]">
        Pulse<span className="text-[var(--pl-primary)]">Link</span>
      </span>
    </Link>
  );

  const navContent = <SidebarNav items={navItems} />;

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col bg-[var(--pl-bg)] shadow-[1px_0_0_var(--pl-border)] lg:flex">
        <div className="flex h-[72px] items-center px-3">{logo}</div>
        <div className="flex-1 overflow-y-auto px-3 py-2">{navContent}</div>
        <div className="px-3 pb-3">
          <SidebarUserCard user={user} />
        </div>
      </aside>

      {/* Mobile drawer */}
      <Drawer>
        <Button
          className="fixed bottom-4 right-4 z-40 shadow-lg lg:hidden"
          variant="primary"
        >
          <LayoutSideContentLeft />
          Menu
        </Button>
        <Drawer.Backdrop>
          <Drawer.Content placement="left">
            <Drawer.Dialog className="flex flex-col bg-[var(--pl-bg)]">
              <Drawer.CloseTrigger />
              <Drawer.Header className="border-b border-[var(--pl-border)] py-4">
                {logo}
              </Drawer.Header>
              <Drawer.Body className="flex-1 overflow-y-auto py-2">
                {navContent}
              </Drawer.Body>
              <div className="border-t border-[var(--pl-border)] p-3">
                <SidebarUserCard user={user} />
              </div>
            </Drawer.Dialog>
          </Drawer.Content>
        </Drawer.Backdrop>
      </Drawer>
    </>
  );
}