import Link from "next/link";
import { ChevronDown, User } from "lucide-react";

type NavKey = "home" | "events" | "about";

interface NavItem {
  key: NavKey;
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { key: "home", label: "Home", href: "/" },
  { key: "events", label: "Events", href: "/events" },
  { key: "about", label: "About", href: "/about" },
];

interface HeaderProps {
  active?: NavKey;
}

export function Header({ active }: HeaderProps): React.ReactNode {
  return (
    <header className="border-b border-midnight-violet-100 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="font-serif text-2xl font-bold text-midnight-violet-900"
        >
          Sessio
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={
                item.key === active
                  ? "font-medium text-midnight-violet-700 underline decoration-2 underline-offset-8"
                  : "font-medium text-midnight-violet-900 hover:text-midnight-violet-700"
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/login"
          className="inline-flex items-center gap-2 rounded-xl border border-midnight-violet-200 px-4 py-2 text-sm font-medium text-midnight-violet-800 hover:bg-midnight-violet-50"
        >
          <User className="h-4 w-4 text-midnight-violet-500" />
          Sign In
          <ChevronDown className="h-4 w-4 text-midnight-violet-500" />
        </Link>
      </div>
    </header>
  );
}
