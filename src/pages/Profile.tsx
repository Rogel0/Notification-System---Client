import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";

const Profile: React.FC = () => {
  const [user, setUser] = useState<{ id: number; email: string } | null>(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/profile")
      .then((res) => setUser(res.data))
      .catch(() => setError("Not authenticated"));
  }, []);

  return (
    <div className="min-h-[90vh] bg-gradient-to-br from-slate-100 via-white to-blue-50 px-4 py-10 sm:px-6">
      <div className="mx-auto w-full max-w-4xl">
        <div className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-[0_24px_55px_rgba(25,36,74,0.12)] sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-blue-600">
                Omega Notification System
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                Account Profile
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Manage your identity and review account information.
              </p>
            </div>
            <Link
              to="/dashboard"
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Back to Dashboard
            </Link>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                User ID
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {user ? user.id : "--"}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                Email
              </p>
              <p className="mt-2 break-all text-lg font-semibold text-slate-900">
                {user ? user.email : "--"}
              </p>
            </div>
          </div>

          {!user && error ? (
            <div className="mt-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
              {error}
            </div>
          ) : null}

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/dashboard"
              className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-black"
            >
              View Plans
            </Link>
            <button
              onClick={async () => {
                try {
                  await api.post("/logout");
                } catch (err) {
                  // ignore
                }
                // redirect to login and reload auth state
                navigate("/login");
                window.location.reload();
              }}
              className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
