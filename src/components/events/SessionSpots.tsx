"use client";

import { Users } from "lucide-react";
import useSWR from "swr";

interface Availability {
  spotsLeft: number;
  isFull: boolean;
}

const fetcher = async (url: string): Promise<Availability> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to load availability");
  }
  return res.json();
};

interface SessionSpotsProps {
  eventId: string;
  initialSpotsLeft: number;
}

export function SessionSpots({ eventId, initialSpotsLeft }: SessionSpotsProps) {
  const { data } = useSWR<Availability>(
    `/api/events/${eventId}/availability`,
    fetcher,
    {
      refreshInterval: 5000,
      fallbackData: {
        spotsLeft: initialSpotsLeft,
        isFull: initialSpotsLeft <= 0,
      },
    },
  );

  const spotsLeft = data?.spotsLeft ?? initialSpotsLeft;
  const isFull = data?.isFull ?? initialSpotsLeft <= 0;

  return (
    <span className={`flex items-center gap-2 ${isFull ? "text-raspberry-red-600" : "text-green-600"}`}>
      <Users className="h-4 w-4" />
      {isFull ? "Full" : `${spotsLeft} spots left`}
    </span>
  );
}
