import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
  typescript: true,
});

export const PLANS = {
  FREE: {
    name: "Free",
    price: 0,
    priceId: null,
    features: [
      "5 ideas per day",
      "Basic filters",
      "Community access",
    ],
  },
  STARTER: {
    name: "Starter",
    price: 19,
    priceId: process.env.STRIPE_PRICE_STARTER,
    features: [
      "Unlimited ideas",
      "Advanced filters",
      "Trend data",
      "Save & organize ideas",
      "Email alerts",
    ],
  },
  PRO: {
    name: "Pro",
    price: 49,
    priceId: process.env.STRIPE_PRICE_PRO,
    features: [
      "Everything in Starter",
      "AI-powered scoring",
      "Market analysis",
      "Export reports",
      "Priority support",
    ],
  },
  EMPIRE: {
    name: "Empire",
    price: 99,
    priceId: process.env.STRIPE_PRICE_EMPIRE,
    features: [
      "Everything in Pro",
      "API access",
      "Custom pipelines",
      "Team features",
      "White-label reports",
      "Dedicated support",
    ],
  },
} as const;

export type PlanKey = keyof typeof PLANS;

export async function createCheckoutSession({
  customerId,
  priceId,
  userId,
}: {
  customerId: string;
  priceId: string;
  userId: string;
}) {
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    metadata: {
      userId,
    },
  });

  return session;
}

export async function createCustomerPortalSession(customerId: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
  });

  return session;
}

export async function createOrRetrieveCustomer({
  email,
  userId,
}: {
  email: string;
  userId: string;
}) {
  const existingCustomers = await stripe.customers.list({
    email,
    limit: 1,
  });

  if (existingCustomers.data.length > 0) {
    return existingCustomers.data[0];
  }

  const customer = await stripe.customers.create({
    email,
    metadata: {
      userId,
    },
  });

  return customer;
}
