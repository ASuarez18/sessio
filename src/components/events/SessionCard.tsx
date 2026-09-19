import Image from "next/image";
import { Calendar, MapPin, Users } from "lucide-react";

import { SessionSpots } from "@/components/events/SessionSpots";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { Session } from "@/types/session";

interface SessionCardProps {
  session: Session;
  showTime?: boolean;
  pollAvailability?: boolean;
}

export function SessionCard({
  session,
  showTime = false,
  pollAvailability = false,
}: SessionCardProps): React.ReactNode {
  const isFull = session.spotsLeft <= 0;

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-midnight-violet-100 bg-white">
      <div className="relative aspect-4/3">
        <Image
          src={session.imageUrl}
          alt={session.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <span className="absolute left-4 top-4">
          <Badge>{session.category}</Badge>
        </span>
        {isFull ? (
          <span className="absolute right-4 top-4">
            <Badge tone="dark">Session full</Badge>
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="font-heading text-xl font-bold text-midnight-violet-900">
          {session.title}
        </h3>

        <div className="flex flex-col gap-2 text-sm text-midnight-violet-600">
          <span className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-midnight-violet-400" />
            {showTime && session.time
              ? `${session.date} · ${session.time}`
              : session.date}
          </span>
          <span className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-midnight-violet-400" />
            {session.location}
          </span>
          {pollAvailability ? (
            <SessionSpots
              eventId={session.id}
              initialSpotsLeft={session.spotsLeft}
            />
          ) : (
            <span
              className={`flex items-center gap-2 ${isFull ? "text-raspberry-red-600" : "text-green-600"}`}
            >
              <Users className="h-4 w-4" />
              {isFull ? "Full" : `${session.spotsLeft} spots left`}
            </span>
          )}
        </div>

        <Button
          href={`/events/${session.id}`}
          variant="outline"
          className="mt-2 w-full"
        >
          View details
        </Button>
      </div>
    </article>
  );
}
