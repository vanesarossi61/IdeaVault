import { prisma } from "./prisma";
import { PLANS, type PlanKey } from "./stripe";
import type { SubscriptionPlan, SubscriptionStatus } from "@prisma/client";

// ===== PLAN LIMITS =====

export interface PlanLimits {
  ideasPerDay: number;
  advancedFilters: boolean;
  trendData: boolean;
  saveIdeas: boolean;
  emailAlerts: boolean;
  aiScoring: boolean;
  marketAnalysis: boolean;
  exportReports: boolean;
  prioritySupport: boolean;
  apiAccess: boolean;
  customPipelines: boolean;
  teamFeatures: boolean;
  whiteLabelReports: boolean;
  dedicatedSupport: boolean;
}

const PLAN_LIMITS: Record<SubscriptionPlan, PlanLimits> = {
  FREE: {
    ideasPerDay: 5,
    advancedFilters: false,
    trendData: false,
    saveIdeas: false,
    emailAlerts: false,
    aiScoring: false,
    marketAnalysis: false,
    exportReports: false,
    prioritySupport: false,
    apiAccess: false,
    customPipelines: false,
    teamFeatures: false,
    whiteLabelReports: false,
    dedicatedSupport: false,
  },
  STARTER: {
    ideasPerDay: Infinity,
    advancedFilters: true,
    trendData: true,
    saveIdeas: true,
    emailAlerts: true,
    aiScoring: false,
    marketAnalysis: false,
    exportReports: false,
    prioritySupport: false,
    apiAccess: false,
    customPipelines: false,
    teamFeatures: false,
    whiteLabelReports: false,
    dedicatedSupport: false,
  },
  PRO: {
    ideasPerDay: Infinity,
    advancedFilters: true,
    trendData: true,
    saveIdeas: true,
    emailAlerts: true,
    aiScoring: true,
    marketAnalysis: true,
    exportReports: true,
    prioritySupport: true,
    apiAccess: false,
    customPipelines: false,
    teamFeatures: false,
    whiteLabelReports: false,
    dedicatedSupport: false,
  },
  EMPIRE: {
    ideasPerDay: Infinity,
    advancedFilters: true,
    trendData: true,
    saveIdeas: true,
    emailAlerts: true,
    aiScoring: true,
    marketAnalysis: true,
    exportReports: true,
    prioritySupport: true,
    apiAccess: true,
    customPipelines: true,
    teamFeatures: true,
    whiteLabelReports: true,
    dedicatedSupport: true,
  },
};

export type Feature = keyof PlanLimits;

const FEATURE_PLAN_MAP: Record<Feature, SubscriptionPlan> = {
  ideasPerDay: "FREE",
  advancedFilters: "STARTER",
  trendData: "STARTER",
  saveIdeas: "STARTER",
  emailAlerts: "STARTER",
  aiScoring: "PRO",
  marketAnalysis: "PRO",
  exportReports: "PRO",
  prioritySupport: "PRO",
  apiAccess: "EMPIRE",
  customPipelines: "EMPIRE",
  teamFeatures: "EMPIRE",
  whiteLabelReports: "EMPIRE",
  dedicatedSupport: "EMPIRE",
};

const PLAN_HIERARCHY: SubscriptionPlan[] = ["FREE", "STARTER", "PRO", "EMPIRE"];

// ===== PUBLIC API =====

export async function checkSubscription(userId: string) {
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  });

  if (!subscription) {
    return {
      plan: "FREE" as SubscriptionPlan,
      status: "ACTIVE" as SubscriptionStatus,
      isActive: true,
      isPaid: false,
      currentPeriodEnd: null,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
    };
  }

  const isActive =
    subscription.status === "ACTIVE" ||
    (subscription.status === "PAST_DUE" &&
      subscription.currentPeriodEnd != null &&
      subscription.currentPeriodEnd > new Date());

  return {
    plan: subscription.plan,
    status: subscription.status,
    isActive: !!isActive,
    isPaid: subscription.plan !== "FREE",
    currentPeriodEnd: subscription.currentPeriodEnd,
    stripeCustomerId: subscription.stripeCustomerId,
    stripeSubscriptionId: subscription.stripeSubscriptionId,
  };
}

export function getPlanLimits(plan: SubscriptionPlan): PlanLimits {
  return PLAN_LIMITS[plan];
}

export async function canAccessFeature(
  userId: string,
  feature: Feature
): Promise<boolean> {
  const { plan, isActive } = await checkSubscription(userId);
  if (!isActive) return false;
  const userIdx = PLAN_HIERARCHY.indexOf(plan);
  const reqIdx = PLAN_HIERARCHY.indexOf(FEATURE_PLAN_MAP[feature]);
  return userIdx >= reqIdx;
}

export function canPlanAccessFeature(
  plan: SubscriptionPlan,
  feature: Feature
): boolean {
  const planIdx = PLAN_HIERARCHY.indexOf(plan);
  const reqIdx = PLAN_HIERARCHY.indexOf(FEATURE_PLAN_MAP[feature]);
  return planIdx >= reqIdx;
}

export function getRequiredPlan(feature: Feature): SubscriptionPlan {
  return FEATURE_PLAN_MAP[feature];
}

export function getPlanDetails(plan: SubscriptionPlan) {
  return PLANS[plan as PlanKey];
}

export function comparePlans(a: SubscriptionPlan, b: SubscriptionPlan): number {
  return Math.sign(PLAN_HIERARCHY.indexOf(a) - PLAN_HIERARCHY.indexOf(b));
}

export function isUpgrade(current: SubscriptionPlan, target: SubscriptionPlan): boolean {
  return comparePlans(target, current) > 0;
}

export function getAnnualPrice(monthlyPrice: number): number {
  return Math.round(monthlyPrice * 12 * 0.8);
}

export function getAnnualMonthlyPrice(monthlyPrice: number): number {
  return Math.round((monthlyPrice * 12 * 0.8) / 12);
}
