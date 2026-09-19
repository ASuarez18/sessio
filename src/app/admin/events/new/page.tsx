// app/admin/events/new/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

/**
 * Create Event Page (Client Component)
 */

export default function CreateEventPage() {
  const router = useRouter();

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

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Combine date and time strings into valid Date objects for the backend
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
        ...(formData.imageUrl && { imageUrl: formData.imageUrl }),
      };

      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create event");
      }

      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      console.error("Submission error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto font-sans">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-gray-900">
          Create event
        </h1>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
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

            {/* Category Field */}
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
                <option value="Software Engineering">Software Engineering</option>
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
                href="/admin"
                className="px-6 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2.5 bg-gray-900 text-white font-semibold rounded-lg hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Saving..." : "Save event"}
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

            <div className="relative rounded-xl bg-gray-100 aspect-video mb-4 flex items-center justify-center overflow-hidden">
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

            <h3 className="font-heading text-xl font-bold text-gray-900 mb-3 break-words">
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
  );
}