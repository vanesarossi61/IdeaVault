"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { trpc } from "@/lib/trpc/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, formatDate, COMPLEXITY_COLORS } from "@/lib/utils";
import { IdeaScoreBadge, ScoreBreakdown } from "@/components/ideas/IdeaScoreBadge";
import { InteractionButtons, UpvoteButton } from "@/components/ideas/InteractionButtons";
import { CommentSection } from "@/components/ideas/CommentSection";

export default function IdeaDetailPage() {
  const params = useParams<{ slug: string }>();
  const { data: idea, isLoading, error } = trpc.idea.getBySlug.useQuery(
    { slug: params.slug },
    { enabled: !!params.slug }
  );

  if (isLoading) return <IdeaDetailSkeleton />;

  if (error || !idea) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-zinc-800/50 flex items-center justify-center mb-4">
          <span className="text-2xl">?</span>
        </div>
        <h2 className="text-lg font-medium text-zinc-300 mb-1">Idea not found</h2>
        <p className="text-sm text-zinc-500 mb-4">
          This idea may have been removed or the URL is incorrect.
        </p>
        <Link href="/database">
          <Button variant="outline" className="border-zinc-800 text-zinc-300 hover:bg-zinc-800">
            Back to Database
          </Button>
        </Link>
      </div>
    );
  }

  const tags = idea.tags?.map((it: any) => it.tag) ?? [];
  const score = idea.scores?.composite ?? 0;
  const commentCount = idea._count?.comments ?? 0;
  const upvoteCount = idea._count?.upvotes ?? 0;
  const plan = Array.isArray(idea.plan) ? (idea.plan as string[]) : [];
  const trends = (idea as any).trends?.map((it: any) => it.trend) ?? [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back link */}
      <Link
        href="/database"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back to Database
      </Link>

      {/* Main header card */}
      <div className="space-y-4">
        {/* Title + Score + Actions */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100 mb-3">
              {idea.title}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge
                variant="outline"
                className={cn("text-xs border", COMPLEXITY_COLORS[idea.complexity])}
              >
                {idea.complexity} Complexity
              </Badge>
              <Badge variant="outline" className="text-xs border-zinc-700/50 text-zinc-400">
                {idea.revenueModel}
              </Badge>
              <span className="text-xs text-zinc-500">
                Added {formatDate(idea.createdAt)}
              </span>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag: any) => (
                  <Badge
                    key={tag.id}
                    variant="outline"
                    className="text-[10px] px-2 py-0.5 border-zinc-700/50 text-zinc-400 bg-zinc-800/50"
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <div className="flex sm:flex-col items-center gap-3">
            <IdeaScoreBadge score={score} size="lg" showLabel />
            <UpvoteButton ideaId={idea.id} count={upvoteCount} />
          </div>
        </div>

        {/* Interaction buttons */}
        <InteractionButtons ideaId={idea.id} />
      </div>

      {/* Content sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Problem */}
          <ContentSection title="The Problem" icon="!">
            <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
              {idea.problem}
            </p>
          </ContentSection>

          {/* Solution */}
          <ContentSection title="The Solution" icon="*">
            <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
              {idea.solution}
            </p>
          </ContentSection>

          {/* Execution Plan */}
          {plan.length > 0 && (
            <ContentSection title="Execution Plan" icon="#">
              <ol className="space-y-2">
                {plan.map((step, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-xs text-green-400 font-medium">
                      {i + 1}
                    </span>
                    <span className="text-zinc-300 leading-relaxed pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </ContentSection>
          )}

          {/* Why Now */}
          {idea.whyNow && (
            <ContentSection title="Why Now?" icon=">">
              <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
                {idea.whyNow}
              </p>
            </ContentSection>
          )}

          {/* Comments */}
          <Card className="border-zinc-800/50 bg-zinc-900/30">
            <CardContent className="p-5">
              <CommentSection
                ideaId={idea.id}
                comments={(idea as any).comments ?? []}
                totalCount={commentCount}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar (1/3) */}
        <div className="space-y-4">
          {/* Score Breakdown */}
          {idea.scores && (
            <Card className="border-zinc-800/50 bg-zinc-900/30">
              <CardContent className="p-5">
                <ScoreBreakdown scores={idea.scores} />
              </CardContent>
            </Card>
          )}

          {/* Community Signals */}
          {idea.signals && idea.signals.length > 0 && (
            <Card className="border-zinc-800/50 bg-zinc-900/30">
              <CardHeader className="p-5 pb-3">
                <CardTitle className="text-sm font-medium text-zinc-300">
                  Community Signals ({idea.signals.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-5 space-y-3">
                {idea.signals.map((signal: any) => (
                  <div
                    key={signal.id}
                    className="p-3 rounded-lg bg-zinc-800/30 border border-zinc-800/50"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px] px-1.5 py-0 border",
                          getSignalColor(signal.source)
                        )}
                      >
                        {signal.source}
                      </Badge>
                      {signal.metric && (
                        <span className="text-[10px] text-zinc-500">{signal.metric}</span>
                      )}
                    </div>
                    {signal.snippet && (
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        {signal.snippet}
                      </p>
                    )}
                    {signal.url && (
                      <a
                        href={signal.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-green-500 hover:text-green-400 mt-1 inline-block"
                      >
                        View source
                      </a>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Related Trends */}
          {trends.length > 0 && (
            <Card className="border-zinc-800/50 bg-zinc-900/30">
              <CardHeader className="p-5 pb-3">
                <CardTitle className="text-sm font-medium text-zinc-300">
                  Related Trends
                </CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-5 space-y-2">
                {trends.map((trend: any) => (
                  <Link
                    key={trend.id}
                    href={`/trends/${trend.slug}`}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-zinc-800/50 transition-colors"
                  >
                    <span className="text-sm text-zinc-300">{trend.name}</span>
                    {trend.growthPct && (
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px] border",
                          trend.growthPct > 0
                            ? "text-green-400 border-green-500/30"
                            : "text-red-400 border-red-500/30"
                        )}
                      >
                        {trend.growthPct > 0 ? "+" : ""}
                        {Math.round(trend.growthPct)}%
                      </Badge>
                    )}
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Stats */}
          <Card className="border-zinc-800/50 bg-zinc-900/30">
            <CardContent className="p-5 space-y-3">
              <h4 className="text-sm font-medium text-zinc-300">Stats</h4>
              <div className="grid grid-cols-3 gap-3">
                <StatItem label="Upvotes" value={upvoteCount} />
                <StatItem label="Comments" value={commentCount} />
                <StatItem label="Interactions" value={idea._count?.interactions ?? 0} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Reusable content section
function ContentSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="border-zinc-800/50 bg-zinc-900/30">
      <CardHeader className="p-5 pb-3">
        <CardTitle className="text-sm font-medium text-zinc-300 flex items-center gap-2">
          <span className="w-5 h-5 rounded bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 text-xs">
            {icon}
          </span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-5">{children}</CardContent>
    </Card>
  );
}

function StatItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center">
      <div className="text-lg font-semibold text-zinc-200">{value}</div>
      <div className="text-[10px] text-zinc-500">{label}</div>
    </div>
  );
}

function getSignalColor(source: string): string {
  const colors: Record<string, string> = {
    REDDIT: "text-orange-400 border-orange-500/30 bg-orange-500/10",
    HACKERNEWS: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    PRODUCTHUNT: "text-red-400 border-red-500/30 bg-red-500/10",
    FLIPPA: "text-blue-400 border-blue-500/30 bg-blue-500/10",
    TRENDS: "text-green-400 border-green-500/30 bg-green-500/10",
  };
  return colors[source] ?? "text-zinc-400 border-zinc-500/30";
}

// Loading skeleton
function IdeaDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="w-32 h-4 bg-zinc-800 rounded animate-pulse" />
      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 space-y-3">
            <div className="w-3/4 h-8 bg-zinc-800 rounded animate-pulse" />
            <div className="flex gap-2">
              <div className="w-24 h-5 bg-zinc-800 rounded animate-pulse" />
              <div className="w-20 h-5 bg-zinc-800 rounded animate-pulse" />
            </div>
            <div className="flex gap-1.5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-16 h-5 bg-zinc-800 rounded animate-pulse" />
              ))}
            </div>
          </div>
          <div className="w-14 h-14 rounded-full bg-zinc-800 animate-pulse" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="border-zinc-800/50 bg-zinc-900/30">
              <CardContent className="p-5 space-y-3">
                <div className="w-32 h-4 bg-zinc-800 rounded animate-pulse" />
                <div className="space-y-2">
                  <div className="w-full h-3 bg-zinc-800 rounded animate-pulse" />
                  <div className="w-full h-3 bg-zinc-800 rounded animate-pulse" />
                  <div className="w-2/3 h-3 bg-zinc-800 rounded animate-pulse" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <Card key={i} className="border-zinc-800/50 bg-zinc-900/30">
              <CardContent className="p-5">
                <Skeleton className="w-full h-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function ArrowLeftIcon({ className }: { className?: string }) {
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
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}
