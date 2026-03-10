import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/trpc";

export const hubRouter = createTRPCRouter({
  // ── Community Feed: actividad reciente de toda la plataforma ──
  getCommunityFeed: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(20),
        cursor: z.string().nullish(),
        type: z
          .enum(["all", "comments", "interactions", "ideas"])
          .default("all"),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor, type } = input;

      // Traer comentarios recientes
      const comments =
        type === "all" || type === "comments"
          ? await ctx.prisma.comment.findMany({
              take: limit,
              orderBy: { createdAt: "desc" },
              ...(cursor && type === "comments"
                ? { cursor: { id: cursor }, skip: 1 }
                : {}),
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    image: true,
                  },
                },
                idea: {
                  select: { id: true, title: true, slug: true },
                },
              },
            })
          : [];

      // Traer interacciones recientes (BUILDING + INTERESTED)
      const interactions =
        type === "all" || type === "interactions"
          ? await ctx.prisma.userIdeaInteraction.findMany({
              where: { type: { in: ["BUILDING", "INTERESTED"] } },
              take: limit,
              orderBy: { createdAt: "desc" },
              ...(cursor && type === "interactions"
                ? { cursor: { id: cursor }, skip: 1 }
                : {}),
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    image: true,
                  },
                },
                idea: {
                  select: { id: true, title: true, slug: true },
                },
              },
            })
          : [];

      // Traer ideas publicadas recientemente
      const ideas =
        type === "all" || type === "ideas"
          ? await ctx.prisma.idea.findMany({
              where: { status: "PUBLISHED" },
              take: limit,
              orderBy: { createdAt: "desc" },
              ...(cursor && type === "ideas"
                ? { cursor: { id: cursor }, skip: 1 }
                : {}),
              select: {
                id: true,
                title: true,
                slug: true,
                problem: true,
                createdAt: true,
                _count: {
                  select: { comments: true, upvotes: true },
                },
              },
            })
          : [];

      // Unificar en feed
      type FeedItem = {
        id: string;
        type: "comment" | "interaction" | "idea";
        action: string;
        userName: string | null;
        userImage: string | null;
        userId: string;
        ideaTitle: string;
        ideaSlug: string;
        preview: string | null;
        createdAt: Date;
      };

      const feed: FeedItem[] = [
        ...comments.map((c) => ({
          id: `comment-${c.id}`,
          type: "comment" as const,
          action: "commented on",
          userName: c.user.name,
          userImage: c.user.image,
          userId: c.user.id,
          ideaTitle: c.idea.title,
          ideaSlug: c.idea.slug,
          preview: c.body.slice(0, 150),
          createdAt: c.createdAt,
        })),
        ...interactions.map((i) => ({
          id: `interaction-${i.id}`,
          type: "interaction" as const,
          action:
            i.type === "BUILDING" ? "started building" : "is interested in",
          userName: i.user.name,
          userImage: i.user.image,
          userId: i.user.id,
          ideaTitle: i.idea.title,
          ideaSlug: i.idea.slug,
          preview: null,
          createdAt: i.createdAt,
        })),
        ...ideas.map((idea) => ({
          id: `idea-${idea.id}`,
          type: "idea" as const,
          action: "New idea published",
          userName: null,
          userImage: null,
          userId: "",
          ideaTitle: idea.title,
          ideaSlug: idea.slug,
          preview: idea.problem?.slice(0, 150) ?? null,
          createdAt: idea.createdAt,
        })),
      ];

      feed.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      const items = feed.slice(0, limit);
      const nextCursor =
        items.length === limit ? items[items.length - 1]?.id : undefined;

      return { items, nextCursor };
    }),

  // ── Builders: usuarios que estan construyendo ideas ──
  getBuilders: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(20),
        cursor: z.string().nullish(),
        search: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor, search } = input;

      // Usuarios con al menos una interaccion BUILDING
      const builders = await ctx.prisma.user.findMany({
        where: {
          interactions: {
            some: { type: "BUILDING" },
          },
          ...(search && {
            OR: [
              { name: { contains: search, mode: "insensitive" as const } },
              { bio: { contains: search, mode: "insensitive" as const } },
            ],
          }),
        },
        take: limit + 1,
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          image: true,
          bio: true,
          createdAt: true,
          _count: {
            select: {
              interactions: true,
              comments: true,
            },
          },
          interactions: {
            where: { type: "BUILDING" },
            take: 3,
            orderBy: { createdAt: "desc" },
            include: {
              idea: {
                select: { id: true, title: true, slug: true },
              },
            },
          },
        },
      });

      let nextCursor: string | undefined;
      if (builders.length > limit) {
        const next = builders.pop();
        nextCursor = next!.id;
      }

      return { items: builders, nextCursor };
    }),

  // ── Leaderboard: top builders por actividad ──
  getLeaderboard: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(10),
        period: z.enum(["week", "month", "all"]).default("month"),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, period } = input;

      let since: Date | undefined;
      if (period !== "all") {
        since = new Date();
        if (period === "week") since.setDate(since.getDate() - 7);
        if (period === "month") since.setMonth(since.getMonth() - 1);
      }

      const dateFilter = since ? { createdAt: { gte: since } } : {};

      // Contar actividad por usuario
      const users = await ctx.prisma.user.findMany({
        select: {
          id: true,
          name: true,
          image: true,
          bio: true,
          _count: {
            select: {
              interactions: { where: dateFilter },
              comments: { where: dateFilter },
              upvotes: { where: dateFilter },
            },
          },
        },
      });

      // Calcular score: building*5 + comments*3 + upvotes*1
      const ranked = users
        .map((u) => ({
          ...u,
          score:
            u._count.interactions * 5 +
            u._count.comments * 3 +
            u._count.upvotes * 1,
          totalActions:
            u._count.interactions + u._count.comments + u._count.upvotes,
        }))
        .filter((u) => u.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);

      return ranked;
    }),

  // ── Discussions: comentarios como threads de discusion ──
  getDiscussions: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(20),
        cursor: z.string().nullish(),
        search: z.string().optional(),
        sortBy: z
          .enum(["recent", "popular", "mostReplies"])
          .default("recent"),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor, search, sortBy } = input;

      // Obtener comentarios raiz (sin parentId) como "discussions"
      const orderBy =
        sortBy === "recent"
          ? { createdAt: "desc" as const }
          : sortBy === "mostReplies"
            ? { createdAt: "desc" as const } // sorted post-query by reply count
            : { createdAt: "desc" as const };

      const discussions = await ctx.prisma.comment.findMany({
        where: {
          parentId: null,
          ...(search && {
            body: { contains: search, mode: "insensitive" as const },
          }),
        },
        take: limit + 1,
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
        orderBy,
        include: {
          user: {
            select: { id: true, name: true, image: true },
          },
          idea: {
            select: { id: true, title: true, slug: true },
          },
          _count: {
            select: { replies: true },
          },
        },
      });

      let nextCursor: string | undefined;
      if (discussions.length > limit) {
        const next = discussions.pop();
        nextCursor = next!.id;
      }

      return { items: discussions, nextCursor };
    }),

  // ── Community Stats globales para el Hub ──
  getCommunityStats: publicProcedure.query(async ({ ctx }) => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const [
      totalBuilders,
      totalDiscussions,
      activeThisWeek,
      totalInteractions,
    ] = await Promise.all([
      ctx.prisma.user.count({
        where: { interactions: { some: { type: "BUILDING" } } },
      }),
      ctx.prisma.comment.count({ where: { parentId: null } }),
      ctx.prisma.user.count({
        where: {
          OR: [
            { comments: { some: { createdAt: { gte: oneWeekAgo } } } },
            { interactions: { some: { createdAt: { gte: oneWeekAgo } } } },
          ],
        },
      }),
      ctx.prisma.userIdeaInteraction.count(),
    ]);

    return {
      totalBuilders,
      totalDiscussions,
      activeThisWeek,
      totalInteractions,
    };
  }),
});
