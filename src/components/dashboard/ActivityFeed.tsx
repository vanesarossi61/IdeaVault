"use client";

import Link from "next/link";
import { cn, formatDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface ActivityItem {
  id: string;
  type: "interaction" | "comment" | "upvote";
  action: string;
  ideaTitle: string | null;
  ideaSlug: string | null;
  preview: string | null;
  createdAt: Date;
}

interface ActivityFeedProps {
  items: ActivityItem[];
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

const actionIcons: Record<string, string> = {
  saved: "M5 5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16l-7-3.5L5 21V5z",
  interested:
    "M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  building:
    "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z",
  commented:
    "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
  upvoted: "M7 10l5-5 5 5M12 5v12",
  hidden: "M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94",
};

const actionColors: Record<string, string> = {
  saved: "text-blue-400",
  interested: "text-purple-400",
  building: "text-green-400",
  commented: "text-amber-400",
  upvoted: "text-rose-400",
  hidden: "text-muted-foreground",
};

const actionLabels: Record<string, string> = {
  saved: "Saved",
  interested: "Marked interested in",
  building: "Started building",
  commented: "Commented on",
  upvoted: "Upvoted",
  hidden: "Hidden",
};

function ActivityIcon({ action }: { action: string }) {
  const path = actionIcons[action] || actionIcons.saved;
  const isStroke = action === "upvoted";

  return (
    <svg
      className={cn("h-4 w-4", actionColors[action] || "text-muted-foreground")}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={isStroke ? "none" : "currentColor"}
      stroke={isStroke ? "currentColor" : "none"}
      strokeWidth={isStroke ? 2 : 0}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={path} />
    </svg>
  );
}

export function ActivityFeed({
  items,
  isLoading,
  hasMore,
  onLoadMore,
}: ActivityFeedProps) {
  if (isLoading) {
    return <ActivityFeedSkeleton />;
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-3 rounded-full bg-[#1a1a1a] p-4">
          <svg
            className="h-6 w-6 text-muted-foreground"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
          </svg>
        </div>
        <p className="text-sm text-muted-foreground">
          No activity yet. Start exploring ideas!
        </p>
      </div>
    );
  }

  // Agrupar por fecha
  const grouped = groupByDate(items);

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([date, dateItems]) => (
        <div key={date}>
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {date}
          </p>
          <div className="space-y-1">
            {dateItems.map((item) => (
              <div
                key={item.id}
                className="group flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-[#1a1a1a]"
              >
                <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#1a1a1a] group-hover:bg-[#222]">
                  <ActivityIcon action={item.action} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-[#a0a0a0]">
                    <span className="text-white">
                      {actionLabels[item.action] || item.action}
                    </span>
                    {item.ideaTitle && item.ideaSlug && (
                      <>
                        {" "}
                        <Link
                          href={`/idea/${item.ideaSlug}`}
                          className="font-medium text-green-400 hover:underline"
                        >
                          {item.ideaTitle}
                        </Link>
                      </>
                    )}
                  </p>
                  {item.preview && (
                    <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                      "{item.preview}"
                    </p>
                  )}
                  <p className="mt-1 text-[11px] text-muted-foreground/60">
                    {formatTimeAgo(item.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {hasMore && onLoadMore && (
        <button
          onClick={onLoadMore}
          className="w-full rounded-lg border border-[#2a2a2a] bg-[#111] py-2 text-sm text-muted-foreground hover:border-[#3a3a3a] hover:text-white transition-colors"
        >
          Load more activity
        </button>
      )}
    </div>
  );
}

function groupByDate(items: ActivityItem[]): Record<string, ActivityItem[]> {
  const groups: Record<string, ActivityItem[]> = {};
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  items.forEach((item) => {
    const d = new Date(item.createdAt);
    const itemDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());

    let key: string;
    if (itemDate >= today) {
      key = "Today";
    } else if (itemDate >= yesterday) {
      key = "Yesterday";
    } else {
      key = formatDate(item.createdAt);
    }

    if (!groups[key]) groups[key] = [];
    groups[key]!.push(item);
  });

  return groups;
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const d = new Date(date);
  const diff = now.getTime() - d.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return formatDate(date);
}

export function ActivityFeedSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="mb-3 h-3 w-16" />
        <div className="space-y-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3 px-3 py-2.5">
              <Skeleton className="h-7 w-7 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
