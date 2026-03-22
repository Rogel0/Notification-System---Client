import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/Card";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

type LoginFormProps = {
  email: string;
  password: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onTogglePassword?: () => void;
  showPassword?: boolean;
  error?: string;
  success?: string;
  isLoading?: boolean;
};

export function LoginForm({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onTogglePassword,
  showPassword,
  error,
  success,
  isLoading,
}: LoginFormProps) {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">
          Login to Omega Notification System
        </CardTitle>
        <CardDescription>
          Login with your email and password to manage notifications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              required
              placeholder="you@example.com"
            />
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          {success ? (
            <p className="text-sm text-emerald-600">{success}</p>
          ) : null}

          <div className="flex flex-col gap-3">
            <Button type="submit" variant="primary" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={onTogglePassword}
              disabled={isLoading}
            >
              {showPassword ? "Hide password" : "Show password"}
            </Button>
          </div>

          <div className="text-center text-sm text-slate-500">
            Forgot password?{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Reset
            </a>
          </div>
        </form>
      </CardContent>
      {false ? <></> : null}
    </Card>
  );
}
