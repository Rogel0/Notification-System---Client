import * as React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function HeaderLink({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cx(
          "rounded-xl px-3 py-2 text-sm font-medium transition",
          "hover:bg-slate-100",
          isActive ? "bg-slate-100 text-slate-900" : "text-slate-700",
        )
      }
    >
      {children}
    </NavLink>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] bg-gradient-to-b from-slate-50 via-white to-white">
      <header className=" border-b border-slate-200/70 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <NavLink
            to="/login"
            className="group flex items-center gap-2 rounded-xl px-2 py-1 hover:bg-slate-100"
          >
            <div className="leading-tight">
              <div className="text-sm font-bold text-slate-900">
                Omega Notification System
              </div>
              <div className="text-xs text-slate-500">Register & login</div>
            </div>
          </NavLink>

          <nav className="flex items-center gap-1">
            {!loading && !isAuthenticated && (
              <>
                <HeaderLink to="/register">Register</HeaderLink>
                <HeaderLink to="/login">Login</HeaderLink>
              </>
            )}

            {!loading && isAuthenticated && (
              <>
                <HeaderLink to="/dashboard">Dashboard</HeaderLink>
                <HeaderLink to="/calendar">Calendar</HeaderLink>
                <HeaderLink to="/profile">Profile</HeaderLink>
                <button
                  onClick={async () => {
                    await logout();
                    navigate("/login");
                    window.location.reload();
                  }}
                  className="rounded-xl px-3 py-2 text-sm font-medium transition hover:bg-slate-100 text-slate-700"
                >
                  Logout
                </button>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="w-full py-10 lg:py-0">{children}</main>

      {/* <footer className="border-t border-slate-200/70 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-6 text-xs text-slate-500">
          <span>
            &copy; {new Date().getFullYear()} Omega Notification System
          </span>
        </div>
      </footer> */}
    </div>
  );
}
