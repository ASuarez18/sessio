"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface UnregisterButtonProps {
  eventId: string;
}

export function UnregisterButton({ eventId }: UnregisterButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleUnregister(): Promise<void> {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/registrations/${eventId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        router.refresh();
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleUnregister}
      disabled={isLoading}
      className="rounded-xl border border-midnight-violet-300 px-4 py-1.5 text-sm font-medium text-midnight-violet-800 hover:bg-midnight-violet-50 disabled:opacity-50"
    >
      {isLoading ? "..." : "Unregister"}
    </button>
  );
}
