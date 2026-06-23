"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AlertDialog, Button } from "@heroui/react";
import { Eye, Pencil, Trash2, Check, X, Loader2 } from "lucide-react";

import {
  updateDonationRequest,
  deleteDonationRequest,
} from "@/lib/actions/donation_request";

const STATUS_STYLES = {
  pending: "bg-[var(--pl-warning)]/10 text-[var(--pl-warning)]",
  inprogress: "bg-[var(--pl-info)]/10 text-[var(--pl-info)]",
  done: "bg-[var(--pl-success)]/10 text-[var(--pl-success)]",
  canceled: "bg-[var(--pl-ink-soft)]/10 text-[var(--pl-ink-soft)]",
};

export default function RecentDonationRequests({ requests }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [actingId, setActingId] = useState(null);

  function handleStatusChange(id, newStatus) {
    setActingId(id);
    startTransition(async () => {
      await updateDonationRequest(id, { donationStatus: newStatus });
      router.refresh();
      setActingId(null);
    });
  }

  function handleDelete(id) {
    setActingId(id);
    startTransition(async () => {
      await deleteDonationRequest(id);
      router.refresh();
      setActingId(null);
    });
  }

  if (!requests || requests.length === 0) {
    return null;
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-[var(--pl-border)]">
      <table className="w-full min-w-[860px] text-left text-sm">
        <thead className="bg-[var(--pl-surface)] text-xs uppercase tracking-wide text-[var(--pl-ink-soft)]">
          <tr>
            <th className="px-4 py-3 font-semibold">Recipient</th>
            <th className="px-4 py-3 font-semibold">Location</th>
            <th className="px-4 py-3 font-semibold">Date &amp; Time</th>
            <th className="px-4 py-3 font-semibold">Blood Group</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 font-semibold">Donor</th>
            <th className="px-4 py-3 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req, index) => {
            const id = req._id;
            const isActing = isPending && actingId === id;
            const isInProgress = req.donationStatus === "inprogress";

            return (
              <motion.tr
                key={id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05, duration: 0.25 }}
                className="border-t border-[var(--pl-border)] bg-[var(--pl-bg)]"
              >
                <td className="px-4 py-3 font-medium text-[var(--pl-ink)]">
                  {req.recipientName}
                </td>
                <td className="px-4 py-3 text-[var(--pl-ink-soft)]">
                  {req.recipientUpazila}, {req.recipientDistrict}
                </td>
                <td className="px-4 py-3 text-[var(--pl-ink-soft)]">
                  {req.donationDate}
                  <br />
                  <span className="text-xs">{req.donationTime}</span>
                </td>
                <td className="px-4 py-3 font-semibold text-[var(--pl-primary)]">
                  {req.bloodGroup}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                      STATUS_STYLES[req.donationStatus] || STATUS_STYLES.pending
                    }`}
                  >
                    {req.donationStatus || "pending"}
                  </span>
                </td>
                <td className="px-4 py-3 text-[var(--pl-ink-soft)]">
                  {isInProgress && req.donorName ? (
                    <div className="text-xs">
                      <div className="font-medium text-[var(--pl-ink)]">
                        {req.donorName}
                      </div>
                      <div>{req.donorEmail}</div>
                    </div>
                  ) : (
                    <span className="text-xs text-[var(--pl-ink-soft)]/60">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1.5">
                    {isInProgress && (
                      <>
                        <button
                          type="button"
                          title="Mark as done"
                          disabled={isActing}
                          onClick={() => handleStatusChange(id, "done")}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--pl-success)] transition-colors hover:bg-[var(--pl-success)]/10 disabled:opacity-50"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          title="Cancel"
                          disabled={isActing}
                          onClick={() => handleStatusChange(id, "canceled")}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--pl-danger)] transition-colors hover:bg-[var(--pl-danger)]/10 disabled:opacity-50"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </>
                    )}

                    <Link
                      href={`/dashboard/my-donation-requests/${id}`}
                      title="View"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--pl-ink-soft)] transition-colors hover:bg-[var(--pl-surface)]"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>

                    <Link
                      href={`/dashboard/my-donation-requests/${id}/edit`}
                      title="Edit"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--pl-ink-soft)] transition-colors hover:bg-[var(--pl-surface)]"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>

                    <DeleteRequestDialog
                      onConfirm={() => handleDelete(id)}
                      isDeleting={isActing}
                    />
                  </div>
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function DeleteRequestDialog({ onConfirm, isDeleting }) {
  return (
    <AlertDialog>
      <AlertDialog.Trigger>
        <button
          type="button"
          title="Delete"
          disabled={isDeleting}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--pl-danger)] transition-colors hover:bg-[var(--pl-danger)]/10 disabled:opacity-50"
        >
          {isDeleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </button>
      </AlertDialog.Trigger>
      <AlertDialog.Backdrop>
        <AlertDialog.Container>
          <AlertDialog.Dialog>
            {({ close }) => (
              <>
                <AlertDialog.Header>
                  <AlertDialog.Icon status="danger" />
                  <AlertDialog.Heading>
                    Delete donation request?
                  </AlertDialog.Heading>
                </AlertDialog.Header>
                <AlertDialog.Body>
                  This will permanently delete this donation request. This
                  action can&#39;t be undone.
                </AlertDialog.Body>
                <AlertDialog.Footer>
                  <Button variant="ghost" onPress={close}>
                    Cancel
                  </Button>
                  <Button
                    variant="danger"
                    onPress={() => {
                      onConfirm();
                      close();
                    }}
                  >
                    Delete
                  </Button>
                </AlertDialog.Footer>
              </>
            )}
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </AlertDialog>
  );
}