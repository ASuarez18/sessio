// app/admin/layout.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Admin Layout Component
 * Wraps all pages inside the /admin route with a shared responsive sidebar navigation.
 */
export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const navItems = [
		{
			name: "Dashboard",
			href: "/admin",
			icon: (
				<svg
					className="w-5 h-5 shrink-0"
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
			),
		},
		{
			name: "Events",
			href: "/admin/events",
			icon: (
				<svg
					className="w-5 h-5 shrink-0"
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
			),
		},
		{
			name: "Users",
			href: "/admin/users",
			icon: (
				<svg
					className="w-5 h-5 shrink-0"
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
			),
		},
		{
			name: "Admin Users",
			href: "/admin/admin-users",
			icon: (
				<svg
					className="w-5 h-5 shrink-0"
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
			),
		},
	];

	return (
		<div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans">
			{/* Mobile Header */}
			<div className="md:hidden flex items-center justify-between bg-purple-950 p-4 shrink-0">
				<Link
					href="/admin"
					className="font-heading text-lg font-bold text-purple-200"
				>
					Sessio{" "}
					<span className="text-xs text-purple-400 uppercase tracking-wide font-semibold ml-1">
						Admin
					</span>
				</Link>
				<button
					onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
					className="text-purple-200 hover:text-white focus:outline-none"
					aria-label="Toggle menu"
				>
					{isMobileMenuOpen ? (
						<svg
							className="w-6 h-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					) : (
						<svg
							className="w-6 h-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M4 6h16M4 12h16M4 18h16"
							/>
						</svg>
					)}
				</button>
			</div>

			{/* Sidebar */}
			<aside
				className={`${
					isMobileMenuOpen
						? "block absolute top-[60px] left-0 right-0 z-40 h-[calc(100vh-60px)]"
						: "hidden"
				} md:relative md:top-0 md:h-screen md:block w-full md:w-56 bg-purple-950 shrink-0 flex-col transition-all`}
			>
				{/* Desktop Logo */}
				<div className="hidden md:block px-5 py-5 border-b border-purple-800">
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

				{/* Navigation Links */}
				<nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto">
					{navItems.map((item) => {
						const isActive = pathname === item.href;
						return (
							<Link
								key={item.name}
								href={item.href}
								onClick={() => setIsMobileMenuOpen(false)}
								className={`w-full flex items-center gap-3 px-4 py-3 md:py-2.5 rounded-xl text-base md:text-sm font-medium transition-all ${
									isActive
										? "text-white bg-purple-700"
										: "text-purple-300 hover:text-purple-100 hover:bg-purple-800"
								}`}
							>
								{item.icon}
								{item.name}
							</Link>
						);
					})}
				</nav>

				{/* Footer Link */}
				<div className="px-5 py-4 border-t border-purple-800 mt-auto">
					<Link
						href="/"
						onClick={() => setIsMobileMenuOpen(false)}
						className="flex items-center gap-2 text-sm md:text-xs text-purple-400 hover:text-purple-200 transition-colors"
					>
						<svg
							className="w-4 h-4 md:w-3.5 md:h-3.5 shrink-0"
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

			{/* Mobile Overlay Background */}
			{isMobileMenuOpen && (
				<div
					className="md:hidden fixed inset-0 top-[60px] bg-black/50 z-30"
					onClick={() => setIsMobileMenuOpen(false)}
				/>
			)}

			{/* Main Content Area */}
			<main
				className={`flex-1 overflow-auto ${isMobileMenuOpen ? "hidden md:block" : "block"}`}
			>
				{children}
			</main>
		</div>
	);
}
