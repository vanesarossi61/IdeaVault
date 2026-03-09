# IdeaVault

**AI-Powered Startup Idea Discovery Platform**

Discover, validate, and track startup ideas powered by AI scoring, trend analysis, community signals, and a curated cemetery of failed startups to learn from.

## Features

### Public Pages
- **Landing Page** -- Hero with animated stats, feature cards, testimonials, social proof
- **Features** -- Detailed breakdown of all platform capabilities
- **Pricing** -- Free / Pro / Team plans with Stripe integration
- **About** -- Team, mission, and company story

### App (Authenticated)
- **Dashboard** -- Personal stats, activity feed, recommended ideas, quick actions
- **Idea Database** -- Browse, filter, search, and sort 100+ AI-generated startup ideas
- **Idea Detail** -- Full idea breakdown with AI scores, tags, signals, comments, and interactions
- **Trends** -- Real-time trend tracking with charts, growth metrics, and related ideas
- **Tools** -- Curated directory of 50+ startup tools organized by stack category
- **Graveyard** -- Startup Cemetery -- browse 100+ dead/acquired/pivoted startups with postmortems
- **Updates** -- Platform changelog and feature announcements
- **Profile** -- User stats, saved ideas, activity history
- **Settings** -- Account, notifications, appearance, billing, data export

### Data Pipeline (Python)
- **Scrapers** -- Reddit, Hacker News, Product Hunt, Flippa, Google Trends
- **AI Generator** -- GPT-powered idea generation from scraped signals
- **Dedup & Scorer** -- Duplicate detection + composite scoring algorithm
- **Daily Picker** -- Automated daily featured idea selection

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + Radix UI |
| Database | PostgreSQL + Prisma ORM |
| Auth | NextAuth.js (Google OAuth + Magic Link) |
| API | tRPC v10 (end-to-end typesafe) |
| Payments | Stripe (Checkout + Customer Portal + Webhooks) |
| Animations | Framer Motion |
| Charts | Recharts |
| Pipeline | Python 3.11+ (httpx, openai, beautifulsoup4) |

## Project Structure

```
ideavault-app/
|-- prisma/
|   |-- schema.prisma          # Database schema (15 models, 7 enums)
|   |-- seed-graveyard.ts      # 100+ dead startup seed data
|-- src/
|   |-- app/
|   |   |-- layout.tsx          # Root layout (font, providers, metadata)
|   |   |-- globals.css         # Tailwind directives + custom utilities
|   |   |-- (public)/           # Public pages (landing, features, pricing, about)
|   |   |-- (auth)/             # Auth pages (login)
|   |   |-- (app)/              # Protected app pages
|   |   |   |-- dashboard/
|   |   |   |-- database/
|   |   |   |-- graveyard/
|   |   |   |-- idea/[slug]/
|   |   |   |-- trends/
|   |   |   |-- tools/
|   |   |   |-- updates/
|   |   |   |-- profile/
|   |   |   |-- settings/
|   |   |-- api/
|   |       |-- trpc/[trpc]/    # tRPC handler
|   |       |-- stripe/         # Stripe checkout, webhook, portal
|   |-- components/
|   |   |-- landing/            # FeatureCard, StatCounter, TestimonialCard
|   |   |-- pricing/            # PricingCard, PlanBadge
|   |   |-- ideas/              # IdeaCard, IdeaFilters, IdeaScoreBadge, etc.
|   |   |-- trends/             # TrendCard, TrendChart
|   |   |-- tools/              # ToolCard
|   |   |-- graveyard/          # GraveyardCard, GraveyardStats
|   |   |-- dashboard/          # StatCard, ActivityFeed, RecommendedIdeas
|   |-- server/
|   |   |-- trpc.ts             # tRPC init (public, protected, admin procedures)
|   |   |-- routers/
|   |       |-- root.ts         # App router (merges all sub-routers)
|   |       |-- idea.ts         # Ideas CRUD + filtering + interactions
|   |       |-- trend.ts        # Trends listing + detail
|   |       |-- tool.ts         # Tools directory
|   |       |-- graveyard.ts    # Dead startups listing + detail + stats
|   |       |-- dashboard.ts    # Dashboard stats + activity + recommendations
|   |       |-- user.ts         # Profile + settings + preferences
|   |       |-- update.ts       # Platform updates/changelog
|   |-- lib/
|   |   |-- auth.ts             # NextAuth config (Google + Email providers)
|   |   |-- prisma.ts           # Prisma client singleton
|   |   |-- stripe.ts           # Stripe client + helpers
|   |   |-- subscription.ts     # Plan limits + feature gating
|   |   |-- utils.ts            # cn(), formatDate(), slugify(), etc.
|   |   |-- trpc/
|   |       |-- client.ts       # tRPC React client + TRPCProvider
|   |-- types/
|   |   |-- index.ts            # Shared TypeScript types
|   |-- middleware.ts           # Route protection (public vs protected)
|-- package.json
|-- tailwind.config.ts
|-- tsconfig.json
|-- next.config.js
|-- postcss.config.js

ideavault-pipeline/
|-- config.py                   # Pipeline configuration + API keys
|-- run_pipeline.py             # Main orchestrator
|-- requirements.txt
|-- pipeline/
|   |-- idea_generator.py       # GPT-powered idea generation
|   |-- dedup_scorer.py         # Dedup + composite scoring
|   |-- daily_picker.py         # Featured idea selection
|-- scrapers/
    |-- reddit_scraper.py
    |-- hackernews_scraper.py
    |-- producthunt_scraper.py
    |-- flippa_scraper.py
    |-- trends_scraper.py
```

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- Python 3.11+ (for the data pipeline)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vanesarossi61/IdeaVault.git
   cd IdeaVault
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Fill in your credentials:
   - `DATABASE_URL` -- PostgreSQL connection string
   - `NEXTAUTH_SECRET` -- Generate with `openssl rand -base64 32`
   - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` -- Google Cloud Console
   - `RESEND_API_KEY` -- Resend.com for magic link emails
   - `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` -- Stripe Dashboard

4. **Set up the database**
   ```bash
   npx prisma db push
   npx prisma generate
   ```

5. **Seed the Graveyard data** (optional)
   ```bash
   npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed-graveyard.ts
   ```

6. **Start the dev server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

### Pipeline Setup (Optional)

```bash
cd ideavault-pipeline
pip install -r requirements.txt
# Configure API keys in config.py
python run_pipeline.py
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `NEXTAUTH_URL` | Yes | App URL (http://localhost:3000) |
| `NEXTAUTH_SECRET` | Yes | Session encryption secret |
| `GOOGLE_CLIENT_ID` | Yes | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Yes | Google OAuth client secret |
| `RESEND_API_KEY` | No | Magic link email provider |
| `STRIPE_SECRET_KEY` | No | Stripe payments |
| `STRIPE_WEBHOOK_SECRET` | No | Stripe webhook verification |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | No | Stripe client-side key |
| `OPENAI_API_KEY` | No | Pipeline AI generation |

## Database Schema

15 models across 5 domains:

- **Auth**: User, Account, Session, VerificationToken
- **Ideas**: Idea, IdeaScore, Tag, IdeaTag, IdeaTrend
- **Social**: UserIdeaInteraction, Comment, Upvote, CommunitySignal
- **Tools**: Tool, ToolStack
- **Graveyard**: DeadStartup
- **Billing**: Subscription
- **Content**: Trend, TrendDataPoint

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:push` | Push schema to database |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:studio` | Open Prisma Studio GUI |
| `npm run db:seed` | Seed database |

## Development Phases

- [x] **Phase 0** -- Data Pipeline (scrapers, AI generation, scoring)
- [x] **Phase 1** -- App Base (Next.js, Prisma, tRPC, NextAuth, layouts)
- [x] **Phase 2** -- Landing Pages (home, features, about, public layout)
- [x] **Phase 3** -- Idea Database (listing, detail, filters, interactions, comments)
- [x] **Phase 4** -- Trends + Tools + Updates (trend charts, tool directory, changelog)
- [x] **Phase 5** -- Pricing + Stripe (plans, checkout, webhooks, customer portal)
- [x] **Phase 6** -- Dashboard + Profile (stats, activity, settings, preferences)
- [x] **Phase 7** -- Graveyard (startup cemetery, stats, detail pages)
- [ ] **Phase 8** -- Gamification (achievements, streaks, leaderboard)
- [ ] **Phase 9** -- Admin Panel (content moderation, analytics, user management)

## License

MIT

## Author

**Vane Rossi** -- [@vanesarossi61](https://github.com/vanesarossi61)
