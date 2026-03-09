import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const graveyardRouter = router({
  // List dead startups with filters, search, and pagination
  list: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(24),
        cursor: z.string().nullish(),
        batch: z.string().optional(),
        status: z.enum(["INACTIVE", "ACQUIRED", "PIVOTED", "UNKNOWN"]).optional(),
        category: z.string().optional(),
        search: z.string().optional(),
        sortBy: z
          .enum(["name", "batch", "shutdownYear", "createdAt"])
          .default("batch"),
        sortOrder: z.enum(["asc", "desc"]).default("desc"),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor, batch, status, category, search, sortBy, sortOrder } = input;

      const where: any = {};
      if (batch) where.batch = batch;
      if (status) where.status = status;
      if (category) where.category = { contains: category, mode: "insensitive" };
      if (search) {
        where.OR = [
          { name: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
          { category: { contains: search, mode: "insensitive" } },
          { founders: { contains: search, mode: "insensitive" } },
        ];
      }

      const items = await ctx.prisma.deadStartup.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        where,
        orderBy: { [sortBy]: sortOrder },
        include: {
          idea: { select: { id: true, slug: true, title: true } },
        },
      });

      let nextCursor: typeof cursor = undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem!.id;
      }

      return { items, nextCursor };
    }),

  // Get single dead startup by slug
  bySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const startup = await ctx.prisma.deadStartup.findUnique({
        where: { slug: input.slug },
        include: {
          idea: { select: { id: true, slug: true, title: true } },
        },
      });
      if (!startup) throw new Error("Startup not found");
      return startup;
    }),

  // Get all unique batches for filter dropdown
  batches: publicProcedure.query(async ({ ctx }) => {
    const batches = await ctx.prisma.deadStartup.findMany({
      select: { batch: true, batchLabel: true },
      distinct: ["batch"],
      orderBy: { batch: "desc" },
    });
    return batches;
  }),

  // Get all unique categories for filter dropdown
  categories: publicProcedure.query(async ({ ctx }) => {
    const categories = await ctx.prisma.deadStartup.findMany({
      select: { category: true },
      distinct: ["category"],
      where: { category: { not: null } },
      orderBy: { category: "asc" },
    });
    return categories.map((c) => c.category).filter(Boolean) as string[];
  }),

  // Stats for the graveyard dashboard
  stats: publicProcedure.query(async ({ ctx }) => {
    const [total, inactive, acquired, byCategory, byBatch] = await Promise.all([
      ctx.prisma.deadStartup.count(),
      ctx.prisma.deadStartup.count({ where: { status: "INACTIVE" } }),
      ctx.prisma.deadStartup.count({ where: { status: "ACQUIRED" } }),
      ctx.prisma.deadStartup.groupBy({
        by: ["category"],
        _count: { id: true },
        where: { category: { not: null } },
        orderBy: { _count: { id: "desc" } },
        take: 10,
      }),
      ctx.prisma.deadStartup.groupBy({
        by: ["batch"],
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
        take: 10,
      }),
    ]);

    return {
      total,
      inactive,
      acquired,
      pivoted: total - inactive - acquired,
      topCategories: byCategory.map((c) => ({
        category: c.category ?? "Unknown",
        count: c._count.id,
      })),
      topBatches: byBatch.map((b) => ({
        batch: b.batch,
        count: b._count.id,
      })),
    };
  }),

  // Link a dead startup to an IdeaVault idea (admin)
  linkToIdea: protectedProcedure
    .input(
      z.object({
        startupId: z.string(),
        ideaId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.deadStartup.update({
        where: { id: input.startupId },
        data: { ideaId: input.ideaId },
      });
    }),
});
