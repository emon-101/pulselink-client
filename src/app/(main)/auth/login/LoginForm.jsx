"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Form,
  TextField,
  Input,
  Label,
  FieldError,
  Checkbox,
  Button,
} from "@heroui/react";
import { Heart, Loader2 } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function LoginForm() {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");
    const rememberMe = formData.get("rememberMe") === "true";

    setIsSubmitting(true);
    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
        rememberMe,
      });

      if (error) {
        setSubmitError(
          error.message || "Couldn't log you in. Check your details and try again."
        );
        return;
      }

      if(data) {
        toast.success("Login Successful!");
        router.push("/dashboard");
      }
    } catch (err) {
      setSubmitError(err.message || "Something went wrong. Try again.");
      toast.error("Login failed!");
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
        className="w-full max-w-md"
      >
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--pl-primary)]">
            <Heart className="h-6 w-6 text-white" fill="currentColor" />
          </span>
          <h1 className="mt-4 font-[var(--pl-font-display)] text-2xl font-bold tracking-tight text-[var(--pl-ink)] sm:text-3xl">
            Welcome back
          </h1>
          <p className="mt-2 max-w-sm text-sm text-[var(--pl-ink-soft)]">
            Log in to PulseLink and pick up right where the pulse left off.
          </p>
        </div>

        <Form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-[var(--pl-border)] bg-[var(--pl-surface)] p-6 sm:p-8"
        >
          <div className="flex flex-col gap-5">
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

            <TextField
              name="password"
              type="password"
              isRequired
              className="flex flex-col gap-1.5"
            >
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-[var(--pl-ink)]">
                  Password
                </Label>
                <a
                  href="/forgot-password"
                  className="text-xs font-medium text-[var(--pl-primary)] hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <Input
                placeholder="Your password"
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
            isDisabled={isSubmitting}
            className="mt-6 w-full gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              "Log in"
            )}
          </Button>

          <p className="mt-4 text-center text-sm text-[var(--pl-ink-soft)]">
            New to PulseLink?{" "}
            <a
              href="/auth/registration"
              className="font-medium text-[var(--pl-primary)] hover:underline"
            >
              Join as a donor
            </a>
          </p>
        </Form>
      </motion.div>
    </div>
  );
}