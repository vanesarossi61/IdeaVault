"use client";

import { useState } from "react";
import Link from "next/link";
import { trpc } from "@/lib/trpc/client";

type UpdateType = "all" | "new_idea" | "trending" | "new_tool" | "milestone";

const typeConfig = {
  new_idea: {
    label: "New Idea",
    color: "bg-violet-500/15 text-violet-400",
    icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
  },
  trending: {
    label: "Trending",
    color: "bg-emerald-500/15 text-emerald-400",
    icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
  },
  new_tool: {
    label: "New Tool",
    color: "bg-blue-500/15 text-blue-400",
    icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z",
  },
  milestone: {
    label: "Milestone",
    color: "bg-amber-500/15 text-amber-400",
    icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",
  },
};

function formatTimeAgo(date: Date | string): string {
  const now = new Date();
  const d = new Date(date);
  const diff = now.getTime() - d.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

interface UpdateItemProps {
  item: {
    id: string;
    type: "new_idea" | "trending" | "new_tool" | "milestone";
    title: string;
    description: string;
    slug?: string;
    metadata?: Record<string, unknown>;
    createdAt: Date | string;
  };
}

function UpdateItem({ item }: UpdateItemProps) {
  const config = typeConfig[item.type];

  const content = (
    <div className="group flex gap-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 transition-all hover:border-zinc-700 hover:bg-zinc-900">
      {/* Icon */}
      <div className={`flex-shrink-0 rounded-lg p-2.5 ${config.color.split(" ")[0]}`}>
        <svg
          className={`h-5 w-5 ${config.color.split(" ")[1]}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d={config.icon} />
        </svg>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${config.color}`}>
                {config.label}
              </span>
              <span className="text-xs text-zinc-600">{formatTimeAgo(item.createdAt)}</span>
            </div>
            <h3 className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors truncate">
              {item.title}
            </h3>
            <p className="mt-0.5 text-xs text-zinc-400">{item.description}</p>
          </div>

          {/* Metadata badges */}
          <div className="flex flex-shrink-0 items-center gap-2">
            {item.type === "new_idea" && item.metadata?.score && (
              <span
                className={`rounded-md px-2 py-1 text-xs font-bold ${
                  (item.metadata.score as number) >= 80
                    ? "bg-emerald-500/15 text-emerald-400"
                    : (item.metadata.score as number) >= 60
                    ? "bg-yellow-500/15 text-yellow-400"
                    : "bg-zinc-800 text-zinc-400"
                }`}
              >
                {(item.metadata.score as number).toFixed(0)}
              </span>
            )}
            {item.type === "trending" && item.metadata?.growthPct && (
              <span className="rounded-md bg-emerald-500/15 px-2 py-1 text-xs font-bold text-emerald-400">
                +{(item.metadata.growthPct as number).toFixed(1)}%
              </span>
            )}
            {item.type === "new_tool" && item.metadata?.pricing && (
              <span
                className={`rounded-md px-2 py-1 text-xs font-bold ${
                  item.metadata.pricing === "FREE"
                    ? "bg-emerald-500/15 text-emerald-400"
                    : item.metadata.pricing === "FREEMIUM"
                    ? "bg-blue-500/15 text-blue-400"
                    : "bg-amber-500/15 text-amber-400"
                }`}
              >
                {item.metadata.pricing as string}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (item.slug) {
    return <Link href={item.slug}>{content}</Link>;
  }
  return content;
}

export default function UpdatesPage() {
  const [type, setType] = useState<UpdateType>("all");
  const [offset, setOffset] = useState(0);
  const limit = 20;

  const { data: stats } = trpc.update.getStats.useQuery();

  const { data, isLoading } = trpc.update.getFeed.useQuery({
    limit,
    offset,
    type,
  });

  const filterOptions: { value: UpdateType; label: string }[] = [
    { value: "all", label: "All Updates" },
    { value: "new_idea", label: "Ideas" },
    { value: "trending", label: "Trends" },
    { value: "new_tool", label: "Tools" },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Updates</h1>
        <p className="mt-2 text-zinc-400">
          Stay up to date with new ideas, trending topics, and recently added tools.
        </p>
      </div>

      {/* Stats Bar */}
      {stats && (
        <div className="mb-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 text-center">
            <p className="text-2xl font-bold text-white">{stats.totalIdeas}</p>
            <p className="text-xs text-zinc-500 mt-1">Total Ideas</p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 text-center">
            <p className="text-2xl font-bold text-white">{stats.newIdeasThisWeek}</p>
            <p className="text-xs text-zinc-500 mt-1">New This Week</p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 text-center">
            <p className="text-2xl font-bold text-white">{stats.totalTrends}</p>
            <p className="text-xs text-zinc-500 mt-1">Trends Tracked</p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 text-center">
            <p className="text-2xl font-bold text-white">{stats.totalTools}</p>
            <p className="text-xs text-zinc-500 mt-1">Tools Listed</p>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="mb-6 flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-900 p-1 w-fit">
        {filterOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => {
              setType(opt.value);
              setOffset(0);
            }}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              type === opt.value
                ? "bg-emerald-500/15 text-emerald-400"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Feed */}
      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-xl border border-zinc-800 bg-zinc-900/50 p-4"
            >
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-lg bg-zinc-800" />
                <div className="flex-1">
                  <div className="h-3 w-20 rounded bg-zinc-800 mb-2" />
                  <div className="h-4 w-48 rounded bg-zinc-800 mb-1" />
                  <div className="h-3 w-64 rounded bg-zinc-800" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : !data || data.items.length === 0 ? (
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
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
            />
          </svg>
          <p className="text-zinc-400 font-medium">No updates yet</p>
          <p className="text-sm text-zinc-500 mt-1">
            Updates will appear here as new content is added.
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {data.items.map((item) => (
              <UpdateItem key={item.id} item={item} />
            ))}
          </div>

          {/* Pagination */}
          {(data.hasMore || offset > 0) && (
            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                onClick={() => setOffset(Math.max(0, offset - limit))}
                disabled={offset === 0}
                className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-xs text-zinc-500">
                Showing {offset + 1}-{Math.min(offset + limit, data.total)} of {data.total}
              </span>
              <button
                onClick={() => setOffset(offset + limit)}
                disabled={!data.hasMore}
                className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
