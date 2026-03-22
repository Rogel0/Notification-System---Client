import React, { useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { RegisterForm } from "../components/auth/RegisterForm";
import api from "../utils/api";

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);

    try {
      await api.post("/register", { email, password, name, phone });
      setSuccess("Registration successful!");
      setEmail("");
      setName("");
      setPhone("");
      setPassword("");
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data?.message ?? "Registration failed")
        : err instanceof Error
          ? err.message
          : "Registration failed";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <RegisterForm
          name={name}
          email={email}
          phone={phone}
          password={password}
          passwordStrength={passwordStrength}
          onNameChange={setName}
          onEmailChange={setEmail}
          onPhoneChange={setPhone}
          onPasswordChange={setPassword}
          onSubmit={handleSubmit}
          onTogglePassword={() => setShowPassword((val) => !val)}
          showPassword={showPassword}
          error={error}
          success={success}
          isLoading={isLoading}
        />

        <p className="text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-blue-600 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
