"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn, truncate, formatDate, COMPLEXITY_COLORS } from "@/lib/utils";
import { IdeaScoreBadge } from "./IdeaScoreBadge";
import { InteractionButtons, UpvoteButton } from "./InteractionButtons";
import type { IdeaWithRelations, InteractionType } from "@/types";

interface IdeaCardProps {
  idea: IdeaWithRelations;
  userInteractions?: InteractionType[];
  featured?: boolean;
}

export function IdeaCard({ idea, userInteractions = [], featured = false }: IdeaCardProps) {
  const tags = idea.tags?.map((it) => it.tag) ?? [];
  const score = idea.scores?.composite ?? 0;
  const commentCount = idea._count?.comments ?? 0;
  const upvoteCount = idea._count?.upvotes ?? 0;

  return (
    <Link href={`/idea/${idea.slug}`}>
      <Card
        className={cn(
          "group border-zinc-800/50 bg-zinc-900/50 hover:bg-zinc-900 hover:border-zinc-700/70 transition-all duration-200 cursor-pointer",
          featured && "border-green-500/20 bg-green-500/5 hover:border-green-500/40"
        )}
      >
        <CardContent className="p-5">
          {/* Top row: score + featured badge + date */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <IdeaScoreBadge score={score} size="md" />
              <div className="flex flex-col">
                {featured && (
                  <Badge className="bg-green-500/15 text-green-400 border-green-500/30 text-[10px] mb-1 w-fit">
                    Featured Today
                  </Badge>
                )}
                <span className="text-[11px] text-zinc-500">
                  {formatDate(idea.createdAt)}
                </span>
              </div>
            </div>
            <UpvoteButton ideaId={idea.id} count={upvoteCount} />
          </div>

          {/* Title */}
          <h3 className="text-base font-semibold text-zinc-100 group-hover:text-green-400 transition-colors mb-2 leading-snug">
            {idea.title}
          </h3>

          {/* Problem snippet */}
          <p className="text-sm text-zinc-400 leading-relaxed mb-3">
            {truncate(idea.problem, 150)}
          </p>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {tags.slice(0, 4).map((tag) => (
                <Badge
                  key={tag.id}
                  variant="outline"
                  className="text-[10px] px-2 py-0.5 border-zinc-700/50 text-zinc-400 bg-zinc-800/50"
                >
                  {tag.name}
                </Badge>
              ))}
              {tags.length > 4 && (
                <Badge
                  variant="outline"
                  className="text-[10px] px-2 py-0.5 border-zinc-700/50 text-zinc-500"
                >
                  +{tags.length - 4}
                </Badge>
              )}
            </div>
          )}

          {/* Meta row: complexity + revenue model + signals */}
          <div className="flex items-center gap-2 mb-3">
            <Badge
              variant="outline"
              className={cn("text-[10px] px-2 py-0.5 border", COMPLEXITY_COLORS[idea.complexity])}
            >
              {idea.complexity}
            </Badge>
            <Badge
              variant="outline"
              className="text-[10px] px-2 py-0.5 border-zinc-700/50 text-zinc-400"
            >
              {idea.revenueModel}
            </Badge>
            {idea.signals && idea.signals.length > 0 && (
              <span className="text-[10px] text-zinc-500">
                {idea.signals.length} signal{idea.signals.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* Bottom row: interactions + comments */}
          <div className="flex items-center justify-between pt-3 border-t border-zinc-800/50">
            <InteractionButtons
              ideaId={idea.id}
              userInteractions={userInteractions}
              compact
            />
            <div className="flex items-center gap-1 text-xs text-zinc-500">
              <CommentIcon className="h-3.5 w-3.5" />
              <span>{commentCount}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

// Featured Idea Card (larger, for the top of the page)
export function FeaturedIdeaCard({ idea, userInteractions = [] }: IdeaCardProps) {
  const tags = idea.tags?.map((it) => it.tag) ?? [];
  const score = idea.scores?.composite ?? 0;
  const upvoteCount = idea._count?.upvotes ?? 0;

  return (
    <Link href={`/idea/${idea.slug}`}>
      <Card className="group border-green-500/20 bg-gradient-to-br from-green-500/5 via-zinc-900/50 to-zinc-900/50 hover:border-green-500/40 transition-all duration-200 cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <Badge className="bg-green-500/15 text-green-400 border-green-500/30 text-xs">
              Idea of the Day
            </Badge>
            <span className="text-xs text-zinc-500">{formatDate(idea.createdAt)}</span>
          </div>

          <div className="flex gap-5">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-zinc-100 group-hover:text-green-400 transition-colors mb-2">
                {idea.title}
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                {truncate(idea.problem, 250)}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {tags.slice(0, 6).map((tag) => (
                  <Badge
                    key={tag.id}
                    variant="outline"
                    className="text-[10px] px-2 py-0.5 border-zinc-700/50 text-zinc-400 bg-zinc-800/50"
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center gap-4">
                <InteractionButtons
                  ideaId={idea.id}
                  userInteractions={userInteractions}
                />
                <UpvoteButton ideaId={idea.id} count={upvoteCount} />
              </div>
            </div>

            <div className="hidden sm:flex flex-col items-center justify-center px-4">
              <IdeaScoreBadge score={score} size="lg" showLabel />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

// Skeleton loading card
export function IdeaCardSkeleton() {
  return (
    <Card className="border-zinc-800/50 bg-zinc-900/50">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-zinc-800 animate-pulse" />
            <div className="w-16 h-3 bg-zinc-800 rounded animate-pulse" />
          </div>
          <div className="w-12 h-6 bg-zinc-800 rounded animate-pulse" />
        </div>
        <div className="w-3/4 h-5 bg-zinc-800 rounded animate-pulse mb-2" />
        <div className="space-y-1.5 mb-3">
          <div className="w-full h-3 bg-zinc-800 rounded animate-pulse" />
          <div className="w-2/3 h-3 bg-zinc-800 rounded animate-pulse" />
        </div>
        <div className="flex gap-1.5 mb-3">
          <div className="w-14 h-5 bg-zinc-800 rounded animate-pulse" />
          <div className="w-14 h-5 bg-zinc-800 rounded animate-pulse" />
          <div className="w-14 h-5 bg-zinc-800 rounded animate-pulse" />
        </div>
        <div className="flex gap-2 mb-3">
          <div className="w-16 h-5 bg-zinc-800 rounded animate-pulse" />
          <div className="w-20 h-5 bg-zinc-800 rounded animate-pulse" />
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-zinc-800/50">
          <div className="flex gap-1.5">
            <div className="w-7 h-7 bg-zinc-800 rounded animate-pulse" />
            <div className="w-7 h-7 bg-zinc-800 rounded animate-pulse" />
            <div className="w-7 h-7 bg-zinc-800 rounded animate-pulse" />
          </div>
          <div className="w-8 h-4 bg-zinc-800 rounded animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
}

function CommentIcon({ className }: { className?: string }) {
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
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  );
}
