// app/admin/events/[id]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { getEventById } from "../../../../services/event.service";
import { getEventRegistrations } from "../../../../services/registration.service";

/**
 * Admin Event Detail Page (Server Component)
 */
export default async function AdminEventDetailPage({
	params,
}: {
	params: Promise<{ id: string }>
}) {
	const { id: eventId } = await params;

	const [eventData, registrations] = await Promise.all([
		getEventById(eventId),
		getEventRegistrations(eventId),
	]);

	if (!eventData || !eventData.event) {
		notFound();
	}

	const { event, registeredCount } = eventData;
	const actualEventId = event._id;

	console.log("actualEventId ===> ", actualEventId);

	const getStatusBadge = (status: string) => {
		switch (status.toLowerCase()) {
			case "confirmed":
			case "registered":
				return (
					<span className="text-xs bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-full capitalize font-medium">
						{status}
					</span>
				);
			case "waitlist":
				return (
					<span className="text-xs bg-gray-100 text-gray-600 border border-gray-200 px-2.5 py-1 rounded-full capitalize font-medium">
						{status}
					</span>
				);
			case "cancelled":
				return (
					<span className="text-xs bg-red-50 text-red-700 border border-red-200 px-2.5 py-1 rounded-full capitalize font-medium">
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

	return (
		<div className="p-6 sm:p-8 max-w-7xl mx-auto font-sans">
			{/* Back Link */}
			<Link
				href="/admin/events"
				className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-900 text-sm mb-6 transition-colors font-medium"
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
						d="M10 19l-7-7m0 0l7-7m-7 7h18"
					/>
				</svg>
				Back to events
			</Link>

			{/* Event Title Header */}
			<div className="mb-6 flex items-center justify-between">
				<h1 className="font-heading text-3xl font-bold text-gray-900">
					{event.title}
				</h1>
				<Link
					href={`/admin/events/${actualEventId}/edit`}
					className="px-5 py-2 text-sm font-semibold border border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 rounded-xl transition-all"
				>
					Edit event
				</Link>
			</div>

			{/* Event Summary Bar (Based on Wireframe) */}
			<div className="bg-white rounded-xl border border-gray-200 p-0 mb-8 shadow-sm flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-200">
				<div className="flex-1 p-5 flex items-center gap-4">
					<div className="text-gray-400">
						<svg
							className="w-6 h-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={1.5}
								d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
							/>
						</svg>
					</div>
					<div>
						<p className="text-xs text-gray-500 font-medium mb-0.5">Date</p>
						<p className="text-sm text-gray-900 font-semibold">
							{new Date(event.startAt).toLocaleDateString()}
						</p>
					</div>
				</div>

				<div className="flex-1 p-5 flex items-center gap-4">
					<div className="text-gray-400">
						<svg
							className="w-6 h-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={1.5}
								d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
							/>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={1.5}
								d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
							/>
						</svg>
					</div>
					<div>
						<p className="text-xs text-gray-500 font-medium mb-0.5">Location</p>
						<p
							className="text-sm text-gray-900 font-semibold truncate max-w-[200px]"
							title={event.location}
						>
							{event.location}
						</p>
					</div>
				</div>

				<div className="flex-1 p-5 flex items-center gap-4">
					<div className="text-gray-400">
						<svg
							className="w-6 h-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={1.5}
								d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
							/>
						</svg>
					</div>
					<div>
						<p className="text-sm text-gray-900 font-semibold">
							{registeredCount} / {event.maxAttendees} registered
						</p>
					</div>
				</div>
			</div>

			{/* Registered Users Table */}
			<div className="mb-4 flex items-center justify-between">
				<h2 className="font-heading font-bold text-gray-900 text-xl">
					Registered users
				</h2>
				<span className="text-sm font-medium text-gray-500">
					Total: {registrations.length} users
				</span>
			</div>

			<div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
				{registrations.length === 0 ? (
					<div className="p-12 text-center">
						<p className="text-gray-500 text-sm">
							No users have registered for this event yet.
						</p>
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full text-left">
							<thead>
								<tr className="bg-gray-50 border-b border-gray-200">
									<th className="px-6 py-3.5 text-sm font-semibold text-gray-700">
										Name
									</th>
									<th className="px-6 py-3.5 text-sm font-semibold text-gray-700 hidden sm:table-cell">
										Email
									</th>
									<th className="px-6 py-3.5 text-sm font-semibold text-gray-700">
										Registered on
									</th>
									<th className="px-6 py-3.5 text-sm font-semibold text-gray-700">
										Status
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-100">
								{registrations.map((reg: any) => (
									<tr
										key={reg._id || reg.id}
										className="hover:bg-gray-50 transition-colors"
									>
										<td className="px-6 py-4">
											{/* Using populated user data from registration.service.ts */}
											<p className="text-sm text-gray-900">
												{reg.user?.name || "Unknown User"}
											</p>
										</td>
										<td className="px-6 py-4 hidden sm:table-cell">
											<p className="text-sm text-gray-600">
												{reg.user?.email || "N/A"}
											</p>
										</td>
										<td className="px-6 py-4">
											<p className="text-sm text-gray-700">
												{new Date(reg.registeredAt).toLocaleDateString()}
											</p>
										</td>
										<td className="px-6 py-4">{getStatusBadge(reg.status)}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</div>
	);
}
