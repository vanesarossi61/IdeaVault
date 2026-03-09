import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
} from "@/server/trpc";

export const toolRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(50),
        cursor: z.string().nullish(),
        category: z.string().optional(),
        pricing: z.enum(["FREE", "FREEMIUM", "PAID"]).optional(),
        search: z.string().optional(),
        stackId: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor, category, pricing, search, stackId } = input;

      const items = await ctx.prisma.tool.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        where: {
          ...(category && { category }),
          ...(pricing && { pricing }),
          ...(stackId && { stackId }),
          ...(search && {
            OR: [
              { name: { contains: search, mode: "insensitive" as const } },
              { description: { contains: search, mode: "insensitive" as const } },
            ],
          }),
        },
        orderBy: { name: "asc" },
        include: {
          stack: true,
        },
      });

      let nextCursor: typeof cursor = undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem!.id;
      }

      return { items, nextCursor };
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.tool.findUnique({
        where: { id: input.id },
        include: { stack: true },
      });
    }),

  getCategories: publicProcedure.query(async ({ ctx }) => {
    const categories = await ctx.prisma.tool.groupBy({
      by: ["category"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    });

    return categories.map((c) => ({
      name: c.category,
      count: c._count.id,
    }));
  }),

  getStacks: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.toolStack.findMany({
      include: {
        tools: true,
      },
      orderBy: { name: "asc" },
    });
  }),

  getByStack: publicProcedure
    .input(z.object({ stackId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.tool.findMany({
        where: { stackId: input.stackId },
        include: { stack: true },
        orderBy: { name: "asc" },
      });
    }),
});
