"use client";

import { useEffect, useState, useTransition } from "react";
import { motion } from "framer-motion";
import {
  Select,
  ListBox,
  Dropdown,
  Label,
  Avatar,
  AvatarFallback,
} from "@heroui/react";
import {
  MoreVertical,
  Ban,
  CheckCircle,
  UserCog,
  ShieldCheck,
  Loader2,
} from "lucide-react";

import { getAllUsersPaginated, updateUserById } from "@/lib/actions/user";
import PaginationControl from "@/components/dashboard/PaginationControl";

const STATUS_OPTIONS = [
  { id: "all", label: "All statuses" },
  { id: "active", label: "Active" },
  { id: "blocked", label: "Blocked" },
];

const STATUS_STYLES = {
  active: "bg-[var(--pl-success)]/10 text-[var(--pl-success)]",
  blocked: "bg-[var(--pl-danger)]/10 text-[var(--pl-danger)]",
};

const ROLE_STYLES = {
  admin: "bg-[var(--pl-danger)]/10 text-[var(--pl-danger)]",
  volunteer: "bg-[var(--pl-info)]/10 text-[var(--pl-info)]",
  donor: "bg-[var(--pl-primary)]/10 text-[var(--pl-primary)]",
};

const PAGE_SIZE = 10;

/**
 * Admin "All Users" table — server-driven pagination and status
 * filtering (both sent as query params to GET /api/users), not
 * client-side slicing. This matters because the two can't compose
 * correctly the other way around: filtering a single fetched page
 * client-side would show "0 blocked users" on a page that simply
 * doesn't contain any, even if blocked users exist elsewhere.
 *
 * Three-dot dropdown per row for block/unblock and role changes — same
 * as before, only the data-fetching model changed.
 */
export default function AllUsersTable({ currentUserId }) {
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [isLoading, startLoading] = useTransition();
  const [isActing, startActing] = useTransition();
  const [actingId, setActingId] = useState(null);

  function fetchUsers() {
    startLoading(async () => {
      const result = await getAllUsersPaginated(
        page,
        PAGE_SIZE,
        statusFilter === "all" ? undefined : statusFilter,
      );
      setUsers(result?.data || []);
      setTotalPages(result?.totalPages || 1);
      setTotal(result?.total ?? (result?.data?.length || 0));
    });
  }

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusFilter]);

  function handleStatusFilterChange(value) {
    setStatusFilter(value);
    setPage(1); // changing the filter invalidates the current page
  }

  function handleAction(userId, updates) {
    setActingId(userId);
    startActing(async () => {
      await updateUserById(userId, updates);
      fetchUsers();
      setActingId(null);
    });
  }

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[var(--pl-ink-soft)]">
          {total} {total === 1 ? "user" : "users"}
        </p>

        <Select
          className="flex w-full flex-col gap-1.5 sm:w-48"
          value={statusFilter}
          onChange={handleStatusFilterChange}
        >
          <Select.Trigger className="rounded-lg border border-[var(--pl-border)] bg-[var(--pl-bg)] px-3.5 py-2.5 text-sm text-[var(--pl-ink)]">
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              {STATUS_OPTIONS.map((option) => (
                <ListBox.Item
                  key={option.id}
                  id={option.id}
                  textValue={option.label}
                >
                  {option.label}
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center rounded-2xl border border-[var(--pl-border)] bg-[var(--pl-surface)] py-16">
          <Loader2 className="h-5 w-5 animate-spin text-[var(--pl-ink-soft)]" />
        </div>
      ) : users.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--pl-border)] bg-[var(--pl-surface)] p-10 text-center">
          <p className="text-sm text-[var(--pl-ink-soft)]">
            {statusFilter === "all"
              ? "No users found."
              : `No ${statusFilter} users found.`}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[var(--pl-border)]">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-[var(--pl-surface)] text-xs uppercase tracking-wide text-[var(--pl-ink-soft)]">
              <tr>
                <th className="px-4 py-3 font-semibold">User</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Role</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, index) => {
                const status = u.status || "active";
                const role = u.role || "donor";
                const userId = String(u._id || u.id);
                const isSelf = userId === String(currentUserId);
                const rowIsActing = isActing && actingId === userId;
                const initials = u.name
                  ? u.name
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()
                  : "";

                return (
                  <motion.tr
                    key={userId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.04, duration: 0.25 }}
                    className="border-t border-[var(--pl-border)] bg-[var(--pl-bg)]"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar size="sm">
                          {u.image ? (
                            <Avatar.Image src={u.image} alt={u.name} />
                          ) : null}
                          <AvatarFallback className="bg-[var(--pl-primary)] text-white">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-[var(--pl-ink)]">
                          {u.name}
                          {isSelf && (
                            <span className="ml-1.5 text-xs text-[var(--pl-ink-soft)]">
                              (you)
                            </span>
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[var(--pl-ink-soft)]">
                      {u.email}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                          ROLE_STYLES[role] || ROLE_STYLES.donor
                        }`}
                      >
                        {role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                          STATUS_STYLES[status] || STATUS_STYLES.active
                        }`}
                      >
                        {status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {isSelf ? (
                        <span className="text-xs text-[var(--pl-ink-soft)]/60">
                          —
                        </span>
                      ) : rowIsActing ? (
                        <div className="flex justify-end">
                          <Loader2 className="h-4 w-4 animate-spin text-[var(--pl-ink-soft)]" />
                        </div>
                      ) : (
                        <UserActionsMenu
                          userId={userId}
                          status={status}
                          role={role}
                          onAction={handleAction}
                        />
                      )}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <PaginationControl
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}

function UserActionsMenu({ userId, status, role, onAction }) {
  return (
    <Dropdown>
      <Dropdown.Trigger className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg text-[var(--pl-ink-soft)] outline-none transition-colors hover:bg-[var(--pl-surface)] focus-visible:ring-2 focus-visible:ring-[var(--pl-primary)]">
        <MoreVertical className="h-4 w-4" />
      </Dropdown.Trigger>
      <Dropdown.Popover>
        <Dropdown.Menu>
          {status === "active" ? (
            <Dropdown.Item
              id="block"
              textValue="Block user"
              variant="danger"
              onAction={() => onAction(userId, { status: "blocked" })}
            >
              <Ban className="h-4 w-4" />
              <Label>Block user</Label>
            </Dropdown.Item>
          ) : (
            <Dropdown.Item
              id="unblock"
              textValue="Unblock user"
              onAction={() => onAction(userId, { status: "active" })}
            >
              <CheckCircle className="h-4 w-4" />
              <Label>Unblock user</Label>
            </Dropdown.Item>
          )}

          {role === "donor" && (
            <Dropdown.Item
              id="make-volunteer"
              textValue="Make volunteer"
              onAction={() => onAction(userId, { role: "volunteer" })}
            >
              <UserCog className="h-4 w-4" />
              <Label>Make volunteer</Label>
            </Dropdown.Item>
          )}

          {role !== "admin" && (
            <Dropdown.Item
              id="make-admin"
              textValue="Make admin"
              onAction={() => onAction(userId, { role: "admin" })}
            >
              <ShieldCheck className="h-4 w-4" />
              <Label>Make admin</Label>
            </Dropdown.Item>
          )}
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}
