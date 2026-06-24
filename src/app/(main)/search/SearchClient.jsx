"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Mail, Search, Loader2, Users, HeartHandshake } from "lucide-react";
import { Droplet, HeartPulse, Person } from "@gravity-ui/icons";
import { searchDonors } from "@/lib/actions/donors";
import districts from "@/data/districts.json";
import upazilas from "@/data/upazilas.json";

// ── Constants ─────────────────────────────────────────────────────────────────

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const sortedDistricts = [...districts].sort((a, b) =>
  a.name.localeCompare(b.name)
);

const BG_STYLE = {
  "A+":  { bg: "bg-rose-50",   text: "text-rose-600",   badge: "bg-rose-500",   border: "border-rose-200"   },
  "A-":  { bg: "bg-rose-50",   text: "text-rose-600",   badge: "bg-rose-500",   border: "border-rose-200"   },
  "B+":  { bg: "bg-amber-50",  text: "text-amber-600",  badge: "bg-amber-500",  border: "border-amber-200"  },
  "B-":  { bg: "bg-amber-50",  text: "text-amber-600",  badge: "bg-amber-500",  border: "border-amber-200"  },
  "O+":  { bg: "bg-blue-50",   text: "text-blue-600",   badge: "bg-blue-500",   border: "border-blue-200"   },
  "O-":  { bg: "bg-blue-50",   text: "text-blue-600",   badge: "bg-blue-500",   border: "border-blue-200"   },
  "AB+": { bg: "bg-violet-50", text: "text-violet-600", badge: "bg-violet-500", border: "border-violet-200" },
  "AB-": { bg: "bg-violet-50", text: "text-violet-600", badge: "bg-violet-500", border: "border-violet-200" },
};

// ── Animation variants ────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.38, ease: "easeOut" } },
};

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.08 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  show:   { opacity: 1, y: 0,  scale: 1, transition: { duration: 0.35, ease: "easeOut" } },
};

// ── Select field ──────────────────────────────────────────────────────────────

function SelectField({ label, value, onChange, placeholder, children, disabled }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold uppercase tracking-widest text-[var(--pl-ink-soft)]">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="w-full appearance-none rounded-xl border border-[var(--pl-border)] bg-[var(--pl-bg)] px-4 py-3 pr-10 text-sm font-medium text-[var(--pl-ink)] outline-none transition-all
            focus:border-[var(--pl-primary)] focus:ring-2 focus:ring-[var(--pl-primary)]/15
            disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">{placeholder}</option>
          {children}
        </select>
        {/* chevron */}
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--pl-ink-soft)]">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </div>
  );
}

// ── Donor card ────────────────────────────────────────────────────────────────

function DonorCard({ donor, index }) {
  const bgStyle = BG_STYLE[donor.bloodGroup] ?? BG_STYLE["O+"];

  return (
    <motion.div
      variants={cardVariant}
      whileHover={{ y: -4, transition: { duration: 0.18 } }}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-[var(--pl-border)] bg-[var(--pl-bg)] shadow-sm transition-shadow hover:shadow-md"
    >
      {/* Tinted top */}
      <div className={`relative flex flex-col items-center gap-3 px-5 pt-6 pb-5 ${bgStyle.bg}`}>
        {/* Avatar */}
        <div className="relative">
          {donor.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={donor.image}
              alt={donor.name}
              className="h-16 w-16 rounded-full object-cover ring-4 ring-white shadow-sm"
            />
          ) : (
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white ring-4 ring-white shadow-sm">
              <Person className={`h-8 w-8 ${bgStyle.text}`} />
            </span>
          )}
          {/* Blood group dot badge */}
          <span className={`absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full ${bgStyle.badge} text-[10px] font-black text-white shadow`}>
            {donor.bloodGroup}
          </span>
        </div>

        {/* Name */}
        <div className="text-center">
          <h3
            className="text-base font-bold text-[var(--pl-ink)]"
            style={{ fontFamily: "var(--pl-font-display)" }}
          >
            {donor.name}
          </h3>
          <p className={`mt-0.5 text-[11px] font-bold uppercase tracking-widest ${bgStyle.text}`}>
            Blood Donor
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 px-5 py-4">
        <div className="h-px bg-[var(--pl-border)]" />

        <div className="flex flex-col gap-2.5">
          {/* Location */}
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--pl-surface)]">
              <MapPin className="h-3.5 w-3.5 text-[var(--pl-primary)]" />
            </span>
            <span className="text-sm text-[var(--pl-ink-soft)] truncate">
              {donor.upazila}, {donor.district}
            </span>
          </div>

          {/* Email */}
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--pl-surface)]">
              <Mail className="h-3.5 w-3.5 text-[var(--pl-primary)]" />
            </span>
            <span className="text-sm text-[var(--pl-ink-soft)] truncate">
              {donor.email}
            </span>
          </div>
        </div>

        {/* Blood group pill */}
        <div className="mt-auto pt-1">
          <span className={`inline-flex items-center gap-1.5 rounded-2xl border px-3 py-1.5 text-xs font-bold ${bgStyle.bg} ${bgStyle.text} ${bgStyle.border}`}>
            <Droplet className="h-3 w-3" />
            {donor.bloodGroup} Blood Group
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ── Empty / idle states ───────────────────────────────────────────────────────

function IdleState() {
  return (
    <motion.div
      key="idle"
      variants={fadeUp}
      initial="hidden"
      animate="show"
      className="flex flex-col items-center gap-4 py-20 text-center"
    >
      <motion.span
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--pl-surface)]"
      >
        <HeartPulse className="h-8 w-8 text-[var(--pl-primary)]" />
      </motion.span>
      <div>
        <p className="text-lg font-bold text-[var(--pl-ink)]" style={{ fontFamily: "var(--pl-font-display)" }}>
          Find a Blood Donor
        </p>
        <p className="mt-1 text-sm text-[var(--pl-ink-soft)]">
          Fill in the form above and hit Search to see available donors.
        </p>
      </div>
    </motion.div>
  );
}

function EmptyState({ bloodGroup, district, upazila }) {
  const bgStyle = BG_STYLE[bloodGroup] ?? BG_STYLE["O+"];
  return (
    <motion.div
      key="empty"
      variants={fadeUp}
      initial="hidden"
      animate="show"
      className="flex flex-col items-center gap-4 py-20 text-center"
    >
      <span className={`flex h-16 w-16 items-center justify-center rounded-2xl ${bgStyle.bg}`}>
        <Users className={`h-8 w-8 ${bgStyle.text}`} />
      </span>
      <div>
        <p className="text-lg font-bold text-[var(--pl-ink)]" style={{ fontFamily: "var(--pl-font-display)" }}>
          No donors found
        </p>
        <p className="mt-1 text-sm text-[var(--pl-ink-soft)]">
          No active <span className={`font-bold ${bgStyle.text}`}>{bloodGroup}</span> donors in{" "}
          <span className="font-semibold text-[var(--pl-ink)]">{upazila}, {district}</span> right now.
          Try a different location.
        </p>
      </div>
    </motion.div>
  );
}

// ── Main client component ─────────────────────────────────────────────────────

export function SearchClient({ initialDonors, initialParams }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [bloodGroup, setBloodGroup] = useState(initialParams?.bloodGroup ?? "");
  const [districtId, setDistrictId] = useState(() => {
    if (!initialParams?.district) return "";
    return districts.find((d) => d.name === initialParams.district)?.id ?? "";
  });
  const [districtName, setDistrictName] = useState(initialParams?.district ?? "");
  const [upazilaId, setUpazilaId]       = useState(() => {
    if (!initialParams?.upazila) return "";
    return upazilas.find((u) => u.name === initialParams.upazila)?.id ?? "";
  });
  const [upazilaName, setUpazilaName]   = useState(initialParams?.upazila ?? "");

  const [donors, setDonors]       = useState(initialDonors);
  const [searched, setSearched]   = useState(initialDonors !== null);
  const [lastParams, setLastParams] = useState(initialParams ?? {});

  const availableUpazilas = districtId
    ? upazilas.filter((u) => String(u.district_id) === String(districtId))
    : [];

  function handleDistrictChange(id) {
    setDistrictId(id);
    const d = districts.find((d) => d.id === id);
    setDistrictName(d?.name ?? "");
    setUpazilaId("");
    setUpazilaName("");
  }

  function handleUpazilaChange(id) {
    setUpazilaId(id);
    const u = upazilas.find((u) => u.id === id);
    setUpazilaName(u?.name ?? "");
  }

  async function handleSearch(e) {
    e.preventDefault();
    if (!bloodGroup || !districtName || !upazilaName) return;

    // Update URL without navigation
    const params = new URLSearchParams({ bloodGroup, district: districtName, upazila: upazilaName });
    router.replace(`/search?${params.toString()}`, { scroll: false });

    startTransition(async () => {
      const results = await searchDonors({
        bloodGroup,
        district: districtName,
        upazila:  upazilaName,
      });
      setDonors(results);
      setSearched(true);
      setLastParams({ bloodGroup, district: districtName, upazila: upazilaName });
    });
  }

  const isFormValid = bloodGroup && districtId && upazilaId;

  return (
    <div className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl ">

      {/* ── Page header ── */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="mb-10 text-center"
      >
        <motion.span
          variants={fadeUp}
          className="mb-3 inline-flex items-center gap-2 rounded-full bg-[var(--pl-surface)] px-4 py-1.5 text-sm font-semibold text-[var(--pl-primary)]"
        >
          <HeartHandshake className="h-3.5 w-3.5" />
          Donor Directory
        </motion.span>

        <motion.h1
          variants={fadeUp}
          className="text-3xl font-black tracking-tight text-[var(--pl-ink)] sm:text-4xl"
          style={{ fontFamily: "var(--pl-font-display)" }}
        >
          Find a{" "}
          <span className="text-[var(--pl-accent)]">Blood Donor</span>
        </motion.h1>

        <motion.p variants={fadeUp} className="mt-3 text-base text-[var(--pl-ink-soft)]">
          Search for available donors by blood group and location.
        </motion.p>
      </motion.div>

      {/* ── Search form card ── */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1, ease: "easeOut" }}
        className="mb-10 overflow-hidden rounded-3xl border border-[var(--pl-border)] bg-[var(--pl-bg)] shadow-sm"
      >
        {/* Card top bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[var(--pl-primary)] via-[var(--pl-accent)] to-[var(--pl-primary-light)]" />

        <div className="p-6 sm:p-8">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--pl-primary)]/10">
              <Search className="h-4 w-4 text-[var(--pl-primary)]" />
            </span>
            <div>
              <h2 className="text-base font-bold text-[var(--pl-ink)]"
                style={{ fontFamily: "var(--pl-font-display)" }}>
                Search Filters
              </h2>
              <p className="text-xs text-[var(--pl-ink-soft)]">
                All three fields are required
              </p>
            </div>
          </div>

          <form onSubmit={handleSearch}>
            <div className="grid gap-4 sm:grid-cols-3">
              {/* Blood group */}
              <SelectField
                label="Blood Group"
                value={bloodGroup}
                onChange={setBloodGroup}
                placeholder="Select blood group"
              >
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </SelectField>

              {/* District */}
              <SelectField
                label="District"
                value={districtId}
                onChange={handleDistrictChange}
                placeholder="Select district"
              >
                {sortedDistricts.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </SelectField>

              {/* Upazila */}
              <SelectField
                label="Upazila"
                value={upazilaId}
                onChange={handleUpazilaChange}
                placeholder={districtId ? "Select upazila" : "Pick district first"}
                disabled={!districtId}
              >
                {availableUpazilas.map((u) => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </SelectField>
            </div>

            {/* Submit */}
            <div className="mt-5 flex justify-end">
              <motion.button
                type="submit"
                disabled={!isFormValid || isPending}
                whileHover={isFormValid && !isPending ? { scale: 1.03 } : {}}
                whileTap={isFormValid && !isPending ? { scale: 0.97 } : {}}
                className="flex items-center gap-2.5 rounded-2xl bg-[var(--pl-primary)] px-8 py-3 text-sm font-bold text-white shadow-sm transition-all
                  hover:bg-[var(--pl-primary-light)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Searching…
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    Search Donors
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>

      {/* ── Results area ── */}
      <AnimatePresence mode="wait">
        {isPending ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-4 py-20"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[var(--pl-border)] border-t-[var(--pl-primary)]"
            />
            <p className="text-sm font-medium text-[var(--pl-ink-soft)]">Finding donors…</p>
          </motion.div>

        ) : !searched ? (
          <IdleState key="idle" />

        ) : donors?.length === 0 ? (
          <EmptyState
            key="empty"
            bloodGroup={lastParams.bloodGroup}
            district={lastParams.district}
            upazila={lastParams.upazila}
          />

        ) : (
          <motion.div key="results" variants={stagger} initial="hidden" animate="show">
            {/* Result count */}
            <motion.div variants={fadeUp} className="mb-5 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--pl-surface)]">
                <Users className="h-3.5 w-3.5 text-[var(--pl-primary)]" />
              </span>
              <p className="text-sm text-[var(--pl-ink-soft)]">
                Found{" "}
                <span className="font-bold text-[var(--pl-ink)]">{donors.length}</span>{" "}
                donor{donors.length !== 1 ? "s" : ""} in{" "}
                <span className="font-semibold text-[var(--pl-ink)]">
                  {lastParams.upazila}, {lastParams.district}
                </span>{" "}
                with{" "}
                <span className="font-bold text-[var(--pl-accent)]">{lastParams.bloodGroup}</span>{" "}
                blood
              </p>
            </motion.div>

            {/* Cards grid */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {donors.map((donor, i) => (
                <DonorCard key={donor._id ?? i} donor={donor} index={i} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}