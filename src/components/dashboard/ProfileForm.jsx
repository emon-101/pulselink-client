"use client";

import { useMemo, useState } from "react";
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
import { Camera, Loader2, Pencil, User, Check, X } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import districts from "@/data/districts.json";
import upazilas from "@/data/upazilas.json";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const sortedDistricts = [...districts].sort((a, b) =>
  a.name.localeCompare(b.name)
);

export default function ProfileForm({ user }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Editable local state — seeded from the user prop, reset on cancel.
  const [name, setName] = useState(user?.name || "");
  const [bloodGroup, setBloodGroup] = useState(user?.bloodGroup || null);
  const [districtId, setDistrictId] = useState(
    findDistrictIdByName(user?.district) || null
  );
  const [upazilaId, setUpazilaId] = useState(
    findUpazilaIdByName(user?.upazila) || null
  );

  // Avatar
  const [avatarUrl, setAvatarUrl] = useState(user?.image || null);
  const [avatarPreview, setAvatarPreview] = useState(user?.image || null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState(null);

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

  function handleEditClick() {
    setSaveError(null);
    setSaveSuccess(false);
    setIsEditing(true);
  }

  function handleCancel() {
    // Reset every field back to the original user values
    setName(user?.name || "");
    setBloodGroup(user?.bloodGroup || null);
    setDistrictId(findDistrictIdByName(user?.district) || null);
    setUpazilaId(findUpazilaIdByName(user?.upazila) || null);
    setAvatarUrl(user?.image || null);
    setAvatarPreview(user?.image || null);
    setAvatarError(null);
    setSaveError(null);
    setIsEditing(false);
  }

  async function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarError(null);
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
      setAvatarUrl(user?.image || null);
      setAvatarPreview(user?.image || null);
    } finally {
      setIsUploadingAvatar(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaveError(null);

    if (!districtId) {
      setSaveError("Please select your district.");
      return;
    }
    if (!upazilaId) {
      setSaveError("Please select your upazila.");
      return;
    }
    if (!bloodGroup) {
      setSaveError("Please select your blood group.");
      return;
    }
    if (isUploadingAvatar) {
      setSaveError("Please wait for the avatar to finish uploading.");
      return;
    }

    const districtName =
      sortedDistricts.find((d) => String(d.id) === String(districtId))
        ?.name ?? "";
    const upazilaName =
      availableUpazilas.find((u) => String(u.id) === String(upazilaId))
        ?.name ?? "";

    setIsSaving(true);
    try {
      const { error } = await authClient.updateUser({
        name,
        image: avatarUrl ?? undefined,
        bloodGroup,
        district: districtName,
        upazila: upazilaName,
      });

      if (error) {
        setSaveError(error.message || "Couldn't save your changes. Try again.");
        return;
      }

      setSaveSuccess(true);
      setIsEditing(false);
    } catch (err) {
      setSaveError(err.message || "Something went wrong. Try again.");
    } finally {
      setIsSaving(false);
    }
  }

  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="mx-auto w-full max-w-2xl"
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-[var(--pl-font-display)] text-2xl font-bold tracking-tight text-[var(--pl-ink)]">
            Profile
          </h1>
          <p className="mt-1 text-sm text-[var(--pl-ink-soft)]">
            Manage your personal information and donor details.
          </p>
        </div>

        {!isEditing && (
          <Button variant="outline" size="md" onPress={handleEditClick} className="gap-2">
            <Pencil className="h-4 w-4" />
            Edit
          </Button>
        )}
      </div>

      <Form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-[var(--pl-border)] bg-[var(--pl-surface)] p-6 sm:p-8"
      >
        {/* Avatar */}
        <div className="mb-6 flex flex-col items-center gap-3">
          <button
            type="button"
            disabled={!isEditing}
            onClick={() =>
              isEditing && document.getElementById("profile-avatar-input")?.click()
            }
            className="group relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-[var(--pl-border)] bg-[var(--pl-bg)] transition-colors disabled:cursor-default disabled:border-solid enabled:hover:border-[var(--pl-primary)]"
            aria-label="Update avatar"
          >
            {avatarPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarPreview}
                alt={name}
                className="h-full w-full object-cover"
              />
            ) : (
              <User className="h-9 w-9 text-[var(--pl-ink-soft)]" />
            )}

            {isEditing && (
              <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <Camera className="h-6 w-6 text-white" />
              </span>
            )}

            {isUploadingAvatar && (
              <span className="absolute inset-0 flex items-center justify-center bg-black/50">
                <Loader2 className="h-6 w-6 animate-spin text-white" />
              </span>
            )}
          </button>

          {isEditing && (
            <input
              id="profile-avatar-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          )}

          {avatarError && (
            <span className="text-xs text-[var(--pl-danger)]">{avatarError}</span>
          )}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            isRequired
            isDisabled={!isEditing}
            className="flex flex-col gap-1.5"
          >
            <Label className="text-sm font-medium text-[var(--pl-ink)]">
              Full name
            </Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-lg border border-[var(--pl-border)] bg-[var(--pl-bg)] px-3.5 py-2.5 text-sm text-[var(--pl-ink)] outline-none transition-colors focus:border-[var(--pl-primary)] focus:ring-2 focus:ring-[var(--pl-primary)]/20 disabled:cursor-not-allowed disabled:opacity-70"
            />
            <FieldError className="text-xs text-[var(--pl-danger)]" />
          </TextField>

          {/* Email — never editable, per spec, even in edit mode */}
          <TextField isDisabled className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium text-[var(--pl-ink)]">
              Email
            </Label>
            <Input
              value={user?.email || ""}
              readOnly
              className="cursor-not-allowed rounded-lg border border-[var(--pl-border)] bg-[var(--pl-bg)] px-3.5 py-2.5 text-sm text-[var(--pl-ink-soft)] opacity-70 outline-none"
            />
          </TextField>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-3">
          <Select
            className="flex flex-col gap-1.5"
            placeholder="Select"
            value={bloodGroup}
            onChange={setBloodGroup}
            isDisabled={!isEditing}
          >
            <Label className="text-sm font-medium text-[var(--pl-ink)]">
              Blood group
            </Label>
            <Select.Trigger className="rounded-lg border border-[var(--pl-border)] bg-[var(--pl-bg)] px-3.5 py-2.5 text-sm text-[var(--pl-ink)] disabled:cursor-not-allowed disabled:opacity-70">
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

          <Select
            className="flex flex-col gap-1.5"
            placeholder="Select district"
            value={districtId}
            onChange={handleDistrictChange}
            isDisabled={!isEditing}
          >
            <Label className="text-sm font-medium text-[var(--pl-ink)]">
              District
            </Label>
            <Select.Trigger className="rounded-lg border border-[var(--pl-border)] bg-[var(--pl-bg)] px-3.5 py-2.5 text-sm text-[var(--pl-ink)] disabled:cursor-not-allowed disabled:opacity-70">
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
            isDisabled={!isEditing || !districtId}
          >
            <Label className="text-sm font-medium text-[var(--pl-ink)]">
              Upazila
            </Label>
            <Select.Trigger className="rounded-lg border border-[var(--pl-border)] bg-[var(--pl-bg)] px-3.5 py-2.5 text-sm text-[var(--pl-ink)] disabled:cursor-not-allowed disabled:opacity-70">
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

        {saveError && (
          <p className="mt-5 rounded-lg bg-[var(--pl-danger)]/10 px-3.5 py-2.5 text-sm text-[var(--pl-danger)]">
            {saveError}
          </p>
        )}

        {saveSuccess && !isEditing && (
          <p className="mt-5 flex items-center gap-2 rounded-lg bg-[var(--pl-success)]/10 px-3.5 py-2.5 text-sm text-[var(--pl-success)]">
            <Check className="h-4 w-4" />
            Profile updated successfully.
          </p>
        )}

        {isEditing && (
          <div className="mt-6 flex gap-3">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isDisabled={isSaving || isUploadingAvatar}
              className="gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Save changes
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="lg"
              onPress={handleCancel}
              isDisabled={isSaving}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
          </div>
        )}
      </Form>
    </motion.div>
  );
}

function findDistrictIdByName(name) {
  if (!name) return null;
  return districts.find((d) => d.name === name)?.id ?? null;
}

function findUpazilaIdByName(name) {
  if (!name) return null;
  return upazilas.find((u) => u.name === name)?.id ?? null;
}