import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

export function GlassCard({
  children,
  className,
}: GlassCardProps): React.ReactNode {
  return (
    <div
      className={cn(
        "rounded-xl border border-white/20 bg-white/10 p-5 backdrop-blur-md",
        className,
      )}
    >
      {children}
    </div>
  );
}
