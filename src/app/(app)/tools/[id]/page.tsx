"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { trpc } from "@/lib/trpc/client";

const pricingConfig = {
  FREE: { label: "Free", className: "bg-emerald-500/15 text-emerald-400", desc: "Completely free to use" },
  FREEMIUM: { label: "Freemium", className: "bg-blue-500/15 text-blue-400", desc: "Free tier available with paid upgrades" },
  PAID: { label: "Paid", className: "bg-amber-500/15 text-amber-400", desc: "Paid plans only" },
};

export default function ToolDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: tool, isLoading } = trpc.tool.getById.useQuery({ id });

  // Get tools in same stack for "similar tools" section
  const { data: stackTools } = trpc.tool.getByStack.useQuery(
    { stackId: tool?.stackId ?? "" },
    { enabled: !!tool?.stackId }
  );

  const similarTools = stackTools?.filter((t) => t.id !== id)?.slice(0, 6) ?? [];

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-4 w-24 rounded bg-zinc-800 mb-6" />
          <div className="flex items-start gap-4 mb-8">
            <div className="h-14 w-14 rounded-xl bg-zinc-800" />
            <div>
              <div className="h-8 w-56 rounded bg-zinc-800 mb-3" />
              <div className="h-5 w-80 rounded bg-zinc-800" />
            </div>
          </div>
          <div className="h-48 rounded-xl bg-zinc-800" />
        </div>
      </div>
    );
  }

  if (!tool) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <svg
          className="mx-auto h-16 w-16 text-zinc-700 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
          />
        </svg>
        <h2 className="text-xl font-bold text-white mb-2">Tool not found</h2>
        <p className="text-zinc-400 mb-6">This tool doesn't exist or was removed.</p>
        <button
          onClick={() => router.push("/tools")}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 transition-colors"
        >
          Back to Tools
        </button>
      </div>
    );
  }

  const pricing = pricingConfig[tool.pricing];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-zinc-500">
        <Link href="/tools" className="hover:text-white transition-colors">
          Tools
        </Link>
        <span>/</span>
        <span className="text-zinc-300 truncate">{tool.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 rounded-xl bg-zinc-800 p-3.5">
            <svg
              className="h-7 w-7 text-emerald-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
              />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-white">{tool.name}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${pricing.className}`}>
                {pricing.label}
              </span>
              <span className="rounded bg-zinc-800 px-2.5 py-1 text-xs text-zinc-400">
                {tool.category}
              </span>
              {tool.stack && (
                <span className="rounded bg-zinc-800 px-2.5 py-1 text-xs text-zinc-400">
                  Stack: {tool.stack.name}
                </span>
              )}
            </div>
          </div>
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-500 transition-colors"
          >
            Visit Tool
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>

      {/* Description Card */}
      <div className="mb-8 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 mb-3">
          About this Tool
        </h2>
        <p className="text-base text-zinc-300 leading-relaxed">
          {tool.description}
        </p>
      </div>

      {/* Info Grid */}
      <div className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <p className="text-xs text-zinc-500 mb-1">Pricing</p>
          <p className="text-sm font-medium text-white">{pricing.label}</p>
          <p className="text-xs text-zinc-400 mt-0.5">{pricing.desc}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <p className="text-xs text-zinc-500 mb-1">Category</p>
          <p className="text-sm font-medium text-white">{tool.category}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <p className="text-xs text-zinc-500 mb-1">Website</p>
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors truncate block"
          >
            {tool.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
          </a>
        </div>
      </div>

      {/* Similar Tools (same stack) */}
      {similarTools.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">
            Other Tools in {tool.stack?.name}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {similarTools.map((st) => {
              const stPricing = pricingConfig[st.pricing];
              return (
                <Link key={st.id} href={`/tools/${st.id}`}>
                  <div className="group rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 transition-all hover:border-emerald-500/30 hover:bg-zinc-900">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-medium text-white group-hover:text-emerald-400 transition-colors truncate">
                        {st.name}
                      </h4>
                      <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${stPricing.className}`}>
                        {stPricing.label}
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs text-zinc-400 line-clamp-2">
                      {st.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
