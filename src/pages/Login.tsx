import React, { useState } from "react";
import axios from "axios";
import { LoginForm } from "../components/auth/LoginForm";
import api from "../utils/api";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [sessionMessage, setSessionMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    if (localStorage.getItem("session_expired") === "true") {
      setSessionMessage("Your session has expired. Please log in again.");
      localStorage.removeItem("session_expired");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      localStorage.removeItem("session_expired");
      await api.post("/login", { email, password });
      setSuccess("Login successful!");
      setEmail("");
      setPassword("");
      // Force reload so authentication check can refresh from server cookie
      window.location.href = "/dashboard";
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data?.message ?? "Login failed")
        : err instanceof Error
          ? err.message
          : "Login failed";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        {sessionMessage && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800">
            {sessionMessage}
          </div>
        )}
        <LoginForm
          email={email}
          password={password}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onSubmit={handleSubmit}
          onTogglePassword={() => setShowPassword((val) => !val)}
          showPassword={showPassword}
          error={error}
          success={success}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default Login;
