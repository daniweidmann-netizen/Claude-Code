import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getOrCreateCart, cartTotals } from "@/lib/cart";
import { findValidDiscount } from "@/lib/discount";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { generateOrderNumber } from "@/lib/utils";
import { checkoutSchema } from "@/lib/validations";

const SHIPPING_AMOUNT = 499;
const FREE_SHIPPING_THRESHOLD = 5000;

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = checkoutSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe" },
      { status: 400 }
    );
  }

  const cart = await getOrCreateCart();
  if (cart.items.length === 0) {
    return NextResponse.json({ error: "Warenkorb ist leer." }, { status: 400 });
  }

  for (const item of cart.items) {
    if (item.quantity > item.product.stock) {
      return NextResponse.json(
        { error: `"${item.product.name}" ist nicht mehr in ausreichender Menge verfügbar.` },
        { status: 400 }
      );
    }
  }

  const { subtotal } = cartTotals(cart.items);
  const { email, address, discountCode } = parsed.data;

  let discountAmount = 0;
  let discountCodeId: string | null = null;

  if (discountCode) {
    const result = await findValidDiscount(discountCode, subtotal);
    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    discountAmount = result.discountAmount;
    discountCodeId = result.discountCode.id;
  }

  const shippingAmount = subtotal - discountAmount >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_AMOUNT;
  const total = Math.max(0, subtotal - discountAmount) + shippingAmount;

  const session = await auth();

  const order = await prisma.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      userId: session?.user?.id,
      subtotal,
      discountAmount,
      shippingAmount,
      total,
      email,
      shippingName: address.fullName,
      shippingLine1: address.line1,
      shippingLine2: address.line2,
      shippingCity: address.city,
      shippingPostal: address.postalCode,
      shippingCountry: address.country,
      discountCodeId,
      items: {
        create: cart.items.map((item) => ({
          productId: item.productId,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.images[0],
        })),
      },
    },
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  try {
    let stripeCouponId: string | undefined;
    if (discountAmount > 0) {
      const coupon = await stripe.coupons.create({
        amount_off: discountAmount,
        currency: "eur",
        duration: "once",
        name: discountCode,
      });
      stripeCouponId = coupon.id;
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email,
      line_items: cart.items.map((item) => ({
        price_data: {
          currency: "eur",
          product_data: {
            name: item.product.name,
            images: item.product.images[0] ? [item.product.images[0]] : undefined,
          },
          unit_amount: item.product.price,
        },
        quantity: item.quantity,
      })),
      shipping_options:
        shippingAmount > 0
          ? [
              {
                shipping_rate_data: {
                  type: "fixed_amount",
                  fixed_amount: { amount: shippingAmount, currency: "eur" },
                  display_name: "Standardversand",
                },
              },
            ]
          : undefined,
      discounts: stripeCouponId ? [{ coupon: stripeCouponId }] : undefined,
      metadata: { orderId: order.id, orderNumber: order.orderNumber },
      success_url: `${appUrl}/checkout/success?order=${order.orderNumber}`,
      cancel_url: `${appUrl}/checkout/cancel`,
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: checkoutSession.id },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err) {
    await prisma.order.delete({ where: { id: order.id } });
    const message = err instanceof Error ? err.message : "Unbekannter Fehler";
    return NextResponse.json(
      { error: `Zahlung konnte nicht gestartet werden: ${message}` },
      { status: 502 }
    );
  }
}
