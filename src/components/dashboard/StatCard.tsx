"use client";

import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface StatCardProps {
  label: string;
  value: number;
  change?: number;
  icon: React.ReactNode;
  color?: "green" | "blue" | "purple" | "amber" | "rose";
}

const colorMap = {
  green: {
    icon: "text-green-400 bg-green-400/10",
    badge: "text-green-400 bg-green-400/10",
    glow: "shadow-green-400/5",
  },
  blue: {
    icon: "text-blue-400 bg-blue-400/10",
    badge: "text-blue-400 bg-blue-400/10",
    glow: "shadow-blue-400/5",
  },
  purple: {
    icon: "text-purple-400 bg-purple-400/10",
    badge: "text-purple-400 bg-purple-400/10",
    glow: "shadow-purple-400/5",
  },
  amber: {
    icon: "text-amber-400 bg-amber-400/10",
    badge: "text-amber-400 bg-amber-400/10",
    glow: "shadow-amber-400/5",
  },
  rose: {
    icon: "text-rose-400 bg-rose-400/10",
    badge: "text-rose-400 bg-rose-400/10",
    glow: "shadow-rose-400/5",
  },
};

export function StatCard({
  label,
  value,
  change,
  icon,
  color = "green",
}: StatCardProps) {
  const colors = colorMap[color];

  return (
    <div
      className={cn(
        "relative rounded-xl border border-[#2a2a2a] bg-[#111111] p-5",
        "hover:border-[#3a3a3a] transition-all duration-200",
        "shadow-lg",
        colors.glow
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-3xl font-bold tracking-tight text-white">
            {value.toLocaleString()}
          </p>
        </div>
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-lg",
            colors.icon
          )}
        >
          {icon}
        </div>
      </div>

      {change !== undefined && (
        <div className="mt-3 flex items-center gap-1.5">
          <span
            className={cn(
              "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
              change > 0
                ? "text-green-400 bg-green-400/10"
                : change < 0
                ? "text-red-400 bg-red-400/10"
                : "text-muted-foreground bg-[#1a1a1a]"
            )}
          >
            {change > 0 ? "+" : ""}
            {change}%
          </span>
          <span className="text-xs text-muted-foreground">vs last week</span>
        </div>
      )}
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-xl border border-[#2a2a2a] bg-[#111111] p-5">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-16" />
        </div>
        <Skeleton className="h-10 w-10 rounded-lg" />
      </div>
      <div className="mt-3">
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
}
