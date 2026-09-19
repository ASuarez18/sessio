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

export default function LoginPage(): React.ReactNode {
  const router = useRouter();
  const searchParams = new URLSearchParams();

  const redirectPath = searchParams.get("from") || "/events";

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { refreshUser } = useAuth();

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password, rememberMe }),
      });
      const result = (await response.json()) as AuthResponse;

      if (!response.ok || !result.user) {
        setError(result.error ?? "Invalid email or password");
        return;
      }

      await refreshUser();

      const destination =
        result.user.role === "admin" ? "/admin" : redirectPath;
      router.push(destination);
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
            WELCOME BACK
          </p>
          <h1 className="font-heading text-3xl font-bold text-[#241426]">
            Sign in to Sessio
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
            htmlFor="login-identifier"
          >
            Email or Username
          </label>
          <input
            className="h-12.5 w-full rounded-xl border border-[#e5b5e0] px-4 outline-[#934295] placeholder:text-[#d095d0]"
            id="login-identifier"
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="Enter your email"
            required
          />

          <label
            className="text-sm font-bold text-[#69336a]"
            htmlFor="login-password"
          >
            Password
          </label>
          <div className="relative w-full">
            <input
              className="h-12.5 w-full rounded-xl border border-[#e5b5e0] pl-4 pr-11 outline-[#934295] placeholder:text-[#d095d0]"
              id="login-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
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

          <div className="my-1 flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-[#69336a]">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-[#e5b5e0] text-[#934295] focus:ring-[#934295]"
              />
              Remember me
            </label>
          </div>

          <button
            className="mt-2 h-13 rounded-xl bg-[#934295] text-base font-bold text-white hover:bg-[#713273] disabled:cursor-wait disabled:opacity-60"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>

          <p className="mt-4 text-center text-sm text-[#69336a]">
            Don&apos;t have an account?{" "}
            <Link
              className="font-bold text-[#934295] hover:underline"
              href="/register"
            >
              Create account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
