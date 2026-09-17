import type { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

export function GlassCard({
  children,
  className = "",
}: GlassCardProps): React.ReactNode {
  return (
    <div
      className={`rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-md ${className}`.trim()}
    >
      {children}
    </div>
  );
}
