import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps): React.ReactNode {
  return (
    <div
      className={`rounded-2xl border border-midnight-violet-100 bg-white p-6 ${className}`.trim()}
    >
      {children}
    </div>
  );
}
