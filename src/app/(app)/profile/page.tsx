"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, formatDate, getInitials } from "@/lib/utils";

type ActivityTab = "all" | "interactions" | "comments" | "upvotes";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<ActivityTab>("all");

  const profileQuery = trpc.user.getProfile.useQuery(undefined, {
    enabled: !!session,
  });

  const activityQuery = trpc.user.getActivity.useQuery(
    { type: activeTab, limit: 20 },
    { enabled: !!session }
  );

  if (profileQuery.isLoading) return <ProfileSkeleton />;

  const profile = profileQuery.data;
  if (!profile) return null;

  const planName = profile.subscription?.plan || "FREE";
  const planColors: Record<string, string> = {
    FREE: "bg-gray-400/10 text-gray-400",
    STARTER: "bg-blue-400/10 text-blue-400",
    PRO: "bg-purple-400/10 text-purple-400",
    EMPIRE: "bg-amber-400/10 text-amber-400",
  };

  const tabs: { key: ActivityTab; label: string }[] = [
    { key: "all", label: "All" },
    { key: "interactions", label: "Interactions" },
    { key: "comments", label: "Comments" },
    { key: "upvotes", label: "Upvotes" },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* ── Profile Header ── */}
      <div className="relative">
        {/* Banner */}
        <div className="h-32 rounded-t-xl bg-gradient-to-r from-green-500/20 via-[#111111] to-purple-500/20" />

        <div className="relative -mt-12 px-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:gap-5">
            {/* Avatar */}
            <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-[#0a0a0a] bg-[#1a1a1a] text-2xl font-bold text-white">
              {profile.image ? (
                <img
                  src={profile.image}
                  alt={profile.name || ""}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                getInitials(profile.name || "U")
              )}
            </div>

            <div className="mt-3 flex-1 sm:mt-0 sm:mb-1">
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-white">
                  {profile.name || "Anonymous"}
                </h1>
                <Badge
                  variant="outline"
                  className={cn(
                    "border-0 text-[10px] font-semibold uppercase",
                    planColors[planName] || planColors.FREE
                  )}
                >
                  {planName}
                </Badge>
              </div>
              {profile.bio && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {profile.bio}
                </p>
              )}
              <p className="mt-1 text-xs text-muted-foreground/60">
                Joined {formatDate(profile.createdAt)}
              </p>
            </div>

            <Link href="/settings">
              <Button
                variant="outline"
                size="sm"
                className="border-[#2a2a2a] bg-transparent text-white hover:bg-[#1a1a1a]"
              >
                Edit profile
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {[
          { label: "Saved", value: profile.stats.saved, color: "text-green-400" },
          { label: "Interested", value: profile.stats.interested, color: "text-purple-400" },
          { label: "Building", value: profile.stats.building, color: "text-blue-400" },
          { label: "Comments", value: profile.stats.comments, color: "text-amber-400" },
          { label: "Upvotes", value: profile.stats.upvotes, color: "text-rose-400" },
          { label: "Total", value: profile.stats.totalInteractions, color: "text-white" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-[#2a2a2a] bg-[#111111] p-4 text-center"
          >
            <p className={cn("text-2xl font-bold", stat.color)}>
              {stat.value}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* ── Ideas Section ── */}
      {profile.interactions.length > 0 && (
        <div>
          <h2 className="mb-4 text-base font-semibold text-white">
            Your Ideas
          </h2>
          <div className="space-y-2">
            {profile.interactions.map((interaction) => {
              const typeColors: Record<string, string> = {
                SAVED: "bg-green-400/10 text-green-400",
                INTERESTED: "bg-purple-400/10 text-purple-400",
                BUILDING: "bg-blue-400/10 text-blue-400",
                HIDDEN: "bg-gray-400/10 text-gray-400",
              };

              return (
                <Link
                  key={interaction.id}
                  href={`/idea/${interaction.idea.slug}`}
                  className="group flex items-center justify-between rounded-lg border border-[#2a2a2a] bg-[#111111] px-4 py-3 hover:border-[#3a3a3a] transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Badge
                      variant="outline"
                      className={cn(
                        "border-0 text-[10px] shrink-0",
                        typeColors[interaction.type] || typeColors.SAVED
                      )}
                    >
                      {interaction.type}
                    </Badge>
                    <span className="truncate text-sm text-white group-hover:text-green-400 transition-colors">
                      {interaction.idea.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-3">
                    <Badge
                      variant="outline"
                      className="border-0 bg-[#1a1a1a] text-[10px] text-muted-foreground"
                    >
                      {interaction.idea.complexity}
                    </Badge>
                    <span className="text-xs text-muted-foreground/60">
                      {formatDate(interaction.createdAt)}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Activity Feed with Tabs ── */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-white">Activity</h2>
        </div>

        {/* Tab bar */}
        <div className="mb-4 flex gap-1 rounded-lg bg-[#111111] p-1 border border-[#2a2a2a]">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                activeTab === tab.key
                  ? "bg-[#1a1a1a] text-white"
                  : "text-muted-foreground hover:text-white"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Activity items */}
        {activityQuery.isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-3 px-3 py-2.5">
                <Skeleton className="h-7 w-7 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : activityQuery.data?.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#2a2a2a] py-12 text-center">
            <p className="text-sm text-muted-foreground">
              No {activeTab === "all" ? "" : activeTab + " "}activity yet
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {activityQuery.data?.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-[#111111] transition-colors"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1a1a1a]">
                  <span className="text-[10px] font-medium text-muted-foreground uppercase">
                    {item.action.slice(0, 2)}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-[#a0a0a0]">
                    <span className="capitalize text-white">{item.action}</span>
                    {"idea" in item && item.idea && (
                      <>
                        {" "}
                        <Link
                          href={`/idea/${(item as any).idea.slug}`}
                          className="font-medium text-green-400 hover:underline"
                        >
                          {(item as any).idea.title}
                        </Link>
                      </>
                    )}
                  </p>
                  {"preview" in item && (item as any).preview && (
                    <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                      "{(item as any).preview}"
                    </p>
                  )}
                </div>
                <span className="shrink-0 text-[11px] text-muted-foreground/60">
                  {formatDate(item.createdAt)}
                </span>
              </div>
            ))}

            {activityQuery.data?.nextCursor && (
              <button
                onClick={() => activityQuery.fetchNextPage?.()}
                className="w-full rounded-lg border border-[#2a2a2a] py-2 text-sm text-muted-foreground hover:border-[#3a3a3a] hover:text-white transition-colors"
              >
                Load more
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <div className="h-32 rounded-t-xl bg-[#111111]" />
        <div className="relative -mt-12 px-6">
          <div className="flex items-end gap-5">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="space-y-2 mb-1">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-60" />
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
