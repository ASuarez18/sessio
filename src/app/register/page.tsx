"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";

type AuthResponse = {
  error?: string;
  user?: { role: "user" | "admin" };
};

export default function RegisterPage(): React.ReactNode {
  const router = useRouter();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { refreshUser } = useAuth();

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username, email, password }),
      });
      const result = (await response.json()) as AuthResponse;

      if (!response.ok || !result.user) {
        setError(result.error ?? "Unable to create account");
        return;
      }

      await refreshUser();
      router.push("/events");
      router.refresh();
    } catch {
      setError("Unable to connect. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-[#f8eff8] px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="mb-2 text-xs font-bold tracking-[2px] text-[#b54eb4]">
            JOIN SESSIO
          </p>
          <h1 className="font-serif text-3xl font-bold text-[#241426]">
            Create your account
          </h1>
        </div>

        <form
          className="flex flex-col gap-3 rounded-[20px] border border-[#e5b5e0] bg-white p-8 shadow-sm"
          onSubmit={handleSubmit}
        >
          {error && (
            <div className="rounded-xl bg-red-50 p-3 text-center text-sm font-semibold text-red-600">
              {error}
            </div>
          )}

          <label
            className="text-sm font-bold text-[#69336a]"
            htmlFor="register-name"
          >
            Full Name
          </label>
          <input
            className="h-12.5 w-full rounded-xl border border-[#e5b5e0] px-4 outline-[#934295] placeholder:text-[#d095d0]"
            id="register-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            minLength={2}
            required
          />

          <label
            className="text-sm font-bold text-[#69336a]"
            htmlFor="register-username"
          >
            Username
          </label>
          <input
            className="h-12.5 w-full rounded-xl border border-[#e5b5e0] px-4 outline-[#934295] placeholder:text-[#d095d0]"
            id="register-username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Choose a username"
            minLength={3}
            maxLength={20}
            required
          />

          <label
            className="text-sm font-bold text-[#69336a]"
            htmlFor="register-email"
          >
            Email
          </label>
          <input
            className="h-12.5 w-full rounded-xl border border-[#e5b5e0] px-4 outline-[#934295] placeholder:text-[#d095d0]"
            id="register-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />

          <label
            className="text-sm font-bold text-[#69336a]"
            htmlFor="register-password"
          >
            Password
          </label>
          <div className="relative w-full">
            <input
              className="h-12.5 w-full rounded-xl border border-[#e5b5e0] pl-4 pr-11 outline-[#934295] placeholder:text-[#d095d0]"
              id="register-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Choose a password (min 8 chars)"
              minLength={8}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#934295] hover:text-[#713273]"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          <label
            className="text-sm font-bold text-[#69336a]"
            htmlFor="register-confirm-password"
          >
            Confirm Password
          </label>
          <div className="relative w-full">
            <input
              className="h-12.5 w-full rounded-xl border border-[#e5b5e0] px-4 outline-[#934295] placeholder:text-[#d095d0]"
              id="register-confirm-password"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              minLength={8}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#934295] hover:text-[#713273]"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          <button
            className="mt-2 h-13 rounded-xl bg-[#934295] text-base font-bold text-white hover:bg-[#713273] disabled:cursor-wait disabled:opacity-60"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>

          <p className="mt-4 text-center text-sm text-[#69336a]">
            Already have an account?{" "}
            <Link
              className="font-bold text-[#934295] hover:underline"
              href="/login"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
