"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Modal, useOverlayState } from "@heroui/react";
import {
  MapPin,
  CalendarDays,
  Clock3,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  User,
  Mail,
  Droplets,
  FileText,
  Building2,
} from "lucide-react";
import { Droplet, HeartPulse } from "@gravity-ui/icons";
import { updateDonationRequest } from "@/lib/actions/donation_request";

// ── Helpers ───────────────────────────────────────────────────────────────────

const BG_COLOURS = {
  "A+":  "bg-rose-50   text-rose-600   border-rose-200",
  "A-":  "bg-rose-50   text-rose-600   border-rose-200",
  "B+":  "bg-amber-50  text-amber-600  border-amber-200",
  "B-":  "bg-amber-50  text-amber-600  border-amber-200",
  "O+":  "bg-blue-50   text-blue-600   border-blue-200",
  "O-":  "bg-blue-50   text-blue-600   border-blue-200",
  "AB+": "bg-violet-50 text-violet-600 border-violet-200",
  "AB-": "bg-violet-50 text-violet-600 border-violet-200",
};

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTime(timeStr) {
  if (!timeStr) return "—";
  const [h, m] = timeStr.split(":");
  const d = new Date();
  d.setHours(+h, +m);
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

// ── Info row ──────────────────────────────────────────────────────────────────

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--pl-surface)]">
        <Icon className="h-4 w-4 text-[var(--pl-primary)]" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--pl-ink-soft)]">
          {label}
        </p>
        <p className="mt-0.5 text-sm font-semibold text-[var(--pl-ink)]">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

// ── Read-only modal field ─────────────────────────────────────────────────────

function ReadOnlyField({ label, value, icon: Icon }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-[var(--pl-ink)]">{label}</label>
      <div className="flex items-center gap-2.5 rounded-lg border border-[var(--pl-border)] bg-[var(--pl-surface)] px-3.5 py-2.5 opacity-80">
        {Icon && <Icon className="h-4 w-4 shrink-0 text-[var(--pl-ink-soft)]" />}
        <span className="text-sm text-[var(--pl-ink-soft)]">{value}</span>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function DonationDetailView({ request, user }) {
  const router = useRouter();
  const modalState = useOverlayState();
  const [confirming, setConfirming] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(null);

  const {
    _id,
    recipientName,
    recipientDistrict,
    recipientUpazila,
    hospitalName,
    fullAddress,
    bloodGroup,
    donationDate,
    donationTime,
    requestMessage,
    requesterName,
    requesterEmail,
    donationStatus,
  } = request;

  const bgColour =
    BG_COLOURS[bloodGroup] ??
    "bg-[var(--pl-surface)] text-[var(--pl-ink)] border-[var(--pl-border)]";

  const isAlreadyTaken = donationStatus !== "pending";

  async function handleConfirmDonate() {
    setConfirming(true);
    setError(null);
    try {
      await updateDonationRequest(_id, {
        donationStatus: "inprogress",
        donorId:    user.id,
        donorName:  user.name,
        donorEmail: user.email,
      });
      setDone(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setConfirming(false);
    }
  }

  function handleClose() {
    modalState.close();
    if (done) router.refresh();
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">

      {/* ── Back link ── */}
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2 text-sm font-medium text-[var(--pl-ink-soft)] transition-colors hover:text-[var(--pl-ink)]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to requests
      </button>

      {/* ── Detail card ── */}
      <div className="overflow-hidden rounded-2xl border border-[var(--pl-border)] bg-[var(--pl-bg)] shadow-sm">

        {/* Top accent bar */}
        <div className="h-1.5 w-full bg-[var(--pl-accent)]" />

        {/* Card header */}
        <div className="flex flex-col gap-4 border-b border-[var(--pl-border)] bg-[var(--pl-surface)] px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--pl-bg)] shadow-sm">
              <HeartPulse className="h-6 w-6 text-[var(--pl-accent)]" />
            </span>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--pl-ink-soft)]">
                Donation Request
              </p>
              <h1
                className="text-xl font-bold text-[var(--pl-ink)]"
                style={{ fontFamily: "var(--pl-font-display)" }}
              >
                {recipientName} needs blood
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-sm font-bold ${bgColour}`}
            >
              <Droplet className="h-3.5 w-3.5" />
              {bloodGroup}
            </span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                donationStatus === "pending"
                  ? "bg-amber-100 text-amber-600"
                  : donationStatus === "inprogress"
                  ? "bg-blue-100 text-blue-600"
                  : "bg-emerald-100 text-emerald-600"
              }`}
            >
              {donationStatus}
            </span>
          </div>
        </div>

        {/* Info grid */}
        <div className="grid gap-5 px-6 py-6 sm:grid-cols-2">
          <InfoRow icon={User}        label="Recipient name"  value={recipientName} />
          <InfoRow icon={MapPin}      label="Location"        value={`${recipientUpazila}, ${recipientDistrict}`} />
          <InfoRow icon={Building2}   label="Hospital"        value={hospitalName} />
          <InfoRow icon={MapPin}      label="Full address"    value={fullAddress} />
          <InfoRow icon={CalendarDays}label="Donation date"   value={formatDate(donationDate)} />
          <InfoRow icon={Clock3}      label="Donation time"   value={formatTime(donationTime)} />
          <InfoRow icon={Droplets}    label="Blood group"     value={bloodGroup} />
          <InfoRow icon={User}        label="Requested by"    value={`${requesterName} (${requesterEmail})`} />
          {requestMessage && (
            <div className="sm:col-span-2">
              <InfoRow icon={FileText} label="Message" value={requestMessage} />
            </div>
          )}
        </div>

        {/* Donate CTA */}
        <div className="border-t border-[var(--pl-border)] px-6 py-5">
          {isAlreadyTaken ? (
            <div className="flex items-center gap-2 text-sm font-medium text-[var(--pl-ink-soft)]">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              This request is already being handled.
            </div>
          ) : (
            <Button
              color="danger"
              size="lg"
              className="gap-2 rounded-xl font-semibold"
              onPress={modalState.open}
            >
              <Droplet className="h-4 w-4" />
              I Want to Donate
            </Button>
          )}
        </div>
      </div>

      {/* ── Donate confirmation modal (HeroUI v3 API) ── */}
      <Modal state={modalState}>
        <Modal.Backdrop>
          <Modal.Container>
            <Modal.Dialog className="bg-[var(--pl-bg)]">
              <Modal.CloseTrigger onPress={handleClose} />

              <Modal.Header className="border-b border-[var(--pl-border)] pb-4">
                <Modal.Heading>
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--pl-accent)]/10">
                      <Droplet className="h-4 w-4 text-[var(--pl-accent)]" />
                    </span>
                    <span
                      className="text-base font-bold text-[var(--pl-ink)]"
                      style={{ fontFamily: "var(--pl-font-display)" }}
                    >
                      Confirm Donation
                    </span>
                  </div>
                </Modal.Heading>
                <p className="mt-1 text-sm text-[var(--pl-ink-soft)]">
                  You are about to offer to donate{" "}
                  <span className="font-semibold text-[var(--pl-ink)]">{bloodGroup}</span>{" "}
                  blood to{" "}
                  <span className="font-semibold text-[var(--pl-ink)]">{recipientName}</span>.
                </p>
              </Modal.Header>

              <Modal.Body className="py-5">
                {done ? (
                  <div className="flex flex-col items-center gap-3 py-4 text-center">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
                      <CheckCircle2 className="h-7 w-7 text-emerald-600" />
                    </span>
                    <p className="text-base font-semibold text-[var(--pl-ink)]">
                      Thank you, {user.name}!
                    </p>
                    <p className="text-sm text-[var(--pl-ink-soft)]">
                      Your donation offer has been recorded. The requester will be notified.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    <ReadOnlyField label="Your name"  value={user.name}  icon={User} />
                    <ReadOnlyField label="Your email" value={user.email} icon={Mail} />
                    <p className="rounded-lg bg-[var(--pl-surface)] px-3.5 py-2.5 text-xs text-[var(--pl-ink-soft)]">
                      By confirming, this request status will change to{" "}
                      <span className="font-semibold text-blue-600">In Progress</span>.
                      The requester will be able to contact you.
                    </p>
                    {error && (
                      <p className="rounded-lg bg-[var(--pl-danger)]/10 px-3.5 py-2.5 text-sm text-[var(--pl-danger)]">
                        {error}
                      </p>
                    )}
                  </div>
                )}
              </Modal.Body>

              <Modal.Footer className="border-t border-[var(--pl-border)] pt-4">
                {done ? (
                  <Button
                    variant="flat"
                    className="rounded-xl font-semibold"
                    onPress={handleClose}
                  >
                    Close
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="flat"
                      className="rounded-xl"
                      onPress={handleClose}
                      isDisabled={confirming}
                    >
                      Cancel
                    </Button>
                    <Button
                      color="danger"
                      className="gap-2 rounded-xl font-semibold"
                      onPress={handleConfirmDonate}
                      isDisabled={confirming}
                    >
                      {confirming ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Confirming…
                        </>
                      ) : (
                        <>
                          <Droplet className="h-4 w-4" />
                          Confirm Donation
                        </>
                      )}
                    </Button>
                  </>
                )}
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </div>
  );
}