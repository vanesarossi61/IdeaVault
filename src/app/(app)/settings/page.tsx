"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type SettingsTab = "profile" | "plan" | "notifications" | "danger";

const tabs: { key: SettingsTab; label: string }[] = [
  { key: "profile", label: "Profile" },
  { key: "plan", label: "Plan & Billing" },
  { key: "notifications", label: "Notifications" },
  { key: "danger", label: "Danger Zone" },
];

export default function SettingsPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  if (!session) return null;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account and preferences
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 rounded-lg border border-[#2a2a2a] bg-[#111111] p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              activeTab === tab.key
                ? "bg-[#1a1a1a] text-white"
                : "text-muted-foreground hover:text-white"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="rounded-xl border border-[#2a2a2a] bg-[#111111]">
        {activeTab === "profile" && <ProfileSettings />}
        {activeTab === "plan" && <PlanSettings />}
        {activeTab === "notifications" && <NotificationSettings />}
        {activeTab === "danger" && <DangerZone />}
      </div>
    </div>
  );
}

// ════════════════════════════════════════
// Profile Settings
// ════════════════════════════════════════
function ProfileSettings() {
  const profileQuery = trpc.user.getProfile.useQuery();
  const updateMutation = trpc.user.updateProfile.useMutation({
    onSuccess: () => {
      profileQuery.refetch();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    },
  });

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [initialized, setInitialized] = useState(false);
  const [saved, setSaved] = useState(false);

  // Initialize form when data loads
  if (profileQuery.data && !initialized) {
    setName(profileQuery.data.name || "");
    setBio(profileQuery.data.bio || "");
    setInitialized(true);
  }

  const handleSave = () => {
    updateMutation.mutate({ name: name.trim(), bio: bio.trim() });
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h3 className="text-base font-semibold text-white">Profile Information</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Update your name and bio visible to other users
        </p>
      </div>

      <div className="space-y-4">
        {/* Avatar preview */}
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#1a1a1a] text-lg font-bold text-white">
            {profileQuery.data?.image ? (
              <img
                src={profileQuery.data.image}
                alt=""
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              name.slice(0, 2).toUpperCase() || "U"
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-white">{name || "Your name"}</p>
            <p className="text-xs text-muted-foreground">
              {profileQuery.data?.email}
            </p>
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-white">
            Display Name
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="border-[#2a2a2a] bg-[#0a0a0a] text-white"
            maxLength={50}
          />
        </div>

        {/* Bio */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-white">
            Bio
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell the community about yourself..."
            className="w-full rounded-md border border-[#2a2a2a] bg-[#0a0a0a] px-3 py-2 text-sm text-white placeholder:text-muted-foreground focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 resize-none"
            rows={3}
            maxLength={300}
          />
          <p className="mt-1 text-xs text-muted-foreground text-right">
            {bio.length}/300
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-[#2a2a2a] pt-4">
        {saved && (
          <span className="text-sm text-green-400">Changes saved!</span>
        )}
        <Button
          onClick={handleSave}
          disabled={updateMutation.isPending}
          className="ml-auto bg-green-500 text-black hover:bg-green-400"
        >
          {updateMutation.isPending ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════
// Plan & Billing
// ════════════════════════════════════════
function PlanSettings() {
  const profileQuery = trpc.user.getProfile.useQuery();
  const plan = profileQuery.data?.subscription?.plan || "FREE";
  const status = profileQuery.data?.subscription?.status || "ACTIVE";

  const plans = [
    {
      name: "FREE",
      price: "$0",
      features: ["5 ideas/day", "Basic filters", "Community access"],
    },
    {
      name: "STARTER",
      price: "$19/mo",
      features: [
        "Unlimited ideas",
        "Advanced filters",
        "Save & organize",
        "Email digest",
      ],
    },
    {
      name: "PRO",
      price: "$49/mo",
      popular: true,
      features: [
        "Everything in Starter",
        "AI validation",
        "Trend alerts",
        "Export data",
        "Priority support",
      ],
    },
    {
      name: "EMPIRE",
      price: "$99/mo",
      features: [
        "Everything in Pro",
        "API access",
        "Custom reports",
        "Team features",
        "White-label",
      ],
    },
  ];

  const planColors: Record<string, string> = {
    FREE: "border-[#2a2a2a]",
    STARTER: "border-blue-500/30",
    PRO: "border-purple-500/30",
    EMPIRE: "border-amber-500/30",
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h3 className="text-base font-semibold text-white">Plan & Billing</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Current plan:{" "}
          <span className="font-medium text-white">{plan}</span>
          <Badge
            variant="outline"
            className={cn(
              "ml-2 border-0 text-[10px]",
              status === "ACTIVE"
                ? "bg-green-400/10 text-green-400"
                : "bg-red-400/10 text-red-400"
            )}
          >
            {status}
          </Badge>
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {plans.map((p) => (
          <div
            key={p.name}
            className={cn(
              "relative rounded-xl border p-4 transition-colors",
              plan === p.name
                ? "border-green-500/50 bg-green-500/5"
                : planColors[p.name] || "border-[#2a2a2a]",
              "hover:border-[#3a3a3a]"
            )}
          >
            {p.popular && (
              <Badge className="absolute -top-2 right-3 border-0 bg-purple-500 text-white text-[10px]">
                Popular
              </Badge>
            )}
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-white">{p.name}</span>
              <span className="text-lg font-bold text-white">{p.price}</span>
            </div>
            <ul className="space-y-1.5">
              {p.features.map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-2 text-xs text-muted-foreground"
                >
                  <svg
                    className="h-3 w-3 shrink-0 text-green-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
            {plan === p.name ? (
              <div className="mt-3 rounded-md bg-green-500/10 py-1.5 text-center text-xs font-medium text-green-400">
                Current plan
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="mt-3 w-full border-[#2a2a2a] bg-transparent text-white hover:bg-[#1a1a1a]"
              >
                {plans.indexOf(p) > plans.findIndex((x) => x.name === plan)
                  ? "Upgrade"
                  : "Downgrade"}
              </Button>
            )}
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] p-4">
        <p className="text-sm text-muted-foreground">
          Need to manage your subscription?{" "}
          <button className="text-green-400 hover:underline">
            Open billing portal
          </button>
        </p>
      </div>
    </div>
  );
}

// ════════════════════════════════════════
// Notification Settings
// ════════════════════════════════════════
function NotificationSettings() {
  const updateNotifs = trpc.user.updateNotificationPrefs.useMutation({
    onSuccess: () => {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    },
  });

  const [saved, setSaved] = useState(false);
  const [prefs, setPrefs] = useState({
    emailNewIdeas: true,
    emailWeeklyDigest: true,
    emailCommentReplies: true,
    emailProductUpdates: false,
  });

  const toggle = (key: keyof typeof prefs) => {
    const newPrefs = { ...prefs, [key]: !prefs[key] };
    setPrefs(newPrefs);
    updateNotifs.mutate(newPrefs);
  };

  const notifOptions = [
    {
      key: "emailNewIdeas" as const,
      label: "New Ideas",
      desc: "Get notified when new ideas match your interests",
    },
    {
      key: "emailWeeklyDigest" as const,
      label: "Weekly Digest",
      desc: "A weekly summary of top ideas and trends",
    },
    {
      key: "emailCommentReplies" as const,
      label: "Comment Replies",
      desc: "Notifications when someone replies to your comments",
    },
    {
      key: "emailProductUpdates" as const,
      label: "Product Updates",
      desc: "News about IdeaVault features and improvements",
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h3 className="text-base font-semibold text-white">
          Email Notifications
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose what emails you want to receive
        </p>
      </div>

      <div className="space-y-1">
        {notifOptions.map((opt) => (
          <div
            key={opt.key}
            className="flex items-center justify-between rounded-lg px-4 py-3 hover:bg-[#0a0a0a] transition-colors"
          >
            <div>
              <p className="text-sm font-medium text-white">{opt.label}</p>
              <p className="text-xs text-muted-foreground">{opt.desc}</p>
            </div>
            <button
              onClick={() => toggle(opt.key)}
              className={cn(
                "relative h-6 w-11 rounded-full transition-colors",
                prefs[opt.key] ? "bg-green-500" : "bg-[#2a2a2a]"
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform",
                  prefs[opt.key] && "translate-x-5"
                )}
              />
            </button>
          </div>
        ))}
      </div>

      {saved && (
        <p className="text-sm text-green-400">Preferences saved!</p>
      )}
    </div>
  );
}

// ════════════════════════════════════════
// Danger Zone
// ════════════════════════════════════════
function DangerZone() {
  const [confirmText, setConfirmText] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const deleteMutation = trpc.user.deleteAccount.useMutation({
    onSuccess: () => {
      signOut({ callbackUrl: "/" });
    },
  });

  const handleDelete = () => {
    if (confirmText === "DELETE MY ACCOUNT") {
      deleteMutation.mutate({ confirmation: "DELETE MY ACCOUNT" });
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h3 className="text-base font-semibold text-red-400">Danger Zone</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Irreversible actions that affect your account
        </p>
      </div>

      <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-white">
              Delete your account
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Permanently remove your account and all associated data. This
              action cannot be undone.
            </p>
          </div>
          {!showConfirm && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowConfirm(true)}
              className="shrink-0 border-red-500/30 bg-transparent text-red-400 hover:bg-red-500/10"
            >
              Delete account
            </Button>
          )}
        </div>

        {showConfirm && (
          <div className="mt-4 space-y-3 border-t border-red-500/20 pt-4">
            <p className="text-sm text-muted-foreground">
              Type{" "}
              <span className="font-mono font-medium text-red-400">
                DELETE MY ACCOUNT
              </span>{" "}
              to confirm:
            </p>
            <Input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE MY ACCOUNT"
              className="border-red-500/30 bg-[#0a0a0a] text-white font-mono"
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowConfirm(false);
                  setConfirmText("");
                }}
                className="border-[#2a2a2a] bg-transparent text-white hover:bg-[#1a1a1a]"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleDelete}
                disabled={
                  confirmText !== "DELETE MY ACCOUNT" ||
                  deleteMutation.isPending
                }
                className="bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
              >
                {deleteMutation.isPending
                  ? "Deleting..."
                  : "Permanently delete"}
              </Button>
            </div>
            {deleteMutation.isError && (
              <p className="text-sm text-red-400">
                Error: {deleteMutation.error.message}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Sign out */}
      <div className="rounded-lg border border-[#2a2a2a] p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white">Sign out</p>
            <p className="text-xs text-muted-foreground">
              Sign out of your account on this device
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="border-[#2a2a2a] bg-transparent text-white hover:bg-[#1a1a1a]"
          >
            Sign out
          </Button>
        </div>
      </div>
    </div>
  );
}
