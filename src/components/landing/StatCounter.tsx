"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface StatCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  duration?: number;
  className?: string;
}

export function StatCounter({
  value,
  suffix = "",
  prefix = "",
  label,
  duration = 2000,
  className,
}: StatCounterProps) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateCount();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasAnimated]);

  function animateCount() {
    const startTime = Date.now();
    const step = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * value));

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setCount(value);
      }
    };
    requestAnimationFrame(step);
  }

  function formatNumber(n: number): string {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}K`;
    return n.toLocaleString();
  }

  return (
    <div ref={ref} className={cn("text-center", className)}>
      <div className="text-3xl sm:text-4xl font-bold text-white mb-1">
        {prefix}
        {formatNumber(count)}
        {suffix}
      </div>
      <p className="text-sm text-[#71717a]">{label}</p>
    </div>
  );
}

// ===== STATS ROW =====

interface StatsRowProps {
  stats: Array<{
    value: number;
    suffix?: string;
    prefix?: string;
    label: string;
  }>;
  className?: string;
}

export function StatsRow({ stats, className }: StatsRowProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 sm:grid-cols-4 gap-8 py-12 px-6",
        "rounded-2xl border border-[#2a2a2a] bg-[#111111]/50",
        className
      )}
    >
      {stats.map((stat, i) => (
        <StatCounter key={i} {...stat} />
      ))}
    </div>
  );
}
