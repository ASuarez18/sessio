// app/admin/events/[id]/edit/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * Edit Event Page (Client Component)
 * Fetches existing event data, populates the form, and handles updates.
 */
export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Uncategorized",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    maxAttendees: "",
    status: "upcoming",
    imageUrl: "",
  });

  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/events/${eventId}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch event details");

        const data = await res.json();

        const event = data.event || data;

        const startDate = new Date(event.startAt);
        const endDate = new Date(event.endAt);

        setFormData({
          title: event.title || "",
          description: event.description || "",
          category: event.category || "Uncategorized",
          date: startDate.toISOString().split("T")[0],
          startTime: startDate.toTimeString().slice(0, 5),
          endTime: endDate.toTimeString().slice(0, 5),
          location: event.location || "",
          maxAttendees: event.maxAttendees?.toString() || "",
          status: event.status || "upcoming",
          imageUrl: event.imageUrl || "",
        });
      } catch (err: any) {
        console.error("Error loading event:", err);
        setError(err.message || "Could not load event data");
      } finally {
        setIsInitialLoading(false);
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      const startAt = new Date(`${formData.date}T${formData.startTime}`);
      const endAt = new Date(`${formData.date}T${formData.endTime}`);

      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        startAt: startAt.toISOString(),
        endAt: endAt.toISOString(),
        location: formData.location,
        maxAttendees: Number(formData.maxAttendees),
        status: formData.status,
        imageUrl: formData.imageUrl || "",
      };

      const res = await fetch(`/api/events/${eventId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        cache: "no-store",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update event");
      }

      router.push(`/admin/events/${eventId}`);
      router.refresh();
    } catch (err: any) {
      console.error("Update error:", err);
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsSaving(true);
    setError("");

    try {
      const res = await fetch(`/api/events/${eventId}`, {
        method: "DELETE",
        cache: "no-store",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete event");
      }
      setShowDeleteModal(false);
      router.push("/admin/events");
      router.refresh();
    } catch (err: any) {
      console.error("Delete error:", err);
      setError(err.message);
      setIsSaving(false);
      setShowDeleteModal(false);
    }
  };
  if (isInitialLoading) {
    return (
      <div className="p-8 text-center text-gray-500 font-sans">
        Loading event details...
      </div>
    );
  }

  return (
    <>
      <div className="p-6 sm:p-8 max-w-7xl mx-auto font-sans">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-heading text-3xl font-bold text-gray-900">
            Edit event
          </h1>

          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            disabled={isSaving}
            className="flex items-center justify-center gap-2 p-2.5 text-sm font-semibold text-rose-700 border border-rose-200 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
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
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Delete
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-semibold text-gray-700 mb-1"
                >
                  Event title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter event title"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-semibold text-gray-700 mb-1"
                >
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-purple-600 outline-none bg-white"
                >
                  <option value="Web Dev">Web Dev</option>
                  <option value="Software Engineering">
                    Software Engineering
                  </option>
                  <option value="AI & ML">AI & ML</option>
                  <option value="UI design">UI design</option>
                  <option value="Design">Design</option>
                  <option value="Data">Data</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="Cloud & DevOps">Cloud & DevOps</option>
                  <option value="Uncategorized">Uncategorized</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-semibold text-gray-700 mb-1"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter event description"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none resize-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="date"
                    className="block text-sm font-semibold text-gray-700 mb-1"
                  >
                    Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    required
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-purple-600 outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="startTime"
                    className="block text-sm font-semibold text-gray-700 mb-1"
                  >
                    Start time
                  </label>
                  <input
                    type="time"
                    id="startTime"
                    name="startTime"
                    required
                    value={formData.startTime}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-purple-600 outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="endTime"
                    className="block text-sm font-semibold text-gray-700 mb-1"
                  >
                    End time
                  </label>
                  <input
                    type="time"
                    id="endTime"
                    name="endTime"
                    required
                    value={formData.endTime}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-purple-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-semibold text-gray-700 mb-1"
                >
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Enter location"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-purple-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="maxAttendees"
                    className="block text-sm font-semibold text-gray-700 mb-1"
                  >
                    Maximum attendees
                  </label>
                  <input
                    type="number"
                    id="maxAttendees"
                    name="maxAttendees"
                    min="1"
                    required
                    value={formData.maxAttendees}
                    onChange={handleChange}
                    placeholder="Enter maximum number"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-purple-600 outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="status"
                    className="block text-sm font-semibold text-gray-700 mb-1"
                  >
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-purple-600 outline-none bg-white"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="imageUrl"
                  className="block text-sm font-semibold text-gray-700 mb-1"
                >
                  Image URL (optional)
                </label>
                <input
                  type="url"
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="Enter image URL"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-purple-600 outline-none"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Link
                  href={`/admin/events/${eventId}`}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-gray-900 text-white font-semibold rounded-lg hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? "Updating..." : "Update event"}
                </button>
              </div>
            </form>
          </div>

          {/* Live Preview Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h2 className="font-heading text-lg font-bold text-gray-900 mb-4">
                Event preview
              </h2>

              <div className="rounded-xl bg-gray-100 aspect-video mb-4 flex items-center justify-center overflow-hidden">
                {formData.imageUrl ? (
                  <img
                    src={formData.imageUrl}
                    alt="Event preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg
                    className="w-10 h-10 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                )}
              </div>

              <span className="inline-block px-2.5 py-1 text-xs font-semibold bg-purple-100 text-purple-800 rounded-full mb-2">
                {formData.category}
              </span>

              <h3 className="font-heading text-xl font-bold text-gray-900 mb-3 wrap-break-word">
                {formData.title || "Event title"}
              </h3>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <svg
                    className="w-4 h-4 shrink-0"
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
                  <span>{formData.date || "Date"}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <svg
                    className="w-4 h-4 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>
                    {formData.startTime || "Start time"} -{" "}
                    {formData.endTime || "End time"}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <svg
                    className="w-4 h-4 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="truncate">
                    {formData.location || "Location"}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <svg
                    className="w-4 h-4 shrink-0"
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
                  <span>0 / {formData.maxAttendees || "0"} attendees</span>
                </div>
              </div>

              <p className="text-sm text-gray-600 line-clamp-3">
                {formData.description ||
                  "Event description will appear here in a few lines."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl transform transition-all">
            <div className="flex items-center gap-3 mb-4 text-rose-600">
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
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <h3 className="text-lg font-bold text-gray-900 font-heading">
                Delete Event
              </h3>
            </div>

            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-900">
                &quot;{formData.title}&quot;
              </span>
              ? <br />
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={isSaving}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isSaving}
                className="px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded-lg hover:bg-rose-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isSaving ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
