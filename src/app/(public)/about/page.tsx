import Link from "next/link";
import {
  Lightbulb,
  Target,
  Heart,
  Shield,
  Zap,
  Globe,
  ArrowRight,
  Github,
  Twitter,
  Linkedin,
} from "lucide-react";

// ===== VALUES =====

const VALUES = [
  {
    icon: Target,
    title: "Data-Driven Decisions",
    description:
      "Every feature we build is backed by data. We believe founders deserve facts, not gut feelings, when choosing what to build.",
  },
  {
    icon: Heart,
    title: "Founder-First",
    description:
      "We're founders too. IdeaVault exists because we wished this tool existed when we were starting out. Every decision prioritizes founder needs.",
  },
  {
    icon: Shield,
    title: "Radical Transparency",
    description:
      "Our scoring algorithms are documented. Our data sources are cited. We show you exactly why an idea gets the score it does.",
  },
  {
    icon: Zap,
    title: "Speed Matters",
    description:
      "The startup world moves fast. We optimize for speed everywhere -- sub-100ms search, instant AI scoring, real-time trend data.",
  },
  {
    icon: Globe,
    title: "Global Perspective",
    description:
      "Great ideas come from everywhere. Our database spans 50+ countries and we track trends across every major market.",
  },
  {
    icon: Lightbulb,
    title: "Continuous Innovation",
    description:
      "We ship weekly. New ideas, better scoring models, and fresh tools land constantly. Check our Updates page to see what's new.",
  },
];

// ===== TEAM =====

const TEAM = [
  {
    name: "Alex Rivera",
    role: "CEO & Co-Founder",
    bio: "Serial entrepreneur. Previously founded two YC-backed startups. Obsessed with making startup validation accessible to everyone.",
    initials: "AR",
  },
  {
    name: "Jordan Lee",
    role: "CTO & Co-Founder",
    bio: "Ex-Google ML engineer. Built recommendation systems at scale. Leads our AI scoring engine and infrastructure.",
    initials: "JL",
  },
  {
    name: "Sam Patel",
    role: "Head of Data",
    bio: "Former data science lead at CB Insights. Curates our idea database and builds the trend detection pipeline.",
    initials: "SP",
  },
  {
    name: "Maya Chen",
    role: "Head of Product",
    bio: "Ex-Notion product lead. Ensures every feature in IdeaVault is intuitive, fast, and genuinely useful for founders.",
    initials: "MC",
  },
  {
    name: "Chris Okafor",
    role: "Lead Engineer",
    bio: "Full-stack architect from Vercel. Responsible for our edge infrastructure and sub-100ms search performance.",
    initials: "CO",
  },
  {
    name: "Elena Volkov",
    role: "Head of Growth",
    bio: "Built growth engines at three unicorns. Leads partnerships, community, and our accelerator program integrations.",
    initials: "EV",
  },
];

// ===== TIMELINE =====

const TIMELINE = [
  {
    year: "2023",
    title: "The Spark",
    description:
      "Alex and Jordan meet at a hackathon. Frustrated by the lack of data-driven tools for idea validation, they prototype IdeaVault in 48 hours.",
  },
  {
    year: "2023",
    title: "YC W23",
    description:
      "Accepted into Y Combinator. Launch beta with 1,000 ideas and basic AI scoring. First 500 users sign up in week one.",
  },
  {
    year: "2024",
    title: "Public Launch",
    description:
      "Launch on Product Hunt (#1 Product of the Day). Database grows to 10,000 ideas. Introduce Trend Tracker and Builder Tools.",
  },
  {
    year: "2024",
    title: "Series A",
    description:
      "Raise $8M led by Horizon Ventures. Team grows to 15. Launch Startup Graveyard and enterprise features.",
  },
  {
    year: "2025",
    title: "50K Ideas",
    description:
      "Hit 50,000 ideas in the database and 12,000 active users. Launch API access, team collaboration, and global market coverage.",
  },
  {
    year: "2026",
    title: "What's Next",
    description:
      "Building the definitive startup intelligence platform. AI co-pilot for founders, predictive market maps, and much more coming soon.",
  },
];

// ===== PAGE =====

export default function AboutPage() {
  return (
    <div>
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#22c55e]/5 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Making Startup Validation{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22c55e] to-[#4ade80]">
                Accessible
              </span>
            </h1>
            <p className="text-lg text-[#a1a1aa] leading-relaxed">
              IdeaVault was born from a simple frustration: choosing what startup
              to build shouldn&apos;t require months of research and guesswork.
              We&apos;re building the platform we wished existed when we were
              starting out.
            </p>
          </div>
        </div>
      </section>

      {/* ===== MISSION STATEMENT ===== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24">
        <div className="rounded-2xl border border-[#2a2a2a] bg-[#111111] p-8 sm:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-[#22c55e]/10 mb-6">
              <Lightbulb className="w-7 h-7 text-[#22c55e]" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Our Mission
            </h2>
            <p className="text-base text-[#a1a1aa] leading-relaxed">
              To democratize startup intelligence. We believe every aspiring
              founder -- regardless of their network, location, or resources --
              deserves access to the same quality of market data and validation
              tools that top VCs and serial entrepreneurs use. IdeaVault levels
              the playing field.
            </p>
          </div>
        </div>
      </section>

      {/* ===== VALUES ===== */}
      <section className="bg-[#111111]/50 border-y border-[#2a2a2a]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Our Values
            </h2>
            <p className="text-lg text-[#a1a1aa] max-w-2xl mx-auto">
              The principles that guide every decision we make.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {VALUES.map((value) => {
              const Icon = value.icon;
              return (
                <div
                  key={value.title}
                  className="rounded-xl border border-[#2a2a2a] bg-[#0a0a0a] p-6 transition-all hover:border-[#3a3a3a]"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[#22c55e]/10 mb-4">
                    <Icon className="w-6 h-6 text-[#22c55e]" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {value.title}
                  </h3>
                  <p className="text-sm text-[#a1a1aa] leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== TEAM ===== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Meet the Team
          </h2>
          <p className="text-lg text-[#a1a1aa] max-w-2xl mx-auto">
            A small, passionate team building the future of startup intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TEAM.map((member) => (
            <div
              key={member.name}
              className="rounded-xl border border-[#2a2a2a] bg-[#111111] p-6 transition-all hover:border-[#3a3a3a]"
            >
              {/* Avatar */}
              <div className="w-16 h-16 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center mb-4">
                <span className="text-lg font-bold text-[#22c55e]">
                  {member.initials}
                </span>
              </div>

              {/* Info */}
              <h3 className="text-base font-semibold text-white">
                {member.name}
              </h3>
              <p className="text-sm text-[#22c55e] font-medium mb-3">
                {member.role}
              </p>
              <p className="text-sm text-[#a1a1aa] leading-relaxed">
                {member.bio}
              </p>

              {/* Social links */}
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-[#1a1a1a]">
                <a
                  href="#"
                  className="text-[#52525b] hover:text-[#a1a1aa] transition-colors"
                  aria-label={`${member.name} Twitter`}
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="text-[#52525b] hover:text-[#a1a1aa] transition-colors"
                  aria-label={`${member.name} LinkedIn`}
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== TIMELINE ===== */}
      <section className="bg-[#111111]/50 border-y border-[#2a2a2a]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Our Journey
            </h2>
            <p className="text-lg text-[#a1a1aa] max-w-2xl mx-auto">
              From hackathon prototype to 50,000+ ideas and counting.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-6 top-0 bottom-0 w-px bg-[#2a2a2a]" />

              <div className="space-y-10">
                {TIMELINE.map((item, index) => (
                  <div key={index} className="flex gap-6">
                    {/* Dot */}
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-[#0a0a0a] border border-[#2a2a2a] flex items-center justify-center z-10 relative">
                        <span className="text-xs font-bold text-[#22c55e]">
                          {item.year}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="pb-2">
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-[#a1a1aa] leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== NUMBERS ===== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          {[
            { value: "50K+", label: "Ideas in Database" },
            { value: "12K+", label: "Active Users" },
            { value: "200+", label: "Markets Tracked" },
            { value: "50+", label: "Countries" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-white mb-1">
                {stat.value}
              </div>
              <p className="text-sm text-[#71717a]">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24">
        <div className="rounded-2xl border border-[#2a2a2a] bg-gradient-to-br from-[#111111] to-[#0a0a0a] p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Join the Mission
          </h2>
          <p className="text-lg text-[#a1a1aa] max-w-xl mx-auto mb-8">
            Whether you&apos;re a first-time founder or a seasoned investor,
            IdeaVault has something for you.
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
              href="/features"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base font-semibold text-white border border-[#2a2a2a] rounded-xl hover:bg-[#111111] transition-all"
            >
              Explore Features
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
