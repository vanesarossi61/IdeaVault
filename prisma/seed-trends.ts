import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const TRENDS_DATA = [
  {
    name: "AI Agents",
    slug: "ai-agents",
    category: "Artificial Intelligence",
    description: "Autonomous AI systems that can plan, execute, and iterate on complex tasks. Moving beyond chatbots to agents that can browse the web, write code, and manage workflows independently.",
    volume: 145000,
    growthPct: 340,
    dataPoints: [
      { daysAgo: 90, value: 20 },
      { daysAgo: 75, value: 28 },
      { daysAgo: 60, value: 42 },
      { daysAgo: 45, value: 58 },
      { daysAgo: 30, value: 75 },
      { daysAgo: 15, value: 88 },
      { daysAgo: 0, value: 100 },
    ],
  },
  {
    name: "Vertical SaaS",
    slug: "vertical-saas",
    category: "Business Model",
    description: "Industry-specific software solutions replacing horizontal tools. From dental practice management to construction project tracking, vertical SaaS commands higher retention and willingness to pay.",
    volume: 89000,
    growthPct: 85,
    dataPoints: [
      { daysAgo: 90, value: 55 },
      { daysAgo: 75, value: 58 },
      { daysAgo: 60, value: 62 },
      { daysAgo: 45, value: 68 },
      { daysAgo: 30, value: 75 },
      { daysAgo: 15, value: 82 },
      { daysAgo: 0, value: 88 },
    ],
  },
  {
    name: "Developer Experience (DX)",
    slug: "developer-experience",
    category: "Developer Tools",
    description: "Tools and platforms focused on improving the developer workflow. From AI code completion to instant preview deployments, DX is becoming a key competitive advantage.",
    volume: 67000,
    growthPct: 120,
    dataPoints: [
      { daysAgo: 90, value: 40 },
      { daysAgo: 75, value: 48 },
      { daysAgo: 60, value: 55 },
      { daysAgo: 45, value: 62 },
      { daysAgo: 30, value: 72 },
      { daysAgo: 15, value: 80 },
      { daysAgo: 0, value: 90 },
    ],
  },
  {
    name: "Creator Monetization",
    slug: "creator-monetization",
    category: "Creator Economy",
    description: "Platforms and tools helping creators earn beyond ad revenue. Digital products, memberships, courses, consulting marketplaces, and community-powered business models.",
    volume: 112000,
    growthPct: 95,
    dataPoints: [
      { daysAgo: 90, value: 48 },
      { daysAgo: 75, value: 52 },
      { daysAgo: 60, value: 58 },
      { daysAgo: 45, value: 65 },
      { daysAgo: 30, value: 72 },
      { daysAgo: 15, value: 80 },
      { daysAgo: 0, value: 85 },
    ],
  },
  {
    name: "Edge Computing",
    slug: "edge-computing",
    category: "Infrastructure",
    description: "Moving computation closer to users with edge functions, edge databases, and CDN-native applications. Driven by Cloudflare Workers, Vercel Edge, and Deno Deploy.",
    volume: 78000,
    growthPct: 65,
    dataPoints: [
      { daysAgo: 90, value: 50 },
      { daysAgo: 75, value: 53 },
      { daysAgo: 60, value: 57 },
      { daysAgo: 45, value: 62 },
      { daysAgo: 30, value: 68 },
      { daysAgo: 15, value: 73 },
      { daysAgo: 0, value: 78 },
    ],
  },
  {
    name: "Local-First Software",
    slug: "local-first-software",
    category: "Architecture",
    description: "Apps that work offline-first with automatic sync. CRDTs and sync engines enable real-time collaboration without server dependency. Privacy-friendly by design.",
    volume: 34000,
    growthPct: 180,
    dataPoints: [
      { daysAgo: 90, value: 25 },
      { daysAgo: 75, value: 32 },
      { daysAgo: 60, value: 40 },
      { daysAgo: 45, value: 50 },
      { daysAgo: 30, value: 60 },
      { daysAgo: 15, value: 70 },
      { daysAgo: 0, value: 80 },
    ],
  },
  {
    name: "Revenue-Based Financing",
    slug: "revenue-based-financing",
    category: "FinTech",
    description: "Non-dilutive funding based on recurring revenue. Platforms like Pipe and Clearco let SaaS founders borrow against their MRR without giving up equity.",
    volume: 45000,
    growthPct: 55,
    dataPoints: [
      { daysAgo: 90, value: 55 },
      { daysAgo: 75, value: 58 },
      { daysAgo: 60, value: 60 },
      { daysAgo: 45, value: 63 },
      { daysAgo: 30, value: 66 },
      { daysAgo: 15, value: 70 },
      { daysAgo: 0, value: 74 },
    ],
  },
  {
    name: "Composable Commerce",
    slug: "composable-commerce",
    category: "E-Commerce",
    description: "Headless, API-first e-commerce stacks replacing monolithic platforms. Brands mix best-of-breed services (Shopify Hydrogen, Medusa, Saleor) for custom storefronts.",
    volume: 56000,
    growthPct: 72,
    dataPoints: [
      { daysAgo: 90, value: 42 },
      { daysAgo: 75, value: 47 },
      { daysAgo: 60, value: 52 },
      { daysAgo: 45, value: 58 },
      { daysAgo: 30, value: 64 },
      { daysAgo: 15, value: 70 },
      { daysAgo: 0, value: 76 },
    ],
  },
  {
    name: "AI Code Generation",
    slug: "ai-code-generation",
    category: "Artificial Intelligence",
    description: "AI models that generate, complete, and refactor code. Beyond Copilot -- full application generation, test writing, and documentation creation from natural language.",
    volume: 198000,
    growthPct: 250,
    dataPoints: [
      { daysAgo: 90, value: 30 },
      { daysAgo: 75, value: 40 },
      { daysAgo: 60, value: 52 },
      { daysAgo: 45, value: 65 },
      { daysAgo: 30, value: 78 },
      { daysAgo: 15, value: 88 },
      { daysAgo: 0, value: 95 },
    ],
  },
  {
    name: "Micro-SaaS",
    slug: "micro-saas",
    category: "Business Model",
    description: "Small, focused SaaS products built by solo founders or tiny teams. Low overhead, niche markets, and lifestyle-friendly businesses generating $1K-$50K MRR.",
    volume: 72000,
    growthPct: 110,
    dataPoints: [
      { daysAgo: 90, value: 38 },
      { daysAgo: 75, value: 44 },
      { daysAgo: 60, value: 50 },
      { daysAgo: 45, value: 58 },
      { daysAgo: 30, value: 66 },
      { daysAgo: 15, value: 74 },
      { daysAgo: 0, value: 82 },
    ],
  },
];

async function seedTrends() {
  console.log("Seeding trends...");

  for (const trendData of TRENDS_DATA) {
    const { dataPoints, ...trend } = trendData;

    const createdTrend = await prisma.trend.upsert({
      where: { slug: trend.slug },
      update: {
        name: trend.name,
        category: trend.category,
        description: trend.description,
        volume: trend.volume,
        growthPct: trend.growthPct,
      },
      create: trend,
    });

    // Delete existing data points and re-create
    await prisma.trendDataPoint.deleteMany({
      where: { trendId: createdTrend.id },
    });

    const now = new Date();
    await prisma.trendDataPoint.createMany({
      data: dataPoints.map((dp) => {
        const date = new Date(now);
        date.setDate(date.getDate() - dp.daysAgo);
        return {
          trendId: createdTrend.id,
          date,
          value: dp.value,
        };
      }),
    });

    console.log(`  Seeded: ${trend.name} (${dataPoints.length} data points)`);
  }

  console.log(`\nDone! Seeded ${TRENDS_DATA.length} trends with data points.`);
}

seedTrends()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
