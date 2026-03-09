"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

type StartupStatus = "INACTIVE" | "ACQUIRED" | "PIVOTED" | "UNKNOWN";

interface GraveyardCardProps {
  name: string;
  slug: string;
  batch: string;
  batchLabel: string;
  status: StartupStatus;
  category: string | null;
  categories: string[];
  description: string | null;
  founders: string | null;
  funding: string | null;
  shutdownYear: number | null;
  successor: string | null;
  successorUrl: string | null;
  linkedIdea?: { id: string; slug: string; title: string } | null;
  className?: string;
}

const STATUS_CONFIG: Record<StartupStatus, { label: string; color: string; bg: string; icon: string }> = {
  INACTIVE: {
    label: "Dead",
    color: "text-red-400",
    bg: "bg-red-500/10 border-red-500/20",
    icon: "💀",
  },
  ACQUIRED: {
    label: "Acquired",
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
    icon: "🤝",
  },
  PIVOTED: {
    label: "Pivoted",
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/20",
    icon: "🔄",
  },
  UNKNOWN: {
    label: "Unknown",
    color: "text-zinc-400",
    bg: "bg-zinc-500/10 border-zinc-500/20",
    icon: "❓",
  },
};

export function GraveyardCard({
  name,
  slug,
  batch,
  batchLabel,
  status,
  category,
  categories,
  description,
  founders,
  funding,
  shutdownYear,
  successor,
  successorUrl,
  linkedIdea,
  className,
}: GraveyardCardProps) {
  const statusConfig = STATUS_CONFIG[status];

  return (
    <Link
      href={`/graveyard/${slug}`}
      className={cn(
        "group relative flex flex-col rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 transition-all duration-300",
        "hover:border-zinc-700 hover:bg-zinc-900 hover:shadow-lg hover:shadow-black/20",
        "hover:-translate-y-0.5",
        className
      )}
    >
      {/* Header: Name + Status */}
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors">
            {name}
          </h3>
          <div className="mt-1 flex items-center gap-2 text-xs text-zinc-500">
            <span className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono">
              {batch}
            </span>
            <span>{batchLabel}</span>
          </div>
        </div>
        <span
          className={cn(
            "flex-shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium",
            statusConfig.bg,
            statusConfig.color
          )}
        >
          {statusConfig.icon} {statusConfig.label}
        </span>
      </div>

      {/* Description */}
      {description && (
        <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-zinc-400">
          {description}
        </p>
      )}

      {/* Meta Row */}
      <div className="mt-auto flex flex-wrap items-center gap-2">
        {/* Category */}
        {category && (
          <span className="rounded-md border border-zinc-800 bg-zinc-800/50 px-2 py-0.5 text-xs text-zinc-400">
            {category}
          </span>
        )}

        {/* Shutdown Year */}
        {shutdownYear && (
          <span className="flex items-center gap-1 text-xs text-zinc-500">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {shutdownYear}
          </span>
        )}

        {/* Founders */}
        {founders && (
          <span className="flex items-center gap-1 text-xs text-zinc-500">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="max-w-[120px] truncate">{founders}</span>
          </span>
        )}

        {/* Funding */}
        {funding && (
          <span className="flex items-center gap-1 text-xs text-zinc-500">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {funding}
          </span>
        )}
      </div>

      {/* Successor / Linked Idea */}
      {(successor || linkedIdea) && (
        <div className="mt-3 flex flex-wrap gap-2 border-t border-zinc-800/50 pt-3">
          {successor && (
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/5 border border-emerald-500/10 px-2 py-0.5 text-xs text-emerald-400">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              {successor}
            </span>
          )}
          {linkedIdea && (
            <span className="inline-flex items-center gap-1 rounded-md bg-violet-500/5 border border-violet-500/10 px-2 py-0.5 text-xs text-violet-400">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              IdeaVault match
            </span>
          )}
        </div>
      )}
    </Link>
  );
}

/* ===== Skeleton ===== */

export function GraveyardCardSkeleton() {
  return (
    <div className="flex flex-col rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
      <div className="mb-3 flex items-start justify-between">
        <div className="flex-1">
          <div className="h-5 w-36 animate-pulse rounded bg-zinc-800" />
          <div className="mt-2 flex gap-2">
            <div className="h-4 w-10 animate-pulse rounded bg-zinc-800" />
            <div className="h-4 w-20 animate-pulse rounded bg-zinc-800" />
          </div>
        </div>
        <div className="h-6 w-16 animate-pulse rounded-full bg-zinc-800" />
      </div>
      <div className="mb-4 space-y-2">
        <div className="h-3.5 w-full animate-pulse rounded bg-zinc-800" />
        <div className="h-3.5 w-3/4 animate-pulse rounded bg-zinc-800" />
      </div>
      <div className="mt-auto flex gap-2">
        <div className="h-5 w-16 animate-pulse rounded bg-zinc-800" />
        <div className="h-5 w-12 animate-pulse rounded bg-zinc-800" />
      </div>
    </div>
  );
}
