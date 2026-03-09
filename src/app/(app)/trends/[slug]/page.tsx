"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { trpc } from "@/lib/trpc/client";
import { TrendChart, TrendChartSkeleton } from "@/components/trends/TrendChart";

function GrowthBadgeLarge({ pct }: { pct: number | null }) {
  if (pct === null) {
    return (
      <span className="rounded-full bg-zinc-800 px-3 py-1.5 text-sm text-zinc-400">
        No growth data
      </span>
    );
  }
  const isPositive = pct >= 0;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold ${
        isPositive
          ? "bg-emerald-500/15 text-emerald-400"
          : "bg-red-500/15 text-red-400"
      }`}
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 10 10"
        fill="none"
        className={!isPositive ? "rotate-180" : ""}
      >
        <path d="M5 1L9 6H1L5 1Z" fill="currentColor" />
      </svg>
      {isPositive ? "+" : ""}
      {pct.toFixed(1)}% growth
    </span>
  );
}

function IdeaRelatedCard({
  idea,
}: {
  idea: {
    id: string;
    title: string;
    slug: string;
    status: string;
    scores: { composite: number }[];
    tags: { tag: { name: string; slug: string } }[];
  };
}) {
  const score = idea.scores?.[0]?.composite ?? 0;
  const scoreColor =
    score >= 80
      ? "text-emerald-400 bg-emerald-500/15"
      : score >= 60
      ? "text-yellow-400 bg-yellow-500/15"
      : "text-zinc-400 bg-zinc-800";

  return (
    <Link href={`/idea/${idea.slug}`}>
      <div className="group rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 transition-all hover:border-emerald-500/30 hover:bg-zinc-900">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-medium text-white truncate group-hover:text-emerald-400 transition-colors">
              {idea.title}
            </h4>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {idea.tags.slice(0, 3).map(({ tag }) => (
                <span
                  key={tag.slug}
                  className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-400"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
          <span
            className={`flex-shrink-0 rounded-md px-2 py-1 text-xs font-bold ${scoreColor}`}
          >
            {score.toFixed(0)}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function TrendDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const { data: trend, isLoading } = trpc.trend.getBySlug.useQuery({ slug });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-4 w-32 rounded bg-zinc-800 mb-6" />
          <div className="h-8 w-72 rounded bg-zinc-800 mb-3" />
          <div className="h-5 w-48 rounded bg-zinc-800 mb-8" />
          <TrendChartSkeleton height={350} />
        </div>
      </div>
    );
  }

  if (!trend) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <svg
          className="mx-auto h-16 w-16 text-zinc-700 mb-4"
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
        <h2 className="text-xl font-bold text-white mb-2">Trend not found</h2>
        <p className="text-zinc-400 mb-6">This trend doesn't exist or was removed.</p>
        <button
          onClick={() => router.push("/trends")}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 transition-colors"
        >
          Back to Trends
        </button>
      </div>
    );
  }

  const relatedIdeas = trend.ideas?.map((it) => it.idea) ?? [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-zinc-500">
        <Link href="/trends" className="hover:text-white transition-colors">
          Trends
        </Link>
        <span>/</span>
        <span className="text-zinc-300 truncate">{trend.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          {trend.category && (
            <span className="rounded-md bg-zinc-800 px-2.5 py-1 text-xs font-medium uppercase tracking-wider text-zinc-400">
              {trend.category}
            </span>
          )}
          <GrowthBadgeLarge pct={trend.growthPct} />
        </div>
        <h1 className="text-3xl font-bold text-white">{trend.name}</h1>
        {trend.description && (
          <p className="mt-3 text-lg text-zinc-400 max-w-3xl">
            {trend.description}
          </p>
        )}
        <div className="mt-4 flex items-center gap-6 text-sm text-zinc-500">
          {trend.volume !== null && (
            <div className="flex items-center gap-1.5">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span>Volume: <span className="text-white font-medium">{trend.volume?.toLocaleString()}</span></span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <span>
              <span className="text-white font-medium">{relatedIdeas.length}</span> related idea{relatedIdeas.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
            <span>
              <span className="text-white font-medium">{trend.dataPoints?.length ?? 0}</span> data points
            </span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Trend Over Time</h2>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4">
          {trend.dataPoints && trend.dataPoints.length > 0 ? (
            <TrendChart dataPoints={trend.dataPoints} height={350} />
          ) : (
            <div className="flex items-center justify-center py-20">
              <p className="text-sm text-zinc-500">No data points recorded yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Related Ideas */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">
          Related Ideas ({relatedIdeas.length})
        </h2>
        {relatedIdeas.length === 0 ? (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 py-12 text-center">
            <p className="text-zinc-500">No ideas linked to this trend yet.</p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {relatedIdeas.map((idea) => (
              <IdeaRelatedCard key={idea.id} idea={idea} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
