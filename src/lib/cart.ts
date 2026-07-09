import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const CART_COOKIE = "cart_session_id";

const cartInclude = { items: { include: { product: true } } } as const;

/** Read-only cart lookup safe to call from Server Components (never
 * mutates cookies). Returns an empty virtual cart when none exists yet. */
export async function getCart() {
  const session = await auth();
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(CART_COOKIE)?.value;

  if (session?.user?.id) {
    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: cartInclude,
    });
    if (cart) return cart;
  }

  if (sessionId) {
    const cart = await prisma.cart.findUnique({
      where: { sessionId },
      include: cartInclude,
    });
    if (cart) return cart;
  }

  return { id: "", userId: null, sessionId: null, items: [] };
}

/** Finds (or lazily creates) the cart for the current visitor, linking it to
 * the signed-in user when one exists so guest carts survive login.
 * Must only be called from Route Handlers or Server Actions (mutates cookies). */
export async function getOrCreateCart() {
  const session = await auth();
  const cookieStore = await cookies();
  let sessionId = cookieStore.get(CART_COOKIE)?.value;
  if (!sessionId) {
    sessionId = randomUUID();
    cookieStore.set(CART_COOKIE, sessionId, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  if (session?.user?.id) {
    let cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: cartInclude,
    });

    if (!cart) {
      const guestCart = await prisma.cart.findUnique({ where: { sessionId } });
      if (guestCart) {
        cart = await prisma.cart.update({
          where: { id: guestCart.id },
          data: { userId: session.user.id },
          include: cartInclude,
        });
      } else {
        cart = await prisma.cart.create({
          data: { userId: session.user.id },
          include: cartInclude,
        });
      }
    }

    return cart;
  }

  let cart = await prisma.cart.findUnique({
    where: { sessionId },
    include: cartInclude,
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { sessionId },
      include: cartInclude,
    });
  }

  return cart;
}

export function cartTotals(items: { quantity: number; product: { price: number } }[]) {
  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  return { subtotal, itemCount };
}
