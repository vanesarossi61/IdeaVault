import { z } from "zod";
import {
  createTRPCRouter,
  adminProcedure,
} from "@/server/trpc";
import { TRPCError } from "@trpc/server";

export const adminRouter = createTRPCRouter({
  // ── Dashboard Stats para Admin ──
  getStats: adminProcedure.query(async ({ ctx }) => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      usersThisWeek,
      usersThisMonth,
      totalIdeas,
      publishedIdeas,
      draftIdeas,
      totalComments,
      commentsThisWeek,
      totalInteractions,
      totalSubscriptions,
      activeSubscriptions,
      totalTrends,
      totalTools,
      totalGraveyard,
    ] = await Promise.all([
      ctx.prisma.user.count(),
      ctx.prisma.user.count({ where: { createdAt: { gte: oneWeekAgo } } }),
      ctx.prisma.user.count({ where: { createdAt: { gte: oneMonthAgo } } }),
      ctx.prisma.idea.count(),
      ctx.prisma.idea.count({ where: { status: "PUBLISHED" } }),
      ctx.prisma.idea.count({ where: { status: "DRAFT" } }),
      ctx.prisma.comment.count(),
      ctx.prisma.comment.count({ where: { createdAt: { gte: oneWeekAgo } } }),
      ctx.prisma.userIdeaInteraction.count(),
      ctx.prisma.subscription.count(),
      ctx.prisma.subscription.count({ where: { status: "ACTIVE" } }),
      ctx.prisma.trend.count(),
      ctx.prisma.tool.count(),
      ctx.prisma.graveyardStartup.count(),
    ]);

    return {
      users: {
        total: totalUsers,
        thisWeek: usersThisWeek,
        thisMonth: usersThisMonth,
      },
      ideas: {
        total: totalIdeas,
        published: publishedIdeas,
        drafts: draftIdeas,
      },
      engagement: {
        totalComments,
        commentsThisWeek,
        totalInteractions,
      },
      subscriptions: {
        total: totalSubscriptions,
        active: activeSubscriptions,
      },
      content: {
        trends: totalTrends,
        tools: totalTools,
        graveyardStartups: totalGraveyard,
      },
    };
  }),

  // ── Listar usuarios con paginacion ──
  getUsers: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(25),
        cursor: z.string().nullish(),
        search: z.string().optional(),
        role: z.enum(["USER", "ADMIN"]).optional(),
        sortBy: z.enum(["createdAt", "name", "email"]).default("createdAt"),
        sortOrder: z.enum(["asc", "desc"]).default("desc"),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor, search, role, sortBy, sortOrder } = input;

      const users = await ctx.prisma.user.findMany({
        where: {
          ...(role && { role }),
          ...(search && {
            OR: [
              { name: { contains: search, mode: "insensitive" as const } },
              { email: { contains: search, mode: "insensitive" as const } },
            ],
          }),
        },
        take: limit + 1,
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
        orderBy: { [sortBy]: sortOrder },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
          createdAt: true,
          _count: {
            select: {
              interactions: true,
              comments: true,
            },
          },
          subscription: {
            select: {
              plan: true,
              status: true,
            },
          },
        },
      });

      let nextCursor: string | undefined;
      if (users.length > limit) {
        const next = users.pop();
        nextCursor = next!.id;
      }

      return { items: users, nextCursor };
    }),

  // ── Cambiar rol de usuario ──
  updateUserRole: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        role: z.enum(["USER", "ADMIN"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // No permitir que un admin se quite su propio rol
      if (input.userId === ctx.session.user.id && input.role === "USER") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You cannot remove your own admin role",
        });
      }

      const user = await ctx.prisma.user.update({
        where: { id: input.userId },
        data: { role: input.role },
        select: { id: true, name: true, email: true, role: true },
      });

      return user;
    }),

  // ── Gestionar ideas (publicar, archivar, eliminar) ──
  getIdeas: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(25),
        cursor: z.string().nullish(),
        status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
        search: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor, status, search } = input;

      const ideas = await ctx.prisma.idea.findMany({
        where: {
          ...(status && { status }),
          ...(search && {
            OR: [
              { title: { contains: search, mode: "insensitive" as const } },
              { slug: { contains: search, mode: "insensitive" as const } },
            ],
          }),
        },
        take: limit + 1,
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          slug: true,
          status: true,
          complexity: true,
          createdAt: true,
          _count: {
            select: { comments: true, upvotes: true, interactions: true },
          },
        },
      });

      let nextCursor: string | undefined;
      if (ideas.length > limit) {
        const next = ideas.pop();
        nextCursor = next!.id;
      }

      return { items: ideas, nextCursor };
    }),

  updateIdeaStatus: adminProcedure
    .input(
      z.object({
        ideaId: z.string(),
        status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const idea = await ctx.prisma.idea.update({
        where: { id: input.ideaId },
        data: {
          status: input.status,
          ...(input.status === "PUBLISHED" && { featuredDate: new Date() }),
        },
        select: { id: true, title: true, status: true },
      });

      return idea;
    }),

  deleteIdea: adminProcedure
    .input(z.object({ ideaId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Eliminar relaciones primero
      await Promise.all([
        ctx.prisma.comment.deleteMany({ where: { ideaId: input.ideaId } }),
        ctx.prisma.upvote.deleteMany({ where: { ideaId: input.ideaId } }),
        ctx.prisma.userIdeaInteraction.deleteMany({
          where: { ideaId: input.ideaId },
        }),
        ctx.prisma.ideaTag.deleteMany({ where: { ideaId: input.ideaId } }),
        ctx.prisma.communitySignal.deleteMany({
          where: { ideaId: input.ideaId },
        }),
        ctx.prisma.ideaScore.deleteMany({ where: { ideaId: input.ideaId } }),
      ]);

      await ctx.prisma.idea.delete({ where: { id: input.ideaId } });

      return { success: true };
    }),

  // ── Moderar comentarios ──
  getReportedComments: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(20),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor } = input;

      // Traer comentarios recientes para moderacion
      const comments = await ctx.prisma.comment.findMany({
        take: limit + 1,
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: { id: true, name: true, email: true, image: true },
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
      if (comments.length > limit) {
        const next = comments.pop();
        nextCursor = next!.id;
      }

      return { items: comments, nextCursor };
    }),

  deleteComment: adminProcedure
    .input(z.object({ commentId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Eliminar replies primero
      await ctx.prisma.comment.deleteMany({
        where: { parentId: input.commentId },
      });

      await ctx.prisma.comment.delete({ where: { id: input.commentId } });

      return { success: true };
    }),

  // ── Actividad reciente global ──
  getRecentActivity: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(30),
      })
    )
    .query(async ({ ctx, input }) => {
      const [newUsers, newComments, newInteractions] = await Promise.all([
        ctx.prisma.user.findMany({
          orderBy: { createdAt: "desc" },
          take: input.limit,
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
          },
        }),
        ctx.prisma.comment.findMany({
          orderBy: { createdAt: "desc" },
          take: input.limit,
          include: {
            user: { select: { name: true } },
            idea: { select: { title: true, slug: true } },
          },
        }),
        ctx.prisma.userIdeaInteraction.findMany({
          orderBy: { createdAt: "desc" },
          take: input.limit,
          include: {
            user: { select: { name: true } },
            idea: { select: { title: true, slug: true } },
          },
        }),
      ]);

      type AdminActivityItem = {
        id: string;
        type: "new_user" | "comment" | "interaction";
        description: string;
        createdAt: Date;
      };

      const activity: AdminActivityItem[] = [
        ...newUsers.map((u) => ({
          id: `user-${u.id}`,
          type: "new_user" as const,
          description: `${u.name || u.email} joined IdeaVault`,
          createdAt: u.createdAt,
        })),
        ...newComments.map((c) => ({
          id: `comment-${c.id}`,
          type: "comment" as const,
          description: `${c.user.name || "User"} commented on "${c.idea.title}"`,
          createdAt: c.createdAt,
        })),
        ...newInteractions.map((i) => ({
          id: `interaction-${i.id}`,
          type: "interaction" as const,
          description: `${i.user.name || "User"} ${i.type.toLowerCase()} "${i.idea.title}"`,
          createdAt: i.createdAt,
        })),
      ];

      activity.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      return activity.slice(0, input.limit);
    }),
});
