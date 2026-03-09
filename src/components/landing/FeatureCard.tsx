"use client";

import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  accent?: string;
  className?: string;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  accent = "#22c55e",
  className,
}: FeatureCardProps) {
  return (
    <div
      className={cn(
        "group relative rounded-xl border border-[#2a2a2a] bg-[#111111] p-6",
        "transition-all duration-300 hover:border-[#3a3a3a] hover:bg-[#151515]",
        "hover:shadow-lg hover:shadow-black/20",
        className
      )}
    >
      {/* Glow effect on hover */}
      <div
        className="absolute -inset-px rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"
        style={{ background: `linear-gradient(135deg, ${accent}10, transparent)` }}
      />

      <div className="relative">
        {/* Icon */}
        <div
          className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg"
          style={{ backgroundColor: `${accent}15` }}
        >
          <Icon className="w-6 h-6" style={{ color: accent }} />
        </div>

        {/* Content */}
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-sm text-[#a1a1aa] leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

// ===== FEATURE GRID VARIANT =====

interface FeatureGridItemProps {
  icon: LucideIcon;
  title: string;
  description: string;
  badge?: string;
}

export function FeatureGridItem({
  icon: Icon,
  title,
  description,
  badge,
}: FeatureGridItemProps) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#22c55e]/10 flex items-center justify-center">
        <Icon className="w-5 h-5 text-[#22c55e]" />
      </div>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h4 className="text-sm font-semibold text-white">{title}</h4>
          {badge && (
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-[#22c55e]/10 text-[#22c55e]">
              {badge}
            </span>
          )}
        </div>
        <p className="text-sm text-[#71717a] leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
