import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type BadgeTone = "light" | "dark";

const TONE_CLASSES: Record<BadgeTone, string> = {
  light: "bg-white/85 text-midnight-violet-800 backdrop-blur",
  dark: "bg-midnight-violet-950/85 text-white",
};

interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}

export function Badge({
  children,
  tone = "light",
  className,
}: BadgeProps): React.ReactNode {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        TONE_CLASSES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
