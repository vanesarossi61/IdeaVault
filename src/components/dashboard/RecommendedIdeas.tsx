"use client";

import Link from "next/link";
import { cn, truncate, COMPLEXITY_COLORS } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { IdeaScoreBadge } from "@/components/ideas/IdeaScoreBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc/client";

interface RecommendedIdeasProps {
  limit?: number;
}

export function RecommendedIdeas({ limit = 6 }: RecommendedIdeasProps) {
  const { data: ideas, isLoading } = trpc.dashboard.getRecommendations.useQuery(
    { limit },
    { staleTime: 5 * 60 * 1000 }
  );

  if (isLoading) return <RecommendedIdeasSkeleton count={limit} />;

  if (!ideas || ideas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#2a2a2a] py-12 text-center">
        <div className="mb-3 rounded-full bg-[#1a1a1a] p-4">
          <svg
            className="h-6 w-6 text-muted-foreground"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <p className="text-sm font-medium text-white">No recommendations yet</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Save or interact with ideas to get personalized picks
        </p>
        <Link
          href="/database"
          className="mt-4 inline-flex items-center rounded-lg bg-green-500/10 px-4 py-2 text-sm font-medium text-green-400 hover:bg-green-500/20 transition-colors"
        >
          Explore ideas
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {ideas.map((idea) => {
        const score = idea.score
          ? Math.round(
              (idea.score.opportunity +
                idea.score.painPoints +
                idea.score.confidence +
                idea.score.timing) /
                4
            )
          : 0;
        const complexityColor =
          COMPLEXITY_COLORS[
            idea.complexity as keyof typeof COMPLEXITY_COLORS
          ] || "bg-gray-400/10 text-gray-400";

        return (
          <Link
            key={idea.id}
            href={`/idea/${idea.slug}`}
            className={cn(
              "group relative flex flex-col rounded-xl border border-[#2a2a2a] bg-[#111111] p-4",
              "hover:border-green-500/30 hover:shadow-lg hover:shadow-green-500/5",
              "transition-all duration-200"
            )}
          >
            {/* Header: score + complexity */}
            <div className="mb-3 flex items-center justify-between">
              <IdeaScoreBadge score={score} size="sm" />
              <Badge
                variant="outline"
                className={cn("text-[10px] border-0", complexityColor)}
              >
                {idea.complexity}
              </Badge>
            </div>

            {/* Title */}
            <h4 className="mb-1.5 text-sm font-semibold text-white group-hover:text-green-400 transition-colors line-clamp-2">
              {idea.title}
            </h4>

            {/* Tags */}
            {idea.tags.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-1">
                {idea.tags.slice(0, 3).map((t) => (
                  <span
                    key={t.tag.id}
                    className="rounded-md bg-[#1a1a1a] px-1.5 py-0.5 text-[10px] text-muted-foreground"
                  >
                    {t.tag.name}
                  </span>
                ))}
              </div>
            )}

            {/* Footer stats */}
            <div className="mt-auto flex items-center gap-3 pt-2 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <svg
                  className="h-3 w-3"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                {idea._count.comments}
              </span>
              <span className="flex items-center gap-1">
                <svg
                  className="h-3 w-3"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path d="M7 10l5-5 5 5M12 5v12" />
                </svg>
                {idea._count.upvotes}
              </span>
              <span className="ml-auto text-[10px]">
                {idea.revenueModel}
              </span>
            </div>

            {/* Hover glow */}
            <div className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-b from-green-500/[0.03] to-transparent" />
          </Link>
        );
      })}
    </div>
  );
}

export function RecommendedIdeasSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-[#2a2a2a] bg-[#111111] p-4"
        >
          <div className="mb-3 flex items-center justify-between">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-4 w-14" />
          </div>
          <Skeleton className="mb-1.5 h-4 w-full" />
          <Skeleton className="mb-3 h-4 w-2/3" />
          <div className="flex gap-1">
            <Skeleton className="h-4 w-12 rounded-md" />
            <Skeleton className="h-4 w-14 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}
