// app/admin/events/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface IEvent {
	_id?: string;
	id?: string;
	title: string;
	startAt: string;
	endAt: string;
	location: string;
	maxAttendees: number;
	status: "upcoming" | "ongoing" | "completed" | "cancelled";
}

/**
 * Admin Events List Page (Client Component)
 */
export default function AdminEventsPage() {
	const [events, setEvents] = useState<IEvent[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");

	// Filtering and Pagination State
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 5;

	useEffect(() => {
		const fetchEvents = async () => {
			try {
				const res = await fetch("/api/events");
				if (!res.ok) throw new Error("Failed to fetch events");
				const data = await res.json();
				setEvents(data);
			} catch (err: any) {
				setError(err.message);
			} finally {
				setIsLoading(false);
			}
		};

		fetchEvents();
	}, []);

	const filteredEvents = events.filter((event) => {
		const matchesSearch = event.title
			.toLowerCase()
			.includes(searchQuery.toLowerCase());
		const matchesStatus = statusFilter ? event.status === statusFilter : true;
		return matchesSearch && matchesStatus;
	});

	// Pagination
	const totalItems = filteredEvents.length;
	const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
	const startIndex = (currentPage - 1) * itemsPerPage;
	const currentEvents = filteredEvents.slice(
		startIndex,
		startIndex + itemsPerPage,
	);

	const formatDateTime = (dateString: string) => {
		const date = new Date(dateString);
		return {
			date: date.toLocaleDateString(),
			time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
		};
	};

	const getStatusBadge = (status: string) => {
		switch (status) {
			case "upcoming":
				return (
					<span className="text-xs bg-purple-100 text-purple-700 border border-purple-200 px-2.5 py-1 rounded-full capitalize font-medium">
						{status}
					</span>
				);
			case "ongoing":
				return (
					<span className="text-xs bg-blue-100 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full capitalize font-medium">
						{status}
					</span>
				);
			case "completed":
				return (
					<span className="text-xs bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-full capitalize font-medium">
						{status}
					</span>
				);
			case "cancelled":
				return (
					<span className="text-xs bg-gray-100 text-gray-500 border border-gray-200 px-2.5 py-1 rounded-full capitalize font-medium">
						{status}
					</span>
				);
			default:
				return (
					<span className="text-xs bg-gray-100 text-gray-700 border border-gray-200 px-2.5 py-1 rounded-full capitalize font-medium">
						{status}
					</span>
				);
		}
	};

	// Reset filters
	const handleClearFilters = () => {
		setSearchQuery("");
		setStatusFilter("");
		setCurrentPage(1);
	};

	return (
		<div className="p-6 sm:p-8 max-w-7xl mx-auto font-sans">
			{/* Header */}
			<div className="flex items-center justify-between mb-6">
				<h1 className="font-heading text-3xl font-bold text-gray-900">
					Events
				</h1>
				<Link
					href="/admin/events/new"
					className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-black text-white text-sm font-semibold rounded-xl transition-colors"
				>
					Create event
				</Link>
			</div>

			{/* Filters Section */}
			<div className="flex flex-col sm:flex-row gap-4 mb-6">
				<div className="relative flex-1">
					<svg
						className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>
					<input
						type="text"
						placeholder="Search events..."
						value={searchQuery}
						onChange={(e) => {
							setSearchQuery(e.target.value);
							setCurrentPage(1);
						}}
						className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
					/>
				</div>
				<select
					value={statusFilter}
					onChange={(e) => {
						setStatusFilter(e.target.value);
						setCurrentPage(1);
					}}
					className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 outline-none bg-white min-w-[150px]"
				>
					<option value="">All statuses</option>
					<option value="upcoming">Upcoming</option>
					<option value="ongoing">Ongoing</option>
					<option value="completed">Completed</option>
					<option value="cancelled">Cancelled</option>
				</select>
				<button
					onClick={handleClearFilters}
					className="px-6 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
				>
					Clear
				</button>
			</div>

			{error && (
				<div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">
					{error}
				</div>
			)}

			{/* Table Section */}
			<div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm mb-6">
				<div className="overflow-x-auto">
					<table className="w-full text-left border-collapse">
						<thead className="bg-gray-50 border-b border-gray-200">
							<tr>
								<th className="py-3.5 px-6 font-semibold text-sm text-gray-700">
									Title
								</th>
								<th className="py-3.5 px-6 font-semibold text-sm text-gray-700">
									Start date
								</th>
								<th className="py-3.5 px-6 font-semibold text-sm text-gray-700">
									End date
								</th>
								<th className="py-3.5 px-6 font-semibold text-sm text-gray-700">
									Location
								</th>
								<th className="py-3.5 px-6 font-semibold text-sm text-gray-700">
									Max attendees
								</th>
								<th className="py-3.5 px-6 font-semibold text-sm text-gray-700">
									Status
								</th>
								<th className="py-3.5 px-6 font-semibold text-sm text-gray-700">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100">
							{isLoading ? (
								<tr>
									<td colSpan={7} className="py-8 text-center text-gray-500">
										Loading events...
									</td>
								</tr>
							) : currentEvents.length === 0 ? (
								<tr>
									<td colSpan={7} className="py-8 text-center text-gray-500">
										No events found matching your criteria.
									</td>
								</tr>
							) : (
								currentEvents.map((event) => {
									const eventId = event._id || event.id;
									const start = formatDateTime(event.startAt);
									const end = formatDateTime(event.endAt);

									return (
										<tr
											key={eventId}
											className="hover:bg-gray-50 transition-colors"
										>
											<td className="py-4 px-6">
												<p className="font-semibold text-gray-900 text-sm">
													{event.title}
												</p>
											</td>
											<td className="py-4 px-6">
												<p className="text-sm text-gray-900">{start.date}</p>
												<p className="text-xs text-gray-500">{start.time}</p>
											</td>
											<td className="py-4 px-6">
												<p className="text-sm text-gray-900">{end.date}</p>
												<p className="text-xs text-gray-500">{end.time}</p>
											</td>
											<td className="py-4 px-6">
												<p className="text-sm text-gray-700">
													{event.location}
												</p>
											</td>
											<td className="py-4 px-6">
												<p className="text-sm text-gray-700">
													{event.maxAttendees}
												</p>
											</td>
											<td className="py-4 px-6">
												{getStatusBadge(event.status)}
											</td>
											<td className="py-4 px-6">
												<Link
													href={`/admin/events/${eventId}/edit`}
													className="inline-block border border-gray-300 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-100 text-gray-700 transition-colors"
												>
													Edit
												</Link>
											</td>
										</tr>
									);
								})
							)}
						</tbody>
					</table>
				</div>
			</div>

			{/* Pagination Section */}
			{!isLoading && totalItems > 0 && (
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-1">
						<button
							onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
							disabled={currentPage === 1}
							className="px-3 py-1.5 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							&lt;
						</button>

						{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
							<button
								key={page}
								onClick={() => setCurrentPage(page)}
								className={`px-3.5 py-1.5 border rounded-md text-sm font-medium transition-colors ${
									currentPage === page
										? "bg-gray-200 border-gray-300 text-gray-900"
										: "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
								}`}
							>
								{page}
							</button>
						))}

						<button
							onClick={() =>
								setCurrentPage((prev) => Math.min(prev + 1, totalPages))
							}
							disabled={currentPage === totalPages}
							className="px-3 py-1.5 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							&gt;
						</button>
					</div>
					<div className="text-sm text-gray-500">
						Showing {startIndex + 1}–
						{Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems}{" "}
						events
					</div>
				</div>
			)}
		</div>
	);
}
