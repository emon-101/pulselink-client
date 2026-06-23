"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Form,
  TextField,
  Input,
  TextArea,
  Label,
  FieldError,
  Select,
  ListBox,
  Button,
} from "@heroui/react";
import { Loader2, Send } from "lucide-react";

import { createDonationRequest } from "@/lib/actions/donation_request";
import districts from "@/data/districts.json";
import upazilas from "@/data/upazilas.json";
import { toast } from "sonner";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const sortedDistricts = [...districts].sort((a, b) =>
  a.name.localeCompare(b.name)
);

export default function CreateDonationRequestForm({ user }) {
  const router = useRouter();

  const [districtId, setDistrictId] = useState(null);
  const [upazilaId, setUpazilaId] = useState(null);
  const [bloodGroup, setBloodGroup] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const availableUpazilas = useMemo(() => {
    if (!districtId) return [];
    return upazilas
      .filter((u) => u.district_id === String(districtId))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [districtId]);

  function handleDistrictChange(key) {
    setDistrictId(key);
    setUpazilaId(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError(null);

    const formData = new FormData(e.currentTarget);
    const recipientName = formData.get("recipientName");
    const hospitalName = formData.get("hospitalName");
    const fullAddress = formData.get("fullAddress");
    const donationDate = formData.get("donationDate");
    const donationTime = formData.get("donationTime");
    const requestMessage = formData.get("requestMessage");

    if (!districtId) {
      setSubmitError("Please select the recipient's district.");
      return;
    }
    if (!upazilaId) {
      setSubmitError("Please select the recipient's upazila.");
      return;
    }
    if (!bloodGroup) {
      setSubmitError("Please select a blood group.");
      return;
    }

    const recipientDistrict =
      sortedDistricts.find((d) => String(d.id) === String(districtId))
        ?.name ?? "";
    const recipientUpazila =
      availableUpazilas.find((u) => String(u.id) === String(upazilaId))
        ?.name ?? "";

    setIsSubmitting(true);
    try {
      const result = await createDonationRequest({
        requesterName: user?.name,
        requesterEmail: user?.email,
        recipientName,
        recipientDistrict,
        recipientUpazila,
        hospitalName,
        fullAddress,
        bloodGroup,
        donationDate,
        donationTime,
        requestMessage,
        donationStatus: "pending",
      });

      if (!result?.insertedId && !result?.acknowledged) {
        setSubmitError("Couldn't submit your request. Please try again.");
        return;
      }
      toast.success("Donation Request Create Successfully");
      router.push("/dashboard/my-donation-requests");
    } catch (err) {
      setSubmitError(err.message || "Something went wrong. Please try again.");
      toast.error("Somthing went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="mx-auto w-full max-w-3xl"
    >
      <div className="mb-6">
        <h1 className="font-[var(--pl-font-display)] text-2xl font-bold tracking-tight text-[var(--pl-ink)]">
          Create a donation request
        </h1>
        <p className="mt-1 text-sm text-[var(--pl-ink-soft)]">
          Tell donors what&#39;s needed, where, and when — they&#39;ll see this on
          the public donation requests page once it&#39;s live.
        </p>
      </div>

      <Form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-[var(--pl-border)] bg-[var(--pl-surface)] p-6 sm:p-8"
      >
        {/* Requester info — read-only, from the logged-in user */}
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField isDisabled className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium text-[var(--pl-ink)]">
              Requester name
            </Label>
            <Input
              value={user?.name || ""}
              readOnly
              className="cursor-not-allowed rounded-lg border border-[var(--pl-border)] bg-[var(--pl-bg)] px-3.5 py-2.5 text-sm text-[var(--pl-ink-soft)] opacity-70 outline-none"
            />
          </TextField>

          <TextField isDisabled className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium text-[var(--pl-ink)]">
              Requester email
            </Label>
            <Input
              value={user?.email || ""}
              readOnly
              className="cursor-not-allowed rounded-lg border border-[var(--pl-border)] bg-[var(--pl-bg)] px-3.5 py-2.5 text-sm text-[var(--pl-ink-soft)] opacity-70 outline-none"
            />
          </TextField>
        </div>

        <div className="my-6 border-t border-[var(--pl-border)]" />

        {/* Recipient info */}
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField name="recipientName" isRequired className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium text-[var(--pl-ink)]">
              Recipient name
            </Label>
            <Input
              placeholder="Who needs the blood?"
              className="rounded-lg border border-[var(--pl-border)] bg-[var(--pl-bg)] px-3.5 py-2.5 text-sm text-[var(--pl-ink)] outline-none transition-colors focus:border-[var(--pl-primary)] focus:ring-2 focus:ring-[var(--pl-primary)]/20"
            />
            <FieldError className="text-xs text-[var(--pl-danger)]" />
          </TextField>

          <Select
            className="flex flex-col gap-1.5"
            placeholder="Select"
            value={bloodGroup}
            onChange={setBloodGroup}
          >
            <Label className="text-sm font-medium text-[var(--pl-ink)]">
              Blood group
            </Label>
            <Select.Trigger className="rounded-lg border border-[var(--pl-border)] bg-[var(--pl-bg)] px-3.5 py-2.5 text-sm text-[var(--pl-ink)]">
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                {BLOOD_GROUPS.map((group) => (
                  <ListBox.Item key={group} id={group} textValue={group}>
                    {group}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <Select
            className="flex flex-col gap-1.5"
            placeholder="Select district"
            value={districtId}
            onChange={handleDistrictChange}
          >
            <Label className="text-sm font-medium text-[var(--pl-ink)]">
              Recipient district
            </Label>
            <Select.Trigger className="rounded-lg border border-[var(--pl-border)] bg-[var(--pl-bg)] px-3.5 py-2.5 text-sm text-[var(--pl-ink)]">
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                {sortedDistricts.map((district) => (
                  <ListBox.Item
                    key={district.id}
                    id={district.id}
                    textValue={district.name}
                  >
                    {district.name}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>

          <Select
            className="flex flex-col gap-1.5"
            placeholder={districtId ? "Select upazila" : "Pick district first"}
            value={upazilaId}
            onChange={setUpazilaId}
            isDisabled={!districtId}
          >
            <Label className="text-sm font-medium text-[var(--pl-ink)]">
              Recipient upazila
            </Label>
            <Select.Trigger className="rounded-lg border border-[var(--pl-border)] bg-[var(--pl-bg)] px-3.5 py-2.5 text-sm text-[var(--pl-ink)] disabled:opacity-50">
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                {availableUpazilas.map((upazila) => (
                  <ListBox.Item
                    key={upazila.id}
                    id={upazila.id}
                    textValue={upazila.name}
                  >
                    {upazila.name}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <TextField name="hospitalName" isRequired className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium text-[var(--pl-ink)]">
              Hospital name
            </Label>
            <Input
              placeholder="e.g. Dhaka Medical College Hospital"
              className="rounded-lg border border-[var(--pl-border)] bg-[var(--pl-bg)] px-3.5 py-2.5 text-sm text-[var(--pl-ink)] outline-none transition-colors focus:border-[var(--pl-primary)] focus:ring-2 focus:ring-[var(--pl-primary)]/20"
            />
            <FieldError className="text-xs text-[var(--pl-danger)]" />
          </TextField>

          <TextField name="fullAddress" isRequired className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium text-[var(--pl-ink)]">
              Full address line
            </Label>
            <Input
              placeholder="e.g. Zahir Raihan Rd, Dhaka"
              className="rounded-lg border border-[var(--pl-border)] bg-[var(--pl-bg)] px-3.5 py-2.5 text-sm text-[var(--pl-ink)] outline-none transition-colors focus:border-[var(--pl-primary)] focus:ring-2 focus:ring-[var(--pl-primary)]/20"
            />
            <FieldError className="text-xs text-[var(--pl-danger)]" />
          </TextField>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <TextField name="donationDate" isRequired className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium text-[var(--pl-ink)]">
              Donation date
            </Label>
            <Input
              type="date"
              className="rounded-lg border border-[var(--pl-border)] bg-[var(--pl-bg)] px-3.5 py-2.5 text-sm text-[var(--pl-ink)] outline-none transition-colors focus:border-[var(--pl-primary)] focus:ring-2 focus:ring-[var(--pl-primary)]/20"
            />
            <FieldError className="text-xs text-[var(--pl-danger)]" />
          </TextField>

          <TextField name="donationTime" isRequired className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium text-[var(--pl-ink)]">
              Donation time
            </Label>
            <Input
              type="time"
              className="rounded-lg border border-[var(--pl-border)] bg-[var(--pl-bg)] px-3.5 py-2.5 text-sm text-[var(--pl-ink)] outline-none transition-colors focus:border-[var(--pl-primary)] focus:ring-2 focus:ring-[var(--pl-primary)]/20"
            />
            <FieldError className="text-xs text-[var(--pl-danger)]" />
          </TextField>
        </div>

        <TextField
          name="requestMessage"
          isRequired
          className="mt-5 flex flex-col gap-1.5"
        >
          <Label className="text-sm font-medium text-[var(--pl-ink)]">
            Request message
          </Label>
          <TextArea
            placeholder="Explain why blood is needed, any urgency, and other helpful details for the donor..."
            rows={5}
            className="rounded-lg border border-[var(--pl-border)] bg-[var(--pl-bg)] px-3.5 py-2.5 text-sm text-[var(--pl-ink)] outline-none transition-colors focus:border-[var(--pl-primary)] focus:ring-2 focus:ring-[var(--pl-primary)]/20"
          />
          <FieldError className="text-xs text-[var(--pl-danger)]" />
        </TextField>

        {submitError && (
          <p className="mt-5 rounded-lg bg-[var(--pl-danger)]/10 px-3.5 py-2.5 text-sm text-[var(--pl-danger)]">
            {submitError}
          </p>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isDisabled={isSubmitting}
          className="mt-6 gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Request
            </>
          )}
        </Button>
      </Form>
    </motion.div>
  );
}