"use client";

import { cn } from "@/lib/utils";

interface IdeaScoreBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

function getScoreColor(score: number): string {
  if (score >= 8) return "text-green-400 bg-green-400/10 border-green-400/30 shadow-green-400/10";
  if (score >= 6) return "text-emerald-400 bg-emerald-400/10 border-emerald-400/30";
  if (score >= 4) return "text-yellow-400 bg-yellow-400/10 border-yellow-400/30";
  if (score >= 2) return "text-orange-400 bg-orange-400/10 border-orange-400/30";
  return "text-red-400 bg-red-400/10 border-red-400/30";
}

function getScoreLabel(score: number): string {
  if (score >= 8) return "Excellent";
  if (score >= 6) return "Strong";
  if (score >= 4) return "Moderate";
  if (score >= 2) return "Weak";
  return "Low";
}

const sizeClasses = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-14 h-14 text-lg",
};

export function IdeaScoreBadge({ score, size = "md", showLabel = false }: IdeaScoreBadgeProps) {
  const displayScore = Math.round(score * 10) / 10;

  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "rounded-full border flex items-center justify-center font-bold",
          sizeClasses[size],
          getScoreColor(score)
        )}
      >
        {displayScore}
      </div>
      {showLabel && (
        <span className={cn("text-xs font-medium", getScoreColor(score).split(" ")[0])}>
          {getScoreLabel(score)}
        </span>
      )}
    </div>
  );
}

interface ScoreBreakdownProps {
  scores: {
    opportunity: number;
    painPoints: number;
    confidence: number;
    timing: number;
    composite: number;
  };
}

export function ScoreBreakdown({ scores }: ScoreBreakdownProps) {
  const dimensions = [
    { label: "Opportunity", value: scores.opportunity, icon: "\u25C6" },
    { label: "Pain Points", value: scores.painPoints, icon: "\u25B2" },
    { label: "Confidence", value: scores.confidence, icon: "\u25CF" },
    { label: "Timing", value: scores.timing, icon: "\u25BA" },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-zinc-300">Score Breakdown</span>
        <IdeaScoreBadge score={scores.composite} size="sm" showLabel />
      </div>
      <div className="space-y-2">
        {dimensions.map((dim) => (
          <div key={dim.label} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400">
                {dim.icon} {dim.label}
              </span>
              <span className="text-zinc-300 font-medium">{dim.value}/10</span>
            </div>
            <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  dim.value >= 8 ? "bg-green-400" :
                  dim.value >= 6 ? "bg-emerald-400" :
                  dim.value >= 4 ? "bg-yellow-400" :
                  "bg-red-400"
                )}
                style={{ width: `${(dim.value / 10) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
