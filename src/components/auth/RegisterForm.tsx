import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/Card";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

type RegisterFormProps = {
  name: string;
  email: string;
  phone: string;
  password: string;
  passwordStrength: string;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onTogglePassword: () => void;
  showPassword: boolean;
  error?: string;
  success?: string;
  isLoading?: boolean;
};

export function RegisterForm({
  name,
  email,
  phone,
  password,
  passwordStrength,
  onNameChange,
  onEmailChange,
  onPhoneChange,
  onPasswordChange,
  onSubmit,
  onTogglePassword,
  showPassword,
  error,
  success,
  isLoading,
}: RegisterFormProps) {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">
          Create Omega Notification Account
        </CardTitle>
        <CardDescription>
          Register to receive and manage critical alerts.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            label="Name"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            required
            placeholder="John Doe"
          />
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            required
            placeholder="you@example.com"
          />
          <Input
            label="Phone"
            type="tel"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            placeholder="+15551234567"
          />
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            required
            placeholder="Create a password"
          />
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Password strength: {passwordStrength}</span>
            <button
              type="button"
              onClick={onTogglePassword}
              className="text-blue-600 hover:underline"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          {success ? (
            <p className="text-sm text-emerald-600">{success}</p>
          ) : null}

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create account"}
          </Button>

          <p className="text-center text-xs text-slate-500">
            By clicking create account you agree to our{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Terms
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Privacy
            </a>
            .
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
