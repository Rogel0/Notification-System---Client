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

// Minimal layout wrapper — renders children (login/register forms)

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
  const appBrand =
    brandName || heroTitle.replace(/^Hello\s+/i, "").replace(/!+$/, "");

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-600 text-white">
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <rect
                  x="3"
                  y="3"
                  width="8"
                  height="8"
                  rx="1"
                  fill="currentColor"
                />
                <rect
                  x="13"
                  y="3"
                  width="8"
                  height="8"
                  rx="1"
                  fill="currentColor"
                />
                <rect
                  x="3"
                  y="13"
                  width="8"
                  height="8"
                  rx="1"
                  fill="currentColor"
                />
                <rect
                  x="13"
                  y="13"
                  width="8"
                  height="8"
                  rx="1"
                  fill="currentColor"
                />
              </svg>
            </div>
            {appBrand}
          </a>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <form onSubmit={onSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col items-center gap-1 text-center">
                <h1 className="text-2xl font-bold">{cardTitle}</h1>
                <p className="text-sm text-muted-foreground">{cardSubtitle}</p>
              </div>

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

              <div className="flex flex-col gap-2">
                <button
                  type="submit"
                  className="w-full rounded-md bg-indigo-600 px-4 py-3 text-sm font-semibold text-white"
                >
                  {submitLabel}
                </button>
                <div className="text-center text-sm text-muted-foreground">
                  {modeLabel}{" "}
                  <Link to={switchTo} className="font-semibold">
                    {switchLabel}
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="relative hidden bg-muted lg:block">
        <img
          src="/placeholder.svg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
