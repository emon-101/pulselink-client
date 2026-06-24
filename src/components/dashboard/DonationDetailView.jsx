"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Modal, useOverlayState } from "@heroui/react";
import {
  MapPin, CalendarDays, Clock3, ArrowLeft,
  CheckCircle2, Loader2, User, Mail, Building2, MessageSquare,
} from "lucide-react";
import { Droplet, HeartPulse, Person } from "@gravity-ui/icons";
import { updateDonationRequest } from "@/lib/actions/donation_request";

// ── Colour maps ───────────────────────────────────────────────────────────────

const BG_STYLE = {
  "A+":  { bg: "bg-rose-50",   text: "text-rose-600",   badge: "bg-rose-500"   },
  "A-":  { bg: "bg-rose-50",   text: "text-rose-600",   badge: "bg-rose-500"   },
  "B+":  { bg: "bg-amber-50",  text: "text-amber-600",  badge: "bg-amber-500"  },
  "B-":  { bg: "bg-amber-50",  text: "text-amber-600",  badge: "bg-amber-500"  },
  "O+":  { bg: "bg-blue-50",   text: "text-blue-600",   badge: "bg-blue-500"   },
  "O-":  { bg: "bg-blue-50",   text: "text-blue-600",   badge: "bg-blue-500"   },
  "AB+": { bg: "bg-violet-50", text: "text-violet-600", badge: "bg-violet-500" },
  "AB-": { bg: "bg-violet-50", text: "text-violet-600", badge: "bg-violet-500" },
};

const STATUS_STYLE = {
  pending:    { bg: "bg-amber-50  border-amber-200", text: "text-amber-600",   dot: "bg-amber-400",   label: "Pending"     },
  inprogress: { bg: "bg-blue-50   border-blue-200",  text: "text-blue-600",    dot: "bg-blue-400",    label: "In Progress" },
  done:       { bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-600", dot: "bg-emerald-400", label: "Done"     },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

function formatTime(timeStr) {
  if (!timeStr) return "—";
  return timeStr; // keep raw HH:MM matching sample style
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionTitle({ children }) {
  return (
    <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--pl-ink-soft)]">
      {children}
    </p>
  );
}

function IconRow({ icon: Icon, label, value, iconBg = "bg-[var(--pl-surface)]", iconColor = "text-[var(--pl-primary)]" }) {
  return (
    <div className="flex items-start gap-3">
      <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
        <Icon className={`h-4 w-4 ${iconColor}`} />
      </span>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--pl-ink-soft)]">{label}</p>
        <p className="mt-0.5 text-sm font-bold text-[var(--pl-ink)]">{value || "—"}</p>
      </div>
    </div>
  );
}

function ReadOnlyField({ label, value, icon: Icon }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-[var(--pl-ink)]">{label}</label>
      <div className="flex items-center gap-2.5 rounded-xl border border-[var(--pl-border)] bg-[var(--pl-surface)] px-3.5 py-2.5">
        {Icon && <Icon className="h-4 w-4 shrink-0 text-[var(--pl-ink-soft)]" />}
        <span className="text-sm text-[var(--pl-ink-soft)]">{value}</span>
      </div>
    </div>
  );
}

// ── Animation variants ────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.1 } },
};

// ── Main export ───────────────────────────────────────────────────────────────

export function DonationDetailView({ request, user }) {
  const router = useRouter();
  const modalState = useOverlayState();
  const [confirming, setConfirming] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(null);

  const {
    _id, recipientName, recipientDistrict, recipientUpazila,
    hospitalName, fullAddress, bloodGroup, donationDate,
    donationTime, requestMessage, requesterName, requesterEmail,
    donationStatus = "pending",
  } = request;

  const bgStyle = BG_STYLE[bloodGroup] ?? BG_STYLE["O+"];
  const status  = STATUS_STYLE[donationStatus] ?? STATUS_STYLE.pending;
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
    <div className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl ">

      {/* ── Back ── */}
      <motion.button
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2 text-sm font-medium text-[var(--pl-ink-soft)] transition-colors hover:text-[var(--pl-ink)]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to requests
      </motion.button>

      {/* ── Page title (matching sample "Request Details") ── */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="mb-6 text-center"
      >
        <motion.h1
          variants={fadeUp}
          className="text-3xl font-black text-[var(--pl-ink)] sm:text-4xl"
          style={{ fontFamily: "var(--pl-font-display)" }}
        >
          Request{" "}
          <span className="text-[var(--pl-accent)]">Details</span>
        </motion.h1>
        <motion.p
          variants={fadeUp}
          className="mt-2 text-sm text-[var(--pl-ink-soft)]"
        >
          View urgency, location, and requirements.
        </motion.p>
      </motion.div>

      {/* Status pill top-right (matching sample) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.15 }}
        className="mb-4 flex justify-end"
      >
        <span className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-widest ${status.bg} ${status.text}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
          {status.label}
        </span>
      </motion.div>

      {/* ── Main card ── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1, ease: "easeOut" }}
        className="overflow-hidden rounded-3xl border border-[var(--pl-border)] bg-[var(--pl-bg)] shadow-sm"
      >
        {/* ── Recipient + blood group header ── */}
        <div className="flex flex-col gap-5 border-b border-[var(--pl-border)] p-6 sm:flex-row sm:items-center sm:justify-between">
          {/* Recipient block */}
          <div className="flex items-center gap-4">
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[var(--pl-accent)]/10"
            >
              <Person className="h-8 w-8 text-[var(--pl-accent)]" />
            </motion.span>
            <div>
              <h2
                className="text-2xl font-black text-[var(--pl-ink)]"
                style={{ fontFamily: "var(--pl-font-display)" }}
              >
                {recipientName}
              </h2>
              <p className="mt-0.5 text-[11px] font-bold uppercase tracking-widest text-[var(--pl-ink-soft)]">
                Recipient &bull; Patient
              </p>
            </div>
          </div>

          {/* Blood group block (matching sample's pink badge) */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            className={`flex items-center gap-3 rounded-2xl border px-5 py-3 ${bgStyle.bg} border-transparent`}
          >
            <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${bgStyle.badge} text-white font-black text-lg shadow-sm`}>
              {bloodGroup}
            </span>
            <div>
              <p className={`text-[10px] font-bold uppercase tracking-widest ${bgStyle.text}`}>
                Required
              </p>
              <p className="text-sm font-bold text-[var(--pl-ink)]">Blood Group</p>
            </div>
          </motion.div>
        </div>

        {/* ── Two-column body (matching sample: Location | Timing) ── */}
        <div className="grid gap-0 divide-y divide-[var(--pl-border)] sm:grid-cols-2 sm:divide-x sm:divide-y-0">

          {/* Left: Location details */}
          <div className="p-6">
            <SectionTitle>Location Details</SectionTitle>
            <div className="flex flex-col gap-5">
              <IconRow
                icon={Building2}
                label="Hospital"
                value={
                  <>
                    {hospitalName}
                    <span className="block text-xs font-medium text-[var(--pl-ink-soft)]">
                      {recipientUpazila}, {recipientDistrict}
                    </span>
                  </>
                }
                iconBg="bg-emerald-100"
                iconColor="text-emerald-600"
              />
              <IconRow
                icon={MapPin}
                label="Full Address"
                value={fullAddress}
                iconBg="bg-[var(--pl-accent)]/10"
                iconColor="text-[var(--pl-accent)]"
              />
            </div>
          </div>

          {/* Right: Timing & urgency */}
          <div className="p-6">
            <SectionTitle>Timing &amp; Urgency</SectionTitle>
            <div className="flex flex-col gap-5">
              {/* Date + Time inline (matching sample) */}
              <div className="flex items-start gap-5">
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--pl-primary)]/10">
                    <CalendarDays className="h-4 w-4 text-[var(--pl-primary)]" />
                  </span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--pl-ink-soft)]">
                      Required Date
                    </p>
                    <p className="mt-0.5 text-sm font-bold text-[var(--pl-ink)]">
                      {formatDate(donationDate)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--pl-primary)]/10">
                    <Clock3 className="h-4 w-4 text-[var(--pl-primary)]" />
                  </span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--pl-ink-soft)]">
                      Time
                    </p>
                    <p className="mt-0.5 text-sm font-bold text-[var(--pl-ink)]">
                      {formatTime(donationTime)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Request message box (matching sample's yellow box) */}
              {requestMessage && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="rounded-2xl border border-amber-200 bg-amber-50 p-4"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <MessageSquare className="h-3.5 w-3.5 text-amber-600" />
                    <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600">
                      Request Message
                    </p>
                  </div>
                  <p className="text-sm font-medium italic text-[var(--pl-ink)]">
                    &ldquo;{requestMessage}&rdquo;
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* ── Donate CTA ── */}
        <div className="flex items-center justify-between gap-4 border-t border-[var(--pl-border)] px-6 py-5">
          <p className="text-xs text-[var(--pl-ink-soft)]">
            Requested by{" "}
            <span className="font-semibold text-[var(--pl-ink)]">{requesterName}</span>
          </p>

          {isAlreadyTaken ? (
            <div className="flex items-center gap-2 text-sm font-medium text-[var(--pl-ink-soft)]">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              Already being handled
            </div>
          ) : (
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                color="danger"
                size="lg"
                className="gap-2 rounded-2xl px-8 font-bold shadow-md"
                style={{ background: "var(--pl-accent)" }}
                onPress={modalState.open}
              >
                <Droplet className="h-4 w-4" />
                Donate Now
              </Button>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* ── Confirm Donation Modal ── */}
      <Modal state={modalState}>
        <Modal.Backdrop>
          <Modal.Container>
            <Modal.Dialog className="bg-[var(--pl-bg)]">
              <Modal.CloseTrigger onPress={handleClose} />

              <Modal.Header className="border-b border-[var(--pl-border)] pb-4">
                <Modal.Heading>
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--pl-accent)]/10">
                      <Droplet className="h-4 w-4 text-[var(--pl-accent)]" />
                    </span>
                    <span
                      className="text-lg font-black text-[var(--pl-ink)]"
                      style={{ fontFamily: "var(--pl-font-display)" }}
                    >
                      Confirm Donation
                    </span>
                  </div>
                </Modal.Heading>
                <p className="mt-1.5 text-sm text-[var(--pl-ink-soft)]">
                  You are about to offer{" "}
                  <span className="font-bold text-[var(--pl-ink)]">{bloodGroup}</span> blood to{" "}
                  <span className="font-bold text-[var(--pl-ink)]">{recipientName}</span>.
                </p>
              </Modal.Header>

              <Modal.Body className="py-5">
                <AnimatePresence mode="wait">
                  {done ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center gap-3 py-6 text-center"
                    >
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100"
                      >
                        <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                      </motion.span>
                      <p className="text-lg font-black text-[var(--pl-ink)]"
                        style={{ fontFamily: "var(--pl-font-display)" }}>
                        Thank you, {user.name}!
                      </p>
                      <p className="text-sm text-[var(--pl-ink-soft)]">
                        Your donation offer is recorded. The requester will contact you soon.
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col gap-4"
                    >
                      <ReadOnlyField label="Your name"  value={user.name}  icon={User} />
                      <ReadOnlyField label="Your email" value={user.email} icon={Mail} />
                      <p className="rounded-xl bg-[var(--pl-surface)] px-4 py-3 text-xs text-[var(--pl-ink-soft)]">
                        By confirming, this request changes to{" "}
                        <span className="font-bold text-blue-600">In Progress</span>.
                        The requester will be able to contact you.
                      </p>
                      {error && (
                        <p className="rounded-xl bg-[var(--pl-danger)]/10 px-4 py-3 text-sm text-[var(--pl-danger)]">
                          {error}
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
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
                    <motion.div whileTap={{ scale: 0.96 }}>
                      <Button
                        color="danger"
                        className="gap-2 rounded-xl font-bold"
                        style={{ background: "var(--pl-accent)" }}
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
                    </motion.div>
                  </>
                )}
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
      </div>
    </div>
  );
}