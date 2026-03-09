"use client";

import { useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface DataPoint {
  id: string;
  date: Date | string;
  value: number;
}

interface TrendChartProps {
  dataPoints: DataPoint[];
  height?: number;
  color?: string;
  showGrid?: boolean;
}

function formatDate(dateStr: string | Date): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function formatFullDate(dateStr: string | Date): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 shadow-xl">
      <p className="text-xs text-zinc-400">{label ? formatFullDate(label) : ""}</p>
      <p className="text-sm font-semibold text-emerald-400">
        {payload[0].value.toLocaleString()}
      </p>
    </div>
  );
}

export function TrendChart({
  dataPoints,
  height = 300,
  color = "#22c55e",
  showGrid = true,
}: TrendChartProps) {
  const chartData = useMemo(() => {
    return dataPoints.map((dp) => ({
      date: typeof dp.date === "string" ? dp.date : dp.date.toISOString(),
      value: dp.value,
      formattedDate: formatDate(dp.date),
    }));
  }, [dataPoints]);

  if (chartData.length === 0) {
    return (
      <div
        className="flex items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/30"
        style={{ height }}
      >
        <p className="text-sm text-zinc-500">No data points available</p>
      </div>
    );
  }

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.2} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#27272a"
              vertical={false}
            />
          )}
          <XAxis
            dataKey="formattedDate"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#71717a", fontSize: 11 }}
            interval={"preserveStartEnd"}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#71717a", fontSize: 11 }}
            width={45}
            tickFormatter={(v: number) =>
              v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v.toString()
            }
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            fill="url(#trendGradient)"
            dot={false}
            activeDot={{
              r: 5,
              fill: color,
              stroke: "#18181b",
              strokeWidth: 2,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TrendChartSkeleton({ height = 300 }: { height?: number }) {
  return (
    <div
      className="animate-pulse rounded-xl border border-zinc-800 bg-zinc-900/30"
      style={{ height }}
    >
      <div className="flex h-full items-end justify-around gap-1 p-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="w-full rounded-t bg-zinc-800"
            style={{ height: `${20 + Math.random() * 60}%` }}
          />
        ))}
      </div>
    </div>
  );
}
