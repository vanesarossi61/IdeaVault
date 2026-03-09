"use client";

import { useState, useCallback } from "react";
import { trpc } from "@/lib/trpc/client";
import { TrendCard, TrendCardSkeleton } from "@/components/trends/TrendCard";

type SortBy = "growthPct" | "volume" | "createdAt";

export default function TrendsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortBy>("growthPct");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const debounceTimer = useCallback(
    (() => {
      let timer: NodeJS.Timeout;
      return (value: string) => {
        clearTimeout(timer);
        timer = setTimeout(() => setDebouncedSearch(value), 300);
      };
    })(),
    []
  );

  const handleSearchChange = (value: string) => {
    setSearch(value);
    debounceTimer(value);
  };

  const { data: categories } = trpc.trend.getCategories.useQuery();

  const {
    data,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = trpc.trend.getAll.useInfiniteQuery(
    {
      limit: 20,
      category: category || undefined,
      search: debouncedSearch || undefined,
      sortBy,
      sortOrder: "desc",
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const { data: topGrowing } = trpc.trend.getTopGrowing.useQuery({ limit: 5 });

  const allTrends = data?.pages.flatMap((p) => p.items) ?? [];

  const sortOptions: { value: SortBy; label: string }[] = [
    { value: "growthPct", label: "Growth %" },
    { value: "volume", label: "Volume" },
    { value: "createdAt", label: "Newest" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Trends</h1>
        <p className="mt-2 text-zinc-400">
          Discover growing markets, emerging technologies, and rising consumer behaviors.
        </p>
      </div>

      {/* Top Growing Banner */}
      {topGrowing && topGrowing.length > 0 && (
        <div className="mb-8 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-emerald-400 mb-3">
            Top Growing Right Now
          </h2>
          <div className="flex flex-wrap gap-3">
            {topGrowing.map((t) => (
              <a
                key={t.id}
                href={`/trends/${t.slug}`}
                className="inline-flex items-center gap-2 rounded-lg bg-zinc-900/80 border border-zinc-800 px-3 py-2 text-sm hover:border-emerald-500/40 transition-colors"
              >
                <span className="text-white font-medium">{t.name}</span>
                {t.growthPct !== null && (
                  <span className="text-emerald-400 text-xs font-bold">
                    +{t.growthPct.toFixed(1)}%
                  </span>
                )}
                <span className="text-zinc-500 text-xs">
                  {t._count.ideas} ideas
                </span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Filters Row */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search trends..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900 py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/25"
          />
        </div>

        {/* Category Filter */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-500/50 min-w-[160px]"
        >
          <option value="">All Categories</option>
          {categories?.map((c) => (
            <option key={c.name} value={c.name}>
              {c.name} ({c.count})
            </option>
          ))}
        </select>

        {/* Sort */}
        <div className="flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-900 p-1">
          {sortOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSortBy(opt.value)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                sortBy === opt.value
                  ? "bg-emerald-500/15 text-emerald-400"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      {!isLoading && (
        <p className="mb-4 text-sm text-zinc-500">
          {allTrends.length} trend{allTrends.length !== 1 ? "s" : ""}
          {debouncedSearch && ` matching "${debouncedSearch}"`}
          {category && ` in ${category}`}
        </p>
      )}

      {/* Trends Grid */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <TrendCardSkeleton key={i} />
          ))}
        </div>
      ) : allTrends.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/30 py-20">
          <svg
            className="h-12 w-12 text-zinc-700 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
          <p className="text-zinc-400 font-medium">No trends found</p>
          <p className="text-sm text-zinc-500 mt-1">
            Try adjusting your filters or search query.
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {allTrends.map((trend) => (
              <TrendCard key={trend.id} trend={trend} />
            ))}
          </div>

          {hasNextPage && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="rounded-lg border border-zinc-800 bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white hover:border-emerald-500/30 hover:bg-zinc-800 transition-colors disabled:opacity-50"
              >
                {isFetchingNextPage ? "Loading..." : "Load More Trends"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
