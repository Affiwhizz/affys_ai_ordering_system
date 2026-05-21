"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, ArrowLeft, AlertTriangle, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

/**
 * Admin sign-in page — magic-link only.
 *
 * Flow:
 *   1. Staff enters their email.
 *   2. Supabase sends a one-time sign-in link.
 *   3. Click the link → /admin/auth/callback exchanges the code → /admin.
 *
 * The middleware further checks the user has an active staff_users row;
 * if not, it redirects back here with `?error=not-staff`.
 *
 * The form reads search params (?next, ?error), so it must be wrapped in a
 * Suspense boundary — Next.js requires this for the production build.
 */

export default function AdminLogin() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-cream">
          <span className="text-sm text-foreground-muted">Loading…</span>
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}

function AdminLoginForm() {
  const params = useSearchParams();
  const nextPath = params.get("next") ?? "/admin";
  const errorParam = params.get("error");
  // Some Supabase URL configs deliver the sign-in `code` straight to the Site
  // URL (here) rather than the callback route. When we see one, complete the
  // sign-in right here — exactly once — then hard-redirect so the server picks
  // up the new session cookie. detectSessionInUrl is disabled on the client so
  // nothing else races us for this single-use code.
  const codeParam = params.get("code");

  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!codeParam) return;
    let cancelled = false;
    (async () => {
      const supabase = createClient();
      const { error: exchangeErr } =
        await supabase.auth.exchangeCodeForSession(codeParam);
      if (cancelled) return;
      if (exchangeErr) {
        window.location.replace("/admin/login?error=callback-failed");
        return;
      }
      // Full reload so the server (proxy) sees the freshly-set session cookie.
      window.location.replace(nextPath);
    })();
    return () => {
      cancelled = true;
    };
  }, [codeParam, nextPath]);

  if (codeParam) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <span className="text-sm text-foreground-muted">Signing you in…</span>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSending(true);

    const supabase = createClient();
    const redirectTo = `${window.location.origin}/admin/auth/callback?next=${encodeURIComponent(nextPath)}`;

    const { error: signInError } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: redirectTo },
    });

    setSending(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }
    setSent(true);
  };

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <div className="container-x flex flex-1 items-center justify-center py-16">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.22em] text-foreground-subtle transition-colors hover:text-espresso"
          >
            <ArrowLeft size={12} />
            Back to Affy&rsquo;s
          </Link>

          <div className="rounded-2xl border border-border bg-white p-8 shadow-luxe">
            {/* Brand mark */}
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-espresso text-gold font-display text-lg font-bold">
                A
              </span>
              <div className="flex flex-col leading-none">
                <span className="font-display text-base font-semibold text-espresso">Affy&rsquo;s</span>
                <span className="mt-1 text-[9px] uppercase tracking-[0.22em] text-foreground-subtle">Admin</span>
              </div>
            </div>

            <h1 className="mt-6 font-display text-2xl font-medium tracking-tight text-espresso">
              Sign in
            </h1>
            <p className="mt-2 text-sm text-foreground-muted">
              We&rsquo;ll send a one-time sign-in link to your email. No
              password to remember.
            </p>

            {/* Error from proxy (not-staff) */}
            {errorParam === "not-staff" && (
              <div className="mt-5 flex items-start gap-3 rounded-xl border border-red/30 bg-red/5 p-4">
                <AlertTriangle size={16} className="mt-0.5 shrink-0 text-red" />
                <div className="text-sm">
                  <p className="font-semibold text-espresso">Not authorized</p>
                  <p className="mt-0.5 text-foreground-muted">
                    Your email signed in, but you&rsquo;re not a registered staff member yet.
                    Ask the owner to add you, then try again.
                  </p>
                </div>
              </div>
            )}

            {/* Error from proxy / callback (config, auth, or code-exchange failure) */}
            {(errorParam === "not-configured" ||
              errorParam === "auth-error" ||
              errorParam === "callback-failed") && (
              <div className="mt-5 flex items-start gap-3 rounded-xl border border-red/30 bg-red/5 p-4">
                <AlertTriangle size={16} className="mt-0.5 shrink-0 text-red" />
                <div className="text-sm">
                  <p className="font-semibold text-espresso">Sign-in unavailable</p>
                  <p className="mt-0.5 text-foreground-muted">
                    {errorParam === "not-configured"
                      ? "The admin isn’t connected to its database yet. Check that the Supabase keys are set in the hosting environment."
                      : errorParam === "callback-failed"
                        ? "That sign-in link couldn’t be completed — it may have expired or already been used. Please request a fresh link below, and open it in this same browser."
                        : "We couldn’t reach the sign-in service just now. Please try again in a moment."}
                  </p>
                </div>
              </div>
            )}

            {sent ? (
              <div className="mt-6 flex items-start gap-3 rounded-xl border border-forest/30 bg-forest/5 p-4">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-forest" />
                <div className="text-sm">
                  <p className="font-semibold text-espresso">Check your email</p>
                  <p className="mt-0.5 text-foreground-muted">
                    We sent a sign-in link to <strong>{email}</strong>. Click it to
                    continue. The link expires in 60 minutes.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSent(false);
                      setEmail("");
                    }}
                    className="mt-3 text-xs font-semibold text-espresso underline decoration-gold underline-offset-4 hover:text-red"
                  >
                    Use a different email
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-foreground-subtle">
                    Email
                  </label>
                  <div className="mt-1 flex items-center gap-2 rounded-lg border border-border bg-cream px-3 py-2.5 focus-within:border-espresso">
                    <Mail size={14} className="text-foreground-muted" />
                    <input
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@atasteofaffys.com"
                      className="flex-1 bg-transparent text-sm text-espresso placeholder:text-foreground-subtle focus:outline-none"
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-xs text-red">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={sending || email.trim().length === 0}
                  className={`btn-gold w-full ${
                    sending || email.trim().length === 0
                      ? "cursor-not-allowed opacity-60"
                      : ""
                  }`}
                >
                  {sending ? "Sending…" : "Send sign-in link"}
                </button>
              </form>
            )}

            <p className="mt-6 border-t border-border pt-4 text-[11px] text-foreground-subtle">
              Magic-link sign-in keeps things passwordless and safe. If you
              don&rsquo;t receive the email within 2 minutes, check spam — or
              ask the owner to confirm you&rsquo;re on the staff list.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
