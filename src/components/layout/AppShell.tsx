import * as React from 'react'
import { NavLink } from 'react-router-dom'

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ')
}

function HeaderLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cx(
          'rounded-xl px-3 py-2 text-sm font-medium transition',
          'hover:bg-slate-100',
          isActive ? 'bg-slate-100 text-slate-900' : 'text-slate-700',
        )
      }
    >
      {children}
    </NavLink>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white">
      <header className="sticky top-0 z-10 border-b border-slate-200/70 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <NavLink to="/login" className="group flex items-center gap-2 rounded-xl px-2 py-1 hover:bg-slate-100">
            <div className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-sm">
              <span className="text-sm font-black">S</span>
            </div>
            <div className="leading-tight">
              <div className="text-sm font-bold text-slate-900">SalesPilot</div>
              <div className="text-xs text-slate-500">Register & login</div>
            </div>
          </NavLink>

          <nav className="flex items-center gap-1">
            <HeaderLink to="/register">Register</HeaderLink>
            <HeaderLink to="/login">Login</HeaderLink>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 py-10 lg:py-14">{children}</main>

      <footer className="border-t border-slate-200/70 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-6 text-xs text-slate-500">
          <span>&copy; {new Date().getFullYear()} SalesPilot</span>
        </div>
      </footer>
    </div>
  )
}
