import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AuthPhoneShell } from "../components/auth/AuthPhoneShell";
import api from "../utils/api";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await api.post("/login", { email, password });
      setSuccess("Login successful!");
      setEmail("");
      setPassword("");
    } catch (err: unknown) {
      const message = (err as any)?.response?.data?.message || "Login failed";
      setError(message);
    }
  };

  return (
    <AuthPhoneShell
      modeLabel="Don't have an account?"
      switchLabel="Create one now."
      switchTo="/register"
      heroTitle="Hello SalesPilot!"
      heroSubtitle="Skip repetitive and manual tasks. Get highly productive through automation and save tons of time."
      cardTitle="Welcome Back!"
      cardSubtitle="It's FREE! Takes less than a minute."
      submitLabel="Login Now"
      socialLabel="Login with Google"
      brandName="SalesPilot"
      onSubmit={handleSubmit}
      error={error}
      success={success}
      footer={
        <div className="text-center text-xs text-slate-500">
          Forgot password?{" "}
          <Link to="/forgot-password" className="font-semibold text-slate-700">
            Click here
          </Link>
        </div>
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
          Password
        </span>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 w-full border-0 border-b border-slate-300 bg-transparent px-0 pr-10 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute right-0 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition hover:text-slate-600"
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
        </div>
      </label>
    </AuthPhoneShell>
  );
};

export default Login;
