"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User, LogOut, ShieldAlert } from "lucide-react";
import Image from "next/image";
import logo from "@/public/sessio-logo.svg";
import brand from "@/public/sessio-full.svg";

interface PublicUser {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Events", href: "/events" },
  { label: "About", href: "/about" },
];

export function Header(): React.ReactNode {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<PublicUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [pathname]);   

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="border-b border-midnight-violet-100 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="font-serif text-2xl font-bold text-midnight-violet-900"
        >
          {/*TODO: Implement this logo <Image src={brand} alt="Sessio logo" height={50}  className="inline-block mr-2" /> */}
          <Image src={logo} alt="Sessio logo" width={32} height={32} className="inline-block mr-2" />
          Sessio
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  isActive
                    ? "font-bold text-midnight-violet-700 underline decoration-2 underline-offset-8"
                    : "font-bold text-midnight-violet-900 hover:text-midnight-violet-700"
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          {loading ? (
            <div className="h-9 w-24 animate-pulse rounded-xl bg-midnight-violet-50" />
          ) : user ? (
            <div className="flex items-center gap-3">
              {user.role === "admin" && (
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1 rounded-lg bg-raspberry-red-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-raspberry-red-600"
                >
                  <ShieldAlert className="h-3.5 w-3.5" />
                  Admin
                </Link>
              )}
              <span className="flex items-center text-sm font-medium text-midnight-violet-900">
                <User className="mr-1 inline h-5 w-5 text-midnight-violet-500" />
                {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1 rounded-xl border border-midnight-violet-200 px-3 py-1.5 text-xs font-medium text-midnight-violet-700 hover:bg-midnight-violet-50"
              >
                <LogOut className="h-3.5 w-3.5" />
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl border border-midnight-violet-200 px-4 py-2 text-sm font-medium text-midnight-violet-800 hover:bg-midnight-violet-50"
            >
              <User className="h-4 w-4 text-midnight-violet-500" />
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}