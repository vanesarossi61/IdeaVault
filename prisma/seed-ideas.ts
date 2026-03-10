import { PrismaClient, Complexity, IdeaStatus } from "@prisma/client";

const prisma = new PrismaClient();

const IDEAS_DATA = [
  {
    title: "AI-Powered Code Review Platform",
    slug: "ai-code-review-platform",
    problem: "Code reviews are time-consuming and inconsistent. Junior developers wait hours for feedback while senior developers spend 30% of their time reviewing code instead of building features.",
    solution: "An AI assistant that provides instant, comprehensive code reviews with actionable suggestions. It learns from your team's patterns and coding standards to provide increasingly relevant feedback.",
    plan: {
      mvp: "VS Code extension + GitHub integration",
      phase1: "Basic pattern detection and style enforcement",
      phase2: "Team-specific learning and custom rules",
      phase3: "Security vulnerability detection and performance analysis",
    },
    revenueModel: "SaaS - $19/dev/month",
    whyNow: "LLMs have reached a quality threshold where code understanding is reliable. GitHub Copilot proved demand for AI dev tools, but code review remains underserved.",
    complexity: "MEDIUM" as Complexity,
    tags: ["AI", "Developer Tools", "SaaS"],
    scores: { opportunity: 82, painPoints: 88, confidence: 75, timing: 85, composite: 82.5 },
  },
  {
    title: "Micro-SaaS Directory & Analytics",
    slug: "micro-saas-directory-analytics",
    problem: "Indie hackers and solo founders struggle to discover proven micro-SaaS niches. Market research is scattered across Twitter, Reddit, and ProductHunt with no centralized, data-driven resource.",
    solution: "A curated directory of micro-SaaS opportunities with real-time market data, competition analysis, and revenue estimates. Think ProductHunt meets Statista for the indie hacker audience.",
    plan: {
      mvp: "Curated list of 200+ micro-SaaS ideas with basic metrics",
      phase1: "Add market size estimates and competition scores",
      phase2: "Community features - voting, comments, success stories",
      phase3: "AI-powered idea generation based on market gaps",
    },
    revenueModel: "Freemium - Free tier + Pro at $29/month",
    whyNow: "The creator economy is booming. More people are building solo businesses than ever before, but validated idea discovery remains a major bottleneck.",
    complexity: "LOW" as Complexity,
    tags: ["Marketplace", "Analytics", "Creator Economy"],
    scores: { opportunity: 76, painPoints: 72, confidence: 80, timing: 78, composite: 76.5 },
  },
  {
    title: "No-Code API Integration Builder",
    slug: "no-code-api-integration-builder",
    problem: "Non-technical founders need to connect APIs (Stripe, SendGrid, Twilio) but existing tools like Zapier are limited in customization and expensive at scale.",
    solution: "A visual API builder that lets you design custom integrations with drag-and-drop logic. More powerful than Zapier, simpler than code. Includes pre-built templates for common workflows.",
    plan: {
      mvp: "Visual workflow builder with 10 popular API connectors",
      phase1: "Custom logic blocks (conditionals, loops, data transforms)",
      phase2: "Template marketplace and community sharing",
      phase3: "Enterprise features - SSO, audit logs, team management",
    },
    revenueModel: "Usage-based - Free for 100 runs/month, then $0.01/run",
    whyNow: "API-first businesses are everywhere but integration complexity hasn't decreased. The no-code movement needs better infrastructure tools.",
    complexity: "HIGH" as Complexity,
    tags: ["No-Code", "API", "Developer Tools", "SaaS"],
    scores: { opportunity: 85, painPoints: 80, confidence: 65, timing: 82, composite: 78.0 },
  },
  {
    title: "Remote Team Culture Platform",
    slug: "remote-team-culture-platform",
    problem: "Remote teams lose the spontaneous interactions that build culture. Slack channels become noisy, virtual happy hours feel forced, and new hires struggle to integrate.",
    solution: "An async-first platform that creates organic connection opportunities: AI-matched coffee chats, interest-based channels, celebration automations, and culture health metrics.",
    plan: {
      mvp: "Slack bot that matches random coffee chats weekly",
      phase1: "Interest-based matching and conversation starters",
      phase2: "Culture health dashboard with engagement metrics",
      phase3: "Standalone platform with video rooms and async activities",
    },
    revenueModel: "Per-seat SaaS - $4/user/month",
    whyNow: "Remote work is permanent for most tech companies. The initial excitement has faded and culture problems are now acute and measurable.",
    complexity: "MEDIUM" as Complexity,
    tags: ["Remote Work", "HR Tech", "SaaS", "AI"],
    scores: { opportunity: 74, painPoints: 78, confidence: 70, timing: 80, composite: 75.5 },
  },
  {
    title: "Subscription Analytics for Creators",
    slug: "subscription-analytics-creators",
    problem: "Creators on Patreon, Substack, and Gumroad lack unified analytics. They can't easily track churn, predict revenue, or understand which content drives subscriptions across platforms.",
    solution: "A dashboard that aggregates subscription data from all creator platforms into one view. Includes churn prediction, content performance analysis, and revenue forecasting.",
    plan: {
      mvp: "Connect Patreon + Substack, basic revenue dashboard",
      phase1: "Add Gumroad, Ko-fi, YouTube memberships",
      phase2: "Churn prediction and content correlation analysis",
      phase3: "AI recommendations for pricing and content strategy",
    },
    revenueModel: "SaaS - Free under $1K MRR, 1% of revenue above",
    whyNow: "Creator economy reached $100B+ and creators are professionalizing. They need business intelligence tools but current options are enterprise-focused.",
    complexity: "MEDIUM" as Complexity,
    tags: ["Creator Economy", "Analytics", "SaaS"],
    scores: { opportunity: 79, painPoints: 82, confidence: 72, timing: 84, composite: 79.3 },
  },
  {
    title: "AI Resume Optimizer",
    slug: "ai-resume-optimizer",
    problem: "Job seekers send generic resumes. ATS systems reject 75% before a human sees them. Tailoring resumes for each application takes 30+ minutes.",
    solution: "Upload your resume + paste the job description. AI instantly optimizes keywords, restructures content, and generates a tailored version that passes ATS filters while remaining natural.",
    plan: {
      mvp: "Web app: paste resume + JD, get optimized version",
      phase1: "Chrome extension for 1-click optimization on job boards",
      phase2: "Cover letter generation and LinkedIn profile optimization",
      phase3: "Interview prep and salary negotiation coaching",
    },
    revenueModel: "Freemium - 3 free optimizations, then $12/month",
    whyNow: "Tech layoffs created a huge pool of job seekers. AI quality for text rewriting has reached a point where outputs are genuinely useful, not just gimmicks.",
    complexity: "LOW" as Complexity,
    tags: ["AI", "HR Tech", "Consumer"],
    scores: { opportunity: 88, painPoints: 90, confidence: 82, timing: 86, composite: 86.5 },
  },
  {
    title: "Open Source Monetization Platform",
    slug: "open-source-monetization-platform",
    problem: "Open source maintainers struggle to earn sustainable income. GitHub Sponsors and OpenCollective have low conversion rates. Most developers don't know how to monetize without alienating their community.",
    solution: "A platform that helps OSS maintainers offer paid features, support tiers, and consulting without the stigma. Includes license management, payment processing, and community tools.",
    plan: {
      mvp: "License key generation + Stripe integration for OSS repos",
      phase1: "Tiered support system with SLA guarantees",
      phase2: "Marketplace for paid plugins and extensions",
      phase3: "Enterprise procurement automation",
    },
    revenueModel: "Transaction fee - 5% of revenue processed",
    whyNow: "OSS sustainability crisis is well-documented. Recent high-profile burnouts (Log4j, core-js) created urgency. Companies are increasingly willing to pay for OSS they depend on.",
    complexity: "HIGH" as Complexity,
    tags: ["Open Source", "Developer Tools", "Marketplace"],
    scores: { opportunity: 70, painPoints: 85, confidence: 60, timing: 75, composite: 72.5 },
  },
  {
    title: "Local Business Review Aggregator",
    slug: "local-business-review-aggregator",
    problem: "Local businesses have reviews scattered across Google, Yelp, TripAdvisor, and Facebook. Managing reputation across platforms is chaotic and time-consuming.",
    solution: "One dashboard to monitor, respond to, and analyze reviews from all platforms. AI suggests responses, tracks sentiment trends, and alerts on negative reviews in real-time.",
    plan: {
      mvp: "Google + Yelp aggregation with unified inbox",
      phase1: "AI response suggestions and sentiment analysis",
      phase2: "Add TripAdvisor, Facebook, and industry-specific platforms",
      phase3: "Review generation campaigns and competitor benchmarking",
    },
    revenueModel: "SaaS - $49/month per location",
    whyNow: "Online reviews drive 93% of local purchase decisions. Small businesses finally understand their importance but lack tools designed for their budget and skill level.",
    complexity: "MEDIUM" as Complexity,
    tags: ["Local Business", "SaaS", "AI", "Marketing"],
    scores: { opportunity: 77, painPoints: 83, confidence: 78, timing: 72, composite: 77.5 },
  },
];

async function seedIdeas() {
  console.log("Seeding ideas...");

  for (const ideaData of IDEAS_DATA) {
    const { tags, scores, ...idea } = ideaData;

    // Upsert tags
    const tagRecords = await Promise.all(
      tags.map((tagName) =>
        prisma.tag.upsert({
          where: { slug: tagName.toLowerCase().replace(/\s+/g, "-") },
          update: {},
          create: {
            name: tagName,
            slug: tagName.toLowerCase().replace(/\s+/g, "-"),
          },
        })
      )
    );

    // Upsert idea
    const createdIdea = await prisma.idea.upsert({
      where: { slug: idea.slug },
      update: {
        title: idea.title,
        problem: idea.problem,
        solution: idea.solution,
        plan: idea.plan,
        revenueModel: idea.revenueModel,
        whyNow: idea.whyNow,
        complexity: idea.complexity,
        status: "PUBLISHED" as IdeaStatus,
      },
      create: {
        ...idea,
        status: "PUBLISHED" as IdeaStatus,
      },
    });

    // Upsert score
    await prisma.ideaScore.upsert({
      where: { ideaId: createdIdea.id },
      update: scores,
      create: {
        ideaId: createdIdea.id,
        ...scores,
      },
    });

    // Connect tags
    for (const tag of tagRecords) {
      await prisma.ideaTag.upsert({
        where: {
          ideaId_tagId: {
            ideaId: createdIdea.id,
            tagId: tag.id,
          },
        },
        update: {},
        create: {
          ideaId: createdIdea.id,
          tagId: tag.id,
        },
      });
    }

    console.log(`  Seeded: ${idea.title}`);
  }

  console.log(`\nDone! Seeded ${IDEAS_DATA.length} ideas with tags and scores.`);
}

seedIdeas()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
