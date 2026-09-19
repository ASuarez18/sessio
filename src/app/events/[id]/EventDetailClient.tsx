"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  User,
  Users,
  FileText,
  Navigation,
  HelpCircle,
} from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { Badge } from "@/components/ui/Badge";
import type { EventDetailData } from "./page";

interface EventDetailClientProps {
  session: EventDetailData;
}

export default function EventDetailClient({ session }: EventDetailClientProps) {
  const { user, isLoading } = useAuth();

  const [isRegistered, setIsRegistered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredCount, setRegisteredCount] = useState(
    session.registeredCount,
  );

  const maxAttendees = session.maxAttendees;
  const spotsLeft = Math.max(0, maxAttendees - registeredCount);
  const progressPercentage =
    maxAttendees > 0
      ? Math.min(100, (registeredCount / maxAttendees) * 100)
      : 0;

  // Verificar si el usuario ya está registrado al cargar el componente
  useEffect(() => {
    let isMounted = true;

    async function checkRegistrationStatus() {
      if (!user) {
        if (isMounted) setIsRegistered(false);
        return;
      }

      try {
        const res = await fetch("/api/registrations/me");
        if (res.ok && isMounted) {
          const data = await res.json();
          const isUserRegistered = data.registrations?.some(
            (reg: { event: string | { _id: string } }) => {
              const regEventId =
                typeof reg.event === "object" ? reg.event._id : reg.event;
              return regEventId === session.id;
            },
          );
          setIsRegistered(!!isUserRegistered);
        }
      } catch (err) {
        console.error("Error checking registration status:", err);
      }
    }

    checkRegistrationStatus();

    return () => {
      isMounted = false;
    };
  }, [user, session.id]);

  const handleRegister = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/registrations/${session.id}`, {
        method: "POST",
      });

      if (res.ok) {
        setIsRegistered(true);
        setRegisteredCount((prev) => prev + 1);
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Failed to register");
      }
    } catch (err) {
      console.error("Error registering for event:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelRegistration = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/registrations/${session.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setIsRegistered(false);
        setRegisteredCount((prev) => Math.max(0, prev - 1));
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Failed to cancel registration");
      }
    } catch (err) {
      console.error("Error cancelling registration:", err);
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
                  src={session.imageUrl}
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
                    "A hands-on session covering core technologies, component design, and practical exercises. Perfect for developers looking to level up their skill set."}
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
                    A laptop, charger, and curiosity. All materials provided on
                    the day.
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
                      <p className="font-bold text-midnight-violet-900">
                        {session.date}
                      </p>
                      <p className="text-xs text-midnight-violet-500">
                        {session.time}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 text-midnight-violet-400" />
                    <div>
                      <p className="font-bold text-midnight-violet-900">
                        {session.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <User className="mt-0.5 h-5 w-5 text-midnight-violet-400" />
                    <div>
                      <p className="text-xs text-midnight-violet-500">
                        Instructor
                      </p>
                      <p className="font-bold text-midnight-violet-900">
                        Sessio Team
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Users className="mt-0.5 h-5 w-5 text-midnight-violet-400" />
                    <div>
                      <p className="font-bold text-midnight-violet-900">
                        {registeredCount} / {maxAttendees} registered
                      </p>
                      <p className="text-xs text-midnight-violet-500">
                        {spotsLeft > 0
                          ? `${spotsLeft} spots remaining`
                          : "Session full"}
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
                  ) : spotsLeft <= 0 ? (
                    <div className="w-full">
                      <button
                        disabled
                        className="w-full cursor-not-allowed rounded-xl bg-gray-200 py-3.5 text-center font-bold text-gray-500"
                      >
                        Session Full
                      </button>
                      {!user && (
                        <p className="mt-3 text-xs text-midnight-violet-500">
                          This session is at maximum capacity.
                        </p>
                      )}
                    </div>
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
                  ) : (
                    <button
                      onClick={handleRegister}
                      disabled={isSubmitting}
                      className="w-full rounded-xl bg-raspberry-red-500 py-3.5 text-center font-bold text-white transition-colors hover:bg-raspberry-red-600 disabled:bg-gray-300"
                    >
                      {isSubmitting ? "Registering..." : "Register for session"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
