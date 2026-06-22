"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutSideContentLeft,
  House,
  Person,
  Gear,
  Droplet,
  HeartPulse,
  Bell,
  ListCheck,
  Megaphone,
} from "@gravity-ui/icons";
import { Button, Drawer } from "@heroui/react";
import {
  Users,
  ShieldCheck,
  BarChart2,
  HeartHandshake,
  Heart,
} from "lucide-react";

const adminNavLinks = [
  { icon: BarChart2, href: "/dashboard/admin", label: "Overview" },
  { icon: Users, href: "/dashboard/admin/users", label: "Users" },
  {
    icon: Droplet,
    href: "/dashboard/admin/blood-requests",
    label: "Blood Requests",
  },
  {
    icon: HeartHandshake,
    href: "/dashboard/admin/donations",
    label: "Donations",
  },
  {
    icon: ShieldCheck,
    href: "/dashboard/admin/volunteers",
    label: "Volunteers",
  },
  { icon: Megaphone, href: "/dashboard/admin/campaigns", label: "Campaigns" },
  { icon: Person, href: "/dashboard/profile", label: "Profile" },
  { icon: Gear, href: "/dashboard/admin/settings", label: "Settings" },
];

const donorNavLinks = [
  { icon: House, href: "/dashboard/donor", label: "Dashboard" },
  { icon: Droplet, href: "/dashboard/donor/donate", label: "Donate Blood" },
  {
    icon: ListCheck,
    href: "/dashboard/donor/history",
    label: "Donation History",
  },
  { icon: Bell, href: "/dashboard/donor/requests", label: "Blood Requests" },
  { icon: Person, href: "/dashboard/profile", label: "Profile" },
  { icon: Gear, href: "/dashboard/donor/settings", label: "Settings" },
];

const volunteerNavLinks = [
  { icon: House, href: "/dashboard/volunteer", label: "Dashboard" },
  {
    icon: HeartPulse,
    href: "/dashboard/volunteer/campaigns",
    label: "Campaigns",
  },
  { icon: ListCheck, href: "/dashboard/volunteer/tasks", label: "My Tasks" },
  { icon: Bell, href: "/dashboard/volunteer/requests", label: "Requests" },
  { icon: Person, href: "/dashboard/profile", label: "Profile" },
  { icon: Gear, href: "/dashboard/volunteer/settings", label: "Settings" },
];

const navLinksMap = {
  admin: adminNavLinks,
  donor: donorNavLinks,
  volunteer: volunteerNavLinks,
};

function SidebarLogo() {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-2 mb-4">
      <motion.span
        whileHover={{ scale: 1.06, rotate: -4 }}
        whileTap={{ scale: 0.94 }}
        className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--pl-primary)]"
      >
        <Heart
          className="h-4.5 w-4.5 text-white"
          strokeWidth={2.5}
          fill="currentColor"
        />
      </motion.span>
      <span className="font-[var(--pl-font-display)] text-lg font-bold tracking-tight text-[var(--pl-ink)]">
        Pulse<span className="text-[var(--pl-primary)]">Link</span>
      </span>
    </Link>
  );
}

function NavLinks({ items, onNavigate }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {items.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.label}
            href={item.href}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
              isActive
                ? "bg-danger/10 text-danger font-semibold"
                : "text-foreground hover:bg-default"
            }`}
          >
            <Icon
              className={`size-5 shrink-0 ${
                isActive ? "text-danger" : "text-foreground/50"
              }`}
            />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function DashboardSidebar({ userRole = "donor" }) {
  const [open, setOpen] = useState(false);
  const navItems = navLinksMap[userRole] ?? donorNavLinks;

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside className="hidden w-64 shrink-0 border-r border-default p-4 lg:flex lg:flex-col">
        <SidebarLogo />
        <NavLinks items={navItems} />
      </aside>

      {/* ── Mobile top bar ── */}
      <div className="flex items-center justify-between gap-3 border-b border-default px-4 py-3 lg:hidden">
        <Drawer>
          {/* First child of Drawer is the trigger */}
          <Button variant="ghost" size="sm" className="gap-2">
            <LayoutSideContentLeft className="size-5" />
            Menu
          </Button>

          <Drawer.Backdrop>
            <Drawer.Content placement="left">
              <Drawer.Dialog>
                <Drawer.CloseTrigger />
                <Drawer.Header>
                  <Drawer.Heading>
                    <div className="flex items-center gap-2">
                      <SidebarLogo />
                    </div>
                  </Drawer.Heading>
                </Drawer.Header>
                <Drawer.Body>
                  <NavLinks items={navItems} />
                </Drawer.Body>
              </Drawer.Dialog>
            </Drawer.Content>
          </Drawer.Backdrop>
        </Drawer>

        {/* Brand mark on mobile bar */}
        <div className="font-bold text-red-500">
          {userRole}
        </div>
      </div>
    </>
  );
}
