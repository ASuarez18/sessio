'use client';

// app/admin/layout.tsx
import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Admin Layout Component
 * Wraps all pages inside the /admin route with a shared sidebar navigation.
 */
export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            {/* Sidebar */}
            <aside className="w-56 bg-purple-950 shrink-0 flex flex-col">
                <div className="px-5 py-5 border-b border-purple-800">
                    <Link
                        href="/admin"
                        className="font-heading text-lg font-bold text-purple-200 hover:text-white transition-colors"
                    >
                        Sessio
                    </Link>
                    <p className="text-xs text-purple-400 mt-0.5 uppercase tracking-wide font-semibold">
                        Admin
                    </p>
                </div>

                <nav className="flex-1 px-3 py-4 space-y-1">
                    <Link
                        href="/admin"
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                            pathname === "/admin"
                                ? "text-white bg-purple-700"
                                : "text-purple-300 hover:text-purple-100 hover:bg-purple-800"
                        }`}
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                            />
                        </svg>
                        Dashboard
                    </Link>

                    <Link
                        href="/admin/events"
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                            pathname === "/admin/events"
                                ? "text-white bg-purple-700"
                                : "text-purple-300 hover:text-purple-100 hover:bg-purple-800"
                        }`}
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                        Events
                    </Link>

                    <Link
                        href="/admin/users"
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                            pathname === "/admin/users"
                                ? "text-white bg-purple-700"
                                : "text-purple-300 hover:text-purple-100 hover:bg-purple-800"
                        }`}
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                            />
                        </svg>
                        Users
                    </Link>

                    <Link
                        href="/admin/admin-users"
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                            pathname === "/admin/admin-users"
                                ? "text-white bg-purple-700"
                                : "text-purple-300 hover:text-purple-100 hover:bg-purple-800"
                        }`}
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                            />
                        </svg>
                        Admin Users
                    </Link>
                </nav>

                <div className="px-5 py-4 border-t border-purple-800">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-xs text-purple-400 hover:text-purple-200 transition-colors"
                    >
                        <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                        </svg>
                        Public site
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">{children}</main>
        </div>
    );
}