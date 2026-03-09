"use client";

import Link from "next/link";

interface ToolCardProps {
  tool: {
    id: string;
    name: string;
    description: string;
    url: string;
    pricing: "FREE" | "FREEMIUM" | "PAID";
    category: string;
    stack?: { id: string; name: string } | null;
  };
}

const pricingConfig = {
  FREE: {
    label: "Free",
    className: "bg-emerald-500/15 text-emerald-400",
  },
  FREEMIUM: {
    label: "Freemium",
    className: "bg-blue-500/15 text-blue-400",
  },
  PAID: {
    label: "Paid",
    className: "bg-amber-500/15 text-amber-400",
  },
};

const categoryIcons: Record<string, string> = {
  "Analytics": "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  "Design": "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
  "Development": "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
  "Marketing": "M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z",
  "AI": "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
  "Productivity": "M13 10V3L4 14h7v7l9-11h-7z",
};

function getCategoryIcon(category: string): string {
  return (
    categoryIcons[category] ||
    "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
  );
}

export function ToolCard({ tool }: ToolCardProps) {
  const pricing = pricingConfig[tool.pricing];

  return (
    <div className="group rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 transition-all hover:border-emerald-500/30 hover:bg-zinc-900">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          {/* Category Icon */}
          <div className="flex-shrink-0 rounded-lg bg-zinc-800 p-2.5">
            <svg
              className="h-5 w-5 text-zinc-400 group-hover:text-emerald-400 transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={getCategoryIcon(tool.category)}
              />
            </svg>
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-white truncate group-hover:text-emerald-400 transition-colors">
              {tool.name}
            </h3>
            <p className="mt-1 text-sm text-zinc-400 line-clamp-2">
              {tool.description}
            </p>
          </div>
        </div>
        <span
          className={`flex-shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${pricing.className}`}
        >
          {pricing.label}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-zinc-500">
          <span className="rounded bg-zinc-800/80 px-2 py-0.5">
            {tool.category}
          </span>
          {tool.stack && (
            <span className="rounded bg-zinc-800/80 px-2 py-0.5">
              {tool.stack.name}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/tools/${tool.id}`}
            className="text-xs text-zinc-400 hover:text-white transition-colors"
          >
            Details
          </Link>
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 rounded-md bg-zinc-800 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-zinc-700 transition-colors"
          >
            Visit
            <svg
              className="h-3 w-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

export function ToolCardSkeleton() {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-lg bg-zinc-800" />
        <div className="flex-1">
          <div className="h-5 w-36 rounded bg-zinc-800 mb-2" />
          <div className="h-4 w-full rounded bg-zinc-800" />
        </div>
        <div className="h-6 w-16 rounded-full bg-zinc-800" />
      </div>
      <div className="mt-4 flex justify-between">
        <div className="h-4 w-24 rounded bg-zinc-800" />
        <div className="h-6 w-14 rounded bg-zinc-800" />
      </div>
    </div>
  );
}
