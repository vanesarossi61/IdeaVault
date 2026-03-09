"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { trpc } from "@/lib/trpc/client";

const STATUS_CONFIG = {
  INACTIVE: { label: "Shut Down", color: "text-red-400", bg: "bg-red-500/10 border-red-500/20", icon: "💀" },
  ACQUIRED: { label: "Acquired", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20", icon: "🤝" },
  PIVOTED: { label: "Pivoted", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20", icon: "🔄" },
  UNKNOWN: { label: "Unknown", color: "text-zinc-400", bg: "bg-zinc-500/10 border-zinc-500/20", icon: "❓" },
} as const;

export default function GraveyardDetailPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();

  const { data: startup, isLoading, error } = trpc.graveyard.bySlug.useQuery(
    { slug: params.slug },
    { enabled: !!params.slug }
  );

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-6">
          <div className="h-5 w-32 rounded bg-zinc-800" />
          <div className="h-10 w-72 rounded bg-zinc-800" />
          <div className="h-6 w-48 rounded bg-zinc-800" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 rounded-xl border border-zinc-800 bg-zinc-900/50" />
            ))}
          </div>
          <div className="h-40 rounded-xl border border-zinc-800 bg-zinc-900/50" />
        </div>
      </div>
    );
  }

  if (error || !startup) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <span className="text-5xl">🪦</span>
        <h2 className="mt-4 text-xl font-bold text-white">Startup not found</h2>
        <p className="mt-2 text-zinc-400">This startup doesn&apos;t exist in the graveyard.</p>
        <Link
          href="/graveyard"
          className="mt-6 inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-medium text-white hover:border-zinc-600 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Graveyard
        </Link>
      </div>
    );
  }

  const statusConfig = STATUS_CONFIG[startup.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.UNKNOWN;
  const categories = (startup.categories as string[]) ?? [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-zinc-500">
        <Link href="/graveyard" className="hover:text-white transition-colors">
          Graveyard
        </Link>
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-zinc-300">{startup.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-start gap-3">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            {startup.name}
          </h1>
          <span
            className={`mt-1 flex-shrink-0 rounded-full border px-3 py-1 text-sm font-medium ${statusConfig.bg} ${statusConfig.color}`}
          >
            {statusConfig.icon} {statusConfig.label}
          </span>
        </div>

        {startup.description && (
          <p className="mt-3 text-lg leading-relaxed text-zinc-400">
            {startup.description}
          </p>
        )}

        {/* Tags */}
        {categories.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <span
                key={cat}
                className="rounded-md border border-zinc-800 bg-zinc-800/50 px-2.5 py-1 text-xs font-medium text-zinc-400"
              >
                {cat}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Info Cards Grid */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Batch */}
        <InfoCard
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
          label="YC Batch"
          value={startup.batch}
          subvalue={startup.batchLabel}
        />

        {/* Shutdown Year */}
        <InfoCard
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
          label="Shutdown Year"
          value={startup.shutdownYear?.toString() ?? "Unknown"}
        />

        {/* Founders */}
        <InfoCard
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
          label="Founders"
          value={startup.founders ?? "Unknown"}
        />

        {/* Funding */}
        <InfoCard
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          label="Funding"
          value={startup.funding ?? "Undisclosed"}
        />
      </div>

      {/* Successor Section */}
      {(startup.successor || startup.idea) && (
        <div className="mb-8 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
          <h2 className="mb-4 text-lg font-semibold text-white">What Came After</h2>

          {startup.successor && (
            <div className="mb-4 flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
                <svg className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-300">Successor</p>
                {startup.successorUrl ? (
                  <a
                    href={startup.successorUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:underline"
                  >
                    {startup.successor}
                    <svg className="ml-1 inline h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                ) : (
                  <p className="text-emerald-400">{startup.successor}</p>
                )}
              </div>
            </div>
          )}

          {startup.idea && (
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-violet-500/10">
                <svg className="h-4 w-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-300">Linked IdeaVault Idea</p>
                <Link
                  href={`/ideas/${startup.idea.slug}`}
                  className="text-violet-400 hover:underline"
                >
                  {startup.idea.title}
                  <svg className="ml-1 inline h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Source */}
      {startup.sourceUrl && (
        <div className="mb-8 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
          <h2 className="mb-3 text-lg font-semibold text-white">Source</h2>
          <a
            href={startup.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-emerald-400 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            {startup.sourceUrl}
          </a>
        </div>
      )}

      {/* Back Button */}
      <div className="flex items-center justify-between border-t border-zinc-800 pt-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Graveyard
        </button>

        <Link
          href="/graveyard"
          className="rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-medium text-white hover:border-zinc-600 transition-colors"
        >
          Browse all startups
        </Link>
      </div>
    </div>
  );
}

/* ===== Info Card Sub-component ===== */

function InfoCard({
  icon,
  label,
  value,
  subvalue,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subvalue?: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 transition-colors hover:border-zinc-700">
      <div className="flex items-center gap-2 text-zinc-500">
        {icon}
        <span className="text-xs font-medium uppercase tracking-wider">
          {label}
        </span>
      </div>
      <p className="mt-2 text-lg font-semibold text-white">{value}</p>
      {subvalue && (
        <p className="mt-0.5 text-xs text-zinc-500">{subvalue}</p>
      )}
    </div>
  );
}
