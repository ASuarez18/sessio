import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "outline" | "outlineLight";

const BASE_CLASSES =
  "inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold transition-colors";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-raspberry-red-500 text-white hover:bg-raspberry-red-600",
  outline:
    "border border-midnight-violet-300 text-midnight-violet-800 hover:bg-midnight-violet-50",
  outlineLight: "border border-white/70 text-white hover:bg-white/10",
};

interface ButtonProps {
  href?: string;
  variant?: ButtonVariant;
  type?: "button" | "submit";
  className?: string;
  children: ReactNode;
}

export function Button({
  href,
  variant = "primary",
  type = "button",
  className,
  children,
}: ButtonProps): React.ReactNode {
  const classes = cn(BASE_CLASSES, VARIANT_CLASSES[variant], className);

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes}>
      {children}
    </button>
  );
}
