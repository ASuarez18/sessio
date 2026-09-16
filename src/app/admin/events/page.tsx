// app/admin/page.tsx
import Link from "next/link";
import { getAllUsers } from "@/services/user.service";
import { getEvents } from "@/services/event.service";

/**
 * Admin Dashboard Page (Server Component)
 * Fetches data directly from the Service layer per project guidelines.
 */
export default async function AdminDashboard() {
	// 1. Fetch data directly from the service layers
	const users = await getAllUsers();
	const events = await getEvents();

	// TODO: Fetch real total registrations once registration.service is ready by the team
	const totalRegistrations = 0;

	return (
		<div className="max-w-6xl mx-auto p-6">
			<div className="flex justify-between items-center mb-8">
				<h1 className="text-3xl font-bold">Admin dashboard</h1>
				<Link
					href="/admin/events/new"
					className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
				>
					Create event
				</Link>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
				<div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
					<h2 className="text-gray-500 text-sm font-medium mb-2">
						Total users
					</h2>
					<p className="text-4xl font-bold">{users.length}</p>
				</div>

				<div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
					<h2 className="text-gray-500 text-sm font-medium mb-2">
						Total events
					</h2>
					<p className="text-4xl font-bold">{events.length}</p>
				</div>

				<div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
					<h2 className="text-gray-500 text-sm font-medium mb-2">
						Registrations
					</h2>
					<p className="text-4xl font-bold">{totalRegistrations}</p>
				</div>
			</div>

			{/* Recent Events Table */}
			<div className="mb-8">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-xl font-bold">Recent events</h2>
					<Link
						href="/admin/events"
						className="text-blue-600 hover:underline text-sm"
					>
						View all events &rarr;
					</Link>
				</div>

				<div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
					<table className="w-full text-left border-collapse">
						<thead className="bg-gray-50 border-b border-gray-200">
							<tr>
								<th className="py-3 px-4 font-medium text-gray-700">
									Event name
								</th>
								<th className="py-3 px-4 font-medium text-gray-700">Date</th>
								<th className="py-3 px-4 font-medium text-gray-700">
									Attendees
								</th>
								<th className="py-3 px-4 font-medium text-gray-700">Status</th>
								<th className="py-3 px-4 font-medium text-gray-700 text-right">
									Action
								</th>
							</tr>
						</thead>
						<tbody>
							{events.length === 0 ? (
								<tr>
									<td colSpan={5} className="py-8 text-center text-gray-500">
										No events found. Create one to get started!
									</td>
								</tr>
							) : (
								events.map((event) => (
									<tr
										key={event.id || (event._id as string)}
										className="border-b border-gray-100 hover:bg-gray-50"
									>
										<td className="py-3 px-4">{event.title}</td>
										<td className="py-3 px-4">
											{new Date(event.startAt).toLocaleDateString()}
										</td>
										<td className="py-3 px-4">
											{/* TODO: Update this when we can fetch attendee counts per event from registrations */}
											0
										</td>
										<td className="py-3 px-4">
											<span className="px-2 py-1 bg-gray-200 text-xs rounded-full capitalize">
												{event.status}
											</span>
										</td>
										<td className="py-3 px-4 text-right">
											<Link
												href={`/admin/events/${event.id || event._id}/edit`}
												className="border border-gray-300 px-3 py-1 rounded text-sm hover:bg-gray-100"
											>
												Edit
											</Link>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
