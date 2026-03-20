import * as React from 'react'
import { Card } from '../ui/Card'

export function AuthLayout({
  title,
  subtitle,
  children,
  belowCard,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
  belowCard?: React.ReactNode
}) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-24 -top-24 size-72 rounded-full bg-blue-200/40 blur-3xl" />
        <div className="absolute -right-24 -top-16 size-72 rounded-full bg-indigo-200/40 blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 size-72 rounded-full bg-sky-200/30 blur-3xl" />
      </div>

      <div className="mx-auto grid w-full max-w-5xl items-center gap-6 lg:grid-cols-2 lg:gap-10">
        <div className="hidden lg:block">
          <Card className="relative overflow-hidden p-8">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-sky-500 opacity-90" />
            <div className="relative space-y-4 text-white">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">
                <span className="size-1.5 rounded-full bg-white" />
                Secure authentication
              </div>
              <h2 className="text-pretty text-3xl font-extrabold tracking-tight">
                Keep it simple.
              </h2>
              <p className="text-pretty text-sm text-white/90">
                A clean Register/Login experience with accessible forms, clear errors,
                and consistent styling.
              </p>
              <div className="grid gap-3 pt-2 text-sm text-white/95">
                <div className="flex items-start gap-2">
                  <span className="mt-1 inline-block size-2 rounded-full bg-white/90" />
                  <span>Polished UI with Tailwind v4</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 inline-block size-2 rounded-full bg-white/90" />
                  <span>Keyboard-friendly focus rings</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 inline-block size-2 rounded-full bg-white/90" />
                  <span>Inline validation + loading states</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="mx-auto w-full max-w-md">
          <div className="mb-5 space-y-1 text-center lg:text-left">
            <h1 className="text-balance text-3xl font-extrabold tracking-tight text-slate-900">
              {title}
            </h1>
            {subtitle ? <p className="text-sm text-slate-600">{subtitle}</p> : null}
          </div>

          <Card className="p-6 shadow-md shadow-slate-900/5">{children}</Card>

          {belowCard ? <div className="pt-4">{belowCard}</div> : null}
        </div>
      </div>
    </div>
  )
}

