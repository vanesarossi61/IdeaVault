"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { trpc } from "@/lib/trpc/client";

// ── Icons ──
function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "h-5 w-5"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
      <path d="M18 14l.75 2.25L21 17l-2.25.75L18 20l-.75-2.25L15 17l2.25-.75L18 14z" />
    </svg>
  );
}
function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "h-5 w-5"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
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
function ChatIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "h-5 w-5"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "h-5 w-5"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
function FileTextIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "h-5 w-5"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}
function TrendingIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "h-5 w-5"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}
function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "h-5 w-5"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

// ── Score Ring Component ──
function ScoreRing({ score, size = 80 }: { score: number; size?: number }) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color =
    score >= 80 ? "text-emerald-400" : score >= 60 ? "text-amber-400" : "text-red-400";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="-rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={4}
          fill="none"
          className="text-zinc-800"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={4}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={color}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-lg font-bold ${color}`}>{score}</span>
      </div>
    </div>
  );
}

// ── Score Bar ──
function ScoreBar({ label, score, reasoning }: { label: string; score: number; reasoning: string }) {
  const color =
    score >= 80 ? "bg-emerald-500" : score >= 60 ? "bg-amber-500" : "bg-red-500";

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-zinc-300">{label}</span>
        <span className="text-sm font-bold text-white">{score}/100</span>
      </div>
      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <p className="text-xs text-zinc-500">{reasoning}</p>
    </div>
  );
}

export default function AIWorkspacePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"validate" | "plan" | "market">("validate");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [context, setContext] = useState("");

  // Mutations
  const validateMutation = trpc.ai.validateIdea.useMutation();
  const planMutation = trpc.ai.generatePlan.useMutation();
  const marketMutation = trpc.ai.analyzeMarket.useMutation();

  // History
  const { data: history } = trpc.ai.getHistory.useQuery(
    { limit: 10 },
    { enabled: status === "authenticated" }
  );

  const navTabs = [
    { label: "Feed", href: "/hub", icon: UsersIcon, active: false },
    { label: "Builders", href: "/hub/builders", icon: WrenchIcon, active: false },
    { label: "Discuss", href: "/hub/discuss", icon: ChatIcon, active: false },
    { label: "AI Workspace", href: "/hub/ai", icon: SparklesIcon, active: true },
  ];

  const toolTabs = [
    { value: "validate" as const, label: "Validate Idea", icon: CheckIcon },
    { value: "plan" as const, label: "Business Plan", icon: FileTextIcon },
    { value: "market" as const, label: "Market Analysis", icon: TrendingIcon },
  ];

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <SparklesIcon className="h-12 w-12 text-violet-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Sign in to use AI Workspace</h2>
          <p className="text-zinc-400 mb-4">AI tools are available for authenticated users.</p>
          <Link href="/api/auth/signin" className="px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-500 transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const handleValidate = () => {
    if (!title.trim() || !description.trim()) return;
    validateMutation.mutate({ title: title.trim(), description: description.trim() });
  };

  const handlePlan = () => {
    if (!title.trim() || !description.trim()) return;
    planMutation.mutate({ title: title.trim(), description: description.trim() });
  };

  const handleMarket = () => {
    if (!category.trim()) return;
    marketMutation.mutate({ category: category.trim(), context: context.trim() || undefined });
  };

  const isLoading = validateMutation.isPending || planMutation.isPending || marketMutation.isPending;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
            AI Workspace
          </h1>
          <p className="mt-2 text-zinc-400">
            Validate ideas, generate business plans, and analyze markets with AI.
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Tool Area */}
          <div className="lg:col-span-2">
            {/* Tool Tabs */}
            <div className="flex gap-2 mb-6">
              {toolTabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    activeTab === tab.value
                      ? "bg-violet-500/20 text-violet-300 border border-violet-500/30 shadow-lg shadow-violet-500/5"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800"
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
              {(activeTab === "validate" || activeTab === "plan") && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1.5">Idea Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., AI-Powered Code Review Platform"
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1.5">Description</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe your idea in detail: what problem it solves, who it's for, how it works..."
                      rows={5}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 resize-none"
                    />
                  </div>
                  <button
                    onClick={activeTab === "validate" ? handleValidate : handlePlan}
                    disabled={isLoading || !title.trim() || !description.trim()}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-violet-600 text-white font-medium hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading ? (
                      <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <SparklesIcon className="h-4 w-4" />
                    )}
                    {activeTab === "validate" ? "Validate Idea" : "Generate Business Plan"}
                  </button>
                </div>
              )}

              {activeTab === "market" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1.5">Market / Category</label>
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="e.g., Developer Tools, EdTech, FinTech"
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1.5">Additional Context (optional)</label>
                    <textarea
                      value={context}
                      onChange={(e) => setContext(e.target.value)}
                      placeholder="Any specific angle or sub-market you want to analyze..."
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 resize-none"
                    />
                  </div>
                  <button
                    onClick={handleMarket}
                    disabled={isLoading || !category.trim()}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-violet-600 text-white font-medium hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading ? (
                      <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <TrendingIcon className="h-4 w-4" />
                    )}
                    Analyze Market
                  </button>
                </div>
              )}
            </div>

            {/* Validation Result */}
            {validateMutation.data && activeTab === "validate" && (
              <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-6">
                <div className="flex items-center gap-4">
                  <ScoreRing score={validateMutation.data.overallScore} />
                  <div>
                    <h3 className="text-lg font-bold text-white">Validation Score</h3>
                    <p className="text-sm text-zinc-400">
                      {validateMutation.data.overallScore >= 80
                        ? "Strong potential! This idea shows promise."
                        : validateMutation.data.overallScore >= 60
                          ? "Moderate potential. Consider the recommendations."
                          : "Needs work. Review the feedback carefully."}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <ScoreBar label="Market Potential" score={validateMutation.data.marketPotential.score} reasoning={validateMutation.data.marketPotential.reasoning} />
                  <ScoreBar label="Feasibility" score={validateMutation.data.feasibility.score} reasoning={validateMutation.data.feasibility.reasoning} />
                  <ScoreBar label="Competition" score={validateMutation.data.competition.score} reasoning={validateMutation.data.competition.reasoning} />
                  <ScoreBar label="Uniqueness" score={validateMutation.data.uniqueness.score} reasoning={validateMutation.data.uniqueness.reasoning} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-zinc-800">
                  <div>
                    <h4 className="text-sm font-semibold text-emerald-400 mb-2">Recommendations</h4>
                    <ul className="space-y-1">
                      {validateMutation.data.recommendations.map((r, i) => (
                        <li key={i} className="text-xs text-zinc-400 flex gap-2">
                          <span className="text-emerald-400 mt-0.5">+</span> {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-amber-400 mb-2">Risks</h4>
                    <ul className="space-y-1">
                      {validateMutation.data.risks.map((r, i) => (
                        <li key={i} className="text-xs text-zinc-400 flex gap-2">
                          <span className="text-amber-400 mt-0.5">!</span> {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Business Plan Result */}
            {planMutation.data && activeTab === "plan" && (
              <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-5">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileTextIcon className="h-5 w-5 text-violet-400" />
                  Business Plan
                </h3>

                {[
                  { title: "Executive Summary", content: planMutation.data.executiveSummary },
                  { title: "Problem", content: planMutation.data.problemStatement },
                  { title: "Solution", content: planMutation.data.solution },
                  { title: "Target Market", content: planMutation.data.targetMarket },
                  { title: "Revenue Model", content: planMutation.data.revenueModel },
                ].map((section) => (
                  <div key={section.title}>
                    <h4 className="text-sm font-semibold text-violet-300 mb-1">{section.title}</h4>
                    <p className="text-sm text-zinc-400">{section.content}</p>
                  </div>
                ))}

                <div>
                  <h4 className="text-sm font-semibold text-violet-300 mb-2">Go-to-Market Strategy</h4>
                  <ol className="space-y-1">
                    {planMutation.data.goToMarket.map((step, i) => (
                      <li key={i} className="text-xs text-zinc-400">{step}</li>
                    ))}
                  </ol>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-violet-300 mb-2">Milestones</h4>
                  <div className="space-y-3">
                    {planMutation.data.milestones.map((m, i) => (
                      <div key={i} className="p-3 rounded-lg bg-zinc-800/50">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-white">{m.phase}</span>
                          <span className="text-xs text-zinc-500">{m.duration}</span>
                        </div>
                        <ul className="space-y-0.5">
                          {m.goals.map((g, j) => (
                            <li key={j} className="text-xs text-zinc-400 flex gap-1">
                              <span className="text-violet-400">-</span> {g}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-violet-300 mb-2">Estimated Costs</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {planMutation.data.estimatedCosts.map((c, i) => (
                      <div key={i} className="p-2 rounded-lg bg-zinc-800/50">
                        <p className="text-xs text-zinc-500">{c.category}</p>
                        <p className="text-sm font-medium text-white">{c.range}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Market Analysis Result */}
            {marketMutation.data && activeTab === "market" && (
              <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-5">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <TrendingIcon className="h-5 w-5 text-violet-400" />
                  Market Analysis
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-zinc-800/50">
                    <p className="text-xs text-zinc-500">Market Size</p>
                    <p className="text-sm text-zinc-300 mt-1">{marketMutation.data.marketSize}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-zinc-800/50">
                    <p className="text-xs text-zinc-500">Growth Rate</p>
                    <p className="text-sm text-zinc-300 mt-1">{marketMutation.data.growthRate}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-violet-300 mb-2">Key Trends</h4>
                  <ul className="space-y-1">
                    {marketMutation.data.keyTrends.map((t, i) => (
                      <li key={i} className="text-xs text-zinc-400 flex gap-2">
                        <TrendingIcon className="h-3 w-3 text-violet-400 mt-0.5 flex-shrink-0" /> {t}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-violet-300 mb-2">Competitors</h4>
                  <div className="space-y-2">
                    {marketMutation.data.competitors.map((c, i) => (
                      <div key={i} className="p-3 rounded-lg bg-zinc-800/50">
                        <p className="text-sm font-medium text-white">{c.name}</p>
                        <div className="flex gap-4 mt-1">
                          <span className="text-xs text-emerald-400">+ {c.strength}</span>
                          <span className="text-xs text-red-400">- {c.weakness}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-semibold text-emerald-400 mb-2">Opportunities</h4>
                    <ul className="space-y-1">
                      {marketMutation.data.opportunities.map((o, i) => (
                        <li key={i} className="text-xs text-zinc-400">+ {o}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-red-400 mb-2">Threats</h4>
                    <ul className="space-y-1">
                      {marketMutation.data.threats.map((t, i) => (
                        <li key={i} className="text-xs text-zinc-400">- {t}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-violet-300 mb-1">Target Demographic</h4>
                  <p className="text-sm text-zinc-400">{marketMutation.data.targetDemographic}</p>
                </div>
              </div>
            )}

            {/* Error Display */}
            {(validateMutation.error || planMutation.error || marketMutation.error) && (
              <div className="mt-4 p-4 rounded-xl border border-red-500/30 bg-red-500/10">
                <p className="text-sm text-red-400">
                  {validateMutation.error?.message || planMutation.error?.message || marketMutation.error?.message}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar: History */}
          <div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800">
                <ClockIcon className="h-4 w-4 text-zinc-400" />
                <h3 className="font-semibold text-white text-sm">Recent History</h3>
              </div>

              <div className="divide-y divide-zinc-800">
                {history?.items && history.items.length > 0 ? (
                  history.items.map((item) => (
                    <Link
                      key={item.id}
                      href={`/hub/ai?id=${item.id}`}
                      className="block px-4 py-3 hover:bg-zinc-800/50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        {item.type === "VALIDATION" ? (
                          <CheckIcon className="h-3.5 w-3.5 text-emerald-400" />
                        ) : item.type === "BUSINESS_PLAN" ? (
                          <FileTextIcon className="h-3.5 w-3.5 text-violet-400" />
                        ) : (
                          <TrendingIcon className="h-3.5 w-3.5 text-amber-400" />
                        )}
                        <span className="text-sm text-white truncate flex-1">
                          {item.title}
                        </span>
                        {item.score && (
                          <span className={`text-xs font-bold ${
                            item.score >= 80 ? "text-emerald-400" : item.score >= 60 ? "text-amber-400" : "text-red-400"
                          }`}>
                            {item.score}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </Link>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center text-sm text-zinc-500">
                    No AI analyses yet. Try validating an idea!
                  </div>
                )}
              </div>
            </div>

            {/* Tips */}
            <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
              <h3 className="font-semibold text-white text-sm mb-3">Tips</h3>
              <ul className="space-y-2 text-xs text-zinc-400">
                <li className="flex gap-2">
                  <SparklesIcon className="h-3.5 w-3.5 text-violet-400 mt-0.5 flex-shrink-0" />
                  Be specific in your descriptions for better analysis
                </li>
                <li className="flex gap-2">
                  <SparklesIcon className="h-3.5 w-3.5 text-violet-400 mt-0.5 flex-shrink-0" />
                  Include target audience and revenue model details
                </li>
                <li className="flex gap-2">
                  <SparklesIcon className="h-3.5 w-3.5 text-violet-400 mt-0.5 flex-shrink-0" />
                  Combine validation + market analysis for complete picture
                </li>
                <li className="flex gap-2">
                  <SparklesIcon className="h-3.5 w-3.5 text-violet-400 mt-0.5 flex-shrink-0" />
                  You can run up to 10 validations and 5 plans per day
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
