"use client";

import Link from "next/link";

interface TrendCardProps {
  trend: {
    id: string;
    name: string;
    slug: string;
    volume: number | null;
    growthPct: number | null;
    category: string | null;
    description: string | null;
    _count: {
      ideas: number;
      dataPoints?: number;
    };
    dataPoints?: { date: Date | string; value: number }[];
  };
}

function MiniSparkline({ data }: { data: { value: number }[] }) {
  if (!data || data.length < 2) return null;

  const values = data.map((d) => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const width = 80;
  const height = 32;
  const padding = 2;

  const points = values
    .map((v, i) => {
      const x = padding + (i / (values.length - 1)) * (width - padding * 2);
      const y = height - padding - ((v - min) / range) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(" ");

  const lastValue = values[values.length - 1];
  const firstValue = values[0];
  const isUp = lastValue >= firstValue;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="flex-shrink-0"
    >
      <polyline
        fill="none"
        stroke={isUp ? "#22c55e" : "#ef4444"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

function GrowthBadge({ pct }: { pct: number | null }) {
  if (pct === null || pct === undefined) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-zinc-800 px-2.5 py-1 text-xs font-medium text-zinc-400">
        N/A
      </span>
    );
  }

  const isPositive = pct >= 0;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
        isPositive
          ? "bg-emerald-500/15 text-emerald-400"
          : "bg-red-500/15 text-red-400"
      }`}
    >
      <svg
        width="10"
        height="10"
        viewBox="0 0 10 10"
        fill="none"
        className={!isPositive ? "rotate-180" : ""}
      >
        <path
          d="M5 1L9 6H1L5 1Z"
          fill="currentColor"
        />
      </svg>
      {isPositive ? "+" : ""}
      {pct.toFixed(1)}%
    </span>
  );
}

export function TrendCard({ trend }: TrendCardProps) {
  return (
    <Link href={`/trends/${trend.slug}`}>
      <div className="group rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 transition-all hover:border-emerald-500/30 hover:bg-zinc-900">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              {trend.category && (
                <span className="rounded-md bg-zinc-800 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-zinc-400">
                  {trend.category}
                </span>
              )}
            </div>
            <h3 className="text-base font-semibold text-white truncate group-hover:text-emerald-400 transition-colors">
              {trend.name}
            </h3>
            {trend.description && (
              <p className="mt-1.5 text-sm text-zinc-400 line-clamp-2">
                {trend.description}
              </p>
            )}
          </div>
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <GrowthBadge pct={trend.growthPct} />
            {trend.dataPoints && trend.dataPoints.length > 1 && (
              <MiniSparkline data={trend.dataPoints} />
            )}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-4 text-xs text-zinc-500">
          {trend.volume !== null && (
            <div className="flex items-center gap-1">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span>{trend.volume.toLocaleString()} vol</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <span>{trend._count.ideas} idea{trend._count.ideas !== 1 ? "s" : ""}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function TrendCardSkeleton() {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 animate-pulse">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="h-3 w-16 rounded bg-zinc-800 mb-2" />
          <div className="h-5 w-48 rounded bg-zinc-800 mb-2" />
          <div className="h-4 w-full rounded bg-zinc-800" />
        </div>
        <div className="h-6 w-16 rounded-full bg-zinc-800" />
      </div>
      <div className="mt-4 flex gap-4">
        <div className="h-3 w-20 rounded bg-zinc-800" />
        <div className="h-3 w-16 rounded bg-zinc-800" />
      </div>
    </div>
  );
}
