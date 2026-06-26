# 🩸 PulseLink

**Feel the pulse. Save a life.**

PulseLink is a full-stack blood donation platform that connects donors with people who need them most — built end-to-end with the MERN stack and Next.js, from authentication and role-based dashboards to real-time donation request tracking and JWT-secured APIs.

🔗 **Live Site:** [pulselink-client.vercel.app](https://pulselink-client.vercel.app/)
📦 **Client Repository:** [github.com/emon-101/pulselink-client](https://github.com/emon-101/pulselink-client)

---

## 💡 Why PulseLink?

Most blood donation demos stop at a CRUD form. PulseLink doesn't.

It's a complete, **role-aware ecosystem** — donors, volunteers, and admins each get a tailored dashboard experience with permissions enforced both in the UI *and* on the backend. Every donation request flows through a real lifecycle (`pending → in progress → done/canceled`), donor information is revealed only when it matters, and every private API route is protected by signature-verified JWTs — not just a "logged in" cookie check.

This isn't a tutorial clone. It's architected the way a production app would be.

---

## ✨ Key Features

### 🏠 Public Experience
- **Animated landing page** — pulse-line motif, staggered reveals, and a journey-based "How it Bridges" section instead of generic feature cards
- **Public donation requests feed** — browse every pending request without an account
- **Donation request details** — full recipient info, hospital, urgency message, and a one-click **Donate Now** flow
- **Donor search** — filter active donors by blood group, district, and upazila across all 64 districts and 490+ upazilas of Bangladesh

### 🔐 Authentication & Authorization
- **Better Auth**-powered email/password authentication with custom fields (blood group, district, upazila, role, status)
- **JWT-secured Express API** — every private route verifies a signed token against a JWKS endpoint (`jose` + remote key set), not a shared secret
- **Three distinct roles** — Donor, Volunteer, Admin — each with backend-enforced permissions, not just hidden UI buttons
- **Avatar uploads** via ImgBB, proxied server-side so API keys never touch the client

### 🩺 Donation Request Lifecycle
- Create, edit, and delete requests with full district/upazila cascading selects
- Status pipeline: `pending → inprogress → done / canceled`, with donor contact info revealed only mid-transaction
- **"My Donation Requests"** with live status filtering
- **Donate confirmation modal** that transitions a request from pending to in-progress and records the donor

### 🛠️ Admin & Volunteer Dashboards
- **Role-based sidebar** — color-coded active states, collapsible on mobile via a HeroUI Drawer
- **Live stat cards** — total donors, total requests, total funding
- **Trend chart** — daily / weekly / monthly donation request volume, aggregated server-side with MongoDB's `$dateTrunc`
- **All Users management** — block/unblock, promote to Volunteer or Admin, all via a three-dot action menu
- **All Blood Donation Requests** — admins get full control; volunteers are scoped to status updates only, enforced at the route level
- **Server-side pagination** on every high-volume table — no client-side data dumping

### 💸 Funding
- Support page with live contributor totals and a recent-contributions feed pulled straight from MongoDB
- Built around your own backend record — no third-party payment dependency required to demo the feature

### 🎨 Design System
- Custom Tailwind-based design tokens (`--pl-primary`, `--pl-accent`, `--pl-surface`, etc.) for light/dark theming
- **HeroUI v3** component library throughout — Dropdown, Modal, AlertDialog, Select, Drawer
- **Framer Motion** micro-interactions on every page — staggered hero reveals, animated status badges, morphing icons
- Fully responsive, mobile-first dashboard with a persistent sidebar on desktop and a slide-out drawer on mobile

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js (App Router), React, Tailwind CSS |
| **UI Components** | HeroUI v3.2.1, Lucide Icons, Gravity UI Icons |
| **Animation** | Framer Motion |
| **Auth** | Better Auth (email/password, custom fields, JWT plugin) |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (native driver, aggregation pipelines) |
| **Security** | JWT verification via `jose` + JWKS, role-based middleware |
| **Charts** | Recharts |
| **Image Hosting** | ImgBB API |
| **Deployment** | Vercel (client), Express server (API) |

---

## 🔒 Security Highlights

This project doesn't stop at "is the user logged in?" — it asks "is this *specific* request authorized to do *this specific* thing?"

- Every mutating API route (`POST` / `PATCH` / `DELETE`) requires a verified JWT, checked against a live JWKS endpoint
- Sensitive routes (`/api/users`, `/api/stats`, `/api/donation-request/trends`) additionally require an `admin` (or `admin`/`volunteer`) role claim — verified server-side, not trusted from the client
- Ownership checks prevent a donor from editing or viewing another donor's private edit page by guessing a URL
- Server actions validate and sanitize amounts, statuses, and IDs before they ever reach the database

---

## 📁 Project Structure (Client)

```
app/
├── (public)/              → Home, donation requests feed, request details
├── login/ register/       → Auth flows
├── funding/                → Public funding/support page
├── dashboard/
│   ├── profile/            → Editable profile with avatar upload
│   ├── create-donation-request/
│   ├── my-donation-requests/[id]/edit/
│   ├── all-users/          → Admin user management
│   └── all-blood-donation-request/  → Admin/volunteer request management
components/
├── dashboard/               → Sidebar, tables, charts, forms
├── funding/
└── homepage/
lib/
├── actions/                 → Server actions (donation requests, users, funding, stats)
└── core/                    → Auth session helpers, API client
```

---

## 🚀 Getting Started

```bash
git clone https://github.com/emon-101/pulselink-client.git
cd pulselink-client
npm install
npm run dev
```

Create a `.env.local` with:

```
MONGO_DB_URI=
AUTH_DB_NAME=
NEXT_PUBLIC_BASE_URL=
NEXT_PUBLIC_BETTER_AUTH_URL=
IMGBB_API_KEY=
NEXT_APP_URL=
```

---

## 👤 Author

**Emon**
🔗 [Live Demo](https://pulselink-client.vercel.app/) · [GitHub](https://github.com/emon-101/pulselink-client)

---

<p align="center">Built with care, one pulse at a time. 🩸</p>