"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type AuthResponse = {
  error?: string;
  user?: { role: "user" | "admin" };
};

export function AuthForm(): React.ReactNode {
  const router = useRouter();
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [name, setName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submitLogin(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const result = (await response.json()) as AuthResponse;

      if (!response.ok || !result.user) {
        setError(result.error ?? "Invalid email or password");
        return;
      }

      router.push(result.user.role === "admin" ? "/admin" : "/events");
    } catch {
      setError("Unable to connect. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function submitRegistration(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email: registerEmail, password: registerPassword }),
      });
      const result = (await response.json()) as AuthResponse;

      if (!response.ok) {
        setError(result.error ?? "Unable to create account");
        return;
      }

      setName("");
      setRegisterEmail("");
      setRegisterPassword("");
      setMessage("Account created. You can now sign in.");
    } catch {
      setError("Unable to connect. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f8eff8] text-[#241426]">
      <header className="sticky top-0 z-50 grid h-[68px] grid-cols-[1fr_auto_1fr] items-center border-b border-[#e5b5e0] bg-white px-[3.6vw] shadow-[0_1px_0_rgba(229,181,224,0.35)]">
        <Link className="font-serif text-[25px] font-bold leading-none" href="/">Sessio</Link>
        <nav className="hidden gap-[43px] font-bold sm:flex">
          <Link href="/">Home</Link>
          <Link href="/events">Events</Link>
          <Link href="/about">About</Link>
        </nav>
        <span className="justify-self-end rounded-[11px] border border-[#e5b5e0] px-4 py-2 font-bold">♙ <span>Sign In</span>⌄</span>
      </header>

      <section className="mx-auto max-w-[1160px] px-6 pb-20 pt-[60px]">
        <p className="mb-3 text-center text-sm tracking-[2px] text-[#b54eb4]">WELCOME</p>
        <h1 className="text-center font-serif text-[clamp(40px,5vw,48px)] font-bold leading-none">Join Sessio</h1>
        <p className="mb-[53px] mt-[17px] text-center text-[17px] font-semibold text-[#934295]">Sign in to register for workshops and track your sessions</p>

        <div className="grid gap-[30px] text-left md:grid-cols-2">
          <form className="flex flex-col gap-2.5 rounded-[20px] border border-[#e5b5e0] bg-white p-7 sm:p-[42px]" onSubmit={submitLogin}>
            <h2 className="mb-3 font-serif text-[28px] font-bold">Sign in</h2>
            <label className="text-sm font-bold text-[#69336a]" htmlFor="login-email">Email</label>
            <input className="mb-3 h-[55px] w-full rounded-[15px] border border-[#e5b5e0] px-[21px] outline-[#934295] placeholder:text-[#d095d0]" id="login-email" type="email" value={loginEmail} onChange={(event) => setLoginEmail(event.target.value)} placeholder="Enter your email" required />
            <label className="text-sm font-bold text-[#69336a]" htmlFor="login-password">Password</label>
            <input className="mb-3 h-[55px] w-full rounded-[15px] border border-[#e5b5e0] px-[21px] outline-[#934295] placeholder:text-[#d095d0]" id="login-password" type="password" value={loginPassword} onChange={(event) => setLoginPassword(event.target.value)} placeholder="Enter your password" required />
            <button className="mt-2 h-[61px] rounded-[15px] bg-[#934295] text-[17px] font-bold text-white hover:bg-[#713273] disabled:cursor-wait disabled:opacity-60" type="submit" disabled={isSubmitting}>{isSubmitting ? "Signing in..." : "Sign in"}</button>
            <Link className="mt-3 text-center text-sm text-[#934295] underline" href="/forgot-password">Forgot password?</Link>
          </form>

          <form className="flex flex-col gap-2.5 rounded-[20px] border border-[#e5b5e0] bg-white p-7 sm:p-[42px]" onSubmit={submitRegistration}>
            <h2 className="mb-3 font-serif text-[28px] font-bold">Create account</h2>
            <label className="text-sm font-bold text-[#69336a]" htmlFor="register-name">Full name</label>
            <input className="mb-3 h-[55px] w-full rounded-[15px] border border-[#e5b5e0] px-[21px] outline-[#934295] placeholder:text-[#d095d0]" id="register-name" type="text" value={name} onChange={(event) => setName(event.target.value)} placeholder="Enter your full name" minLength={2} required />
            <label className="text-sm font-bold text-[#69336a]" htmlFor="register-email">Email</label>
            <input className="mb-3 h-[55px] w-full rounded-[15px] border border-[#e5b5e0] px-[21px] outline-[#934295] placeholder:text-[#d095d0]" id="register-email" type="email" value={registerEmail} onChange={(event) => setRegisterEmail(event.target.value)} placeholder="Enter your email" required />
            <label className="text-sm font-bold text-[#69336a]" htmlFor="register-password">Password</label>
            <input className="mb-3 h-[55px] w-full rounded-[15px] border border-[#e5b5e0] px-[21px] outline-[#934295] placeholder:text-[#d095d0]" id="register-password" type="password" value={registerPassword} onChange={(event) => setRegisterPassword(event.target.value)} placeholder="Choose a password" minLength={8} required />
            <button className="mt-2 h-[61px] rounded-[15px] bg-[#934295] text-[17px] font-bold text-white hover:bg-[#713273] disabled:cursor-wait disabled:opacity-60" type="submit" disabled={isSubmitting}>{isSubmitting ? "Creating account..." : "Create account"}</button>
          </form>
        </div>
        {(error || message) && <p className={`mx-auto mt-6 max-w-xl text-center text-sm font-semibold ${error ? "text-red-700" : "text-[#934295]"}`} role="status">{error || message}</p>}
      </section>
    </main>
  );
}
