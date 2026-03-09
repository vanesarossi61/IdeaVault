"use client";

import { useState, useCallback } from "react";
import { trpc } from "@/lib/trpc/client";
import { GraveyardCard, GraveyardCardSkeleton } from "@/components/graveyard/GraveyardCard";
import { GraveyardStats, GraveyardStatsSkeleton } from "@/components/graveyard/GraveyardStats";

type StatusFilter = "" | "INACTIVE" | "ACQUIRED" | "PIVOTED" | "UNKNOWN";
type SortBy = "name" | "batch" | "shutdownYear" | "createdAt";
type SortOrder = "asc" | "desc";

export default function GraveyardPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("");
  const [batch, setBatch] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("batch");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showStats, setShowStats] = useState(true);

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

  // Data queries
  const { data: statsData, isLoading: statsLoading } =
    trpc.graveyard.stats.useQuery();
  const { data: batches } = trpc.graveyard.batches.useQuery();
  const { data: categories } = trpc.graveyard.categories.useQuery();

  const {
    data,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = trpc.graveyard.list.useInfiniteQuery(
    {
      limit: 24,
      status: (status as "INACTIVE" | "ACQUIRED" | "PIVOTED" | "UNKNOWN") || undefined,
      batch: batch || undefined,
      category: category || undefined,
      search: debouncedSearch || undefined,
      sortBy,
      sortOrder,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const allStartups = data?.pages.flatMap((p) => p.items) ?? [];
  const activeFilters = [status, batch, category].filter(Boolean).length;

  const clearFilters = () => {
    setStatus("");
    setBatch("");
    setCategory("");
    setSearch("");
    setDebouncedSearch("");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🪦</span>
          <div>
            <h1 className="text-3xl font-bold text-white">Startup Graveyard</h1>
            <p className="mt-1 text-zinc-400">
              Learn from the past. Explore startups that didn&apos;t make it and
              discover what we can learn from their journey.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Toggle + Dashboard */}
      <div className="mb-6">
        <button
          onClick={() => setShowStats(!showStats)}
          className="mb-4 flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
        >
          <svg
            className={`h-4 w-4 transition-transform ${showStats ? "rotate-90" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          {showStats ? "Hide" : "Show"} Statistics
        </button>
        {showStats && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            {statsLoading || !statsData ? (
              <GraveyardStatsSkeleton />
            ) : (
              <GraveyardStats data={statsData} />
            )}
          </div>
        )}
      </div>

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
            placeholder="Search startups, founders, categories..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900 py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/25"
          />
        </div>

        {/* Status Filter */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as StatusFilter)}
          className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-300 outline-none focus:border-emerald-500/50"
        >
          <option value="">All Statuses</option>
          <option value="INACTIVE">Dead</option>
          <option value="ACQUIRED">Acquired</option>
          <option value="PIVOTED">Pivoted</option>
          <option value="UNKNOWN">Unknown</option>
        </select>

        {/* Batch Filter */}
        <select
          value={batch}
          onChange={(e) => setBatch(e.target.value)}
          className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-300 outline-none focus:border-emerald-500/50"
        >
          <option value="">All Batches</option>
          {batches?.map((b) => (
            <option key={b.batch} value={b.batch}>
              {b.batch} - {b.batchLabel}
            </option>
          ))}
        </select>

        {/* Category Filter */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-300 outline-none focus:border-emerald-500/50"
        >
          <option value="">All Categories</option>
          {categories?.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Sort + View Controls */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-400 outline-none focus:border-emerald-500/50"
          >
            <option value="batch">Sort by Batch</option>
            <option value="name">Sort by Name</option>
            <option value="shutdownYear">Sort by Shutdown Year</option>
            <option value="createdAt">Sort by Date Added</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="rounded-lg border border-zinc-800 bg-zinc-900 p-2 text-zinc-400 hover:border-zinc-700 hover:text-white transition-colors"
            title={sortOrder === "asc" ? "Ascending" : "Descending"}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {sortOrder === "asc" ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
              )}
            </svg>
          </button>

          {/* Active Filters Badge */}
          {activeFilters > 0 && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 hover:bg-emerald-500/20 transition-colors"
            >
              {activeFilters} filter{activeFilters > 1 ? "s" : ""}
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center rounded-lg border border-zinc-800 bg-zinc-900">
          <button
            onClick={() => setViewMode("grid")}
            className={`rounded-l-lg p-2 transition-colors ${
              viewMode === "grid"
                ? "bg-zinc-800 text-white"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`rounded-r-lg p-2 transition-colors ${
              viewMode === "list"
                ? "bg-zinc-800 text-white"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-sm text-zinc-500">
          {isLoading
            ? "Loading..."
            : `${allStartups.length}${hasNextPage ? "+" : ""} startup${allStartups.length !== 1 ? "s" : ""} found`}
        </p>
      </div>

      {/* Grid / List */}
      {isLoading ? (
        <div
          className={`grid gap-4 ${
            viewMode === "grid"
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1"
          }`}
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <GraveyardCardSkeleton key={i} />
          ))}
        </div>
      ) : allStartups.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/30 py-20">
          <span className="text-5xl mb-4">🔍</span>
          <h3 className="text-lg font-semibold text-white">No startups found</h3>
          <p className="mt-1 text-sm text-zinc-500">
            Try adjusting your filters or search terms.
          </p>
          {activeFilters > 0 && (
            <button
              onClick={clearFilters}
              className="mt-4 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-medium text-white hover:border-zinc-600 transition-colors"
            >
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <div
          className={`grid gap-4 ${
            viewMode === "grid"
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1"
          }`}
        >
          {allStartups.map((startup) => (
            <GraveyardCard
              key={startup.id}
              name={startup.name}
              slug={startup.slug}
              batch={startup.batch}
              batchLabel={startup.batchLabel}
              status={startup.status as any}
              category={startup.category}
              categories={startup.categories as string[]}
              description={startup.description}
              founders={startup.founders}
              funding={startup.funding}
              shutdownYear={startup.shutdownYear}
              successor={startup.successor}
              successorUrl={startup.successorUrl}
              linkedIdea={startup.idea}
            />
          ))}
        </div>
      )}

      {/* Load More */}
      {hasNextPage && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="rounded-lg border border-zinc-700 bg-zinc-800 px-6 py-2.5 text-sm font-medium text-white hover:border-zinc-600 hover:bg-zinc-700 disabled:opacity-50 transition-colors"
          >
            {isFetchingNextPage ? (
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Loading...
              </span>
            ) : (
              "Load more startups"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
