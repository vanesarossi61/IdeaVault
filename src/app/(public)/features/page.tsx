"use client";

import Link from "next/link";
import {
  Database,
  TrendingUp,
  Wrench,
  Skull,
  BarChart3,
  Globe,
  Lightbulb,
  Search,
  Filter,
  Star,
  Target,
  LineChart,
  Cpu,
  Layers,
  Bookmark,
  Bell,
  Users,
  Lock,
  Zap,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { FeatureCard, FeatureGridItem } from "@/components/landing/FeatureCard";

// ===== CORE FEATURES =====

const CORE_FEATURES = [
  {
    icon: Database,
    title: "Idea Database",
    description:
      "Browse 50,000+ curated startup ideas spanning every industry. Each idea includes market analysis, competitor data, and actionable insights.",
    details: [
      { icon: Search, title: "Smart Search", description: "Natural language search across all ideas with semantic understanding" },
      { icon: Filter, title: "Advanced Filters", description: "Filter by industry, market size, AI score, funding stage, and 20+ parameters" },
      { icon: Star, title: "AI Scoring", description: "Every idea scored 0-100 based on market timing, competition, and viability" },
      { icon: Bookmark, title: "Save & Organize", description: "Bookmark ideas into custom collections and track them over time" },
    ],
  },
  {
    icon: TrendingUp,
    title: "Trend Tracker",
    description:
      "Real-time trend detection across 200+ markets. Predictive analytics identify rising opportunities before they peak.",
    details: [
      { icon: LineChart, title: "Real-Time Data", description: "Live trend signals from social media, search data, patent filings, and VC activity" },
      { icon: Target, title: "Predictions", description: "ML models forecast trend trajectories 3-6 months ahead with 85%+ accuracy" },
      { icon: Bell, title: "Alerts", description: "Custom alerts when trends hit your thresholds or new ideas match your criteria" },
      { icon: Globe, title: "Global Coverage", description: "Track trends across North America, Europe, Asia, and emerging markets" },
    ],
  },
  {
    icon: Wrench,
    title: "Builder Tools",
    description:
      "A complete toolkit to go from idea to prototype. Name generators, domain checkers, tech stack advisors, and MVP planners.",
    details: [
      { icon: Lightbulb, title: "Name Generator", description: "AI-powered name suggestions with instant domain and trademark availability" },
      { icon: Layers, title: "Tech Stack Advisor", description: "Personalized tech recommendations based on your idea, team size, and budget" },
      { icon: Cpu, title: "MVP Planner", description: "Auto-generated MVP roadmap with feature prioritization and time estimates" },
      { icon: Users, title: "Team Matcher", description: "Find co-founders and early hires with complementary skills (Pro+)" },
    ],
  },
  {
    icon: Skull,
    title: "Startup Graveyard",
    description:
      "Learn from 5,000+ failed startups. Detailed post-mortems reveal patterns of failure so you can avoid common pitfalls.",
    details: [
      { icon: BarChart3, title: "Failure Analytics", description: "Statistical breakdown of why startups fail by industry, stage, and funding" },
      { icon: Search, title: "Pattern Matching", description: "AI identifies if your idea shares risk factors with previously failed startups" },
      { icon: Target, title: "Risk Assessment", description: "Get a risk score based on historical data and current market conditions" },
      { icon: Lock, title: "Lessons Library", description: "Curated takeaways from founders who share what they'd do differently" },
    ],
  },
];

// ===== PLATFORM FEATURES =====

const PLATFORM_FEATURES = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Sub-100ms search across 50K+ ideas. Built on edge infrastructure for instant results worldwide.",
  },
  {
    icon: Lock,
    title: "Secure by Default",
    description: "SOC 2 Type II compliant. Your saved ideas and research are encrypted at rest and in transit.",
  },
  {
    icon: Cpu,
    title: "AI-Powered",
    description: "GPT-4 and custom ML models power our scoring, search, and recommendation engines.",
  },
  {
    icon: Globe,
    title: "API Access",
    description: "Full REST API for Empire subscribers. SDKs for Python, TypeScript, and Go with generous rate limits.",
  },
  {
    icon: Bell,
    title: "Smart Alerts",
    description: "Email and in-app notifications when new ideas, trends, or graveyard entries match your interests.",
  },
  {
    icon: Users,
    title: "Collaboration",
    description: "Share ideas, collections, and research with your team. Built-in commenting and voting.",
  },
];

// ===== PAGE =====

export default function FeaturesPage() {
  return (
    <div>
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#22c55e]/5 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Built for{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22c55e] to-[#4ade80]">
                Serious Founders
              </span>
            </h1>
            <p className="text-lg text-[#a1a1aa] max-w-2xl mx-auto leading-relaxed">
              Every feature in IdeaVault is designed to reduce the time from
              &quot;I have an idea&quot; to &quot;I have a validated business.&quot;
              Here&apos;s what you get.
            </p>
          </div>
        </div>
      </section>

      {/* ===== CORE FEATURES (alternating sections) ===== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24">
        <div className="space-y-24">
          {CORE_FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            const isReversed = index % 2 === 1;

            return (
              <div
                key={feature.title}
                className={`flex flex-col lg:flex-row gap-12 lg:gap-16 items-center ${
                  isReversed ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Text side */}
                <div className="flex-1">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-[#22c55e]/10 mb-6">
                    <Icon className="w-7 h-7 text-[#22c55e]" />
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-4">
                    {feature.title}
                  </h2>
                  <p className="text-base text-[#a1a1aa] leading-relaxed mb-8">
                    {feature.description}
                  </p>

                  <div className="space-y-5">
                    {feature.details.map((detail) => (
                      <FeatureGridItem
                        key={detail.title}
                        icon={detail.icon}
                        title={detail.title}
                        description={detail.description}
                      />
                    ))}
                  </div>
                </div>

                {/* Visual side (placeholder card) */}
                <div className="flex-1 w-full">
                  <div className="rounded-2xl border border-[#2a2a2a] bg-[#111111] p-8 aspect-[4/3] flex items-center justify-center">
                    <div className="text-center">
                      <Icon className="w-16 h-16 text-[#22c55e]/20 mx-auto mb-4" />
                      <p className="text-sm text-[#52525b]">
                        {feature.title} Preview
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== PLATFORM FEATURES GRID ===== */}
      <section className="bg-[#111111]/50 border-y border-[#2a2a2a]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Platform Features
            </h2>
            <p className="text-lg text-[#a1a1aa] max-w-2xl mx-auto">
              The infrastructure behind IdeaVault that makes everything fast,
              secure, and scalable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PLATFORM_FEATURES.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Explore?
          </h2>
          <p className="text-lg text-[#a1a1aa] max-w-xl mx-auto mb-8">
            Start with our free plan -- no credit card required. Upgrade when
            you need more power.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base font-semibold bg-[#22c55e] text-white rounded-xl hover:bg-[#16a34a] transition-all hover:shadow-lg hover:shadow-[#22c55e]/20"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/pricing"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base font-semibold text-white border border-[#2a2a2a] rounded-xl hover:bg-[#111111] transition-all"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
