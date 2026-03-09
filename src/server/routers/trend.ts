import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/trpc";

export const trendRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(20),
        cursor: z.string().nullish(),
        category: z.string().optional(),
        search: z.string().optional(),
        sortBy: z.enum(["growthPct", "volume", "createdAt"]).default("growthPct"),
        sortOrder: z.enum(["asc", "desc"]).default("desc"),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor, category, search, sortBy, sortOrder } = input;

      const items = await ctx.prisma.trend.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        where: {
          ...(category && { category }),
          ...(search && {
            OR: [
              { name: { contains: search, mode: "insensitive" as const } },
              { description: { contains: search, mode: "insensitive" as const } },
            ],
          }),
        },
        orderBy: { [sortBy]: sortOrder },
        include: {
          _count: {
            select: { ideas: true, dataPoints: true },
          },
        },
      });

      let nextCursor: typeof cursor = undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem!.id;
      }

      return { items, nextCursor };
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const trend = await ctx.prisma.trend.findUnique({
        where: { slug: input.slug },
        include: {
          dataPoints: {
            orderBy: { date: "asc" },
          },
          ideas: {
            include: {
              idea: {
                include: {
                  scores: true,
                  tags: { include: { tag: true } },
                },
              },
            },
          },
        },
      });

      return trend;
    }),

  getDataPoints: publicProcedure
    .input(
      z.object({
        trendId: z.string(),
        days: z.number().min(7).max(365).default(90),
      })
    )
    .query(async ({ ctx, input }) => {
      const since = new Date();
      since.setDate(since.getDate() - input.days);

      return ctx.prisma.trendDataPoint.findMany({
        where: {
          trendId: input.trendId,
          date: { gte: since },
        },
        orderBy: { date: "asc" },
      });
    }),

  getCategories: publicProcedure.query(async ({ ctx }) => {
    const categories = await ctx.prisma.trend.groupBy({
      by: ["category"],
      _count: { id: true },
      where: { category: { not: null } },
      orderBy: { _count: { id: "desc" } },
    });

    return categories.map((c) => ({
      name: c.category!,
      count: c._count.id,
    }));
  }),

  getTopGrowing: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(20).default(10) }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.trend.findMany({
        where: {
          growthPct: { not: null },
        },
        orderBy: { growthPct: "desc" },
        take: input.limit,
        include: {
          _count: {
            select: { ideas: true },
          },
        },
      });
    }),
});
