"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { trpc } from "@/lib/trpc/client";

// ── Inline SVG Icons ──
function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "h-5 w-5"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
function ChatIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "h-5 w-5"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "h-5 w-5"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
      <path d="M18 14l.75 2.25L21 17l-2.25.75L18 20l-.75-2.25L15 17l2.25-.75L18 14z" />
    </svg>
  );
}
function WrenchIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "h-5 w-5"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}
function TrophyIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "h-5 w-5"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}
function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "h-4 w-4"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

// ── Feed Item Component ──
function FeedItem({ item }: { item: { id: string; type: string; action: string; userName: string | null; userImage: string | null; ideaTitle: string; ideaSlug: string; preview: string | null; createdAt: string } }) {
  const timeAgo = getTimeAgo(new Date(item.createdAt));

  return (
    <div className="flex gap-3 p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 transition-colors">
      {/* Avatar */}
      <div className="flex-shrink-0">
        {item.userImage ? (
          <img src={item.userImage} alt="" className="w-10 h-10 rounded-full" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
            {item.userName?.[0]?.toUpperCase() || (item.type === "idea" ? "N" : "?")}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-zinc-300">
          {item.userName && (
            <span className="font-medium text-white">{item.userName}</span>
          )}{" "}
          <span className="text-zinc-400">{item.action}</span>{" "}
          <Link
            href={`/ideas/${item.ideaSlug}`}
            className="font-medium text-violet-400 hover:text-violet-300 transition-colors"
          >
            {item.ideaTitle}
          </Link>
        </p>
        {item.preview && (
          <p className="mt-1 text-sm text-zinc-500 line-clamp-2">{item.preview}</p>
        )}
        <p className="mt-1 text-xs text-zinc-600">{timeAgo}</p>
      </div>

      {/* Type badge */}
      <div className="flex-shrink-0">
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
          item.type === "comment"
            ? "bg-blue-500/10 text-blue-400"
            : item.type === "interaction"
              ? "bg-emerald-500/10 text-emerald-400"
              : "bg-violet-500/10 text-violet-400"
        }`}>
          {item.type === "comment" ? "Comment" : item.type === "interaction" ? "Activity" : "New Idea"}
        </span>
      </div>
    </div>
  );
}

// ── Time Ago Helper ──
function getTimeAgo(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

// ── Skeleton ──
function FeedSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-3 p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 animate-pulse">
          <div className="w-10 h-10 rounded-full bg-zinc-800" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-zinc-800 rounded w-3/4" />
            <div className="h-3 bg-zinc-800 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function HubPage() {
  const { data: session } = useSession();
  const [feedFilter, setFeedFilter] = useState<"all" | "comments" | "interactions" | "ideas">("all");

  const { data: stats } = trpc.hub.getCommunityStats.useQuery();
  const { data: feed, isLoading: feedLoading } = trpc.hub.getCommunityFeed.useQuery({
    limit: 20,
    type: feedFilter,
  });
  const { data: leaderboard } = trpc.hub.getLeaderboard.useQuery({ limit: 5, period: "month" });

  const navTabs = [
    { label: "Feed", href: "/hub", icon: UsersIcon, active: true },
    { label: "Builders", href: "/hub/builders", icon: WrenchIcon, active: false },
    { label: "Discuss", href: "/hub/discuss", icon: ChatIcon, active: false },
    { label: "AI Workspace", href: "/hub/ai", icon: SparklesIcon, active: false },
  ];

  const filterOptions = [
    { value: "all" as const, label: "All Activity" },
    { value: "comments" as const, label: "Comments" },
    { value: "interactions" as const, label: "Interactions" },
    { value: "ideas" as const, label: "New Ideas" },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
            Community Hub
          </h1>
          <p className="mt-2 text-zinc-400">
            Connect with builders, share ideas, and grow together.
          </p>
        </div>

        {/* Hub Navigation */}
        <div className="flex gap-1 p-1 mb-8 bg-zinc-900 rounded-xl border border-zinc-800 w-fit">
          {navTabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab.active
                  ? "bg-violet-500/20 text-violet-300"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </Link>
          ))}
        </div>

        {/* Stats Bar */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Active Builders", value: stats.totalBuilders, icon: WrenchIcon },
              { label: "Discussions", value: stats.totalDiscussions, icon: ChatIcon },
              { label: "Active This Week", value: stats.activeThisWeek, icon: UsersIcon },
              { label: "Total Interactions", value: stats.totalInteractions, icon: SparklesIcon },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-3 p-4 rounded-xl border border-zinc-800 bg-zinc-900/50"
              >
                <div className="p-2 rounded-lg bg-violet-500/10">
                  <stat.icon className="h-5 w-5 text-violet-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {stat.value.toLocaleString()}
                  </p>
                  <p className="text-xs text-zinc-500">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-2">
            {/* Feed Filters */}
            <div className="flex gap-2 mb-4">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFeedFilter(option.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    feedFilter === option.value
                      ? "bg-violet-500/20 text-violet-300 border border-violet-500/30"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800 border border-transparent"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {/* Feed Items */}
            {feedLoading ? (
              <FeedSkeleton />
            ) : feed?.items && feed.items.length > 0 ? (
              <div className="space-y-3">
                {feed.items.map((item) => (
                  <FeedItem key={item.id} item={{ ...item, createdAt: String(item.createdAt) }} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <UsersIcon className="h-12 w-12 text-zinc-700 mx-auto mb-3" />
                <p className="text-zinc-500">No activity yet. Be the first to contribute!</p>
                <Link
                  href="/ideas"
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-500 transition-colors"
                >
                  Browse Ideas <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar: Leaderboard */}
          <div className="space-y-6">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800">
                <TrophyIcon className="h-5 w-5 text-amber-400" />
                <h3 className="font-semibold text-white">Top Builders</h3>
                <span className="ml-auto text-xs text-zinc-500">This Month</span>
              </div>

              <div className="divide-y divide-zinc-800">
                {leaderboard?.map((user, index) => (
                  <div key={user.id} className="flex items-center gap-3 px-4 py-3">
                    <span className={`text-sm font-bold w-5 text-center ${
                      index === 0
                        ? "text-amber-400"
                        : index === 1
                          ? "text-zinc-300"
                          : index === 2
                            ? "text-orange-400"
                            : "text-zinc-600"
                    }`}>
                      {index + 1}
                    </span>
                    {user.image ? (
                      <img src={user.image} alt="" className="w-8 h-8 rounded-full" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-xs text-white font-medium">
                        {user.name?.[0]?.toUpperCase() || "?"}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {user.name || "Anonymous"}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {user.totalActions} actions
                      </p>
                    </div>
                    <span className="text-sm font-bold text-violet-400">
                      {user.score}
                    </span>
                  </div>
                ))}

                {(!leaderboard || leaderboard.length === 0) && (
                  <div className="px-4 py-8 text-center text-sm text-zinc-500">
                    No activity this month yet.
                  </div>
                )}
              </div>

              <Link
                href="/hub/builders"
                className="flex items-center justify-center gap-1 px-4 py-3 text-sm text-violet-400 hover:text-violet-300 border-t border-zinc-800 transition-colors"
              >
                View all builders <ArrowRightIcon className="h-3 w-3" />
              </Link>
            </div>

            {/* Quick Links */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
              <h3 className="font-semibold text-white mb-3">Quick Links</h3>
              <div className="space-y-2">
                <Link
                  href="/hub/builders"
                  className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  <WrenchIcon className="h-4 w-4" /> Builder Directory
                </Link>
                <Link
                  href="/hub/discuss"
                  className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  <ChatIcon className="h-4 w-4" /> Discussion Forum
                </Link>
                <Link
                  href="/hub/ai"
                  className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  <SparklesIcon className="h-4 w-4" /> AI Workspace
                </Link>
                <Link
                  href="/ideas"
                  className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  <ArrowRightIcon className="h-4 w-4" /> Browse Ideas
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
