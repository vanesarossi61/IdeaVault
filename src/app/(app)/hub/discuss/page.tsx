"use client";

import { useState } from "react";
import Link from "next/link";
import { trpc } from "@/lib/trpc/client";

// ── Icons ──
function ChatIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "h-5 w-5"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
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
function WrenchIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "h-5 w-5"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}
function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "h-5 w-5"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
    </svg>
  );
}
function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "h-5 w-5"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}
function ReplyIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "h-4 w-4"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <polyline points="9 17 4 12 9 7" />
      <path d="M20 18v-2a4 4 0 0 0-4-4H4" />
    </svg>
  );
}

// ── Time Ago ──
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

// ── Discussion Card ──
function DiscussionCard({ discussion }: { discussion: {
  id: string;
  body: string;
  createdAt: Date;
  user: { id: string; name: string | null; image: string | null };
  idea: { id: string; title: string; slug: string };
  _count: { replies: number };
}}) {
  const timeAgo = getTimeAgo(new Date(discussion.createdAt));

  return (
    <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 hover:border-zinc-700 transition-all">
      {/* Header */}
      <div className="flex items-start gap-3">
        {discussion.user.image ? (
          <img src={discussion.user.image} alt="" className="w-10 h-10 rounded-full" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
            {discussion.user.name?.[0]?.toUpperCase() || "?"}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-white text-sm">
              {discussion.user.name || "Anonymous"}
            </span>
            <span className="text-zinc-600 text-xs">on</span>
            <Link
              href={`/ideas/${discussion.idea.slug}`}
              className="text-violet-400 text-sm font-medium hover:text-violet-300 transition-colors truncate"
            >
              {discussion.idea.title}
            </Link>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">{timeAgo}</p>
        </div>
      </div>

      {/* Body */}
      <p className="mt-3 text-sm text-zinc-300 leading-relaxed line-clamp-3">
        {discussion.body}
      </p>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between">
        <Link
          href={`/ideas/${discussion.idea.slug}#comments`}
          className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-violet-400 transition-colors"
        >
          <ReplyIcon className="h-3.5 w-3.5" />
          {discussion._count.replies} {discussion._count.replies === 1 ? "reply" : "replies"}
        </Link>
        <Link
          href={`/ideas/${discussion.idea.slug}#comments`}
          className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
        >
          Join Discussion
        </Link>
      </div>
    </div>
  );
}

// ── Skeleton ──
function DiscussionSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/50 animate-pulse">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-zinc-800" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-zinc-800 rounded w-1/2" />
              <div className="h-3 bg-zinc-800 rounded w-1/4" />
            </div>
          </div>
          <div className="mt-3 space-y-2">
            <div className="h-3 bg-zinc-800 rounded w-full" />
            <div className="h-3 bg-zinc-800 rounded w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function DiscussPage() {
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "popular" | "mostReplies">("recent");

  const { data: discussions, isLoading } = trpc.hub.getDiscussions.useQuery({
    limit: 20,
    search: searchQuery || undefined,
    sortBy,
  });

  const navTabs = [
    { label: "Feed", href: "/hub", icon: UsersIcon, active: false },
    { label: "Builders", href: "/hub/builders", icon: WrenchIcon, active: false },
    { label: "Discuss", href: "/hub/discuss", icon: ChatIcon, active: true },
    { label: "AI Workspace", href: "/hub/ai", icon: SparklesIcon, active: false },
  ];

  const sortOptions = [
    { value: "recent" as const, label: "Most Recent" },
    { value: "mostReplies" as const, label: "Most Replies" },
    { value: "popular" as const, label: "Popular" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(search);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
            Discussions
          </h1>
          <p className="mt-2 text-zinc-400">
            Join conversations about ideas, strategies, and building in public.
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

        {/* Search & Sort */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search discussions..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all"
              />
            </div>
          </form>

          <div className="flex gap-2">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSortBy(option.value)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  sortBy === option.value
                    ? "bg-violet-500/20 text-violet-300 border border-violet-500/30"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Discussions List */}
        {isLoading ? (
          <DiscussionSkeleton />
        ) : discussions?.items && discussions.items.length > 0 ? (
          <div className="space-y-4">
            {discussions.items.map((discussion) => (
              <DiscussionCard key={discussion.id} discussion={discussion as any} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <ChatIcon className="h-12 w-12 text-zinc-700 mx-auto mb-3" />
            <p className="text-zinc-500 mb-2">
              {searchQuery
                ? "No discussions found matching your search."
                : "No discussions yet. Be the first to start a conversation!"}
            </p>
            <Link
              href="/ideas"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-500 transition-colors"
            >
              Browse Ideas to Comment
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
