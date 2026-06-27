"use client";

import { Button, Input, Label, Modal, useOverlayState } from "@heroui/react";
import { HandHeart, ShieldCheck, Heart } from "lucide-react";

/**
 * "Give Fund" button + modal. The donation amount is fixed — it's
 * whatever the Stripe Price (price_1Tlw6IPBTnXkxc2f1CgraS6x) configured
 * in /api/checkout_sessions/route.js is set to charge, not something
 * chosen here. Confirm & Pay is a real form POST (no body needed, since
 * the route doesn't read any form fields) that navigates the browser to
 * /api/checkout_sessions, which creates a Stripe Checkout Session and
 * redirects straight to Stripe's hosted payment page. "Maybe Later"
 * just closes the modal.
 */
export default function FundingGiveButton() {
  const modalState = useOverlayState();

  return (
    <>
      <Button
        variant="primary"
        size="lg"
        className="gap-2"
        onPress={modalState.open}
      >
        <HandHeart className="h-4 w-4" />
        Give Fund
      </Button>

      <Modal state={modalState}>
        <Modal.Backdrop>
          <Modal.Container>
            <Modal.Dialog className="bg-[var(--pl-bg)]">
              <Modal.CloseTrigger onPress={modalState.close} />

              <Modal.Header className="border-b border-[var(--pl-border)] pb-4">
                <Modal.Heading>
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--pl-primary)]/10">
                      <HandHeart className="h-4 w-4 text-[var(--pl-primary)]" />
                    </span>
                    <span className="font-[var(--pl-font-display)] text-lg font-bold text-[var(--pl-ink)]">
                      Support PulseLink
                    </span>
                  </div>
                </Modal.Heading>
              </Modal.Header>

              <Modal.Body className="py-5">
                <div className="flex flex-col gap-4">
                  <p className="text-sm leading-relaxed text-[var(--pl-ink-soft)]">
                    Every contribution helps cover the cost of running PulseLink
                    — hosting, outreach, and keeping the donor network growing
                    across every district.
                  </p>

                  <div className="flex items-start gap-3 rounded-xl bg-[var(--pl-surface)] p-3.5">
                    <Heart
                      className="mt-0.5 h-4 w-4 shrink-0 text-[var(--pl-accent)]"
                      fill="currentColor"
                    />
                    <p className="text-xs text-[var(--pl-ink-soft)]">
                      100% of what you give goes toward keeping the platform
                      free for donors and recipients alike.
                    </p>
                  </div>

                  <div className="flex items-start gap-3 rounded-xl bg-[var(--pl-surface)] p-3.5">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[var(--pl-info)]" />
                    <p className="text-xs text-[var(--pl-ink-soft)]">
                      You&#39;ll be redirected to Stripe&#39;s secure checkout
                      to complete your payment.
                    </p>
                  </div>
                </div>
                <form
                  action="/api/checkout_sessions"
                  method="POST"
                  className="flex flex-col gap-5 border-t border-[var(--pl-border)] pt-4 mt-4"
                >
                  <div className="flex flex-col gap-2 w-full">
                    <Label htmlFor="input-type-number">Donation Amount</Label>
                    <Input
                      name="donation"
                      id="input-type-number"
                      min={0}
                      placeholder="30"
                      type="number"
                      required
                    />
                  </div>
                  <div className="flex gap-4 items-center justify-end">
                    <Button variant="ghost" onPress={modalState.close}>
                      Maybe Later
                    </Button>
                    <Button type="submit" variant="primary" className="gap-2">
                      <HandHeart className="h-4 w-4" />
                      Confirm &amp; Pay
                    </Button>
                  </div>
                </form>
              </Modal.Body>

              <Modal.Footer className="border-t border-[var(--pl-border)] pt-4"></Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </>
  );
}
