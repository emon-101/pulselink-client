import Link from "next/link";
import { Heart, Mail, Phone, MapPin } from "lucide-react";

/**
 * PulseLink Footer
 * Uses the new X logo per the brief (not the legacy bird) and groups
 * useful links by what a visitor is actually trying to do.
 */
const linkGroups = [
  {
    title: "Platform",
    links: [
      { label: "Donation Requests", href: "/donation-requests" },
      { label: "Search Donors", href: "/search" },
      { label: "Join as a Donor", href: "/register" },
      { label: "Funding", href: "/funding" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About PulseLink", href: "/about" },
      { label: "Contact Us", href: "/#contact" },
      { label: "How it Works", href: "/#how-it-works" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-[var(--pl-border)] bg-[var(--pl-ink)]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--pl-primary)]">
                <Heart className="h-4.5 w-4.5 text-white" fill="currentColor" strokeWidth={2.5} />
              </span>
              <span className="font-[var(--pl-font-display)] text-lg font-bold text-white">
                Pulse<span className="text-[var(--pl-accent-light)]">Link</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/50">
              Every beat counts. PulseLink links willing donors to the people
              who need them most — one bridge, one life at a time.
            </p>

            <div className="mt-6 flex flex-col gap-2.5 text-sm text-white/60">
              <a href="tel:+8801234567890" className="flex items-center gap-2 hover:text-white">
                <Phone className="h-3.5 w-3.5" /> +880 123-456-7890
              </a>
              <a href="mailto:hello@pulselink.app" className="flex items-center gap-2 hover:text-white">
                <Mail className="h-3.5 w-3.5" /> hello@pulselink.app
              </a>
              <span className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5" /> Dhaka, Bangladesh
              </span>
            </div>
          </div>

          {/* Link groups */}
          {linkGroups.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold text-white">{group.title}</h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col-reverse items-center gap-4 border-t border-white/10 pt-8 sm:flex-row sm:justify-between">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} PulseLink. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <SocialIcon href="https://x.com" label="X">
              {/* New X logo, not the legacy Twitter bird */}
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </SocialIcon>
            <SocialIcon href="https://facebook.com" label="Facebook">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.84c0-2.5 1.49-3.89 3.78-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94z" />
              </svg>
            </SocialIcon>
            <SocialIcon href="https://instagram.com" label="Instagram">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                <path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85C2.38 3.9 3.9 2.38 7.15 2.23 8.42 2.17 8.8 2.16 12 2.16zm0 1.8c-3.15 0-3.5.01-4.74.07-2.43.11-3.5 1.2-3.61 3.61-.06 1.24-.07 1.59-.07 4.74s.01 3.5.07 4.74c.11 2.41 1.18 3.5 3.61 3.61 1.24.06 1.59.07 4.74.07s3.5-.01 4.74-.07c2.42-.11 3.5-1.2 3.61-3.61.06-1.24.07-1.59.07-4.74s-.01-3.5-.07-4.74c-.11-2.41-1.19-3.5-3.61-3.61-1.24-.06-1.59-.07-4.74-.07zM12 7a5 5 0 110 10 5 5 0 010-10zm0 1.8a3.2 3.2 0 100 6.4 3.2 3.2 0 000-6.4zm5.4-2.7a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
              </svg>
            </SocialIcon>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ href, label, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
    >
      {children}
    </a>
  );
}