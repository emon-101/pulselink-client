import Link from "next/link";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import { stripe } from "@/lib/stripe";
import { createFundingInfo } from "@/lib/actions/funding";

const FundingSuccessPage = async ({ searchParams }) => {
  const { session_id } = await searchParams;

  let session = null;
  let error = null;

  if (session_id) {
    try {
      session = await stripe.checkout.sessions.retrieve(session_id);
    } catch (err) {
      error = err.message;
    }
  }

  const {
        status,
        customer_details: { email: customerEmail },
        metadata
    } = await stripe.checkout.sessions.retrieve(session_id, {
        expand: ['line_items', 'payment_intent']
    })

    const paymentInfo = {
      email: customerEmail,
      userId: metadata.userId,
      userName: metadata.userName,
      amount: Number(metadata.amount)
    }

    const res = await createFundingInfo(paymentInfo);

    console.log(res);

  const paid = session?.payment_status === "paid";

  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-[var(--pl-bg)] px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-[var(--pl-border)] bg-[var(--pl-surface)] p-8 text-center">
        <span
          className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${
            paid ? "bg-[var(--pl-success)]/10" : "bg-[var(--pl-warning)]/10"
          }`}
        >
          <CheckCircle2
            className={`h-8 w-8 ${
              paid ? "text-[var(--pl-success)]" : "text-[var(--pl-warning)]"
            }`}
          />
        </span>

        <h1 className="mt-5 font-[var(--pl-font-display)] text-2xl font-bold text-[var(--pl-ink)]">
          {paid ? "Thank you for your support!" : "Payment status unknown"}
        </h1>

        <p className="mt-2 text-sm leading-relaxed text-[var(--pl-ink-soft)]">
          {paid
            ? "Your contribution helps keep PulseLink's donor network running for everyone who needs it."
            : error
              ? "We couldn't confirm your payment right now. If you were charged, this is just a display issue — check your email for a receipt from Stripe."
              : "No checkout session was found for this page."}
        </p>

        {session?.customer_details?.email && (
          <p className="mt-3 text-xs text-[var(--pl-ink-soft)]">
            A receipt was sent to {session.customer_details.email}.
          </p>
        )}

        <Link
          href="/funding"
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--pl-primary)] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to funding
        </Link>
      </div>
    </div>
  );
};

export default FundingSuccessPage;