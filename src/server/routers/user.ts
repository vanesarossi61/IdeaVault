import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const userRouter = createTRPCRouter({
  // ── Perfil propio ──
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const user = await ctx.prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscription: true,
        interactions: {
          take: 20,
          orderBy: { createdAt: "desc" },
          include: {
            idea: {
              select: {
                id: true,
                title: true,
                slug: true,
                complexity: true,
                revenueModel: true,
              },
            },
          },
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

    if (!user) {
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
    }

    // Contar por tipo de interaccion
    const [savedCount, interestedCount, buildingCount] = await Promise.all([
      ctx.prisma.userIdeaInteraction.count({
        where: { userId, type: "SAVED" },
      }),
      ctx.prisma.userIdeaInteraction.count({
        where: { userId, type: "INTERESTED" },
      }),
      ctx.prisma.userIdeaInteraction.count({
        where: { userId, type: "BUILDING" },
      }),
    ]);

    return {
      ...user,
      stats: {
        saved: savedCount,
        interested: interestedCount,
        building: buildingCount,
        comments: user._count.comments,
        upvotes: user._count.upvotes,
        totalInteractions: user._count.interactions,
      },
    };
  }),

  // ── Perfil publico de otro usuario ──
  getPublicProfile: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: input.userId },
        select: {
          id: true,
          name: true,
          image: true,
          bio: true,
          createdAt: true,
          _count: {
            select: {
              comments: true,
              upvotes: true,
            },
          },
        },
      });

      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
      }

      const buildingCount = await ctx.prisma.userIdeaInteraction.count({
        where: { userId: input.userId, type: "BUILDING" },
      });

      return { ...user, buildingCount };
    }),

  // ── Actualizar perfil ──
  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().min(2).max(50).optional(),
        bio: z.string().max(300).optional(),
        image: z.string().url().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const updated = await ctx.prisma.user.update({
        where: { id: userId },
        data: {
          ...(input.name !== undefined && { name: input.name }),
          ...(input.bio !== undefined && { bio: input.bio }),
          ...(input.image !== undefined && { image: input.image }),
        },
      });

      return updated;
    }),

  // ── Actividad paginada del usuario ──
  getActivity: protectedProcedure
    .input(
      z.object({
        type: z
          .enum(["all", "interactions", "comments", "upvotes"])
          .default("all"),
        limit: z.number().min(1).max(50).default(20),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { type, limit, cursor } = input;

      if (type === "interactions" || type === "all") {
        const interactions = await ctx.prisma.userIdeaInteraction.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
          take: limit + 1,
          ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
          include: {
            idea: {
              select: {
                id: true,
                title: true,
                slug: true,
                complexity: true,
              },
            },
          },
        });

        const hasMore = interactions.length > limit;
        const items = hasMore ? interactions.slice(0, -1) : interactions;

        return {
          items: items.map((i) => ({
            id: i.id,
            type: "interaction" as const,
            action: i.type,
            idea: i.idea,
            createdAt: i.createdAt,
          })),
          nextCursor: hasMore ? items[items.length - 1]?.id : undefined,
        };
      }

      if (type === "comments") {
        const comments = await ctx.prisma.comment.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
          take: limit + 1,
          ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
          include: {
            idea: {
              select: {
                id: true,
                title: true,
                slug: true,
              },
            },
          },
        });

        const hasMore = comments.length > limit;
        const items = hasMore ? comments.slice(0, -1) : comments;

        return {
          items: items.map((c) => ({
            id: c.id,
            type: "comment" as const,
            action: "commented",
            idea: c.idea,
            preview: c.body.slice(0, 120),
            createdAt: c.createdAt,
          })),
          nextCursor: hasMore ? items[items.length - 1]?.id : undefined,
        };
      }

      // upvotes
      const upvotes = await ctx.prisma.upvote.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: limit + 1,
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      });

      const hasMore = upvotes.length > limit;
      const items = hasMore ? upvotes.slice(0, -1) : upvotes;

      return {
        items: items.map((u) => ({
          id: u.id,
          type: "upvote" as const,
          action: "upvoted",
          targetType: u.targetType,
          createdAt: u.createdAt,
        })),
        nextCursor: hasMore ? items[items.length - 1]?.id : undefined,
      };
    }),

  // ── Preferencias de notificacion ──
  updateNotificationPrefs: protectedProcedure
    .input(
      z.object({
        emailNewIdeas: z.boolean().optional(),
        emailWeeklyDigest: z.boolean().optional(),
        emailCommentReplies: z.boolean().optional(),
        emailProductUpdates: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Guardar en metadata JSON del usuario
      const userId = ctx.session.user.id;
      const user = await ctx.prisma.user.findUnique({
        where: { id: userId },
        select: { metadata: true },
      });

      const currentMeta =
        (user?.metadata as Record<string, unknown>) || {};
      const notifications = {
        ...((currentMeta.notifications as Record<string, unknown>) || {}),
        ...input,
      };

      await ctx.prisma.user.update({
        where: { id: userId },
        data: { metadata: { ...currentMeta, notifications } },
      });

      return { success: true };
    }),

  // ── Eliminar cuenta ──
  deleteAccount: protectedProcedure
    .input(
      z.object({
        confirmation: z.literal("DELETE MY ACCOUNT"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Eliminar en orden para respetar foreign keys
      await ctx.prisma.$transaction([
        ctx.prisma.upvote.deleteMany({ where: { userId } }),
        ctx.prisma.comment.deleteMany({ where: { userId } }),
        ctx.prisma.userIdeaInteraction.deleteMany({ where: { userId } }),
        ctx.prisma.subscription.deleteMany({ where: { userId } }),
        ctx.prisma.session.deleteMany({ where: { userId } }),
        ctx.prisma.account.deleteMany({ where: { userId } }),
        ctx.prisma.user.delete({ where: { id: userId } }),
      ]);

      return { success: true };
    }),
});
