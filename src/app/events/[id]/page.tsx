"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState, use } from "react";
import { ArrowLeft, Calendar, MapPin, User, Users, FileText, Navigation, HelpCircle } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { SESSIONS } from "@/lib/mock-data";
import { Badge } from "@/components/ui/Badge";
import { Footer } from "@/components/common/Footer";

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user, isLoading } = useAuth();
  
  // mock fallback data
  const session = SESSIONS.find((s) => s.id === id) || SESSIONS[0];

  const [isRegistered, setIsRegistered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const registeredCount = session.registeredCount ?? 31;
  const maxAttendees = session.maxAttendees ?? 40;
  const spotsLeft = maxAttendees - registeredCount;
  const progressPercentage = Math.min(100, (registeredCount / maxAttendees) * 100);

  const handleRegister = async () => {
    setIsSubmitting(true);
    try {
      // POST /api/registrations/[id]
      await new Promise((res) => setTimeout(res, 500));
      setIsRegistered(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelRegistration = async () => {
    setIsSubmitting(true);
    try {
      // DELETE /api/registrations/[id]
      await new Promise((res) => setTimeout(res, 500));
      setIsRegistered(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <main className="min-h-screen bg-[#f8eff8] py-10 text-midnight-violet-900">
        <div className="mx-auto max-w-7xl px-6">
          {/* Back button */}
          <Link
            href="/events"
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-midnight-violet-700 hover:text-midnight-violet-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to sessions
          </Link>

          <div className="grid gap-8 lg:grid-cols-12">
            {/* Left Column: Image, Description & Extra info */}
            <div className="lg:col-span-7">
              <div className="relative aspect-16/10 overflow-hidden rounded-2xl border border-[#e5b5e0] bg-white shadow-sm">
                <Image
                  src={session.imageUrl || "https://picsum.photos/seed/sessio-hero/1600/900"}
                  alt={session.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* About this session */}
              <div className="mt-8 rounded-2xl border border-[#e5b5e0] bg-white p-8 shadow-sm">
                <h2 className="font-serif text-2xl font-bold text-midnight-violet-900">
                  About this session
                </h2>
                <p className="mt-4 leading-relaxed text-midnight-violet-700">
                  {session.description ||
                    "A hands-on full-morning bootcamp covering React hooks, component design, and state management. Perfect for developers with basic JavaScript knowledge who want to level up. You will build a real mini-application by the end of the session."}
                </p>
              </div>

              {/* Quick Info Grid */}
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-[#e5b5e0] bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-2 font-bold text-midnight-violet-900">
                    <FileText className="h-4 w-4 text-[#934295]" />
                    What to bring
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-midnight-violet-600">
                    A laptop, charger, and curiosity. All materials provided on the day.
                  </p>
                </div>

                <div className="rounded-2xl border border-[#e5b5e0] bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-2 font-bold text-midnight-violet-900">
                    <Navigation className="h-4 w-4 text-[#934295]" />
                    Getting there
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-midnight-violet-600">
                    {session.location}
                  </p>
                </div>

                <div className="rounded-2xl border border-[#e5b5e0] bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-2 font-bold text-midnight-violet-900">
                    <HelpCircle className="h-4 w-4 text-[#934295]" />
                    Questions?
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-midnight-violet-600">
                    Email us at sessions@sessio.com
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Sticky Event Details Card */}
            <div className="lg:col-span-5">
              <div className="sticky top-8 rounded-2xl border border-[#e5b5e0] bg-white p-8 shadow-sm">
                <span className="inline-block">
                  <Badge>{session.category}</Badge>
                </span>

                <h1 className="mt-4 font-serif text-3xl font-bold leading-tight text-midnight-violet-900">
                  {session.title}
                </h1>

                {/* Details List */}
                <div className="mt-6 flex flex-col gap-4 text-sm font-medium text-midnight-violet-700">
                  <div className="flex items-start gap-3">
                    <Calendar className="mt-0.5 h-5 w-5 text-midnight-violet-400" />
                    <div>
                      <p className="font-bold text-midnight-violet-900">{session.date}</p>
                      <p className="text-xs text-midnight-violet-500">{session.time || "9:00 AM - 1:00 PM"}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 text-midnight-violet-400" />
                    <div>
                      <p className="font-bold text-midnight-violet-900">{session.location}</p>
                      <p className="text-xs text-midnight-violet-500">Carrer de Pallars 122, Barcelona</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <User className="mt-0.5 h-5 w-5 text-midnight-violet-400" />
                    <div>
                      <p className="text-xs text-midnight-violet-500">Instructor</p>
                      <p className="font-bold text-midnight-violet-900">Marta Solé</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Users className="mt-0.5 h-5 w-5 text-midnight-violet-400" />
                    <div>
                      <p className="font-bold text-midnight-violet-900">
                        {registeredCount} / {maxAttendees} registered
                      </p>
                      <p className="text-xs text-midnight-violet-500">
                        {spotsLeft > 0 ? `${spotsLeft} spots remaining` : "Session full"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-midnight-violet-100">
                  <div
                    className="h-full bg-[#934295] transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>

                {/* CTA Action Section */}
                <div className="mt-8 flex flex-col items-center text-center">
                  {isLoading ? (
                    <div className="h-12 w-full animate-pulse rounded-xl bg-midnight-violet-100" />
                  ) : !user ? (
                    <>
                      <Link
                        href={`/login?from=/events/${session.id}`}
                        className="w-full rounded-xl bg-raspberry-red-500 py-3.5 text-center font-bold text-white transition-colors hover:bg-raspberry-red-600"
                      >
                        Sign in to register
                      </Link>
                      <Link
                        href="/register"
                        className="mt-3 text-xs font-semibold text-midnight-violet-600 underline hover:text-midnight-violet-900"
                      >
                        Create a free account to register
                      </Link>
                    </>
                  ) : isRegistered ? (
                    <div className="w-full">
                      <div className="mb-3 rounded-xl bg-emerald-50 py-2.5 text-sm font-bold text-emerald-700">
                        ✓ You are registered!
                      </div>
                      <button
                        onClick={handleCancelRegistration}
                        disabled={isSubmitting}
                        className="w-full rounded-xl border border-raspberry-red-200 py-3 text-sm font-bold text-raspberry-red-600 hover:bg-raspberry-red-50 disabled:opacity-50"
                      >
                        {isSubmitting ? "Cancelling..." : "Cancel registration"}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleRegister}
                      disabled={isSubmitting || spotsLeft <= 0}
                      className="w-full rounded-xl bg-raspberry-red-500 py-3.5 text-center font-bold text-white transition-colors hover:bg-raspberry-red-600 disabled:bg-gray-300"
                    >
                      {spotsLeft <= 0
                        ? "Session Full"
                        : isSubmitting
                        ? "Registering..."
                        : "Register for session"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}