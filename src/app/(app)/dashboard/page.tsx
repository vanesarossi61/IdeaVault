"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { trpc } from "@/lib/trpc/client";
import { StatCard, StatCardSkeleton } from "@/components/dashboard/StatCard";
import { ActivityFeed, ActivityFeedSkeleton } from "@/components/dashboard/ActivityFeed";
import { RecommendedIdeas } from "@/components/dashboard/RecommendedIdeas";

// ── Inline SVG icons (no lucide dependency needed) ──
function BookmarkIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M5 5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16l-7-3.5L5 21V5z" />
    </svg>
  );
}
function EyeIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function WrenchIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}
function ChatIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
function ArrowIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // tRPC queries (solo se ejecutan si hay session)
  const statsQuery = trpc.dashboard.getStats.useQuery(undefined, {
    enabled: !!session,
    staleTime: 60 * 1000,
  });

  const activityQuery = trpc.dashboard.getRecentActivity.useQuery(
    { limit: 15 },
    { enabled: !!session, staleTime: 60 * 1000 }
  );

  if (status === "loading") {
    return <DashboardSkeleton />;
  }

  if (!session) return null;

  const firstName = session.user.name?.split(" ")[0] || "there";
  const stats = statsQuery.data;

  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Welcome back, {firstName}
          </h1>
          <p className="mt-1 text-[#a1a1aa]">
            Here's what's happening with your ideas
          </p>
        </div>
        <Link
          href="/database"
          className="hidden sm:inline-flex items-center gap-2 rounded-lg bg-green-500/10 px-4 py-2 text-sm font-medium text-green-400 hover:bg-green-500/20 transition-colors"
        >
          Explore database
          <ArrowIcon />
        </Link>
      </div>

      {/* ── Stat Cards ── */}
      {statsQuery.isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Ideas Saved"
            value={stats?.saved.value ?? 0}
            change={stats?.saved.change}
            icon={<BookmarkIcon />}
            color="green"
          />
          <StatCard
            label="Interested"
            value={stats?.interested.value ?? 0}
            change={stats?.interested.change}
            icon={<EyeIcon />}
            color="purple"
          />
          <StatCard
            label="Building"
            value={stats?.building.value ?? 0}
            change={stats?.building.change}
            icon={<WrenchIcon />}
            color="blue"
          />
          <StatCard
            label="Comments"
            value={stats?.comments.value ?? 0}
            icon={<ChatIcon />}
            color="amber"
          />
        </div>
      )}

      {/* ── Two-column layout: Activity + Recommendations ── */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Activity Feed — 2/5 */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-[#2a2a2a] bg-[#111111]">
            <div className="flex items-center justify-between border-b border-[#2a2a2a] px-5 py-4">
              <h2 className="text-base font-semibold text-white">
                Recent Activity
              </h2>
              <Link
                href="/profile"
                className="text-xs text-muted-foreground hover:text-white transition-colors"
              >
                View all
              </Link>
            </div>
            <div className="p-4">
              <ActivityFeed
                items={activityQuery.data?.items ?? []}
                isLoading={activityQuery.isLoading}
                hasMore={!!activityQuery.data?.nextCursor}
              />
            </div>
          </div>
        </div>

        {/* Recommended Ideas — 3/5 */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-white">
              Recommended for You
            </h2>
            <Link
              href="/database?tab=for-you"
              className="text-xs text-muted-foreground hover:text-white transition-colors"
            >
              See all
            </Link>
          </div>
          <RecommendedIdeas limit={6} />
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div className="grid gap-3 sm:grid-cols-3">
        <Link
          href="/database"
          className="group flex items-center gap-4 rounded-xl border border-[#2a2a2a] bg-[#111111] p-5 hover:border-green-500/30 transition-all"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-400/10 text-green-400">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <ellipse cx="12" cy="5" rx="9" ry="3" />
              <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
              <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-white group-hover:text-green-400 transition-colors">
              Browse Ideas
            </p>
            <p className="text-xs text-muted-foreground">Discover validated opportunities</p>
          </div>
        </Link>
        <Link
          href="/trends"
          className="group flex items-center gap-4 rounded-xl border border-[#2a2a2a] bg-[#111111] p-5 hover:border-purple-500/30 transition-all"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-400/10 text-purple-400">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-white group-hover:text-purple-400 transition-colors">
              Explore Trends
            </p>
            <p className="text-xs text-muted-foreground">Track market movements</p>
          </div>
        </Link>
        <Link
          href="/graveyard"
          className="group flex items-center gap-4 rounded-xl border border-[#2a2a2a] bg-[#111111] p-5 hover:border-rose-500/30 transition-all"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-400/10 text-rose-400">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-white group-hover:text-rose-400 transition-colors">
              Startup Graveyard
            </p>
            <p className="text-xs text-muted-foreground">Learn from failures</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

// ── Skeleton de carga completa ──
function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="h-8 w-64 animate-pulse rounded-lg bg-[#1a1a1a]" />
        <div className="h-5 w-48 animate-pulse rounded-lg bg-[#1a1a1a]" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2 rounded-xl border border-[#2a2a2a] bg-[#111111] p-5">
          <ActivityFeedSkeleton />
        </div>
        <div className="lg:col-span-3">
          <div className="h-5 w-40 animate-pulse rounded bg-[#1a1a1a] mb-4" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-36 animate-pulse rounded-xl border border-[#2a2a2a] bg-[#111111]" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
