"use client";

import Link from "next/link";
import {
  Database,
  TrendingUp,
  Wrench,
  Skull,
  Lightbulb,
  Zap,
  BarChart3,
  Shield,
  Globe,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { FeatureCard } from "@/components/landing/FeatureCard";
import { TestimonialCard } from "@/components/landing/TestimonialCard";
import { StatsRow } from "@/components/landing/StatCounter";

// ===== DATA =====

const HERO_STATS = [
  { value: 50000, suffix: "+", label: "Startup Ideas" },
  { value: 12000, suffix: "+", label: "Active Users" },
  { value: 850, suffix: "+", label: "Trends Tracked" },
  { value: 95, suffix: "%", label: "Accuracy Score" },
];

const FEATURES = [
  {
    icon: Database,
    title: "Idea Database",
    description:
      "Browse 50,000+ validated startup ideas with AI-powered scoring, market analysis, and competitive landscape data.",
  },
  {
    icon: TrendingUp,
    title: "Trend Tracker",
    description:
      "Real-time trend detection across 200+ markets. Know what's rising before it peaks with predictive analytics.",
  },
  {
    icon: Wrench,
    title: "Builder Tools",
    description:
      "Name generators, domain checkers, tech stack recommenders, and MVP planners -- everything to go from idea to launch.",
  },
  {
    icon: Skull,
    title: "Startup Graveyard",
    description:
      "Learn from 5,000+ failed startups. Understand what went wrong so you don't repeat the same mistakes.",
  },
  {
    icon: BarChart3,
    title: "AI Scoring Engine",
    description:
      "Every idea gets a viability score based on market size, competition, timing, and founder-market fit signals.",
  },
  {
    icon: Globe,
    title: "Market Intelligence",
    description:
      "TAM/SAM/SOM estimates, competitor mapping, and regulatory landscape analysis for every idea in the vault.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "IdeaVault saved me months of market research. I found my SaaS idea in 20 minutes and the AI scoring gave me confidence to commit.",
    author: "Sarah Chen",
    role: "Founder, DataPulse",
    rating: 5,
  },
  {
    quote:
      "The Startup Graveyard alone is worth the subscription. Learning from others' failures has been invaluable for our pivot strategy.",
    author: "Marcus Rodriguez",
    role: "CTO, NexLayer",
    rating: 5,
  },
  {
    quote:
      "We use IdeaVault for our accelerator program. The trend data helps us identify which cohort startups have the best timing.",
    author: "Emily Watson",
    role: "Director, TechStars NYC",
    rating: 5,
  },
  {
    quote:
      "The builder tools are incredibly polished. Domain checker + name generator + tech stack advisor in one place is a game changer.",
    author: "Alex Kim",
    role: "Solo Founder",
    rating: 5,
  },
  {
    quote:
      "I've been in VC for 12 years. IdeaVault's market intelligence rivals reports that cost $10K+ from traditional research firms.",
    author: "David Park",
    role: "Partner, Horizon Ventures",
    rating: 5,
  },
  {
    quote:
      "From ideation to validation in a weekend. The AI scoring told me my idea had a 78% viability score -- we just closed our seed round.",
    author: "Priya Sharma",
    role: "CEO, FinFlow",
    rating: 5,
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Explore Ideas",
    description:
      "Browse our curated database of 50K+ startup ideas, filtered by industry, market size, or AI score.",
  },
  {
    step: "02",
    title: "Validate Fast",
    description:
      "Get instant AI-powered viability scores, competitor analysis, and market sizing for any idea.",
  },
  {
    step: "03",
    title: "Build Smarter",
    description:
      "Use our builder tools to name, plan, and prototype your startup with confidence.",
  },
];

// ===== PAGE =====

export default function LandingPage() {
  return (
    <div className="relative">
      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#22c55e]/5 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#22c55e]/5 rounded-full blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-28 sm:pb-24">
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#22c55e]/20 bg-[#22c55e]/5">
              <Sparkles className="w-4 h-4 text-[#22c55e]" />
              <span className="text-sm font-medium text-[#22c55e]">
                Now with AI-powered scoring
              </span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-center text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight max-w-4xl mx-auto">
            Find Your Next{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22c55e] to-[#4ade80]">
              Billion-Dollar
            </span>{" "}
            Idea
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-center text-lg sm:text-xl text-[#a1a1aa] max-w-2xl mx-auto leading-relaxed">
            The startup intelligence platform with 50,000+ validated ideas,
            real-time trends, and AI scoring. Stop guessing, start building.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base font-semibold bg-[#22c55e] text-white rounded-xl hover:bg-[#16a34a] transition-all hover:shadow-lg hover:shadow-[#22c55e]/20"
            >
              Start Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/database"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base font-semibold text-white border border-[#2a2a2a] rounded-xl hover:bg-[#111111] hover:border-[#3a3a3a] transition-all"
            >
              Explore Database
            </Link>
          </div>

          {/* Social proof line */}
          <div className="mt-10 flex items-center justify-center gap-2 text-sm text-[#71717a]">
            <div className="flex -space-x-2">
              {["SC", "MR", "EW", "AK", "DP"].map((initials, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-[#1a1a1a] border-2 border-[#0a0a0a] flex items-center justify-center"
                >
                  <span className="text-[10px] font-medium text-[#22c55e]">
                    {initials}
                  </span>
                </div>
              ))}
            </div>
            <span>Trusted by 12,000+ founders & investors</span>
          </div>
        </div>
      </section>

      {/* ===== STATS ROW ===== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-4">
        <StatsRow stats={HERO_STATS} />
      </section>

      {/* ===== FEATURES GRID ===== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Everything You Need to Validate
          </h2>
          <p className="text-lg text-[#a1a1aa] max-w-2xl mx-auto">
            From discovery to launch, IdeaVault gives you the data and tools
            to make confident startup decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="bg-[#111111]/50 border-y border-[#2a2a2a]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-[#a1a1aa] max-w-2xl mx-auto">
              Go from zero to validated startup idea in three simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((item) => (
              <div key={item.step} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#22c55e]/10 mb-6">
                  <span className="text-2xl font-bold text-[#22c55e]">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-[#a1a1aa] leading-relaxed max-w-xs mx-auto">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Loved by Founders
          </h2>
          <p className="text-lg text-[#a1a1aa] max-w-2xl mx-auto">
            See why thousands of founders and investors use IdeaVault to make
            smarter startup decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((testimonial) => (
            <TestimonialCard key={testimonial.author} {...testimonial} />
          ))}
        </div>
      </section>

      {/* ===== BOTTOM CTA ===== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24">
        <div className="relative overflow-hidden rounded-2xl border border-[#2a2a2a] bg-gradient-to-br from-[#111111] to-[#0a0a0a] p-12 sm:p-16 text-center">
          {/* Background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#22c55e]/10 rounded-full blur-[100px]" />

          <div className="relative">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#22c55e]/10 mb-8">
              <Lightbulb className="w-8 h-8 text-[#22c55e]" />
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Find Your Idea?
            </h2>
            <p className="text-lg text-[#a1a1aa] max-w-xl mx-auto mb-8">
              Join 12,000+ founders who use IdeaVault to discover, validate,
              and launch winning startups.
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

            {/* Trust indicators */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-[#71717a]">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#22c55e]" />
                Free forever plan
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#22c55e]" />
                No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#22c55e]" />
                Cancel anytime
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
