"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn, formatDate, getInitials } from "@/lib/utils";
import { trpc } from "@/lib/trpc/client";

interface CommentUser {
  id: string;
  name: string | null;
  image: string | null;
}

interface CommentData {
  id: string;
  body: string;
  createdAt: string | Date;
  user: CommentUser;
  replies?: CommentData[];
}

interface CommentSectionProps {
  ideaId: string;
  comments: CommentData[];
  totalCount: number;
}

export function CommentSection({ ideaId, comments, totalCount }: CommentSectionProps) {
  const [showForm, setShowForm] = useState(false);

  const utils = trpc.useUtils();
  const commentMutation = trpc.idea.comment.useMutation({
    onSuccess: () => {
      utils.idea.getBySlug.invalidate();
      setShowForm(false);
    },
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-zinc-300">
          Comments{" "}
          <span className="text-zinc-500">({totalCount})</span>
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowForm(!showForm)}
          className="border-zinc-700/50 bg-transparent text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 text-xs h-7"
        >
          {showForm ? "Cancel" : "Add Comment"}
        </Button>
      </div>

      {/* New comment form */}
      {showForm && (
        <CommentForm
          ideaId={ideaId}
          onSubmit={async (body) => {
            await commentMutation.mutateAsync({ ideaId, body });
          }}
          isSubmitting={commentMutation.isPending}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Comments list */}
      {comments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm text-zinc-500">
            No comments yet. Be the first to share your thoughts!
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              ideaId={ideaId}
              depth={0}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Individual comment with nested replies
function CommentItem({
  comment,
  ideaId,
  depth,
}: {
  comment: CommentData;
  ideaId: string;
  depth: number;
}) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const utils = trpc.useUtils();
  const replyMutation = trpc.idea.comment.useMutation({
    onSuccess: () => {
      utils.idea.getBySlug.invalidate();
      setShowReplyForm(false);
    },
  });

  const hasReplies = comment.replies && comment.replies.length > 0;
  const maxDepth = 3;

  return (
    <div className={cn("group", depth > 0 && "ml-6 pl-4 border-l border-zinc-800/50")}>
      <div className="py-3">
        {/* Author row */}
        <div className="flex items-center gap-2 mb-2">
          <Avatar name={comment.user.name} image={comment.user.image} size="sm" />
          <span className="text-sm font-medium text-zinc-300">
            {comment.user.name ?? "Anonymous"}
          </span>
          <span className="text-[11px] text-zinc-600">
            {formatDate(comment.createdAt)}
          </span>
        </div>

        {/* Body */}
        <p className="text-sm text-zinc-400 leading-relaxed pl-8">
          {comment.body}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-3 pl-8 mt-2">
          {depth < maxDepth && (
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              {showReplyForm ? "Cancel" : "Reply"}
            </button>
          )}
          {hasReplies && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              {collapsed
                ? `Show ${comment.replies!.length} repl${comment.replies!.length === 1 ? "y" : "ies"}`
                : "Hide replies"}
            </button>
          )}
        </div>

        {/* Reply form */}
        {showReplyForm && (
          <div className="pl-8 mt-3">
            <CommentForm
              ideaId={ideaId}
              parentId={comment.id}
              onSubmit={async (body) => {
                await replyMutation.mutateAsync({
                  ideaId,
                  body,
                  parentId: comment.id,
                });
              }}
              isSubmitting={replyMutation.isPending}
              onCancel={() => setShowReplyForm(false)}
              placeholder={`Reply to ${comment.user.name ?? "Anonymous"}...`}
              compact
            />
          </div>
        )}
      </div>

      {/* Nested replies */}
      {hasReplies && !collapsed && (
        <div>
          {comment.replies!.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              ideaId={ideaId}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Comment form
function CommentForm({
  ideaId,
  parentId,
  onSubmit,
  isSubmitting,
  onCancel,
  placeholder = "Share your thoughts on this idea...",
  compact = false,
}: {
  ideaId: string;
  parentId?: string;
  onSubmit: (body: string) => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
  placeholder?: string;
  compact?: boolean;
}) {
  const [body, setBody] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;
    await onSubmit(body.trim());
    setBody("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder={placeholder}
        rows={compact ? 2 : 3}
        maxLength={2000}
        className={cn(
          "w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200",
          "placeholder:text-zinc-600 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/20",
          "resize-none",
          compact && "text-xs"
        )}
      />
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-zinc-600">
          {body.length}/2000
        </span>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCancel}
            className="border-zinc-800 bg-transparent text-zinc-500 hover:bg-zinc-800 h-7 text-xs"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={!body.trim() || isSubmitting}
            className="bg-green-600 hover:bg-green-700 text-white h-7 text-xs disabled:opacity-50"
          >
            {isSubmitting ? "Posting..." : parentId ? "Reply" : "Comment"}
          </Button>
        </div>
      </div>
    </form>
  );
}

// Simple avatar component
function Avatar({
  name,
  image,
  size = "md",
}: {
  name: string | null;
  image: string | null;
  size?: "sm" | "md";
}) {
  const sizeClass = size === "sm" ? "w-6 h-6 text-[10px]" : "w-8 h-8 text-xs";

  if (image) {
    return (
      <img
        src={image}
        alt={name ?? "User"}
        className={cn("rounded-full object-cover", sizeClass)}
      />
    );
  }

  return (
    <div
      className={cn(
        "rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 font-medium",
        sizeClass
      )}
    >
      {getInitials(name)}
    </div>
  );
}
