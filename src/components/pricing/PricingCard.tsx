"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import type { SubscriptionPlan } from "@prisma/client";

interface PricingCardProps {
  plan: SubscriptionPlan;
  name: string;
  monthlyPrice: number;
  annualMonthlyPrice: number;
  features: readonly string[];
  isAnnual: boolean;
  isPopular?: boolean;
  currentPlan?: SubscriptionPlan | null;
}

export function PricingCard({
  plan,
  name,
  monthlyPrice,
  annualMonthlyPrice,
  features,
  isAnnual,
  isPopular = false,
  currentPlan,
}: PricingCardProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const price = isAnnual ? annualMonthlyPrice : monthlyPrice;
  const isFree = plan === "FREE";
  const isCurrent = currentPlan === plan;
  const isDowngrade =
    currentPlan &&
    ["FREE", "STARTER", "PRO", "EMPIRE"].indexOf(plan) <
      ["FREE", "STARTER", "PRO", "EMPIRE"].indexOf(currentPlan);

  const handleSubscribe = async () => {
    if (isFree || isCurrent) return;

    if (!session?.user) {
      router.push("/auth/signin?callbackUrl=/pricing");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, annual: isAnnual }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getButtonText = () => {
    if (isCurrent) return "Current Plan";
    if (isFree) return "Get Started";
    if (isDowngrade) return "Downgrade";
    if (loading) return "Redirecting...";
    return "Subscribe";
  };

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl border p-8 transition-all duration-200",
        isPopular
          ? "border-violet-500 bg-white shadow-xl shadow-violet-500/10 scale-[1.02] dark:bg-gray-900"
          : "border-gray-200 bg-white hover:border-gray-300 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700"
      )}
    >
      {/* Popular badge */}
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1 rounded-full bg-violet-600 px-4 py-1.5 text-sm font-semibold text-white shadow-lg">
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
              />
            </svg>
            Most Popular
          </span>
        </div>
      )}

      {/* Plan name */}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        {name}
      </h3>

      {/* Price */}
      <div className="mt-4 flex items-baseline gap-1">
        <span className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
          ${price}
        </span>
        {!isFree && (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            /month
          </span>
        )}
      </div>

      {/* Annual savings */}
      {isAnnual && !isFree && monthlyPrice > 0 && (
        <p className="mt-1 text-sm text-green-600 dark:text-green-400">
          Save ${(monthlyPrice - annualMonthlyPrice) * 12}/year
        </p>
      )}

      {/* CTA Button */}
      <button
        onClick={handleSubscribe}
        disabled={isCurrent || loading}
        className={cn(
          "mt-6 w-full rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200",
          isCurrent
            ? "cursor-default border border-gray-300 bg-gray-100 text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
            : isPopular
              ? "bg-violet-600 text-white shadow-lg shadow-violet-500/25 hover:bg-violet-700 hover:shadow-xl"
              : isFree
                ? "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-750"
                : "bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
        )}
      >
        {getButtonText()}
      </button>

      {/* Features */}
      <ul className="mt-8 flex-1 space-y-3">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <svg
              className={cn(
                "mt-0.5 h-5 w-5 flex-shrink-0",
                isPopular
                  ? "text-violet-500"
                  : "text-green-500 dark:text-green-400"
              )}
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
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {feature}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
