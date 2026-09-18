"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useRef, useState } from "react";
import { ChevronDown, User } from "lucide-react";

import { useAuth } from "@/app/context/AuthContext";
import logo from "@/public/sessio-logo.svg";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Events", href: "/events" },
  { label: "About", href: "/about" },
];

export function Header(): ReactNode {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent): void {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleLogout = async (): Promise<void> => {
    setMenuOpen(false);
    await logout();
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="border-b border-midnight-violet-100 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="flex items-center font-serif text-2xl font-bold text-midnight-violet-900"
        >
          <Image
            src={logo}
            alt="Sessio logo"
            width={32}
            height={32}
            className="mr-2 inline-block"
          />
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
          {isLoading ? (
            <div className="h-9 w-24 animate-pulse rounded-xl bg-midnight-violet-50" />
          ) : user ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                className="inline-flex items-center gap-2 rounded-xl border border-midnight-violet-300 px-4 py-2 text-sm font-semibold text-midnight-violet-900 hover:bg-midnight-violet-50"
              >
                <User className="h-5 w-5 text-midnight-violet-500" />
                {user.role === "admin" ? "Admin" : user.name}
                <ChevronDown
                  className={`h-4 w-4 text-midnight-violet-500 transition-transform ${menuOpen ? "rotate-180" : ""}`}/>
              </button>

              {menuOpen ? (
                <div
                  role="menu"
                  className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-midnight-violet-100 bg-white shadow-lg"
                >
                  {user.role === "admin" ? (
                    <Link
                      href="/admin"
                      role="menuitem"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-3 text-sm font-medium text-midnight-violet-900 hover:bg-midnight-violet-50"
                    >
                      Admin Dashboard
                    </Link>
                  ) : (
                    <Link
                      href="/my-events"
                      role="menuitem"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-3 text-sm font-medium text-midnight-violet-900 hover:bg-midnight-violet-50"
                    >
                      My Events
                    </Link>
                  )}
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleLogout}
                    className="block w-full border-t border-midnight-violet-100 px-4 py-3 text-left text-sm font-medium text-raspberry-red-600 hover:bg-midnight-violet-50"
                  >
                    Sign Out
                  </button>
                </div>
              ) : null}
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
