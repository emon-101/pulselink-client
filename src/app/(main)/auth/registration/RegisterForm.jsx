"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Form,
  TextField,
  Input,
  Label,
  FieldError,
  Select,
  ListBox,
  Button,
} from "@heroui/react";
import { Camera, Heart, Loader2, User } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import districts from "@/data/districts.json";
import upazilas from "@/data/upazilas.json";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const sortedDistricts = [...districts].sort((a, b) =>
  a.name.localeCompare(b.name),
);

export default function RegisterForm() {
  const router = useRouter();

  // Cascading location selects
  const [districtId, setDistrictId] = useState(null);
  const [upazilaId, setUpazilaId] = useState(null);

  // Avatar upload
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState(null);

  // Blood group
  const [bloodGroup, setBloodGroup] = useState(null);

  // Submission state
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
    // Reset upazila whenever the district changes, since the previous
    // selection almost certainly doesn't belong to the new district.
    setUpazilaId(null);
  }

  async function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarError(null);
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setIsUploadingAvatar(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed.");
      }

      setAvatarUrl(data.url);
    } catch (err) {
      setAvatarError(err.message || "Couldn't upload your avatar. Try again.");
      setAvatarUrl(null);
    } finally {
      setIsUploadingAvatar(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError(null);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirm_password");

    if (!districtId) {
      setSubmitError("Please select your district.");
      return;
    }
    if (!upazilaId) {
      setSubmitError("Please select your upazila.");
      return;
    }
    if (!bloodGroup) {
      setSubmitError("Please select your blood group.");
      return;
    }
    if (password !== confirmPassword) {
      setSubmitError("Passwords do not match.");
      return;
    }
    if (isUploadingAvatar) {
      setSubmitError("Please wait for the avatar to finish uploading.");
      return;
    }

    const districtName =
      sortedDistricts.find((d) => String(d.id) === String(districtId))?.name ??
      "";
    const upazilaName =
      availableUpazilas.find((u) => String(u.id) === String(upazilaId))?.name ??
      "";

    setIsSubmitting(true);
    try {
      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
        image: avatarUrl ?? undefined,
        // Additional fields declared in lib/auth.js
        bloodGroup,
        district: districtName,
        upazila: upazilaName,
      });

      if (error) {
        setSubmitError(error.message || "Registration failed. Try again.");
        return;
      }

      router.push("/dashboard");
    } catch (err) {
      setSubmitError(err.message || "Something went wrong. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[var(--pl-bg)] px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-xl"
      >
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--pl-primary)]">
            <Heart className="h-6 w-6 text-white" fill="currentColor" />
          </span>
          <h1 className="mt-4 font-[var(--pl-font-display)] text-2xl font-bold tracking-tight text-[var(--pl-ink)] sm:text-3xl">
            Join as a donor
          </h1>
          <p className="mt-2 max-w-sm text-sm text-[var(--pl-ink-soft)]">
            Create your PulseLink account and become part of the network that
            keeps the pulse going.
          </p>
        </div>

        <Form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-[var(--pl-border)] bg-[var(--pl-surface)] p-6 sm:p-8"
        >
          {/* Avatar upload */}
          <div className="mb-6 flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={() => document.getElementById("avatar-input")?.click()}
              className="group relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-[var(--pl-border)] bg-[var(--pl-bg)] transition-colors hover:border-[var(--pl-primary)]"
              aria-label="Upload avatar"
            >
              {avatarPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarPreview}
                  alt="Avatar preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-9 w-9 text-[var(--pl-ink-soft)]" />
              )}

              <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <Camera className="h-6 w-6 text-white" />
              </span>

              {isUploadingAvatar && (
                <span className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <Loader2 className="h-6 w-6 animate-spin text-white" />
                </span>
              )}
            </button>

            <input
              id="avatar-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />

            <span className="text-xs text-[var(--pl-ink-soft)]">
              {avatarUrl
                ? "Avatar uploaded ✓"
                : "Click to upload a profile photo"}
            </span>
            {avatarError && (
              <span className="text-xs text-[var(--pl-danger)]">
                {avatarError}
              </span>
            )}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <TextField name="name" isRequired className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium text-[var(--pl-ink)]">
                Full name
              </Label>
              <Input
                placeholder="Your full name"
                className="rounded-lg border border-[var(--pl-border)] bg-[var(--pl-bg)] px-3.5 py-2.5 text-sm text-[var(--pl-ink)] outline-none transition-colors focus:border-[var(--pl-primary)] focus:ring-2 focus:ring-[var(--pl-primary)]/20"
              />
              <FieldError className="text-xs text-[var(--pl-danger)]" />
            </TextField>

            <TextField
              name="email"
              type="email"
              isRequired
              className="flex flex-col gap-1.5"
            >
              <Label className="text-sm font-medium text-[var(--pl-ink)]">
                Email
              </Label>
              <Input
                placeholder="you@example.com"
                className="rounded-lg border border-[var(--pl-border)] bg-[var(--pl-bg)] px-3.5 py-2.5 text-sm text-[var(--pl-ink)] outline-none transition-colors focus:border-[var(--pl-primary)] focus:ring-2 focus:ring-[var(--pl-primary)]/20"
              />
              <FieldError className="text-xs text-[var(--pl-danger)]" />
            </TextField>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-3">
            {/* Blood group */}
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

            {/* District */}
            <Select
              className="flex flex-col gap-1.5"
              placeholder="Select district"
              value={districtId}
              onChange={handleDistrictChange}
            >
              <Label className="text-sm font-medium text-[var(--pl-ink)]">
                District
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

            {/* Upazila — depends on district */}
            <Select
              className="flex flex-col gap-1.5"
              placeholder={
                districtId ? "Select upazila" : "Pick district first"
              }
              value={upazilaId}
              onChange={setUpazilaId}
              isDisabled={!districtId}
            >
              <Label className="text-sm font-medium text-[var(--pl-ink)]">
                Upazila
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
            <TextField
              name="password"
              type="password"
              isRequired
              minLength={8}
              className="flex flex-col gap-1.5"
            >
              <Label className="text-sm font-medium text-[var(--pl-ink)]">
                Password
              </Label>
              <Input
                placeholder="At least 8 characters"
                className="rounded-lg border border-[var(--pl-border)] bg-[var(--pl-bg)] px-3.5 py-2.5 text-sm text-[var(--pl-ink)] outline-none transition-colors focus:border-[var(--pl-primary)] focus:ring-2 focus:ring-[var(--pl-primary)]/20"
              />
              <FieldError className="text-xs text-[var(--pl-danger)]" />
            </TextField>

            <TextField
              name="confirm_password"
              type="password"
              isRequired
              minLength={8}
              className="flex flex-col gap-1.5"
            >
              <Label className="text-sm font-medium text-[var(--pl-ink)]">
                Confirm password
              </Label>
              <Input
                placeholder="Re-enter your password"
                className="rounded-lg border border-[var(--pl-border)] bg-[var(--pl-bg)] px-3.5 py-2.5 text-sm text-[var(--pl-ink)] outline-none transition-colors focus:border-[var(--pl-primary)] focus:ring-2 focus:ring-[var(--pl-primary)]/20"
              />
              <FieldError className="text-xs text-[var(--pl-danger)]" />
            </TextField>
          </div>

          {submitError && (
            <p className="mt-4 rounded-lg bg-[var(--pl-danger)]/10 px-3.5 py-2.5 text-sm text-[var(--pl-danger)]">
              {submitError}
            </p>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isDisabled={isSubmitting || isUploadingAvatar}
            className="mt-6 w-full gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating your account...
              </>
            ) : (
              "Create account"
            )}
          </Button>

          <p className="mt-4 text-center text-sm text-[var(--pl-ink-soft)]">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-medium text-[var(--pl-primary)] hover:underline"
            >
              Log in
            </a>
          </p>
        </Form>
      </motion.div>
    </div>
  );
}
