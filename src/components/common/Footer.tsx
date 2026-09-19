import Link from "next/link";

const FOOTER_LINKS = [
  { label: "Home", href: "/" },
  { label: "Events", href: "/events" },
  { label: "About", href: "/about" },
];

export function Footer(): React.ReactNode {
  return (
    <footer className="mt-auto border-t border-midnight-violet-100 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
        <span className="font-heading text-xl font-bold text-midnight-violet-900">
          Sessio
        </span>

        <nav className="flex gap-6">
          {FOOTER_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-midnight-violet-700 hover:text-midnight-violet-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <span className="text-sm text-midnight-violet-500">
          © {new Date().getFullYear()} Sessio. Workshops &amp; training.
        </span>
      </div>
    </footer>
  );
}
