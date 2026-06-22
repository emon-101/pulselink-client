"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Dropdown, Label, Avatar, AvatarFallback } from "@heroui/react";
import { Heart, Menu, X, LayoutDashboard, LogOut } from "lucide-react";

/**
 * PulseLink Navbar
 * HeroUI v3 removed the <Navbar> component entirely — this is built manually
 * with semantic HTML + Tailwind, per the official v3 migration guide.
 *
 * Props:
 * - user: null when logged out, or { name, email, avatarUrl, role } when logged in
 */
export default function Navbar({ user = null }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // TODO: wire to Better Auth's signOut(), e.g.:
  // import { signOut } from "@/lib/auth-client";
  // const handleLogout = () => signOut();
  const handleLogout = () => {
    console.log("logout");
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "";

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[var(--pl-border)] bg-[var(--pl-bg)]/80 backdrop-blur-lg">
      <header className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--pl-primary)]">
            <Heart className="h-4.5 w-4.5 text-white" strokeWidth={2.5} fill="currentColor" />
          </span>
          <span className="font-[var(--pl-font-display)] text-lg font-bold tracking-tight text-[var(--pl-ink)]">
            Pulse<span className="text-[var(--pl-primary)]">Link</span>
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-8 md:flex">
          <li>
            <Link
              href="/donation-requests"
              className="text-sm font-medium text-[var(--pl-ink-soft)] transition-colors hover:text-[var(--pl-primary)]"
            >
              Donation Requests
            </Link>
          </li>
          {user && (
            <li>
              <Link
                href="/funding"
                className="text-sm font-medium text-[var(--pl-ink-soft)] transition-colors hover:text-[var(--pl-primary)]"
              >
                Funding
              </Link>
            </li>
          )}
        </ul>

        {/* Right side */}
        <div className="hidden items-center gap-3 md:flex">
          {!user ? (
            <Link href="/login">
              <Button variant="primary" size="md">
                Login
              </Button>
            </Link>
          ) : (
            <Dropdown>
              <Dropdown.Trigger className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[var(--pl-primary)]">
                <Avatar size="sm" className="cursor-pointer">
                  {user.avatarUrl ? (
                    <Avatar.Image src={user.avatarUrl} alt={user.name} />
                  ) : null}
                  <AvatarFallback className="bg-[var(--pl-primary)] text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Dropdown.Trigger>
              <Dropdown.Popover>
                <Dropdown.Menu>
                  <Dropdown.Item id="dashboard" textValue="Dashboard">
                    <LayoutDashboard className="h-4 w-4" />
                    <Label>Dashboard</Label>
                  </Dropdown.Item>
                  <Dropdown.Item
                    id="logout"
                    textValue="Logout"
                    variant="danger"
                    onAction={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    <Label>Logout</Label>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown.Popover>
            </Dropdown>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="flex items-center justify-center rounded-md p-2 text-[var(--pl-ink)] md:hidden"
          onClick={() => setIsMenuOpen((v) => !v)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </header>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="border-t border-[var(--pl-border)] bg-[var(--pl-bg)] px-4 pb-4 pt-2 md:hidden">
          <ul className="flex flex-col gap-1">
            <li>
              <Link
                href="/donation-requests"
                className="block rounded-md px-3 py-2 text-sm font-medium text-[var(--pl-ink-soft)] hover:bg-[var(--pl-surface)]"
                onClick={() => setIsMenuOpen(false)}
              >
                Donation Requests
              </Link>
            </li>
            {user && (
              <li>
                <Link
                  href="/funding"
                  className="block rounded-md px-3 py-2 text-sm font-medium text-[var(--pl-ink-soft)] hover:bg-[var(--pl-surface)]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Funding
                </Link>
              </li>
            )}
          </ul>

          <div className="mt-3 border-t border-[var(--pl-border)] pt-3">
            {!user ? (
              <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                <Button variant="primary" size="md" className="w-full">
                  Login
                </Button>
              </Link>
            ) : (
              <div className="flex flex-col gap-1">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-[var(--pl-ink-soft)] hover:bg-[var(--pl-surface)]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium text-[var(--pl-danger)] hover:bg-[var(--pl-surface)]"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}