"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { PLANS } from "@/lib/stripe";
import { getAnnualMonthlyPrice } from "@/lib/subscription";
import { PricingCard } from "@/components/pricing/PricingCard";
import type { SubscriptionPlan } from "@prisma/client";

// ===== FAQ DATA =====

const FAQ_ITEMS = [
  {
    q: "Can I switch plans at any time?",
    a: "Yes! You can upgrade or downgrade your plan at any time. When upgrading, you'll be charged the prorated difference. When downgrading, you'll receive credit toward your next billing cycle.",
  },
  {
    q: "What happens when I hit the free plan limit?",
    a: "On the Free plan, you can view up to 5 ideas per day. After that, you'll see a prompt to upgrade. Your saved data and interactions are never lost.",
  },
  {
    q: "Is there a free trial?",
    a: "We don't offer a traditional free trial, but our Free plan lets you explore the platform with no time limit. Upgrade when you're ready to unlock the full experience.",
  },
  {
    q: "How does annual billing work?",
    a: "Annual billing gives you a 20% discount compared to monthly. You pay once per year upfront and can cancel anytime -- unused months are not refunded but you keep access until the period ends.",
  },
  {
    q: "Can I cancel my subscription?",
    a: "Absolutely. Cancel anytime from your account settings or the Stripe customer portal. You'll retain access to paid features until the end of your billing period.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit cards (Visa, Mastercard, American Express) through Stripe. We also support Apple Pay and Google Pay where available.",
  },
  {
    q: "Do you offer refunds?",
    a: "We offer a 7-day money-back guarantee on all paid plans. If you're not satisfied, contact us within 7 days of your purchase for a full refund.",
  },
  {
    q: "What does the Empire plan's API access include?",
    a: "Empire subscribers get full REST API access to query ideas, trends, scores, and tools programmatically. Rate limits are generous (10k requests/day) and we provide SDKs for Python, TypeScript, and Go.",
  },
];

// ===== FEATURE COMPARISON =====

interface ComparisonFeature {
  name: string;
  free: string | boolean;
  starter: string | boolean;
  pro: string | boolean;
  empire: string | boolean;
}

const COMPARISON_FEATURES: ComparisonFeature[] = [
  { name: "Ideas per day", free: "5", starter: "Unlimited", pro: "Unlimited", empire: "Unlimited" },
  { name: "Basic filters", free: true, starter: true, pro: true, empire: true },
  { name: "Advanced filters", free: false, starter: true, pro: true, empire: true },
  { name: "Trend data", free: false, starter: true, pro: true, empire: true },
  { name: "Save & organize", free: false, starter: true, pro: true, empire: true },
  { name: "Email alerts", free: false, starter: true, pro: true, empire: true },
  { name: "AI scoring", free: false, starter: false, pro: true, empire: true },
  { name: "Market analysis", free: false, starter: false, pro: true, empire: true },
  { name: "Export reports", free: false, starter: false, pro: true, empire: true },
  { name: "Priority support", free: false, starter: false, pro: true, empire: true },
  { name: "API access", free: false, starter: false, pro: false, empire: true },
  { name: "Custom pipelines", free: false, starter: false, pro: false, empire: true },
  { name: "Team features", free: false, starter: false, pro: false, empire: true },
  { name: "White-label reports", free: false, starter: false, pro: false, empire: true },
  { name: "Dedicated support", free: false, starter: false, pro: false, empire: true },
];

// ===== PAGE =====

export default function PricingPage() {
  const { data: session } = useSession();
  const [isAnnual, setIsAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // TODO: fetch user's current plan from API if logged in
  const currentPlan: SubscriptionPlan | null = null;

  const plans: {
    key: SubscriptionPlan;
    name: string;
    monthlyPrice: number;
    annualMonthlyPrice: number;
    features: readonly string[];
    isPopular: boolean;
  }[] = (
    Object.entries(PLANS) as [SubscriptionPlan, (typeof PLANS)[keyof typeof PLANS]][]
  ).map(([key, plan]) => ({
    key: key as SubscriptionPlan,
    name: plan.name,
    monthlyPrice: plan.price,
    annualMonthlyPrice: plan.price > 0 ? getAnnualMonthlyPrice(plan.price) : 0,
    features: plan.features,
    isPopular: key === "PRO",
  }));

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero */}
      <section className="px-4 pb-16 pt-24 text-center sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
          Simple, transparent pricing
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
          Start free and scale as you grow. Every plan includes access to our
          curated idea database. Upgrade to unlock AI scoring, trend analysis,
          and more.
        </p>

        {/* Billing toggle */}
        <div className="mt-10 flex items-center justify-center gap-3">
          <span
            className={cn(
              "text-sm font-medium transition-colors",
              !isAnnual
                ? "text-gray-900 dark:text-white"
                : "text-gray-500 dark:text-gray-400"
            )}
          >
            Monthly
          </span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className={cn(
              "relative inline-flex h-7 w-12 items-center rounded-full transition-colors",
              isAnnual ? "bg-violet-600" : "bg-gray-300 dark:bg-gray-700"
            )}
            aria-label="Toggle annual billing"
          >
            <span
              className={cn(
                "inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform",
                isAnnual ? "translate-x-6" : "translate-x-1"
              )}
            />
          </button>
          <span
            className={cn(
              "text-sm font-medium transition-colors",
              isAnnual
                ? "text-gray-900 dark:text-white"
                : "text-gray-500 dark:text-gray-400"
            )}
          >
            Annual
          </span>
          {isAnnual && (
            <span className="ml-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700 dark:bg-green-900 dark:text-green-300">
              Save 20%
            </span>
          )}
        </div>
      </section>

      {/* Pricing cards */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <PricingCard
              key={plan.key}
              plan={plan.key}
              name={plan.name}
              monthlyPrice={plan.monthlyPrice}
              annualMonthlyPrice={plan.annualMonthlyPrice}
              features={plan.features}
              isAnnual={isAnnual}
              isPopular={plan.isPopular}
              currentPlan={currentPlan}
            />
          ))}
        </div>
      </section>

      {/* Feature comparison table */}
      <section className="mx-auto mt-24 max-w-5xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-white">
          Compare all features
        </h2>
        <p className="mt-2 text-center text-gray-600 dark:text-gray-400">
          See exactly what you get with each plan
        </p>

        <div className="mt-10 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                <th className="py-4 pr-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Feature
                </th>
                {["Free", "Starter", "Pro", "Empire"].map((name) => (
                  <th
                    key={name}
                    className="px-4 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white"
                  >
                    {name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARISON_FEATURES.map((feature, i) => (
                <tr
                  key={feature.name}
                  className={cn(
                    "border-b border-gray-100 dark:border-gray-800/50",
                    i % 2 === 0 && "bg-gray-50/50 dark:bg-gray-900/30"
                  )}
                >
                  <td className="py-3 pr-4 text-sm text-gray-700 dark:text-gray-300">
                    {feature.name}
                  </td>
                  {(["free", "starter", "pro", "empire"] as const).map(
                    (tier) => (
                      <td key={tier} className="px-4 py-3 text-center">
                        <FeatureValue value={feature[tier]} />
                      </td>
                    )
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto mt-24 max-w-3xl px-4 pb-24 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-white">
          Frequently asked questions
        </h2>

        <div className="mt-10 space-y-1">
          {FAQ_ITEMS.map((item, i) => (
            <div
              key={i}
              className="rounded-xl border border-gray-200 dark:border-gray-800"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="flex w-full items-center justify-between px-6 py-4 text-left"
              >
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {item.q}
                </span>
                <svg
                  className={cn(
                    "h-5 w-5 flex-shrink-0 text-gray-500 transition-transform duration-200",
                    openFaq === i && "rotate-180"
                  )}
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </button>
              {openFaq === i && (
                <div className="px-6 pb-4">
                  <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                    {item.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-gray-200 bg-gray-50 px-4 py-16 text-center dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Ready to find your next big idea?
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Join thousands of entrepreneurs using IdeaVault to discover validated
          business ideas.
        </p>
        <div className="mt-6 flex items-center justify-center gap-4">
          <a
            href="/auth/signin"
            className="rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:bg-violet-700 hover:shadow-xl"
          >
            Get Started Free
          </a>
          <a
            href="/database"
            className="rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          >
            Browse Ideas
          </a>
        </div>
      </section>
    </div>
  );
}

// ===== HELPER COMPONENT =====

function FeatureValue({ value }: { value: string | boolean }) {
  if (typeof value === "string") {
    return (
      <span className="text-sm font-medium text-gray-900 dark:text-white">
        {value}
      </span>
    );
  }

  if (value) {
    return (
      <svg
        className="mx-auto h-5 w-5 text-green-500"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.5 12.75l6 6 9-13.5"
        />
      </svg>
    );
  }

  return (
    <svg
      className="mx-auto h-5 w-5 text-gray-300 dark:text-gray-700"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M18 12H6"
      />
    </svg>
  );
}
