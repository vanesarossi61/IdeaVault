import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
} from "@/server/trpc";

type UpdateItem = {
  id: string;
  type: "new_idea" | "trending" | "new_tool" | "milestone";
  title: string;
  description: string;
  slug?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
};

export const updateRouter = createTRPCRouter({
  /**
   * getFeed - Unified updates feed combining recent ideas, growing trends,
   * and newly added tools into a single chronological timeline.
   */
  getFeed: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(20),
        offset: z.number().min(0).default(0),
        type: z
          .enum(["all", "new_idea", "trending", "new_tool", "milestone"])
          .default("all"),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, offset, type } = input;

      const updates: UpdateItem[] = [];

      // --- Recent Ideas ---
      if (type === "all" || type === "new_idea") {
        const recentIdeas = await ctx.prisma.idea.findMany({
          take: limit,
          skip: type !== "all" ? offset : 0,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            title: true,
            slug: true,
            status: true,
            createdAt: true,
            scores: { select: { composite: true } },
            tags: {
              take: 3,
              include: { tag: { select: { name: true } } },
            },
          },
        });

        for (const idea of recentIdeas) {
          const score = idea.scores?.[0]?.composite ?? 0;
          const tagNames = idea.tags.map((t) => t.tag.name);
          updates.push({
            id: `idea-${idea.id}`,
            type: "new_idea",
            title: idea.title,
            description: `New ${idea.status.toLowerCase()} idea with score ${score.toFixed(0)}${tagNames.length > 0 ? ` in ${tagNames.join(", ")}` : ""}`,
            slug: `/idea/${idea.slug}`,
            metadata: { score, status: idea.status, tags: tagNames },
            createdAt: idea.createdAt,
          });
        }
      }

      // --- Growing Trends ---
      if (type === "all" || type === "trending") {
        const growingTrends = await ctx.prisma.trend.findMany({
          take: Math.min(limit, 10),
          where: { growthPct: { gt: 0 } },
          orderBy: { updatedAt: "desc" },
          select: {
            id: true,
            name: true,
            slug: true,
            growthPct: true,
            category: true,
            updatedAt: true,
            _count: { select: { ideas: true } },
          },
        });

        for (const trend of growingTrends) {
          updates.push({
            id: `trend-${trend.id}`,
            type: "trending",
            title: trend.name,
            description: `Growing ${trend.growthPct ? `+${trend.growthPct.toFixed(1)}%` : ""} with ${trend._count.ideas} related idea${trend._count.ideas !== 1 ? "s" : ""}`,
            slug: `/trends/${trend.slug}`,
            metadata: {
              growthPct: trend.growthPct,
              category: trend.category,
              ideaCount: trend._count.ideas,
            },
            createdAt: trend.updatedAt,
          });
        }
      }

      // --- New Tools ---
      if (type === "all" || type === "new_tool") {
        const tools = await ctx.prisma.tool.findMany({
          take: Math.min(limit, 10),
          orderBy: { name: "asc" },
          select: {
            id: true,
            name: true,
            description: true,
            pricing: true,
            category: true,
            url: true,
            stack: { select: { name: true } },
          },
        });

        // Tools don't have createdAt, use a recent pseudo-date
        const now = new Date();
        for (let i = 0; i < tools.length; i++) {
          const tool = tools[i];
          updates.push({
            id: `tool-${tool.id}`,
            type: "new_tool",
            title: tool.name,
            description: `${tool.pricing} ${tool.category.toLowerCase()} tool${tool.stack ? ` in ${tool.stack.name} stack` : ""}`,
            slug: `/tools/${tool.id}`,
            metadata: {
              pricing: tool.pricing,
              category: tool.category,
              stack: tool.stack?.name,
              url: tool.url,
            },
            createdAt: new Date(now.getTime() - i * 3600000), // stagger by 1h
          });
        }
      }

      // Sort all by date descending
      updates.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      // Apply offset + limit for "all" type
      const paged = type === "all" ? updates.slice(offset, offset + limit) : updates.slice(0, limit);

      return {
        items: paged,
        total: updates.length,
        hasMore: offset + limit < updates.length,
      };
    }),

  /**
   * getStats - Quick summary counts for the updates header.
   */
  getStats: publicProcedure.query(async ({ ctx }) => {
    const [ideaCount, trendCount, toolCount] = await Promise.all([
      ctx.prisma.idea.count(),
      ctx.prisma.trend.count(),
      ctx.prisma.tool.count(),
    ]);

    // Ideas added in the last 7 days
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const newIdeasThisWeek = await ctx.prisma.idea.count({
      where: { createdAt: { gte: weekAgo } },
    });

    return {
      totalIdeas: ideaCount,
      totalTrends: trendCount,
      totalTools: toolCount,
      newIdeasThisWeek,
    };
  }),
});
