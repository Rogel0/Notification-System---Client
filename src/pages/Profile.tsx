import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

const Profile: React.FC = () => {
  const [user, setUser] = useState<
    | {
        id: number;
        email: string;
        name?: string | null;
        phone?: string | null;
        discord_id?: string | null;
        discord_tag?: string | null;
        discord_username?: string | null;
      }
    | null
  >(null);
  const [error, setError] = useState("");

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [discordInput, setDiscordInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [discordNotice, setDiscordNotice] = useState<string | null>(null);

  const profileEndpoints = ["/profile", "/auth/profile"];

  async function fetchProfileWithFallback() {
    let lastError: any = null;
    for (const endpoint of profileEndpoints) {
      try {
        return await api.get(endpoint);
      } catch (err: any) {
        if (err?.response?.status === 404) {
          lastError = err;
          continue;
        }
        throw err;
      }
    }
    throw lastError || new Error("Profile endpoint not found");
  }

  async function saveProfileWithFallback(payload: {
    email: string | null;
    phone: string | null;
    discord_input: string | null;
  }) {
    let lastError: any = null;
    for (const endpoint of profileEndpoints) {
      try {
        return await api.put(endpoint, payload);
      } catch (err: any) {
        if (err?.response?.status === 404) {
          lastError = err;
          continue;
        }
        throw err;
      }
    }
    throw lastError || new Error("Profile update endpoint not found");
  }

  useEffect(() => {
    fetchProfileWithFallback()
      .then((res) => setUser(res.data))
      .catch(() => setError("Not authenticated"));
  }, []);

  useEffect(() => {
    if (user) {
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setDiscordInput(user.discord_id || user.discord_tag || user.discord_username || "");
    }
  }, [user]);

  function validateEmail(e: string) {
    return /^\S+@\S+\.\S+$/.test(e);
  }

  function validatePhone(p: string) {
    return p === "" || /^\+?[0-9]{10,15}$/.test(p);
  }

  function validateDiscord(d: string) {
    if (!d) return true;
    const value = d.trim();
    return (
      /^<@!?\d{17,20}>$/.test(value) ||
      /^\d{17,20}$/.test(value) ||
      /.+#\d{4}$/.test(value) ||
      /^[A-Za-z0-9_.]{2,32}$/.test(value)
    );
  }

  function getDiscordNotice(d: string) {
    const value = d.trim();
    if (!value) return null;
    if (/^<@!?\d{17,20}>$/.test(value) || /^\d{17,20}$/.test(value)) {
      return "Discord ID detected. This is the most reliable option for private bot DMs.";
    }
    if (/.+#\d{4}$/.test(value)) {
      return "Legacy Discord tag detected. This can work, but Discord ID is still more reliable.";
    }
    return "Username-only Discord detected. This may fail unless the bot already shares a server with that account. Prefer Discord ID when possible.";
  }

  async function handleSave() {
    setFormError(null);
    setSuccess(null);
    setDiscordNotice(getDiscordNotice(discordInput));
    if (!validateEmail(email)) return setFormError("Please enter a valid email.");
    if (!validatePhone(phone)) return setFormError("Phone must be E.164 (e.g. +15551234567).");
    if (!validateDiscord(discordInput)) {
      return setFormError(
        "Discord must be a numeric ID, Discord mention, username, or legacy username#1234.",
      );
    }

    setSaving(true);
    try {
      const saveRes = await saveProfileWithFallback({
        email: email || null,
        phone: phone || null,
        discord_input: discordInput || null,
      });

      const changedFields = Array.isArray(saveRes?.data?.changed_fields)
        ? (saveRes.data.changed_fields as string[])
        : [];

      const notificationTest = (saveRes?.data?.notificationTest || {}) as Record<
        string,
        { success?: boolean } | undefined
      >;
      const notifiedChannels = Object.entries(notificationTest)
        .filter(([, value]) => Boolean(value?.success))
        .map(([channel]) => channel.toUpperCase());

      if (changedFields.length === 0) {
        setSuccess(
          "No new changes to save. Your submitted values already match your current profile.",
        );
      } else if (notifiedChannels.length > 0) {
        setSuccess(
          `Profile updated (${changedFields.join(", ")}). Confirmation sent via ${notifiedChannels.join(", ")}. Plan reminders are sent separately.`,
        );
      } else {
        setSuccess(
          `Profile updated (${changedFields.join(", ")}). Plan reminders are sent separately.`,
        );
      }
      const res = await fetchProfileWithFallback();
      setUser(res.data);
      setDiscordNotice(getDiscordNotice(res.data.discord_id || res.data.discord_tag || res.data.discord_username || ""));
    } catch (err: any) {
      setFormError(
        err?.response?.data?.message || err?.message || "Failed to save profile",
      );
    } finally {
      setSaving(false);
    }
  }

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

          <div className="mt-6">
            <h2 className="text-sm font-semibold text-slate-700">Edit Contact</h2>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <Input
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <Input
                  label="Phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="sm:col-span-2">
                <Input
                  label="Discord"
                  value={discordInput}
                  onChange={(e) => {
                    const nextValue = e.target.value;
                    setDiscordInput(nextValue);
                    setDiscordNotice(getDiscordNotice(nextValue));
                  }}
                  hint="Best: paste a numeric Discord ID or use Copy User ID. Username-only works sometimes; legacy username#1234 is also accepted."
                />
              </div>
            </div>

            {discordNotice ? (
              <div className="mt-4 rounded-md border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-700">
                {discordNotice}
              </div>
            ) : null}
            {formError ? (
              <div className="mt-4 rounded-md bg-rose-50 px-4 py-2 text-sm text-rose-700">
                {formError}
              </div>
            ) : null}
            {success ? (
              <div className="mt-4 rounded-md bg-green-50 px-4 py-2 text-sm text-green-700">
                {success}
              </div>
            ) : null}

            <div className="mt-4 flex gap-3">
              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save Contact"}
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  if (user) {
                    const resetDiscord =
                      user.discord_id || user.discord_tag || user.discord_username || "";
                    setEmail(user.email || "");
                    setPhone(user.phone || "");
                    setDiscordInput(resetDiscord);
                    setDiscordNotice(getDiscordNotice(resetDiscord));
                    setFormError(null);
                    setSuccess(null);
                  }
                }}
              >
                Reset
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
