"use client";

import { cn } from "@/lib/utils";
import type { SubscriptionPlan } from "@prisma/client";

interface PlanBadgeProps {
  plan: SubscriptionPlan;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  className?: string;
}

const PLAN_CONFIG: Record<
  SubscriptionPlan,
  { label: string; color: string; bg: string; border: string; icon: string }
> = {
  FREE: {
    label: "Free",
    color: "text-gray-600 dark:text-gray-400",
    bg: "bg-gray-100 dark:bg-gray-800",
    border: "border-gray-200 dark:border-gray-700",
    icon: "M12 6v6m0 0v6m0-6h6m-6 0H6",
  },
  STARTER: {
    label: "Starter",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950",
    border: "border-blue-200 dark:border-blue-800",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
  },
  PRO: {
    label: "Pro",
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-50 dark:bg-violet-950",
    border: "border-violet-200 dark:border-violet-800",
    icon: "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z",
  },
  EMPIRE: {
    label: "Empire",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950",
    border: "border-amber-200 dark:border-amber-800",
    icon: "M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z",
  },
};

const SIZE_CLASSES = {
  sm: "px-2 py-0.5 text-xs gap-1",
  md: "px-2.5 py-1 text-sm gap-1.5",
  lg: "px-3 py-1.5 text-base gap-2",
};

const ICON_SIZES = {
  sm: "h-3 w-3",
  md: "h-3.5 w-3.5",
  lg: "h-4 w-4",
};

export function PlanBadge({
  plan,
  size = "sm",
  showIcon = true,
  className,
}: PlanBadgeProps) {
  const config = PLAN_CONFIG[plan];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-medium",
        config.bg,
        config.color,
        config.border,
        SIZE_CLASSES[size],
        className
      )}
    >
      {showIcon && (
        <svg
          className={cn(ICON_SIZES[size], "flex-shrink-0")}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d={config.icon}
          />
        </svg>
      )}
      {config.label}
    </span>
  );
}

/** Compact version for sidebar/nav -- just icon + text, no border */
export function PlanBadgeCompact({
  plan,
  className,
}: {
  plan: SubscriptionPlan;
  className?: string;
}) {
  const config = PLAN_CONFIG[plan];

  if (plan === "FREE") return null;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-xs font-medium",
        config.color,
        className
      )}
    >
      <svg
        className="h-3 w-3"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d={config.icon}
        />
      </svg>
      {config.label}
    </span>
  );
}
