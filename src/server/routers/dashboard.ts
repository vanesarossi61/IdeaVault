import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const dashboardRouter = createTRPCRouter({
  // ── Stats del usuario autenticado ──
  getStats: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const [saved, interested, building, comments, upvotes] = await Promise.all([
      ctx.prisma.userIdeaInteraction.count({
        where: { userId, type: "SAVED" },
      }),
      ctx.prisma.userIdeaInteraction.count({
        where: { userId, type: "INTERESTED" },
      }),
      ctx.prisma.userIdeaInteraction.count({
        where: { userId, type: "BUILDING" },
      }),
      ctx.prisma.comment.count({
        where: { userId },
      }),
      ctx.prisma.upvote.count({
        where: { userId },
      }),
    ]);

    // Stats de la semana pasada para calcular cambio %
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const [savedLastWeek, interestedLastWeek, buildingLastWeek] =
      await Promise.all([
        ctx.prisma.userIdeaInteraction.count({
          where: {
            userId,
            type: "SAVED",
            createdAt: { lt: oneWeekAgo },
          },
        }),
        ctx.prisma.userIdeaInteraction.count({
          where: {
            userId,
            type: "INTERESTED",
            createdAt: { lt: oneWeekAgo },
          },
        }),
        ctx.prisma.userIdeaInteraction.count({
          where: {
            userId,
            type: "BUILDING",
            createdAt: { lt: oneWeekAgo },
          },
        }),
      ]);

    const calcChange = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    return {
      saved: { value: saved, change: calcChange(saved, savedLastWeek) },
      interested: {
        value: interested,
        change: calcChange(interested, interestedLastWeek),
      },
      building: {
        value: building,
        change: calcChange(building, buildingLastWeek),
      },
      comments: { value: comments },
      upvotes: { value: upvotes },
    };
  }),

  // ── Actividad reciente del usuario ──
  getRecentActivity: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(15),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { limit, cursor } = input;

      // Traer interacciones, comentarios y upvotes mezclados
      const [interactions, comments, upvotes] = await Promise.all([
        ctx.prisma.userIdeaInteraction.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
          take: limit,
          include: {
            idea: {
              select: { id: true, title: true, slug: true },
            },
          },
        }),
        ctx.prisma.comment.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
          take: limit,
          include: {
            idea: {
              select: { id: true, title: true, slug: true },
            },
          },
        }),
        ctx.prisma.upvote.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
          take: limit,
        }),
      ]);

      // Unificar en un feed de actividad
      type ActivityItem = {
        id: string;
        type: "interaction" | "comment" | "upvote";
        action: string;
        ideaTitle: string | null;
        ideaSlug: string | null;
        preview: string | null;
        createdAt: Date;
      };

      const activity: ActivityItem[] = [
        ...interactions.map((i) => ({
          id: i.id,
          type: "interaction" as const,
          action: i.type.toLowerCase(),
          ideaTitle: i.idea.title,
          ideaSlug: i.idea.slug,
          preview: null,
          createdAt: i.createdAt,
        })),
        ...comments.map((c) => ({
          id: c.id,
          type: "comment" as const,
          action: "commented",
          ideaTitle: c.idea.title,
          ideaSlug: c.idea.slug,
          preview: c.body.slice(0, 120),
          createdAt: c.createdAt,
        })),
        ...upvotes.map((u) => ({
          id: u.id,
          type: "upvote" as const,
          action: "upvoted",
          ideaTitle: null,
          ideaSlug: null,
          preview: null,
          createdAt: u.createdAt,
        })),
      ];

      // Ordenar por fecha y paginar
      activity.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      let startIndex = 0;
      if (cursor) {
        const cursorIndex = activity.findIndex((a) => a.id === cursor);
        if (cursorIndex !== -1) startIndex = cursorIndex + 1;
      }

      const items = activity.slice(startIndex, startIndex + limit);
      const nextCursor = items.length === limit ? items[items.length - 1]?.id : undefined;

      return { items, nextCursor };
    }),

  // ── Ideas recomendadas basadas en interacciones previas ──
  getRecommendations: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(20).default(6),
      })
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Obtener tags de ideas con las que el usuario interactuo
      const userInteractions = await ctx.prisma.userIdeaInteraction.findMany({
        where: { userId, type: { in: ["SAVED", "INTERESTED", "BUILDING"] } },
        select: { ideaId: true },
        take: 50,
      });

      const interactedIdeaIds = userInteractions.map((i) => i.ideaId);

      if (interactedIdeaIds.length === 0) {
        // Sin interacciones -> devolver ideas con mejor score
        const topIdeas = await ctx.prisma.idea.findMany({
          where: { status: "PUBLISHED" },
          orderBy: { createdAt: "desc" },
          take: input.limit,
          include: {
            score: true,
            tags: { include: { tag: true } },
            _count: { select: { comments: true, upvotes: true } },
          },
        });
        return topIdeas;
      }

      // Obtener tags frecuentes del usuario
      const userTags = await ctx.prisma.ideaTag.findMany({
        where: { ideaId: { in: interactedIdeaIds } },
        select: { tagId: true },
      });

      const tagCounts = new Map<string, number>();
      userTags.forEach((t) => {
        tagCounts.set(t.tagId, (tagCounts.get(t.tagId) || 0) + 1);
      });

      const topTagIds = [...tagCounts.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([id]) => id);

      // Buscar ideas con tags similares que el usuario NO haya visto
      const recommended = await ctx.prisma.idea.findMany({
        where: {
          status: "PUBLISHED",
          id: { notIn: interactedIdeaIds },
          tags: {
            some: { tagId: { in: topTagIds } },
          },
        },
        orderBy: { createdAt: "desc" },
        take: input.limit,
        include: {
          score: true,
          tags: { include: { tag: true } },
          _count: { select: { comments: true, upvotes: true } },
        },
      });

      // Si no hay suficientes, completar con ideas recientes
      if (recommended.length < input.limit) {
        const filler = await ctx.prisma.idea.findMany({
          where: {
            status: "PUBLISHED",
            id: {
              notIn: [
                ...interactedIdeaIds,
                ...recommended.map((r) => r.id),
              ],
            },
          },
          orderBy: { createdAt: "desc" },
          take: input.limit - recommended.length,
          include: {
            score: true,
            tags: { include: { tag: true } },
            _count: { select: { comments: true, upvotes: true } },
          },
        });
        recommended.push(...filler);
      }

      return recommended;
    }),

  // ── Stats globales (publicas, para landing page) ──
  getGlobalStats: publicProcedure.query(async ({ ctx }) => {
    const [totalIdeas, totalUsers, totalComments, totalBuilding] =
      await Promise.all([
        ctx.prisma.idea.count({ where: { status: "PUBLISHED" } }),
        ctx.prisma.user.count(),
        ctx.prisma.comment.count(),
        ctx.prisma.userIdeaInteraction.count({
          where: { type: "BUILDING" },
        }),
      ]);

    return { totalIdeas, totalUsers, totalComments, totalBuilding };
  }),
});
