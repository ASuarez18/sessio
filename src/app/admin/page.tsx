// app/admin/page.tsx
import Link from "next/link";
import { getAllUsers } from "../../services/user.service";
import { getEvents } from "../../services/event.service";
import { getEventRegistrations } from "../../services/registration.service";

/**
 * Admin Dashboard Page (Server Component)
 */
export default async function AdminDashboard() {
	const [users, events] = await Promise.all([getAllUsers(), getEvents()]);

	const upcomingEvents = events.filter((e: any) => e.status === "upcoming");
	const completedEvents = events.filter((e: any) => e.status === "completed");

	const registrationsPromises = events.map((event: any) =>
		getEventRegistrations(event._id || event.id),
	);
	const eventRegistrationsList = await Promise.all(registrationsPromises);

	let totalRegistrations = 0;
	const attendeeCountMap: Record<string, number> = {};

	eventRegistrationsList.forEach((regs, index) => {
		const eventId = events[index]._id.toString();

		const activeCount = regs.filter(
			(r: any) => r.status !== "cancelled",
		).length;

		attendeeCountMap[eventId] = activeCount;
		totalRegistrations += activeCount;
	});

	const getStatusBadge = (status: string) => {
		switch (status) {
			case "upcoming":
				return (
					<span className="text-xs bg-purple-100 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-full capitalize">
						{status}
					</span>
				);
			case "ongoing":
				return (
					<span className="text-xs bg-blue-100 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full capitalize">
						{status}
					</span>
				);
			case "completed":
				return (
					<span className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full capitalize">
						{status}
					</span>
				);
			default:
				return (
					<span className="text-xs bg-gray-100 text-gray-700 border border-gray-200 px-2 py-0.5 rounded-full capitalize">
						{status}
					</span>
				);
		}
	};

	return (
		<div className="p-6 sm:p-8 font-sans">
			{/* Header */}
			<div className="flex items-center justify-between mb-8">
				<div>
					<p className="text-xs text-gray-500 uppercase tracking-widest mb-1 font-semibold">
						Overview
					</p>
					<h1 className="font-heading text-3xl font-bold text-gray-900">
						Admin dashboard
					</h1>
				</div>
				<Link
					href="/admin/events/new"
					className="flex items-center gap-2 px-4 py-2.5 bg-purple-800 hover:bg-purple-900 text-white text-sm font-semibold rounded-xl transition-colors"
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
							d="M12 4v16m8-8H4"
						/>
					</svg>
					Create event
				</Link>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
				<div className="bg-white rounded-2xl border border-gray-200 p-5">
					<div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mb-3">
						<svg
							className="w-5 h-5 text-purple-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
							/>
						</svg>
					</div>
					<p className="text-xs text-gray-500 mb-1 font-medium">Total users</p>
					<p className="font-heading text-2xl font-bold text-gray-900">
						{users.length}
					</p>
				</div>

				<div className="bg-white rounded-2xl border border-gray-200 p-5">
					<div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-3">
						<svg
							className="w-5 h-5 text-blue-500"
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
					</div>
					<p className="text-xs text-gray-500 mb-1 font-medium">Total events</p>
					<p className="font-heading text-2xl font-bold text-gray-900">
						{events.length}
					</p>
				</div>

				<div className="bg-white rounded-2xl border border-gray-200 p-5">
					<div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center mb-3">
						<svg
							className="w-5 h-5 text-green-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					</div>
					<p className="text-xs text-gray-500 mb-1 font-medium">Upcoming</p>
					<p className="font-heading text-2xl font-bold text-gray-900">
						{upcomingEvents.length}
					</p>
				</div>

				<div className="bg-white rounded-2xl border border-gray-200 p-5">
					<div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center mb-3">
						<svg
							className="w-5 h-5 text-orange-500"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
							/>
						</svg>
					</div>
					<p className="text-xs text-gray-500 mb-1 font-medium">
						Registrations
					</p>
					<p className="font-heading text-2xl font-bold text-gray-900">
						{totalRegistrations.toLocaleString()}
					</p>
				</div>
			</div>

			{/* Recent Events Table */}
			<div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
				<div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
					<h2 className="font-heading font-bold text-gray-900 text-lg">
						Current events
					</h2>
					<div className="flex gap-2">
						<span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-lg font-medium border border-gray-200">
							{upcomingEvents.length} upcoming · {completedEvents.length}{" "}
							completed
						</span>
					</div>
				</div>
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead>
							<tr className="bg-gray-50">
								<th className="text-left px-6 py-3 text-xs text-gray-500 uppercase tracking-wide font-semibold">
									Event
								</th>
								<th className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wide font-semibold hidden sm:table-cell">
									Date
								</th>
								<th className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wide font-semibold">
									Attendees
								</th>
								<th className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wide font-semibold">
									Status
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100">
							{events.length === 0 ? (
								<tr>
									<td colSpan={4} className="py-8 text-center text-gray-500">
										No events found.
									</td>
								</tr>
							) : (
								events.map((event: any) => {
									const eventId = event._id || event.id;
									const currentAttendees = attendeeCountMap[eventId] || 0;
									const progressPercent = Math.min(
										100,
										(currentAttendees / event.maxAttendees) * 100,
									);

									return (
										<tr
											key={eventId.toString()}
											className="hover:bg-gray-50/50 transition-colors"
										>
											<td className="px-6 py-4">
												<p className="font-semibold text-gray-900 text-sm">
													{event.title}
												</p>
												<p className="text-gray-400 text-xs mt-0.5">
													{event.location}
												</p>
											</td>
											<td className="px-4 py-4 hidden sm:table-cell">
												<p className="text-xs text-gray-700 font-medium">
													{new Date(event.startAt).toLocaleDateString()}
												</p>
											</td>
											<td className="px-4 py-4">
												<p className="text-xs text-gray-600 font-medium mb-1">
													{currentAttendees} / {event.maxAttendees}
												</p>
												<div className="h-1.5 w-16 bg-gray-100 rounded-full overflow-hidden">
													{/* Real Progress Bar */}
													<div
														className={`h-full rounded-full ${progressPercent >= 100 ? "bg-red-500" : "bg-purple-500"}`}
														style={{ width: `${progressPercent}%` }}
													/>
												</div>
											</td>
											<td className="px-4 py-4">
												{getStatusBadge(event.status)}
											</td>
										</tr>
									);
								})
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
