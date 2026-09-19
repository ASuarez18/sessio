"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, Users, UserCheck, LayoutDashboard, LogOut } from "lucide-react";

const NAVIGATION_ITEMS = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Events", href: "/admin/events", icon: Calendar },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Admin Users", href: "/admin/admin-users", icon: UserCheck },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 h-screen border-r border-gray-200 bg-white flex flex-col justify-between p-4 z-20">
      <div>
        {/* Brand Header */}
        <div className="px-3 py-4 mb-6 border-b border-gray-100">
          <Link href="/admin" className="font-heading text-xl font-bold text-gray-900">
            Admin Panel
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {NAVIGATION_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-purple-50 text-purple-900 font-semibold"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-purple-800" : "text-gray-400"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Exit Link */}
      <div className="pt-4 border-t border-gray-100">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <LogOut className="w-4 h-4 text-gray-400" />
          Back to website
        </Link>
      </div>
    </aside>
  );
}