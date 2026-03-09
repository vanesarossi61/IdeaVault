"use client";

import { cn } from "@/lib/utils";

interface GraveyardStatsData {
  total: number;
  inactive: number;
  acquired: number;
  pivoted: number;
  topCategories: { category: string; count: number }[];
  topBatches: { batch: string; count: number }[];
}

interface GraveyardStatsProps {
  data: GraveyardStatsData;
  className?: string;
}

/* ===== Stat Card ===== */

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon: string;
  color: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 transition-colors hover:border-zinc-700"
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-2xl">{icon}</span>
        <span className={cn("text-2xl font-bold tabular-nums", color)}>
          {value.toLocaleString()}
        </span>
      </div>
      <p className="mt-2 text-sm text-zinc-500">{label}</p>
    </div>
  );
}

/* ===== Bar Chart Row ===== */

function BarRow({
  label,
  count,
  maxCount,
  color = "bg-emerald-500",
}: {
  label: string;
  count: number;
  maxCount: number;
  color?: string;
}) {
  const pct = maxCount > 0 ? (count / maxCount) * 100 : 0;

  return (
    <div className="group flex items-center gap-3">
      <span className="w-20 flex-shrink-0 truncate text-xs text-zinc-400 group-hover:text-white transition-colors">
        {label}
      </span>
      <div className="relative h-5 flex-1 overflow-hidden rounded-full bg-zinc-800/50">
        <div
          className={cn(
            "absolute inset-y-0 left-0 rounded-full transition-all duration-500 ease-out",
            color
          )}
          style={{ width: `${Math.max(pct, 2)}%` }}
        />
      </div>
      <span className="w-8 flex-shrink-0 text-right text-xs font-medium tabular-nums text-zinc-400">
        {count}
      </span>
    </div>
  );
}

/* ===== Main Component ===== */

export function GraveyardStats({ data, className }: GraveyardStatsProps) {
  const catMax = data.topCategories[0]?.count ?? 1;
  const batchMax = data.topBatches[0]?.count ?? 1;

  return (
    <div className={cn("space-y-6", className)}>
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          label="Total Startups"
          value={data.total}
          icon="🪦"
          color="text-white"
        />
        <StatCard
          label="Shut Down"
          value={data.inactive}
          icon="💀"
          color="text-red-400"
        />
        <StatCard
          label="Acquired"
          value={data.acquired}
          icon="🤝"
          color="text-blue-400"
        />
        <StatCard
          label="Pivoted"
          value={data.pivoted}
          icon="🔄"
          color="text-amber-400"
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Top Categories */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-500">
            Top Categories
          </h3>
          <div className="space-y-2.5">
            {data.topCategories.slice(0, 8).map((cat) => (
              <BarRow
                key={cat.category}
                label={cat.category}
                count={cat.count}
                maxCount={catMax}
                color="bg-emerald-500/80"
              />
            ))}
            {data.topCategories.length === 0 && (
              <p className="text-sm text-zinc-600">No category data yet.</p>
            )}
          </div>
        </div>

        {/* Top Batches */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-500">
            Top YC Batches
          </h3>
          <div className="space-y-2.5">
            {data.topBatches.slice(0, 8).map((b) => (
              <BarRow
                key={b.batch}
                label={b.batch}
                count={b.count}
                maxCount={batchMax}
                color="bg-violet-500/80"
              />
            ))}
            {data.topBatches.length === 0 && (
              <p className="text-sm text-zinc-600">No batch data yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===== Skeleton ===== */

export function GraveyardStatsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4"
          >
            <div className="flex items-center justify-between">
              <div className="h-8 w-8 animate-pulse rounded bg-zinc-800" />
              <div className="h-7 w-16 animate-pulse rounded bg-zinc-800" />
            </div>
            <div className="mt-2 h-4 w-24 animate-pulse rounded bg-zinc-800" />
          </div>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5"
          >
            <div className="mb-4 h-4 w-28 animate-pulse rounded bg-zinc-800" />
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, j) => (
                <div key={j} className="flex items-center gap-3">
                  <div className="h-3 w-16 animate-pulse rounded bg-zinc-800" />
                  <div className="h-5 flex-1 animate-pulse rounded-full bg-zinc-800" />
                  <div className="h-3 w-6 animate-pulse rounded bg-zinc-800" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
