"use client";

import { useState, useCallback } from "react";
import { trpc } from "@/lib/trpc/client";
import { ToolCard, ToolCardSkeleton } from "@/components/tools/ToolCard";

type PricingFilter = "" | "FREE" | "FREEMIUM" | "PAID";

export default function ToolsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [pricing, setPricing] = useState<PricingFilter>("");
  const [stackId, setStackId] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

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

  const { data: categories } = trpc.tool.getCategories.useQuery();
  const { data: stacks } = trpc.tool.getStacks.useQuery();

  const {
    data,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = trpc.tool.getAll.useInfiniteQuery(
    {
      limit: 24,
      category: category || undefined,
      pricing: (pricing as "FREE" | "FREEMIUM" | "PAID") || undefined,
      search: debouncedSearch || undefined,
      stackId: stackId || undefined,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const allTools = data?.pages.flatMap((p) => p.items) ?? [];

  const activeFilters = [category, pricing, stackId].filter(Boolean).length;

  const clearFilters = () => {
    setCategory("");
    setPricing("");
    setStackId("");
    setSearch("");
    setDebouncedSearch("");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Tools Directory</h1>
        <p className="mt-2 text-zinc-400">
          Discover the best tools for building, launching, and growing your startup ideas.
        </p>
      </div>

      {/* Stacks Horizontal Scroll */}
      {stacks && stacks.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 mb-3">
            Popular Stacks
          </h2>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {stacks.map((stack) => (
              <button
                key={stack.id}
                onClick={() => setStackId(stackId === stack.id ? "" : stack.id)}
                className={`flex-shrink-0 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                  stackId === stack.id
                    ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
                    : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700 hover:text-white"
                }`}
              >
                {stack.name}
                <span className="ml-1.5 text-xs text-zinc-500">
                  {stack.tools.length}
                </span>
              </button>
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
            placeholder="Search tools..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900 py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/25"
          />
        </div>

        {/* Category */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-500/50 min-w-[150px]"
        >
          <option value="">All Categories</option>
          {categories?.map((c) => (
            <option key={c.name} value={c.name}>
              {c.name} ({c.count})
            </option>
          ))}
        </select>

        {/* Pricing */}
        <div className="flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-900 p-1">
          {[
            { value: "", label: "All" },
            { value: "FREE", label: "Free" },
            { value: "FREEMIUM", label: "Freemium" },
            { value: "PAID", label: "Paid" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setPricing(opt.value as PricingFilter)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                pricing === opt.value
                  ? "bg-emerald-500/15 text-emerald-400"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-900 p-1">
          <button
            onClick={() => setViewMode("grid")}
            className={`rounded-md p-1.5 transition-colors ${
              viewMode === "grid" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-white"
            }`}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`rounded-md p-1.5 transition-colors ${
              viewMode === "list" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-white"
            }`}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Active Filters */}
      {activeFilters > 0 && (
        <div className="mb-4 flex items-center gap-2">
          <span className="text-xs text-zinc-500">{activeFilters} filter{activeFilters > 1 ? "s" : ""} active</span>
          <button
            onClick={clearFilters}
            className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Results */}
      {!isLoading && (
        <p className="mb-4 text-sm text-zinc-500">
          {allTools.length} tool{allTools.length !== 1 ? "s" : ""}
          {debouncedSearch && ` matching "${debouncedSearch}"`}
        </p>
      )}

      {/* Tools Grid/List */}
      {isLoading ? (
        <div className={viewMode === "grid" ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3" : "flex flex-col gap-3"}>
          {Array.from({ length: 12 }).map((_, i) => (
            <ToolCardSkeleton key={i} />
          ))}
        </div>
      ) : allTools.length === 0 ? (
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
              d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
            />
          </svg>
          <p className="text-zinc-400 font-medium">No tools found</p>
          <p className="text-sm text-zinc-500 mt-1">
            Try adjusting your filters or search query.
          </p>
          {activeFilters > 0 && (
            <button
              onClick={clearFilters}
              className="mt-4 rounded-lg bg-zinc-800 px-4 py-2 text-sm text-white hover:bg-zinc-700 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <>
          <div
            className={
              viewMode === "grid"
                ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                : "flex flex-col gap-3"
            }
          >
            {allTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>

          {hasNextPage && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="rounded-lg border border-zinc-800 bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white hover:border-emerald-500/30 hover:bg-zinc-800 transition-colors disabled:opacity-50"
              >
                {isFetchingNextPage ? "Loading..." : "Load More Tools"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
