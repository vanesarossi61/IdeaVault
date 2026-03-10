"use client";

import { useState } from "react";
import Link from "next/link";
import { trpc } from "@/lib/trpc/client";

// ── Icons ──
function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "h-5 w-5"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
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

// ── Builder Card ──
function BuilderCard({ builder }: { builder: {
  id: string;
  name: string | null;
  image: string | null;
  bio: string | null;
  createdAt: Date;
  _count: { interactions: number; comments: number };
  interactions: { idea: { id: string; title: string; slug: string } }[];
}}) {
  return (
    <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 hover:border-zinc-700 transition-all">
      {/* Builder Info */}
      <div className="flex items-start gap-4">
        {builder.image ? (
          <img src={builder.image} alt="" className="w-14 h-14 rounded-full ring-2 ring-violet-500/20" />
        ) : (
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold ring-2 ring-violet-500/20">
            {builder.name?.[0]?.toUpperCase() || "?"}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white truncate">
            {builder.name || "Anonymous Builder"}
          </h3>
          {builder.bio && (
            <p className="mt-1 text-sm text-zinc-400 line-clamp-2">{builder.bio}</p>
          )}

          {/* Stats */}
          <div className="flex gap-4 mt-3">
            <span className="flex items-center gap-1 text-xs text-zinc-500">
              <WrenchIcon className="h-3 w-3" />
              {builder._count.interactions} projects
            </span>
            <span className="flex items-center gap-1 text-xs text-zinc-500">
              <ChatIcon className="h-3 w-3" />
              {builder._count.comments} comments
            </span>
          </div>
        </div>
      </div>

      {/* Currently Building */}
      {builder.interactions.length > 0 && (
        <div className="mt-4 pt-4 border-t border-zinc-800">
          <p className="text-xs text-zinc-500 mb-2 font-medium uppercase tracking-wide">
            Currently Building
          </p>
          <div className="flex flex-wrap gap-2">
            {builder.interactions.map((interaction) => (
              <Link
                key={interaction.idea.id}
                href={`/ideas/${interaction.idea.slug}`}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-violet-500/10 text-violet-400 text-xs font-medium hover:bg-violet-500/20 transition-colors"
              >
                <WrenchIcon className="h-3 w-3" />
                {interaction.idea.title.length > 30
                  ? interaction.idea.title.slice(0, 30) + "..."
                  : interaction.idea.title}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Skeleton ──
function BuilderSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/50 animate-pulse">
          <div className="flex gap-4">
            <div className="w-14 h-14 rounded-full bg-zinc-800" />
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-zinc-800 rounded w-1/3" />
              <div className="h-4 bg-zinc-800 rounded w-2/3" />
              <div className="h-3 bg-zinc-800 rounded w-1/4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function BuildersPage() {
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: builders, isLoading } = trpc.hub.getBuilders.useQuery({
    limit: 20,
    search: searchQuery || undefined,
  });

  const navTabs = [
    { label: "Feed", href: "/hub", icon: UsersIcon, active: false },
    { label: "Builders", href: "/hub/builders", icon: WrenchIcon, active: true },
    { label: "Discuss", href: "/hub/discuss", icon: ChatIcon, active: false },
    { label: "AI Workspace", href: "/hub/ai", icon: SparklesIcon, active: false },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(search);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
            Builder Directory
          </h1>
          <p className="mt-2 text-zinc-400">
            Discover who is building the next big thing.
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

        {/* Search */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative max-w-md">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search builders by name or bio..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all"
            />
          </div>
        </form>

        {/* Builder Grid */}
        {isLoading ? (
          <BuilderSkeleton />
        ) : builders?.items && builders.items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {builders.items.map((builder) => (
              <BuilderCard key={builder.id} builder={builder as any} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <WrenchIcon className="h-12 w-12 text-zinc-700 mx-auto mb-3" />
            <p className="text-zinc-500 mb-2">
              {searchQuery
                ? "No builders found matching your search."
                : "No builders yet. Start building an idea to appear here!"}
            </p>
            <Link
              href="/ideas"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-500 transition-colors"
            >
              Browse Ideas <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
