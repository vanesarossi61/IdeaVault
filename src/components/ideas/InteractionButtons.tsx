"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc/client";
import type { InteractionType } from "@/types";

interface InteractionButtonsProps {
  ideaId: string;
  userInteractions?: InteractionType[];
  compact?: boolean;
}

const INTERACTIONS = [
  {
    type: "SAVED" as InteractionType,
    label: "Save",
    activeLabel: "Saved",
    icon: BookmarkIcon,
    activeClass: "text-blue-400 bg-blue-400/10 border-blue-400/30 hover:bg-blue-400/20",
  },
  {
    type: "INTERESTED" as InteractionType,
    label: "Interested",
    activeLabel: "Interested",
    icon: SparklesIcon,
    activeClass: "text-purple-400 bg-purple-400/10 border-purple-400/30 hover:bg-purple-400/20",
  },
  {
    type: "BUILDING" as InteractionType,
    label: "Building",
    activeLabel: "Building",
    icon: HammerIcon,
    activeClass: "text-green-400 bg-green-400/10 border-green-400/30 hover:bg-green-400/20",
  },
] as const;

export function InteractionButtons({
  ideaId,
  userInteractions = [],
  compact = false,
}: InteractionButtonsProps) {
  const [activeTypes, setActiveTypes] = useState<Set<InteractionType>>(
    new Set(userInteractions)
  );

  const utils = trpc.useUtils();
  const interactMutation = trpc.idea.interact.useMutation({
    onSuccess: () => {
      utils.idea.getAll.invalidate();
    },
  });

  const handleInteraction = async (type: InteractionType) => {
    const newActive = new Set(activeTypes);
    if (newActive.has(type)) {
      newActive.delete(type);
    } else {
      newActive.add(type);
    }
    setActiveTypes(newActive);

    try {
      await interactMutation.mutateAsync({ ideaId, type });
    } catch {
      // Revert on error
      setActiveTypes(activeTypes);
    }
  };

  return (
    <div className={cn("flex gap-1.5", compact ? "" : "gap-2")}>
      {INTERACTIONS.map(({ type, label, activeLabel, icon: Icon, activeClass }) => {
        const isActive = activeTypes.has(type);
        return (
          <Button
            key={type}
            variant="outline"
            size={compact ? "sm" : "default"}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleInteraction(type);
            }}
            disabled={interactMutation.isPending}
            className={cn(
              "border-zinc-700/50 bg-transparent hover:bg-zinc-800 text-zinc-400 transition-all",
              compact && "h-7 px-2 text-xs",
              isActive && activeClass
            )}
          >
            <Icon className={cn("h-3.5 w-3.5", !compact && "mr-1.5")} />
            {!compact && (
              <span>{isActive ? activeLabel : label}</span>
            )}
          </Button>
        );
      })}
    </div>
  );
}

// Inline SVG icons to avoid external dependency
function BookmarkIcon({ className }: { className?: string }) {
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
      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
    </svg>
  );
}

function SparklesIcon({ className }: { className?: string }) {
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
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}

function HammerIcon({ className }: { className?: string }) {
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
      <path d="m15 12-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L12 9" />
      <path d="M17.64 15 22 10.64" />
      <path d="m20.91 11.7-1.25-1.25c-.6-.6-.93-1.4-.93-2.25v-.86L16.01 4.6a5.56 5.56 0 0 0-3.94-1.64H9l.92.82A6.18 6.18 0 0 1 12 8.4v1.56l2 2h2.47l2.26 1.91" />
    </svg>
  );
}

// Upvote button (separate component for reuse)
interface UpvoteButtonProps {
  ideaId: string;
  count: number;
  isUpvoted?: boolean;
}

export function UpvoteButton({ ideaId, count, isUpvoted = false }: UpvoteButtonProps) {
  const [voted, setVoted] = useState(isUpvoted);
  const [displayCount, setDisplayCount] = useState(count);

  const utils = trpc.useUtils();
  const upvoteMutation = trpc.idea.upvote.useMutation({
    onSuccess: () => {
      utils.idea.getAll.invalidate();
    },
  });

  const handleUpvote = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setVoted(!voted);
    setDisplayCount(voted ? displayCount - 1 : displayCount + 1);

    try {
      await upvoteMutation.mutateAsync({ ideaId });
    } catch {
      setVoted(voted);
      setDisplayCount(count);
    }
  };

  return (
    <button
      onClick={handleUpvote}
      disabled={upvoteMutation.isPending}
      className={cn(
        "flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all",
        "border border-zinc-700/50 hover:border-zinc-600",
        voted
          ? "text-green-400 bg-green-400/10 border-green-400/30"
          : "text-zinc-400 bg-transparent hover:text-zinc-300"
      )}
    >
      <ChevronUpIcon className="h-3.5 w-3.5" />
      <span>{displayCount}</span>
    </button>
  );
}

function ChevronUpIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m18 15-6-6-6 6" />
    </svg>
  );
}
