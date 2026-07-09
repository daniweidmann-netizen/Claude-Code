import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    if (!signature || !webhookSecret) throw new Error("Missing webhook signature or secret");
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: `Webhook signature verification failed: ${message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;

    if (orderId) {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      });

      if (order && order.status === "PENDING") {
        await prisma.$transaction([
          prisma.order.update({
            where: { id: orderId },
            data: {
              status: "PAID",
              stripePaymentIntentId:
                typeof session.payment_intent === "string" ? session.payment_intent : undefined,
            },
          }),
          ...order.items.map((item) =>
            prisma.product.update({
              where: { id: item.productId },
              data: { stock: { decrement: item.quantity } },
            })
          ),
          ...(order.discountCodeId
            ? [
                prisma.discountCode.update({
                  where: { id: order.discountCodeId },
                  data: { timesRedeemed: { increment: 1 } },
                }),
              ]
            : []),
        ]);

        if (order.userId) {
          await prisma.cart.deleteMany({ where: { userId: order.userId } });
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}
