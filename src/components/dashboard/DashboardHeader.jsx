"use client";

import { motion } from "framer-motion";

/**
 * Dashboard top header bar — lives in app/dashboard/layout.jsx so it
 * persists across every dashboard route, sitting flush above the page
 * content next to the sidebar. Simple light surface, no gradient.
 */
const roleStyles = {
  admin: "bg-[var(--pl-danger)]/10 text-[var(--pl-danger)]",
  volunteer: "bg-[var(--pl-info)]/10 text-[var(--pl-info)]",
  donor: "bg-[var(--pl-primary)]/10 text-[var(--pl-primary)]",
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

export default function DashboardHeader({ user }) {
  const roleLabel = user?.role
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
    : "Donor";

  return (
    <motion.header
      initial="hidden"
      animate="show"
      variants={container}
      className="sticky top-0 z-30 flex items-center justify-between border-b border-[var(--pl-border)] bg-[var(--pl-bg)]/90 px-4 py-4 backdrop-blur-sm sm:px-6 lg:px-8"
    >
      <motion.div variants={item}>
        <span className="font-[var(--pl-font-display)] text-lg font-bold tracking-tight text-[var(--pl-ink)] sm:text-xl">
          Feel the pulse.{" "}
          <span className="text-[var(--pl-primary)]">Save a life.</span>
        </span>
      </motion.div>

      <motion.span
        variants={item}
        className={`inline-flex shrink-0 items-center rounded-full px-3 py-1 text-xs font-semibold capitalize ${
          roleStyles[user?.role] || roleStyles.donor
        }`}
      >
        {roleLabel}
      </motion.span>
    </motion.header>
  );
}