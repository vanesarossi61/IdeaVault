"use client";

import { useState, useCallback } from "react";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { IdeaCard, FeaturedIdeaCard, IdeaCardSkeleton } from "@/components/ideas/IdeaCard";
import { IdeaFilters, type FilterState } from "@/components/ideas/IdeaFilters";
import { cn } from "@/lib/utils";
import type { IdeaTab } from "@/types";

const TABS: { value: IdeaTab; label: string; requiresAuth: boolean }[] = [
  { value: "new", label: "New", requiresAuth: false },
  { value: "for-you", label: "For You", requiresAuth: true },
  { value: "interested", label: "Interested", requiresAuth: true },
  { value: "saved", label: "Saved", requiresAuth: true },
  { value: "building", label: "Building", requiresAuth: true },
  { value: "hidden", label: "Hidden", requiresAuth: true },
];

const DEFAULT_FILTERS: FilterState = {
  search: "",
  complexity: undefined,
  tag: undefined,
  sortBy: "createdAt",
  sortOrder: "desc",
};

export default function DatabasePage() {
  const [activeTab, setActiveTab] = useState<IdeaTab>("new");
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  // Fetch featured idea of the day
  const { data: featuredIdea } = trpc.idea.getFeatured.useQuery(undefined, {
    staleTime: 5 * 60 * 1000,
  });

  // Fetch tags for filter pills
  const { data: tags } = trpc.idea.getTags.useQuery(undefined, {
    staleTime: 10 * 60 * 1000,
  });

  // Main infinite query for ideas
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = trpc.idea.getAll.useInfiniteQuery(
    {
      limit: 24,
      status: "PUBLISHED",
      complexity: filters.complexity,
      tag: filters.tag,
      search: filters.search || undefined,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const ideas = data?.pages.flatMap((p) => p.items) ?? [];

  const handleTabChange = useCallback((tab: IdeaTab) => {
    setActiveTab(tab);
    setFilters(DEFAULT_FILTERS);
  }, []);

  const handleFiltersChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Idea Database</h1>
        <p className="text-muted-foreground mt-2">
          Discover validated business ideas backed by real market data,
          community signals, and AI-powered scoring.
        </p>
      </div>

      {/* Featured Idea of the Day */}
      {featuredIdea && activeTab === "new" && (
        <FeaturedIdeaCard idea={featuredIdea as any} />
      )}

      {/* Tabs */}
      <div className="border-b border-zinc-800">
        <div className="flex gap-0 overflow-x-auto scrollbar-hide">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleTabChange(tab.value)}
              className={cn(
                "px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors",
                activeTab === tab.value
                  ? "border-green-500 text-green-400"
                  : "border-transparent text-zinc-500 hover:text-zinc-300 hover:border-zinc-700"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <IdeaFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        tags={tags as any}
        totalCount={ideas.length}
      />

      {/* Ideas Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <IdeaCardSkeleton key={i} />
          ))}
        </div>
      ) : ideas.length === 0 ? (
        <EmptyState
          tab={activeTab}
          hasFilters={
            !!filters.search || !!filters.complexity || !!filters.tag
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {ideas.map((idea) => (
              <IdeaCard key={idea.id} idea={idea as any} />
            ))}
          </div>

          {/* Load more */}
          {hasNextPage && (
            <div className="flex justify-center pt-4">
              <Button
                variant="outline"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="border-zinc-800 bg-zinc-900/50 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 min-w-[200px]"
              >
                {isFetchingNextPage ? (
                  <span className="flex items-center gap-2">
                    <LoaderIcon className="h-4 w-4 animate-spin" />
                    Loading...
                  </span>
                ) : (
                  "Load More Ideas"
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Empty state for each tab
function EmptyState({
  tab,
  hasFilters,
}: {
  tab: IdeaTab;
  hasFilters: boolean;
}) {
  const messages: Record<IdeaTab, { title: string; description: string }> = {
    new: {
      title: hasFilters ? "No matching ideas" : "No ideas yet",
      description: hasFilters
        ? "Try adjusting your filters or search terms."
        : "New ideas are added daily. Check back soon!",
    },
    "for-you": {
      title: "Personalized picks coming soon",
      description:
        "Interact with ideas to help us learn your preferences and recommend better matches.",
    },
    interested: {
      title: "No ideas marked as interesting",
      description:
        "Browse the database and mark ideas you find interesting to see them here.",
    },
    saved: {
      title: "No saved ideas",
      description: "Save ideas you want to revisit later.",
    },
    building: {
      title: "Not building anything yet",
      description:
        "When you start building an idea, mark it here to track your progress.",
    },
    hidden: {
      title: "No hidden ideas",
      description:
        "Ideas you hide will appear here in case you change your mind.",
    },
  };

  const { title, description } = messages[tab];

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-full bg-zinc-800/50 flex items-center justify-center mb-4">
        <EmptyIcon className="h-8 w-8 text-zinc-600" />
      </div>
      <h3 className="text-lg font-medium text-zinc-300 mb-1">{title}</h3>
      <p className="text-sm text-zinc-500 max-w-sm">{description}</p>
    </div>
  );
}

function EmptyIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 12 18.469c-1.006 0-1.914.44-2.536 1.14l-.547-.548Z" />
    </svg>
  );
}

function LoaderIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
