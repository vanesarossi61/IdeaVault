import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe, PLANS, type PlanKey } from "@/lib/stripe";
import { createOrRetrieveCustomer, createCheckoutSession } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || !session?.user?.email) {
      return NextResponse.json(
        { error: "You must be signed in to subscribe." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { plan, annual } = body as { plan: PlanKey; annual?: boolean };

    // Validate plan
    if (!plan || !PLANS[plan]) {
      return NextResponse.json(
        { error: "Invalid plan selected." },
        { status: 400 }
      );
    }

    if (plan === "FREE") {
      return NextResponse.json(
        { error: "Cannot checkout for the free plan." },
        { status: 400 }
      );
    }

    const planConfig = PLANS[plan];
    if (!planConfig.priceId) {
      return NextResponse.json(
        { error: "Price not configured for this plan." },
        { status: 500 }
      );
    }

    // Get or create Stripe customer
    const customer = await createOrRetrieveCustomer({
      email: session.user.email,
      userId: session.user.id,
    });

    // Check if user already has an active subscription
    const existing = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    });

    if (existing && existing.stripeSubscriptionId && existing.plan !== "FREE") {
      // User already subscribed -- redirect to portal instead
      const portalSession = await stripe.billingPortal.sessions.create({
        customer: customer.id,
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
      });
      return NextResponse.json({ url: portalSession.url });
    }

    // Create checkout session
    const checkoutSession = await createCheckoutSession({
      customerId: customer.id,
      priceId: planConfig.priceId,
      userId: session.user.id,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("[STRIPE_CHECKOUT]", error);
    return NextResponse.json(
      { error: "Something went wrong creating checkout session." },
      { status: 500 }
    );
  }
}
