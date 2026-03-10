import { PrismaClient, Pricing } from "@prisma/client";

const prisma = new PrismaClient();

const STACKS = [
  { name: "Frontend" },
  { name: "Backend" },
  { name: "Database" },
  { name: "Deployment" },
  { name: "Analytics" },
  { name: "Marketing" },
  { name: "Design" },
  { name: "AI & ML" },
  { name: "Payments" },
  { name: "Communication" },
];

const TOOLS_DATA = [
  // Frontend
  { name: "Next.js", description: "The React framework for production. Full-stack web applications with server-side rendering, static generation, and API routes. Used by Netflix, TikTok, and Notion.", url: "https://nextjs.org", pricing: "FREE" as Pricing, category: "Framework", stack: "Frontend" },
  { name: "Tailwind CSS", description: "Utility-first CSS framework for rapidly building custom designs. No more writing custom CSS -- compose styles directly in your HTML with responsive, hover, and dark mode variants.", url: "https://tailwindcss.com", pricing: "FREE" as Pricing, category: "Styling", stack: "Frontend" },
  { name: "shadcn/ui", description: "Beautifully designed, accessible components built with Radix UI and Tailwind CSS. Copy-paste into your project and customize -- not a component library, but a collection of reusable components.", url: "https://ui.shadcn.com", pricing: "FREE" as Pricing, category: "UI Components", stack: "Frontend" },
  { name: "Framer Motion", description: "Production-ready animation library for React. Declarative animations, layout transitions, gestures, and scroll-triggered effects with a simple API.", url: "https://www.framer.com/motion", pricing: "FREE" as Pricing, category: "Animation", stack: "Frontend" },

  // Backend
  { name: "tRPC", description: "End-to-end typesafe APIs made easy. Build type-safe APIs without schemas or code generation. Full TypeScript autocompletion from backend to frontend.", url: "https://trpc.io", pricing: "FREE" as Pricing, category: "API", stack: "Backend" },
  { name: "Prisma", description: "Next-generation Node.js and TypeScript ORM. Intuitive data model, automated migrations, type-safety, and auto-completion. Supports PostgreSQL, MySQL, SQLite, and more.", url: "https://www.prisma.io", pricing: "FREE" as Pricing, category: "ORM", stack: "Backend" },
  { name: "NextAuth.js", description: "Authentication for Next.js applications. Supports OAuth, email/password, and magic links. Built-in providers for Google, GitHub, Twitter, and 50+ more.", url: "https://next-auth.js.org", pricing: "FREE" as Pricing, category: "Authentication", stack: "Backend" },
  { name: "Inngest", description: "Durable functions for TypeScript. Build reliable background jobs, scheduled tasks, and event-driven workflows with automatic retries and observability.", url: "https://www.inngest.com", pricing: "FREEMIUM" as Pricing, category: "Background Jobs", stack: "Backend" },

  // Database
  { name: "Supabase", description: "Open source Firebase alternative. PostgreSQL database, authentication, instant APIs, edge functions, realtime subscriptions, and storage. Start free, scale to millions.", url: "https://supabase.com", pricing: "FREEMIUM" as Pricing, category: "BaaS", stack: "Database" },
  { name: "PlanetScale", description: "MySQL-compatible serverless database platform. Branching workflows for schema changes, unlimited connections, and zero-downtime deploys.", url: "https://planetscale.com", pricing: "FREEMIUM" as Pricing, category: "Database", stack: "Database" },
  { name: "Upstash", description: "Serverless Redis and Kafka. Per-request pricing with no idle costs. Perfect for rate limiting, caching, session storage, and real-time features.", url: "https://upstash.com", pricing: "FREEMIUM" as Pricing, category: "Cache", stack: "Database" },

  // Deployment
  { name: "Vercel", description: "Platform for frontend frameworks and static sites. Instant deployments, preview URLs, edge functions, and analytics. The home of Next.js.", url: "https://vercel.com", pricing: "FREEMIUM" as Pricing, category: "Hosting", stack: "Deployment" },
  { name: "Railway", description: "Infrastructure platform for deploying full-stack applications. From databases to services, deploy with a single click or a simple CLI command.", url: "https://railway.app", pricing: "FREEMIUM" as Pricing, category: "PaaS", stack: "Deployment" },
  { name: "Coolify", description: "Self-hostable alternative to Heroku, Netlify, and Vercel. Deploy your apps, databases, and services on your own hardware with a beautiful dashboard.", url: "https://coolify.io", pricing: "FREE" as Pricing, category: "Self-Hosting", stack: "Deployment" },

  // Analytics
  { name: "PostHog", description: "Open-source product analytics, session recording, feature flags, and A/B testing. All-in-one platform that replaces 5+ tools. Self-host or use cloud.", url: "https://posthog.com", pricing: "FREEMIUM" as Pricing, category: "Product Analytics", stack: "Analytics" },
  { name: "Plausible", description: "Simple, privacy-friendly Google Analytics alternative. Lightweight script (<1KB), no cookies, GDPR compliant. Open source and self-hostable.", url: "https://plausible.io", pricing: "PAID" as Pricing, category: "Web Analytics", stack: "Analytics" },

  // Marketing
  { name: "Resend", description: "Email API for developers. Beautiful emails with React components. Deliverability focused with detailed analytics and webhooks.", url: "https://resend.com", pricing: "FREEMIUM" as Pricing, category: "Email", stack: "Marketing" },
  { name: "Dub.co", description: "Open-source link management platform for modern marketing teams. Short links, QR codes, analytics, and API. Built for developers.", url: "https://dub.co", pricing: "FREEMIUM" as Pricing, category: "Link Management", stack: "Marketing" },

  // Design
  { name: "Figma", description: "Collaborative interface design tool. Design, prototype, and gather feedback in one place. The industry standard for product design teams.", url: "https://www.figma.com", pricing: "FREEMIUM" as Pricing, category: "Design Tool", stack: "Design" },
  { name: "Excalidraw", description: "Open-source virtual whiteboard for sketching hand-drawn diagrams. Perfect for wireframes, system architecture, and brainstorming sessions.", url: "https://excalidraw.com", pricing: "FREE" as Pricing, category: "Whiteboard", stack: "Design" },

  // AI & ML
  { name: "OpenAI API", description: "GPT-4, DALL-E, Whisper, and more. Build AI-powered features with the most capable language and vision models. Pay-per-token pricing.", url: "https://platform.openai.com", pricing: "PAID" as Pricing, category: "LLM", stack: "AI & ML" },
  { name: "Replicate", description: "Run and fine-tune open-source AI models in the cloud. Thousands of models available via API -- image generation, speech, video, and more.", url: "https://replicate.com", pricing: "PAID" as Pricing, category: "Model Hosting", stack: "AI & ML" },
  { name: "LangChain", description: "Framework for building applications powered by language models. Chains, agents, retrieval, and memory components for complex AI workflows.", url: "https://www.langchain.com", pricing: "FREE" as Pricing, category: "AI Framework", stack: "AI & ML" },

  // Payments
  { name: "Stripe", description: "Payment infrastructure for the internet. Accept payments, manage subscriptions, send payouts, and build a marketplace. Used by millions of businesses.", url: "https://stripe.com", pricing: "PAID" as Pricing, category: "Payments", stack: "Payments" },
  { name: "Lemon Squeezy", description: "All-in-one platform for selling digital products. Payments, subscriptions, tax compliance, and more. Merchant of record handles all the complexity.", url: "https://www.lemonsqueezy.com", pricing: "PAID" as Pricing, category: "MoR", stack: "Payments" },

  // Communication
  { name: "Novu", description: "Open-source notification infrastructure for developers. Manage all communication channels (email, SMS, push, in-app) from a single API.", url: "https://novu.co", pricing: "FREEMIUM" as Pricing, category: "Notifications", stack: "Communication" },
  { name: "Stream", description: "APIs for building activity feeds, chat, and video. Enterprise-grade infrastructure for real-time features with SDKs for every platform.", url: "https://getstream.io", pricing: "FREEMIUM" as Pricing, category: "Chat & Feeds", stack: "Communication" },
];

async function seedTools() {
  console.log("Seeding tool stacks...");

  // Create stacks
  const stackMap = new Map<string, string>();
  for (const stack of STACKS) {
    const created = await prisma.toolStack.upsert({
      where: { name: stack.name },
      update: {},
      create: { name: stack.name },
    });
    stackMap.set(stack.name, created.id);
    console.log(`  Stack: ${stack.name}`);
  }

  console.log("\nSeeding tools...");

  for (const toolData of TOOLS_DATA) {
    const { stack, ...tool } = toolData;
    const stackId = stackMap.get(stack);

    // Check if tool exists by name (no unique constraint on name, so use findFirst)
    const existing = await prisma.tool.findFirst({
      where: { name: tool.name },
    });

    if (existing) {
      await prisma.tool.update({
        where: { id: existing.id },
        data: {
          description: tool.description,
          url: tool.url,
          pricing: tool.pricing,
          category: tool.category,
          stackId,
        },
      });
    } else {
      await prisma.tool.create({
        data: {
          ...tool,
          stackId,
        },
      });
    }

    console.log(`  Tool: ${tool.name} (${stack})`);
  }

  console.log(`\nDone! Seeded ${STACKS.length} stacks and ${TOOLS_DATA.length} tools.`);
}

seedTools()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
