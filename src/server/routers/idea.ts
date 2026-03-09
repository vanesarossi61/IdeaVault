import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/trpc";
import { TRPCError } from "@trpc/server";
import { slugify } from "@/lib/utils";
import type { Prisma } from "@prisma/client";

export const ideaRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(20),
        cursor: z.string().nullish(),
        status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
        complexity: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
        tag: z.string().optional(),
        search: z.string().optional(),
        sortBy: z
          .enum(["createdAt", "composite", "featuredDate"])
          .default("createdAt"),
        sortOrder: z.enum(["asc", "desc"]).default("desc"),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor, status, complexity, tag, search, sortBy, sortOrder } = input;

      const where: Prisma.IdeaWhereInput = {
        ...(status && { status }),
        ...(complexity && { complexity }),
        ...(tag && {
          tags: {
            some: {
              tag: { slug: tag },
            },
          },
        }),
        ...(search && {
          OR: [
            { title: { contains: search, mode: "insensitive" as const } },
            { problem: { contains: search, mode: "insensitive" as const } },
            { solution: { contains: search, mode: "insensitive" as const } },
          ],
        }),
      };

      const orderBy: Prisma.IdeaOrderByWithRelationInput =
        sortBy === "composite"
          ? { scores: { composite: sortOrder } }
          : { [sortBy]: sortOrder };

      const items = await ctx.prisma.idea.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        where,
        orderBy,
        include: {
          scores: true,
          tags: {
            include: { tag: true },
          },
          signals: true,
          _count: {
            select: {
              comments: true,
              upvotes: true,
              interactions: true,
            },
          },
        },
      });

      let nextCursor: typeof cursor = undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem!.id;
      }

      return {
        items,
        nextCursor,
      };
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const idea = await ctx.prisma.idea.findUnique({
        where: { slug: input.slug },
        include: {
          scores: true,
          tags: {
            include: { tag: true },
          },
          trends: {
            include: { trend: true },
          },
          signals: true,
          comments: {
            where: { parentId: null },
            include: {
              user: {
                select: { id: true, name: true, image: true },
              },
              replies: {
                include: {
                  user: {
                    select: { id: true, name: true, image: true },
                  },
                },
                orderBy: { createdAt: "asc" },
              },
            },
            orderBy: { createdAt: "desc" },
          },
          _count: {
            select: {
              comments: true,
              upvotes: true,
              interactions: true,
            },
          },
        },
      });

      if (!idea) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Idea not found",
        });
      }

      return idea;
    }),

  getFeatured: publicProcedure.query(async ({ ctx }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const featured = await ctx.prisma.idea.findFirst({
      where: {
        featuredDate: {
          gte: today,
          lt: new Date(today.getTime() + 86400000),
        },
        status: "PUBLISHED",
      },
      include: {
        scores: true,
        tags: {
          include: { tag: true },
        },
        _count: {
          select: {
            comments: true,
            upvotes: true,
          },
        },
      },
    });

    return featured;
  }),

  getRecent: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(20).default(5) }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.idea.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { createdAt: "desc" },
        take: input.limit,
        include: {
          scores: true,
          tags: { include: { tag: true } },
          _count: {
            select: { comments: true, upvotes: true },
          },
        },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(3).max(200),
        problem: z.string().min(10),
        solution: z.string().min(10),
        plan: z.array(z.string()),
        revenueModel: z.string(),
        whyNow: z.string().optional(),
        complexity: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
        tagIds: z.array(z.string()).optional(),
        scores: z
          .object({
            opportunity: z.number().min(1).max(10),
            painPoints: z.number().min(1).max(10),
            confidence: z.number().min(1).max(10),
            timing: z.number().min(1).max(10),
          })
          .optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { tagIds, scores, ...data } = input;
      const slug = slugify(data.title);

      const existingSlug = await ctx.prisma.idea.findUnique({
        where: { slug },
      });

      const finalSlug = existingSlug
        ? `${slug}-${Date.now().toString(36)}`
        : slug;

      const idea = await ctx.prisma.idea.create({
        data: {
          ...data,
          slug: finalSlug,
          plan: data.plan as Prisma.InputJsonValue,
          ...(tagIds && {
            tags: {
              create: tagIds.map((tagId) => ({ tagId })),
            },
          }),
          ...(scores && {
            scores: {
              create: {
                ...scores,
                composite:
                  (scores.opportunity * 0.3 +
                    scores.painPoints * 0.25 +
                    scores.confidence * 0.2 +
                    scores.timing * 0.25),
              },
            },
          }),
        },
        include: {
          scores: true,
          tags: { include: { tag: true } },
        },
      });

      return idea;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(3).max(200).optional(),
        problem: z.string().min(10).optional(),
        solution: z.string().min(10).optional(),
        plan: z.array(z.string()).optional(),
        revenueModel: z.string().optional(),
        whyNow: z.string().optional(),
        complexity: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
        status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, plan, ...data } = input;

      const idea = await ctx.prisma.idea.update({
        where: { id },
        data: {
          ...data,
          ...(plan && { plan: plan as Prisma.InputJsonValue }),
        },
        include: {
          scores: true,
          tags: { include: { tag: true } },
        },
      });

      return idea;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.idea.delete({
        where: { id: input.id },
      });
      return { success: true };
    }),

  upvote: protectedProcedure
    .input(z.object({ ideaId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const existing = await ctx.prisma.upvote.findUnique({
        where: {
          userId_targetType_targetId: {
            userId,
            targetType: "idea",
            targetId: input.ideaId,
          },
        },
      });

      if (existing) {
        await ctx.prisma.upvote.delete({
          where: { id: existing.id },
        });
        return { upvoted: false };
      }

      await ctx.prisma.upvote.create({
        data: {
          userId,
          targetType: "idea",
          targetId: input.ideaId,
        },
      });

      return { upvoted: true };
    }),

  comment: protectedProcedure
    .input(
      z.object({
        ideaId: z.string(),
        body: z.string().min(1).max(2000),
        parentId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const comment = await ctx.prisma.comment.create({
        data: {
          userId: ctx.session.user.id,
          ideaId: input.ideaId,
          body: input.body,
          parentId: input.parentId,
        },
        include: {
          user: {
            select: { id: true, name: true, image: true },
          },
        },
      });

      return comment;
    }),

  interact: protectedProcedure
    .input(
      z.object({
        ideaId: z.string(),
        type: z.enum(["SAVED", "INTERESTED", "BUILDING", "HIDDEN"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const existing = await ctx.prisma.userIdeaInteraction.findUnique({
        where: {
          userId_ideaId_type: {
            userId,
            ideaId: input.ideaId,
            type: input.type,
          },
        },
      });

      if (existing) {
        await ctx.prisma.userIdeaInteraction.delete({
          where: { id: existing.id },
        });
        return { active: false };
      }

      await ctx.prisma.userIdeaInteraction.create({
        data: {
          userId,
          ideaId: input.ideaId,
          type: input.type,
        },
      });

      return { active: true };
    }),

  getTags: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.tag.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { ideas: true },
        },
      },
    });
  }),
});
