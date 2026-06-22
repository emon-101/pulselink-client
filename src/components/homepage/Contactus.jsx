"use client";

import { useState } from "react";
import {
  Form,
  TextField,
  TextArea,
  Label,
  Input,
  FieldError,
  Button,
} from "@heroui/react";
import { Phone, Mail, MapPin, Send } from "lucide-react";

/**
 * PulseLink Contact Us section
 * Two-column: contact form (HeroUI Form/TextField) + direct contact details.
 */
export default function ContactUs() {
  const [status, setStatus] = useState("idle"); // idle | sending | sent

  function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");

    // Replace with real submit logic (API route / email service)
    setTimeout(() => {
      setStatus("sent");
    }, 900);
  }

  return (
    <section className="bg-[var(--pl-surface)] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-5">
          {/* Left: copy + direct contact */}
          <div className="lg:col-span-2">
            <span className="text-sm font-semibold uppercase tracking-wide text-[var(--pl-primary)]">
              Get in touch
            </span>
            <h2 className="mt-3 font-[var(--pl-font-display)] text-3xl font-bold tracking-tight text-[var(--pl-ink)] sm:text-4xl">
              Questions before you join the pulse?
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[var(--pl-ink-soft)]">
              Whether you&#39;re a hospital, an organizer, or a first-time donor —
              reach out and a real person on our team will get back to you.
            </p>

            <div className="mt-8 flex flex-col gap-4">
              <a
                href="tel:+8801234567890"
                className="flex items-center gap-3 text-sm font-medium text-[var(--pl-ink)] transition-colors hover:text-[var(--pl-primary)]"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--pl-bg)]">
                  <Phone className="h-4 w-4 text-[var(--pl-primary)]" />
                </span>
                +880 123-456-7890
              </a>
              <a
                href="mailto:hello@pulselink.app"
                className="flex items-center gap-3 text-sm font-medium text-[var(--pl-ink)] transition-colors hover:text-[var(--pl-primary)]"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--pl-bg)]">
                  <Mail className="h-4 w-4 text-[var(--pl-primary)]" />
                </span>
                hello@pulselink.app
              </a>
              <div className="flex items-center gap-3 text-sm font-medium text-[var(--pl-ink)]">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--pl-bg)]">
                  <MapPin className="h-4 w-4 text-[var(--pl-primary)]" />
                </span>
                Dhaka, Bangladesh
              </div>
            </div>
          </div>

          {/* Right: form */}
          <div className="lg:col-span-3">
            <Form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-[var(--pl-border)] bg-[var(--pl-bg)] p-6 sm:p-8"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <TextField name="name" isRequired className="flex flex-col gap-1.5">
                  <Label className="text-sm font-medium text-[var(--pl-ink)]">
                    Name
                  </Label>
                  <Input
                    placeholder="Your full name"
                    className="rounded-lg border border-[var(--pl-border)] bg-[var(--pl-surface)] px-3.5 py-2.5 text-sm text-[var(--pl-ink)] outline-none transition-colors focus:border-[var(--pl-primary)] focus:ring-2 focus:ring-[var(--pl-primary)]/20"
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
                    className="rounded-lg border border-[var(--pl-border)] bg-[var(--pl-surface)] px-3.5 py-2.5 text-sm text-[var(--pl-ink)] outline-none transition-colors focus:border-[var(--pl-primary)] focus:ring-2 focus:ring-[var(--pl-primary)]/20"
                  />
                  <FieldError className="text-xs text-[var(--pl-danger)]" />
                </TextField>
              </div>

              <TextField
                name="message"
                isRequired
                className="mt-5 flex flex-col gap-1.5"
              >
                <Label className="text-sm font-medium text-[var(--pl-ink)]">
                  Message
                </Label>
                <TextArea
                  placeholder="Tell us what you need..."
                  rows={5}
                  className="rounded-lg border border-[var(--pl-border)] bg-[var(--pl-surface)] px-3.5 py-2.5 text-sm text-[var(--pl-ink)] outline-none transition-colors focus:border-[var(--pl-primary)] focus:ring-2 focus:ring-[var(--pl-primary)]/20"
                />
                <FieldError className="text-xs text-[var(--pl-danger)]" />
              </TextField>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isDisabled={status === "sending"}
                className="mt-6 w-full gap-2 sm:w-auto"
              >
                {status === "sending" ? (
                  "Sending..."
                ) : status === "sent" ? (
                  "Message sent ✓"
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send message
                  </>
                )}
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
}