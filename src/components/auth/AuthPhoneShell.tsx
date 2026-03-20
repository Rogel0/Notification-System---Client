import React from "react";
import { Link } from "react-router-dom";

type AuthPhoneShellProps = {
  modeLabel: string;
  switchLabel: string;
  switchTo: string;
  heroTitle: string;
  heroSubtitle: string;
  cardTitle: string;
  cardSubtitle: string;
  submitLabel: string;
  socialLabel?: string;
  brandName?: string;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
  error?: string;
  success?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

function GoogleButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
        <path
          fill="#EA4335"
          d="M12 10.2v3.9h5.4c-.2 1.3-1.5 3.9-5.4 3.9-3.2 0-5.9-2.7-5.9-6s2.7-6 5.9-6c1.8 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3.4 14.6 2.5 12 2.5A9.5 9.5 0 0 0 2.5 12 9.5 9.5 0 0 0 12 21.5c5.5 0 9.1-3.8 9.1-9.1 0-.6-.1-1.1-.2-1.6H12Z"
        />
        <path
          fill="#34A853"
          d="M2.5 7.6 5.7 10a5.7 5.7 0 0 1 0 4l-3.2 2.4A9.5 9.5 0 0 1 2.5 7.6Z"
        />
        <path
          fill="#FBBC05"
          d="M12 21.5c2.6 0 4.8-.9 6.4-2.4l-3.1-2.4c-.8.6-1.8 1-3.3 1a5.9 5.9 0 0 1-5.6-4l-3.3 2.5A9.5 9.5 0 0 0 12 21.5Z"
        />
        <path
          fill="#4285F4"
          d="M21.1 12.4c0-.7-.1-1.2-.2-1.8H12v3.9h5.1c-.3 1.5-1.1 2.6-1.8 3.2l3.1 2.4c1.8-1.7 2.7-4.1 2.7-7.7Z"
        />
      </svg>
      <span>{label}</span>
    </button>
  );
}

function SparkIcon() {
  return (
    <svg
      viewBox="0 0 96 96"
      aria-hidden="true"
      className="h-12 w-12 text-white sm:h-16 sm:w-16"
    >
      <g fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round">
        <path d="M48 8v26" />
        <path d="M48 62v26" />
        <path d="M8 48h26" />
        <path d="M62 48h26" />
        <path d="M20.6 20.6 39 39" />
        <path d="M57 57l18.4 18.4" />
        <path d="M20.6 75.4 39 57" />
        <path d="M57 39l18.4-18.4" />
      </g>
    </svg>
  );
}

export function AuthPhoneShell({
  modeLabel,
  switchLabel,
  switchTo,
  heroTitle,
  heroSubtitle,
  cardTitle,
  cardSubtitle,
  submitLabel,
  socialLabel = "Login with Google",
  brandName,
  onSubmit,
  error,
  success,
  children,
  footer,
}: AuthPhoneShellProps) {
  const appBrand = brandName || heroTitle.replace(/^Hello\s+/i, "").replace(/!+$/, "");

  return (
    <div className="min-h-screen w-full bg-[#f8f8f9]">
      <div className="grid min-h-screen w-full lg:grid-cols-[58%_42%]">
        <section className="relative overflow-hidden bg-gradient-to-br from-[#2d2ddf] via-[#1d26c8] to-[#141a98] px-8 py-10 text-white sm:px-12 sm:py-14 lg:px-16 lg:py-16">
          <div
            className="pointer-events-none absolute inset-0 opacity-45"
            style={{
              backgroundImage:
                "repeating-radial-gradient(circle at 25% 85%, rgba(255,255,255,0.16) 0 2px, transparent 2px 56px)",
            }}
          />
          <div className="relative flex h-full flex-col">
            <div>
              <SparkIcon />
            </div>

            <div className="mt-10 max-w-lg sm:mt-14 lg:mt-16">
              <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
                {heroTitle}
              </h1>
              <p className="mt-6 text-base leading-8 text-white/85 sm:text-[1.08rem]">
                {heroSubtitle}
              </p>
            </div>

            <p className="mt-12 text-sm text-white/70 sm:mt-auto">
              &copy; 2026 {appBrand}. All rights reserved.
            </p>
          </div>
        </section>

        <section className="flex items-center bg-[#f8f8f9] px-6 py-10 sm:px-12 lg:px-14">
          <div className="mx-auto w-full max-w-[430px]">
            <p className="text-3xl font-semibold tracking-tight text-slate-900">
              {appBrand}
            </p>

            <div className="mt-10">
              <h2 className="text-4xl font-bold tracking-tight text-slate-900">
                {cardTitle}
              </h2>
              <p className="mt-2 text-sm text-slate-500">{cardSubtitle}</p>
              <div className="mt-2 text-xs text-slate-500">
                {modeLabel}{" "}
                <Link
                  to={switchTo}
                  className="font-semibold text-slate-800 underline-offset-2 transition hover:underline"
                >
                  {switchLabel}
                </Link>
              </div>
            </div>

            <form onSubmit={onSubmit} className="mt-10 space-y-5">
              {children}

              {error ? (
                <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
                  {error}
                </div>
              ) : null}

              {success ? (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-600">
                  {success}
                </div>
              ) : null}

              <button
                type="submit"
                className="h-12 w-full rounded-lg bg-[#14161f] text-sm font-semibold text-white transition hover:bg-black"
              >
                {submitLabel}
              </button>
            </form>

            <div className="mt-4">
              <GoogleButton label={socialLabel} />
            </div>

            {footer ? <div className="mt-4">{footer}</div> : null}
          </div>
        </section>
      </div>
    </div>
  );
}
