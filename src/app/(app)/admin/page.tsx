"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";

// ── Icons ──
function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "h-5 w-5"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
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
function BulbIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "h-5 w-5"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
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
function CreditCardIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "h-5 w-5"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  );
}
function ActivityIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "h-5 w-5"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}
function TrashIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "h-4 w-4"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}
function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "h-4 w-4"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}

// ── Stat Card ──
function AdminStatCard({ label, value, subValue, icon: Icon, color }: {
  label: string; value: number | string; subValue?: string;
  icon: ({ className }: { className?: string }) => JSX.Element; color: string;
}) {
  return (
    <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-2xl font-bold text-white">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
          <p className="text-xs text-zinc-500">{label}</p>
          {subValue && <p className="text-xs text-zinc-600 mt-0.5">{subValue}</p>}
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<"overview" | "users" | "ideas" | "comments">("overview");
  const [userSearch, setUserSearch] = useState("");
  const [ideaSearch, setIdeaSearch] = useState("");
  const [ideaStatusFilter, setIdeaStatusFilter] = useState<"PUBLISHED" | "DRAFT" | "ARCHIVED" | undefined>(undefined);

  // Queries
  const { data: stats } = trpc.admin.getStats.useQuery(undefined, {
    enabled: status === "authenticated",
  });
  const { data: users } = trpc.admin.getUsers.useQuery(
    { limit: 25, search: userSearch || undefined },
    { enabled: status === "authenticated" && activeSection === "users" }
  );
  const { data: ideas } = trpc.admin.getIdeas.useQuery(
    { limit: 25, search: ideaSearch || undefined, status: ideaStatusFilter },
    { enabled: status === "authenticated" && activeSection === "ideas" }
  );
  const { data: comments } = trpc.admin.getReportedComments.useQuery(
    { limit: 25 },
    { enabled: status === "authenticated" && activeSection === "comments" }
  );
  const { data: activity } = trpc.admin.getRecentActivity.useQuery(
    { limit: 15 },
    { enabled: status === "authenticated" && activeSection === "overview" }
  );

  // Mutations
  const updateRoleMutation = trpc.admin.updateUserRole.useMutation();
  const updateIdeaStatusMutation = trpc.admin.updateIdeaStatus.useMutation();
  const deleteIdeaMutation = trpc.admin.deleteIdea.useMutation();
  const deleteCommentMutation = trpc.admin.deleteComment.useMutation();

  const utils = trpc.useUtils();

  // Auth guard
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-violet-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (status === "unauthenticated" || session?.user?.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <ShieldIcon className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-zinc-400">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  const sections = [
    { value: "overview" as const, label: "Overview", icon: ActivityIcon },
    { value: "users" as const, label: "Users", icon: UsersIcon },
    { value: "ideas" as const, label: "Ideas", icon: BulbIcon },
    { value: "comments" as const, label: "Comments", icon: ChatIcon },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-lg bg-red-500/10">
            <ShieldIcon className="h-6 w-6 text-red-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-zinc-400 text-sm">Manage users, content, and monitor platform health.</p>
          </div>
        </div>

        {/* Section Nav */}
        <div className="flex gap-1 p-1 mb-8 bg-zinc-900 rounded-xl border border-zinc-800 w-fit">
          {sections.map((section) => (
            <button
              key={section.value}
              onClick={() => setActiveSection(section.value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeSection === section.value
                  ? "bg-red-500/20 text-red-300"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800"
              }`}
            >
              <section.icon className="h-4 w-4" />
              {section.label}
            </button>
          ))}
        </div>

        {/* ═══ Overview Section ═══ */}
        {activeSection === "overview" && stats && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <AdminStatCard label="Total Users" value={stats.users.total} subValue={`+${stats.users.thisWeek} this week`} icon={UsersIcon} color="bg-violet-500/10 text-violet-400" />
              <AdminStatCard label="Published Ideas" value={stats.ideas.published} subValue={`${stats.ideas.drafts} drafts`} icon={BulbIcon} color="bg-emerald-500/10 text-emerald-400" />
              <AdminStatCard label="Comments" value={stats.engagement.totalComments} subValue={`+${stats.engagement.commentsThisWeek} this week`} icon={ChatIcon} color="bg-blue-500/10 text-blue-400" />
              <AdminStatCard label="Active Subs" value={stats.subscriptions.active} subValue={`of ${stats.subscriptions.total} total`} icon={CreditCardIcon} color="bg-amber-500/10 text-amber-400" />
              <AdminStatCard label="Interactions" value={stats.engagement.totalInteractions} icon={ActivityIcon} color="bg-rose-500/10 text-rose-400" />
            </div>

            {/* Content Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 text-center">
                <p className="text-3xl font-bold text-white">{stats.content.trends}</p>
                <p className="text-xs text-zinc-500 mt-1">Trends Tracked</p>
              </div>
              <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 text-center">
                <p className="text-3xl font-bold text-white">{stats.content.tools}</p>
                <p className="text-xs text-zinc-500 mt-1">Tools Listed</p>
              </div>
              <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 text-center">
                <p className="text-3xl font-bold text-white">{stats.content.graveyardStartups}</p>
                <p className="text-xs text-zinc-500 mt-1">Graveyard Entries</p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
              <div className="px-4 py-3 border-b border-zinc-800">
                <h3 className="font-semibold text-white">Recent Activity</h3>
              </div>
              <div className="divide-y divide-zinc-800 max-h-96 overflow-y-auto">
                {activity?.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 px-4 py-3">
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      item.type === "new_user" ? "bg-emerald-400" : item.type === "comment" ? "bg-blue-400" : "bg-violet-400"
                    }`} />
                    <p className="text-sm text-zinc-300 flex-1">{item.description}</p>
                    <span className="text-xs text-zinc-600 flex-shrink-0">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
                {(!activity || activity.length === 0) && (
                  <div className="px-4 py-8 text-center text-sm text-zinc-500">No recent activity.</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ═══ Users Section ═══ */}
        {activeSection === "users" && (
          <div>
            <div className="relative max-w-md mb-6">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search users by name or email..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-violet-500/50"
              />
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase">User</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase">Role</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase">Plan</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase">Activity</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase">Joined</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {users?.items.map((user) => (
                    <tr key={user.id} className="hover:bg-zinc-800/30">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {user.image ? (
                            <img src={user.image} alt="" className="w-8 h-8 rounded-full" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center text-xs text-violet-400 font-medium">
                              {user.name?.[0]?.toUpperCase() || "?"}
                            </div>
                          )}
                          <div>
                            <p className="text-sm text-white font-medium">{user.name || "No name"}</p>
                            <p className="text-xs text-zinc-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          user.role === "ADMIN" ? "bg-red-500/10 text-red-400" : "bg-zinc-700 text-zinc-300"
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-zinc-400">
                          {user.subscription?.plan || "FREE"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-zinc-400">
                          {user._count.interactions} actions, {user._count.comments} comments
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-zinc-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => {
                            const newRole = user.role === "ADMIN" ? "USER" : "ADMIN";
                            if (confirm(`Change ${user.name || user.email} to ${newRole}?`)) {
                              updateRoleMutation.mutate(
                                { userId: user.id, role: newRole as "USER" | "ADMIN" },
                                { onSuccess: () => utils.admin.getUsers.invalidate() }
                              );
                            }
                          }}
                          className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
                        >
                          {user.role === "ADMIN" ? "Demote" : "Promote"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {(!users?.items || users.items.length === 0) && (
                <div className="px-4 py-8 text-center text-sm text-zinc-500">No users found.</div>
              )}
            </div>
          </div>
        )}

        {/* ═══ Ideas Section ═══ */}
        {activeSection === "ideas" && (
          <div>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  value={ideaSearch}
                  onChange={(e) => setIdeaSearch(e.target.value)}
                  placeholder="Search ideas..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-violet-500/50"
                />
              </div>
              <div className="flex gap-2">
                {([undefined, "PUBLISHED", "DRAFT", "ARCHIVED"] as const).map((s) => (
                  <button
                    key={s ?? "all"}
                    onClick={() => setIdeaStatusFilter(s)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      ideaStatusFilter === s
                        ? "bg-violet-500/20 text-violet-300 border border-violet-500/30"
                        : "text-zinc-400 hover:bg-zinc-800 border border-zinc-800"
                    }`}
                  >
                    {s ?? "All"}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase">Idea</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase">Complexity</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase">Engagement</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {ideas?.items.map((idea) => (
                    <tr key={idea.id} className="hover:bg-zinc-800/30">
                      <td className="px-4 py-3">
                        <p className="text-sm text-white font-medium">{idea.title}</p>
                        <p className="text-xs text-zinc-500">{idea.slug}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          idea.status === "PUBLISHED" ? "bg-emerald-500/10 text-emerald-400"
                          : idea.status === "DRAFT" ? "bg-amber-500/10 text-amber-400"
                          : "bg-zinc-700 text-zinc-400"
                        }`}>
                          {idea.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-zinc-400">{idea.complexity}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-zinc-400">
                          {idea._count.comments}c / {idea._count.upvotes}u / {idea._count.interactions}i
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          {idea.status !== "PUBLISHED" && (
                            <button
                              onClick={() => updateIdeaStatusMutation.mutate(
                                { ideaId: idea.id, status: "PUBLISHED" },
                                { onSuccess: () => utils.admin.getIdeas.invalidate() }
                              )}
                              className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
                            >
                              Publish
                            </button>
                          )}
                          {idea.status === "PUBLISHED" && (
                            <button
                              onClick={() => updateIdeaStatusMutation.mutate(
                                { ideaId: idea.id, status: "ARCHIVED" },
                                { onSuccess: () => utils.admin.getIdeas.invalidate() }
                              )}
                              className="text-xs text-amber-400 hover:text-amber-300 transition-colors"
                            >
                              Archive
                            </button>
                          )}
                          <button
                            onClick={() => {
                              if (confirm(`Delete "${idea.title}"? This cannot be undone.`)) {
                                deleteIdeaMutation.mutate(
                                  { ideaId: idea.id },
                                  { onSuccess: () => utils.admin.getIdeas.invalidate() }
                                );
                              }
                            }}
                            className="text-xs text-red-400 hover:text-red-300 transition-colors"
                          >
                            <TrashIcon className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {(!ideas?.items || ideas.items.length === 0) && (
                <div className="px-4 py-8 text-center text-sm text-zinc-500">No ideas found.</div>
              )}
            </div>
          </div>
        )}

        {/* ═══ Comments Section ═══ */}
        {activeSection === "comments" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white">Comment Moderation</h2>
            {comments?.items && comments.items.length > 0 ? (
              <div className="space-y-3">
                {comments.items.map((comment) => (
                  <div key={comment.id} className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        {comment.user.image ? (
                          <img src={comment.user.image} alt="" className="w-8 h-8 rounded-full" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center text-xs text-violet-400">
                            {comment.user.name?.[0] || "?"}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-white">{comment.user.name}</span>
                            <span className="text-xs text-zinc-500">on</span>
                            <span className="text-sm text-violet-400 truncate">{comment.idea.title}</span>
                          </div>
                          <p className="mt-1 text-sm text-zinc-300">{comment.body}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-xs text-zinc-500">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                            <span className="text-xs text-zinc-600">
                              {comment._count.replies} replies
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          if (confirm("Delete this comment and all its replies?")) {
                            deleteCommentMutation.mutate(
                              { commentId: comment.id },
                              { onSuccess: () => utils.admin.getReportedComments.invalidate() }
                            );
                          }
                        }}
                        className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <ChatIcon className="h-12 w-12 text-zinc-700 mx-auto mb-3" />
                <p className="text-zinc-500">No comments to moderate.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
