import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AuthPhoneShell } from "../components/auth/AuthPhoneShell";
import api from "../utils/api";

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const passwordStrength = useMemo(() => {
    if (!password) return "";
    if (password.length >= 10) return "Strong";
    if (password.length >= 6) return "Medium";
    return "Weak";
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await api.post("/register", { email, password });
      setSuccess("Registration successful!");
      setEmail("");
      setName("");
      setPassword("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <AuthPhoneShell
      modeLabel="Already have an account?"
      switchLabel="Sign in now."
      switchTo="/login"
      heroTitle="Hello SalesPilot!"
      heroSubtitle="Create your account to automate repetitive workflows and keep your team moving faster."
      cardTitle="Create Account"
      cardSubtitle="It's FREE! Takes less than a minute."
      submitLabel="Create Account"
      socialLabel="Sign up with Google"
      brandName="SalesPilot"
      onSubmit={handleSubmit}
      error={error}
      success={success}
      footer={
        <p className="text-center text-xs text-slate-500">
          Already registered?{" "}
          <Link to="/login" className="font-semibold text-slate-700">
            Click here
          </Link>
        </p>
      }
    >
      <label className="block">
        <span className="mb-1 block text-xs font-semibold text-slate-500">
          Email Address
        </span>
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-12 w-full border-0 border-b border-slate-300 bg-transparent px-0 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900"
          required
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-xs font-semibold text-slate-500">
          Your Name
        </span>
        <input
          type="text"
          placeholder="Enter your full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-12 w-full border-0 border-b border-slate-300 bg-transparent px-0 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-xs font-semibold text-slate-500">
          Password
        </span>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 w-full border-0 border-b border-slate-300 bg-transparent px-0 pr-24 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute right-14 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition hover:text-slate-600"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-5 w-5 fill-none stroke-current stroke-2"
            >
              <path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6S2 12 2 12Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
          <span
            className={[
              "absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold",
              passwordStrength === "Strong"
                ? "text-emerald-500"
                : passwordStrength === "Medium"
                  ? "text-amber-500"
                  : "text-rose-500",
            ].join(" ")}
          >
            {passwordStrength}
          </span>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Use at least 8 characters for a stronger password.
        </p>
      </label>
    </AuthPhoneShell>
  );
};

export default Register;
