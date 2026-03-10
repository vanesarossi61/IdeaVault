import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/trpc";
import { TRPCError } from "@trpc/server";

// ── Types para AI responses ──
interface ValidationResult {
  overallScore: number;
  marketPotential: { score: number; reasoning: string };
  feasibility: { score: number; reasoning: string };
  competition: { score: number; reasoning: string };
  uniqueness: { score: number; reasoning: string };
  recommendations: string[];
  risks: string[];
}

interface BusinessPlan {
  executiveSummary: string;
  problemStatement: string;
  solution: string;
  targetMarket: string;
  revenueModel: string;
  goToMarket: string[];
  milestones: { phase: string; duration: string; goals: string[] }[];
  estimatedCosts: { category: string; range: string }[];
  keyMetrics: string[];
}

interface MarketAnalysis {
  marketSize: string;
  growthRate: string;
  keyTrends: string[];
  competitors: { name: string; strength: string; weakness: string }[];
  opportunities: string[];
  threats: string[];
  targetDemographic: string;
  entryBarriers: string[];
}

// ── Simulador AI (placeholder para integracion con OpenAI/Anthropic) ──
// En produccion, reemplazar con llamadas reales a LLM API
function simulateAIValidation(title: string, description: string): ValidationResult {
  const hash = (title + description).split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const base = (hash % 40) + 55; // Score entre 55-95

  return {
    overallScore: base,
    marketPotential: {
      score: Math.min(100, base + (hash % 15)),
      reasoning: `The concept of "${title}" addresses a growing market need. Initial analysis suggests moderate to strong demand based on current market trends and search volume indicators.`,
    },
    feasibility: {
      score: Math.min(100, base - 5 + (hash % 10)),
      reasoning: "Technical implementation is achievable with current technology stacks. The main challenges lie in user acquisition and achieving product-market fit within the first 6 months.",
    },
    competition: {
      score: Math.min(100, base - 10 + (hash % 20)),
      reasoning: "The competitive landscape shows several established players, but there are clear differentiation opportunities in UX, pricing, and niche market focus.",
    },
    uniqueness: {
      score: Math.min(100, base + (hash % 12)),
      reasoning: "The idea brings a fresh perspective to the space. Key differentiators include the proposed approach to solving the core problem and the target audience selection.",
    },
    recommendations: [
      "Start with a focused MVP targeting the most underserved segment",
      "Build a waitlist before development to validate demand",
      "Consider a freemium model to accelerate initial user acquisition",
      "Partner with complementary tools/platforms for distribution",
      "Establish clear metrics for go/no-go decisions at each milestone",
    ],
    risks: [
      "Market timing — ensure the target audience is ready for this solution",
      "Dependency on third-party APIs or services for core functionality",
      "Customer acquisition cost may exceed initial projections",
      "Potential regulatory considerations depending on target market",
    ],
  };
}

function simulateBusinessPlan(title: string, description: string): BusinessPlan {
  return {
    executiveSummary: `${title} is an innovative solution designed to ${description.slice(0, 100)}. This business plan outlines a phased approach to market entry, targeting early adopters and scaling through strategic partnerships.`,
    problemStatement: `Current solutions in this space are fragmented, expensive, or fail to address the core needs of the target audience. ${title} fills this gap by providing a unified, user-friendly platform.`,
    solution: `A modern, scalable platform that leverages technology to deliver ${title.toLowerCase()} capabilities. Key features include an intuitive interface, AI-powered insights, and seamless integrations.`,
    targetMarket: "Small to medium businesses and solo entrepreneurs in the tech-forward segment, primarily in North America and Europe. TAM estimated at $2-5B.",
    revenueModel: "SaaS subscription with three tiers: Free (limited), Pro ($19/mo), and Team ($49/mo per seat). Additional revenue from marketplace commissions and premium features.",
    goToMarket: [
      "Phase 1: Launch beta with 100 early adopters from waitlist",
      "Phase 2: Content marketing + SEO to drive organic growth",
      "Phase 3: Strategic partnerships with complementary tools",
      "Phase 4: Paid acquisition channels (Google Ads, social media)",
      "Phase 5: Expand to enterprise segment with custom plans",
    ],
    milestones: [
      {
        phase: "Pre-launch",
        duration: "2 months",
        goals: ["Build MVP", "Collect 500 waitlist signups", "Set up analytics"],
      },
      {
        phase: "Beta",
        duration: "3 months",
        goals: ["Onboard 100 beta users", "Achieve 40% weekly retention", "Iterate on core features"],
      },
      {
        phase: "Launch",
        duration: "2 months",
        goals: ["Public launch", "Reach 1,000 users", "First paying customers"],
      },
      {
        phase: "Growth",
        duration: "6 months",
        goals: ["10,000 users", "$10K MRR", "Hire first 2 team members"],
      },
    ],
    estimatedCosts: [
      { category: "Development (MVP)", range: "$5,000 - $15,000" },
      { category: "Infrastructure (monthly)", range: "$100 - $500" },
      { category: "Marketing (monthly)", range: "$500 - $2,000" },
      { category: "Legal & Admin", range: "$1,000 - $3,000" },
      { category: "Tools & Subscriptions", range: "$200 - $500/mo" },
    ],
    keyMetrics: [
      "Monthly Active Users (MAU)",
      "Weekly Retention Rate (>40% target)",
      "Customer Acquisition Cost (CAC < $50)",
      "Monthly Recurring Revenue (MRR)",
      "Net Promoter Score (NPS > 50)",
      "Churn Rate (<5% monthly)",
    ],
  };
}

function simulateMarketAnalysis(category: string): MarketAnalysis {
  return {
    marketSize: "The addressable market is estimated at $3.2B globally, with a serviceable market of $800M in the primary target regions.",
    growthRate: "The market is growing at approximately 15-22% CAGR, driven by digital transformation and increasing demand for specialized tools.",
    keyTrends: [
      "Shift towards AI-powered automation in " + category,
      "Growing demand for no-code/low-code solutions",
      "Increasing focus on vertical-specific tools over horizontal platforms",
      "Rise of community-driven product development",
      "Premium pricing acceptance for tools that demonstrate clear ROI",
    ],
    competitors: [
      {
        name: "Market Leader A",
        strength: "Large user base and brand recognition",
        weakness: "Slow to innovate, bloated feature set",
      },
      {
        name: "Startup B",
        strength: "Modern UX, fast iteration",
        weakness: "Limited features, small team",
      },
      {
        name: "Enterprise Solution C",
        strength: "Enterprise-grade security and compliance",
        weakness: "Expensive, complex onboarding",
      },
    ],
    opportunities: [
      "Underserved SMB segment willing to pay for specialized tools",
      "Integration marketplace creating network effects",
      "AI capabilities as key differentiator",
      "Geographic expansion into emerging markets",
    ],
    threats: [
      "Large players could add competing features",
      "Market consolidation through acquisitions",
      "Economic downturn reducing SaaS spending",
      "Open-source alternatives gaining traction",
    ],
    targetDemographic: "Tech-savvy professionals aged 25-45, primarily founders, product managers, and indie hackers with annual revenue $0-$5M.",
    entryBarriers: [
      "Building trust and credibility in a crowded market",
      "Achieving critical mass for network effects",
      "Competing with free/open-source alternatives",
    ],
  };
}

export const aiRouter = createTRPCRouter({
  // ── Validar una idea con AI ──
  validateIdea: protectedProcedure
    .input(
      z.object({
        title: z.string().min(3).max(200),
        description: z.string().min(10).max(5000),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { title, description } = input;

      // Rate limiting: max 10 validations per day per user
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayCount = await ctx.prisma.aIValidation.count({
        where: {
          userId: ctx.session.user.id,
          createdAt: { gte: today },
        },
      });

      if (todayCount >= 10) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "You have reached the daily limit of 10 AI validations. Try again tomorrow.",
        });
      }

      // Generar validacion (simulada — reemplazar con LLM real)
      const result = simulateAIValidation(title, description);

      // Guardar en DB
      const validation = await ctx.prisma.aIValidation.create({
        data: {
          userId: ctx.session.user.id,
          type: "VALIDATION",
          title,
          input: description,
          output: JSON.stringify(result),
          score: result.overallScore,
        },
      });

      return { id: validation.id, ...result };
    }),

  // ── Generar Business Plan ──
  generatePlan: protectedProcedure
    .input(
      z.object({
        title: z.string().min(3).max(200),
        description: z.string().min(10).max(5000),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { title, description } = input;

      // Rate limiting: max 5 plans per day
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayCount = await ctx.prisma.aIValidation.count({
        where: {
          userId: ctx.session.user.id,
          type: "BUSINESS_PLAN",
          createdAt: { gte: today },
        },
      });

      if (todayCount >= 5) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "You have reached the daily limit of 5 business plans. Try again tomorrow.",
        });
      }

      const plan = simulateBusinessPlan(title, description);

      const saved = await ctx.prisma.aIValidation.create({
        data: {
          userId: ctx.session.user.id,
          type: "BUSINESS_PLAN",
          title,
          input: description,
          output: JSON.stringify(plan),
        },
      });

      return { id: saved.id, ...plan };
    }),

  // ── Analisis de Mercado ──
  analyzeMarket: protectedProcedure
    .input(
      z.object({
        category: z.string().min(2).max(100),
        context: z.string().max(2000).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { category, context } = input;

      // Rate limiting: max 5 analyses per day
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayCount = await ctx.prisma.aIValidation.count({
        where: {
          userId: ctx.session.user.id,
          type: "MARKET_ANALYSIS",
          createdAt: { gte: today },
        },
      });

      if (todayCount >= 5) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "You have reached the daily limit of 5 market analyses. Try again tomorrow.",
        });
      }

      const analysis = simulateMarketAnalysis(category);

      const saved = await ctx.prisma.aIValidation.create({
        data: {
          userId: ctx.session.user.id,
          type: "MARKET_ANALYSIS",
          title: `Market Analysis: ${category}`,
          input: context ?? category,
          output: JSON.stringify(analysis),
        },
      });

      return { id: saved.id, ...analysis };
    }),

  // ── Historial de validaciones del usuario ──
  getHistory: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(20),
        cursor: z.string().nullish(),
        type: z
          .enum(["VALIDATION", "BUSINESS_PLAN", "MARKET_ANALYSIS"])
          .optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor, type } = input;

      const items = await ctx.prisma.aIValidation.findMany({
        where: {
          userId: ctx.session.user.id,
          ...(type && { type }),
        },
        take: limit + 1,
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          type: true,
          title: true,
          score: true,
          createdAt: true,
        },
      });

      let nextCursor: string | undefined;
      if (items.length > limit) {
        const next = items.pop();
        nextCursor = next!.id;
      }

      return { items, nextCursor };
    }),

  // ── Detalle de una validacion especifica ──
  getValidation: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const validation = await ctx.prisma.aIValidation.findFirst({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
      });

      if (!validation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Validation not found",
        });
      }

      return {
        ...validation,
        output: JSON.parse(validation.output as string),
      };
    }),
});
