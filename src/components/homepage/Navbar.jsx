"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Button, Dropdown, Label, Avatar, AvatarFallback } from "@heroui/react";
import { Heart, Menu, X, LayoutDashboard, LogOut, ChevronDown } from "lucide-react";

import { authClient } from "@/lib/auth-client";

export default function Navbar({ user = null }) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsMenuOpen(false);
    setIsLoggingOut(true);
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/auth/login");
            router.refresh();
          },
        },
      });
    } finally {
      setIsLoggingOut(false);
    }
  }

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
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <motion.span
            whileHover={{ scale: 1.06, rotate: -4 }}
            whileTap={{ scale: 0.94 }}
            className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--pl-primary)]"
          >
            <Heart className="h-4.5 w-4.5 text-white" strokeWidth={2.5} fill="currentColor" />
          </motion.span>
          <span className="font-[var(--pl-font-display)] text-lg font-bold tracking-tight text-[var(--pl-ink)]">
            Pulse<span className="text-[var(--pl-primary)]">Link</span>
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-8 md:flex">
          <li>
            <NavLink href="/donation-requests">Donation Requests</NavLink>
          </li>
          {user && (
            <li>
              <NavLink href="/funding">Funding</NavLink>
            </li>
          )}
        </ul>

        {/* Right side */}
        <div className="hidden items-center gap-3 md:flex">
          {!user ? (
            <Link href="/auth/login">
              <Button variant="primary" size="md">
                Login
              </Button>
            </Link>
          ) : (
            <Dropdown isDisabled={isLoggingOut}>
              <Dropdown.Trigger className="flex items-center gap-2 rounded-full p-1 pr-3 outline-none transition-colors hover:bg-[var(--pl-surface)] focus-visible:ring-2 focus-visible:ring-[var(--pl-primary)] disabled:opacity-60">
                <Avatar size="sm" className="cursor-pointer">
                  {user.image ? (
                    <Avatar.Image src={user.image} alt={user.name} />
                  ) : null}
                  <AvatarFallback className="bg-[var(--pl-primary)] text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span className="max-w-[120px] truncate text-sm font-medium text-[var(--pl-ink)]">
                  {user.name}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-[var(--pl-ink-soft)]" />
              </Dropdown.Trigger>
              <Dropdown.Popover>
                <Dropdown.Menu>
                  <Dropdown.Item id="dashboard" textValue="Dashboard">
                    <LayoutDashboard className="h-4 w-4" />
                    <Link href={'/dashboard'} className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-[var(--pl-ink-soft)] hover:bg-[var(--pl-surface)]">Dashboard</Link>
                  </Dropdown.Item>
                  <Dropdown.Item
                    id="logout"
                    textValue="Logout"
                    variant="danger"
                    onAction={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    <Label>{isLoggingOut ? "Logging out..." : "Logout"}</Label>
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
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={isMenuOpen ? "close" : "open"}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </motion.span>
          </AnimatePresence>
        </button>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-t border-[var(--pl-border)] bg-[var(--pl-bg)] md:hidden"
          >
            <div className="px-4 pb-4 pt-3">
              {user && (
                <div className="mb-3 flex items-center gap-3 rounded-lg bg-[var(--pl-surface)] px-3 py-2.5">
                  <Avatar size="sm">
                    {user.image ? (
                      <Avatar.Image src={user.image} alt={user.name} />
                    ) : null}
                    <AvatarFallback className="bg-[var(--pl-primary)] text-white">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-[var(--pl-ink)]">
                      {user.name}
                    </span>
                    <span className="text-xs text-[var(--pl-ink-soft)]">
                      {user.email}
                    </span>
                  </div>
                </div>
              )}

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
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="flex items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium text-[var(--pl-danger)] hover:bg-[var(--pl-surface)] disabled:opacity-60"
                    >
                      <LogOut className="h-4 w-4" />
                      {isLoggingOut ? "Logging out..." : "Logout"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function NavLink({ href, children }) {
  return (
    <Link
      href={href}
      className="group relative text-sm font-medium text-[var(--pl-ink-soft)] transition-colors hover:text-[var(--pl-primary)]"
    >
      {children}
      <span className="absolute -bottom-1 left-0 h-px w-0 bg-[var(--pl-primary)] transition-all duration-200 group-hover:w-full" />
    </Link>
  );
}